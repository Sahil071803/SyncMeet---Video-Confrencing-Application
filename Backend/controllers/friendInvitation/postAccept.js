const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");

const postAccept = async (req, res) => {
  try {
    const { id, token } = req.body;

    let invitation = null;

    if (token) {
      invitation = await FriendInvitation.findOne({
        token,
        status: "pending",
      });
    } else if (id) {
      invitation = await FriendInvitation.findById(id);
    }

    if (!invitation) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invitation.expiresAt && new Date() > invitation.expiresAt) {
      invitation.status = "expired";
      await invitation.save();

      return res.status(410).json({
        success: false,
        message: "Invitation expired",
      });
    }

    const { senderId, receiverId } = invitation;

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    const senderAlreadyHasFriend = sender.friends.some(
      (friendId) => friendId.toString() === receiverId.toString()
    );

    const receiverAlreadyHasFriend = receiver.friends.some(
      (friendId) => friendId.toString() === senderId.toString()
    );

    if (!senderAlreadyHasFriend) {
      sender.friends.push(receiverId);
    }

    if (!receiverAlreadyHasFriend) {
      receiver.friends.push(senderId);
    }

    await sender.save();
    await receiver.save();

    invitation.status = "accepted";
    await invitation.save();

    return res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
    });
  } catch (err) {
    console.log("ACCEPT INVITATION ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Something went wrong while accepting invitation",
    });
  }
};

module.exports = postAccept;