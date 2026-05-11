const User = require("../../models/user");
const FriendInvitation = require("../../models/friendInvitation");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  try {
    const { targetEmail } = req.body;
    const { userId, email } = req.user;

    if (!targetEmail) {
      return res.status(400).send("Target email required");
    }

    const normalizedEmail = targetEmail.trim().toLowerCase();

    const targetUser = await User.findOne({ email: normalizedEmail });

    if (!targetUser) {
      return res.status(404).send("User not found");
    }

    if (email.toLowerCase() === normalizedEmail) {
      return res.status(409).send("Cannot add yourself");
    }

    const exists = await FriendInvitation.findOne({
      senderId: userId,
      receiverId: targetUser._id,
    });

    if (exists) {
      return res.status(409).send("Already sent");
    }

    const alreadyFriend = targetUser.friends.includes(userId);

    if (alreadyFriend) {
      return res.status(409).send("Already friends");
    }

    const invitation = await FriendInvitation.create({
      senderId: userId,
      receiverId: targetUser._id,
    });

    await friendsUpdate.updateFriendsPendingInvitations(
      targetUser._id.toString()
    );

    return res.status(201).json({
      success: true,
      invitation,
    });
  } catch (err) {
    console.log("postInvite error:", err);
    return res.status(500).send("Server error");
  }
};

module.exports = postInvite;