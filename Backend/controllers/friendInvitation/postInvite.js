const crypto = require("crypto");

const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const { sendInvitationEmail } = require("../../services/emailService");

const getSenderName = (senderUser, senderEmail) => {
  return (
    senderUser?.username ||
    senderUser?.name ||
    senderEmail ||
    "Someone"
  );
};

const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const createInviteLink = (token) => {
  const frontendUrl =
    process.env.FRONTEND_URL || "http://localhost:5173";

  return `${frontendUrl}/invite/${token}`;
};

const sendEmailInBackground = ({
  receiverMailAddress,
  invitationLink,
  senderName,
}) => {
  setImmediate(async () => {
    try {
      console.log("📧 Background email sending to:", receiverMailAddress);

      const emailSent = await sendInvitationEmail({
        receiverMailAddress,
        invitationLink,
        senderName,
      });

      console.log("📧 Background email result:", emailSent);
    } catch (error) {
      console.log("❌ Background email error:", error.message);
    }
  });
};

const postInvite = async (req, res) => {
  try {
    console.log("📩 INVITE API HIT");
    console.log("📦 BODY:", req.body);
    console.log("👤 USER:", req.user);

    const { targetEmail } = req.body;
    const { userId, email } = req.user || {};

    if (!userId || !email) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user",
      });
    }

    if (!targetEmail) {
      return res.status(400).json({
        success: false,
        message: "Target email required",
      });
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    const senderEmail = email.trim().toLowerCase();

    if (senderEmail === normalizedEmail) {
      return res.status(409).json({
        success: false,
        message: "Cannot add yourself",
      });
    }

    const targetUser = await User.findOne({
      email: normalizedEmail,
    });

    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found. Ask this user to register first.",
      });
    }

    const senderUser = await User.findById(userId);

    if (!senderUser) {
      return res.status(404).json({
        success: false,
        message: "Sender user not found",
      });
    }

    const receiverId = targetUser._id.toString();
    const senderId = senderUser._id.toString();

    const alreadyFriend =
      senderUser.friends?.some(
        (id) => id.toString() === receiverId
      ) ||
      targetUser.friends?.some(
        (id) => id.toString() === senderId
      );

    if (alreadyFriend) {
      return res.status(409).json({
        success: false,
        message: "Already friends",
      });
    }

    const senderName = getSenderName(senderUser, senderEmail);

    const invitationAlreadySent =
      await FriendInvitation.findOne({
        senderId,
        receiverId,
        status: "pending",
      });

    if (invitationAlreadySent) {
      console.log("⚠️ Invitation already exists, resending email...");

      if (!invitationAlreadySent.token) {
        invitationAlreadySent.token = generateToken();
      }

      invitationAlreadySent.receiverMailAddress = normalizedEmail;
      invitationAlreadySent.expiresAt = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      );

      await invitationAlreadySent.save();

      const invitationLink = createInviteLink(
        invitationAlreadySent.token
      );

      sendEmailInBackground({
        receiverMailAddress: normalizedEmail,
        invitationLink,
        senderName,
      });

      return res.status(200).json({
        success: true,
        message:
          "Invitation already existed. Email is being sent again.",
        invitation: invitationAlreadySent,
      });
    }

    const invitationAlreadyReceived =
      await FriendInvitation.findOne({
        senderId: receiverId,
        receiverId: senderId,
        status: "pending",
      });

    if (invitationAlreadyReceived) {
      return res.status(409).json({
        success: false,
        message: "This user already sent you an invitation",
      });
    }

    const token = generateToken();
    const invitationLink = createInviteLink(token);

    const invitation = await FriendInvitation.create({
      senderId,
      receiverId,
      receiverMailAddress: normalizedEmail,
      token,
      status: "pending",
      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
      ),
    });

    await friendsUpdate.updateFriendsPendingInvitations(receiverId);

    sendEmailInBackground({
      receiverMailAddress: normalizedEmail,
      invitationLink,
      senderName,
    });

    return res.status(201).json({
      success: true,
      message: "Invitation sent. Email is being delivered.",
      invitation,
    });
  } catch (err) {
    console.log("❌ postInvite error:", err);

    return res.status(500).json({
      success: false,
      message: "Server error while sending invitation",
      error: err.message,
    });
  }
};

module.exports = postInvite;