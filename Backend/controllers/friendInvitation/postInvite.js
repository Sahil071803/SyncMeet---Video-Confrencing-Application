const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const { userId, email } = req.user || {};

    if (!userId || !email) {
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }

    if (!targetEmail) {
      return res.status(400).json({
        message: "Target email required",
      });
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();
    const senderEmail = email.trim().toLowerCase();

    if (senderEmail === normalizedEmail) {
      return res.status(409).json({
        message: "Cannot add yourself",
      });
    }

    const targetUser = await User.findOne({
      email: normalizedEmail,
    });

    if (!targetUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const senderUser = await User.findById(userId);

    if (!senderUser) {
      return res.status(404).json({
        message: "Sender user not found",
      });
    }

    const receiverId = targetUser._id.toString();
    const senderId = senderUser._id.toString();

    const alreadyFriend =
      senderUser.friends?.some(
        (friendId) => friendId.toString() === receiverId
      ) ||
      targetUser.friends?.some(
        (friendId) => friendId.toString() === senderId
      );

    if (alreadyFriend) {
      return res.status(409).json({
        message: "Already friends",
      });
    }

    const invitationAlreadySent = await FriendInvitation.findOne({
      senderId,
      receiverId,
    });

    if (invitationAlreadySent) {
      return res.status(409).json({
        message: "Invitation already sent",
      });
    }

    const invitationAlreadyReceived = await FriendInvitation.findOne({
      senderId: receiverId,
      receiverId: senderId,
    });

    if (invitationAlreadyReceived) {
      return res.status(409).json({
        message: "This user already sent you an invitation",
      });
    }

    const invitation = await FriendInvitation.create({
      senderId,
      receiverId,
    });

    await friendsUpdate.updateFriendsPendingInvitations(receiverId);

    return res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invitation,
    });
  } catch (err) {
    console.log("postInvite error:", err);

    return res.status(500).json({
      message: "Server error while sending invitation",
    });
  }
};

module.exports = postInvite;