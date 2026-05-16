const FriendInvitation = require("../../models/friendInvitation");
const User = require("../../models/user");
const serverStore = require("../../serverStore");

// =============================
// FRIEND LIST (PUSH)
// =============================
const updateFriends = async (userId) => {
  try {
    const user = await User.findById(userId).populate(
      "friends",
      "_id username email"
    );

    if (!user) return;

    const friendsList = (user.friends || []).map((f) => ({
      _id: f._id,
      username: f.username,
      email: f.email,
    }));

    const socketIds = serverStore.getSocketIds(userId);
    const io = serverStore.getSocketServerInstance();

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("friends-list", {
        friends: friendsList,
      });
    });
  } catch (err) {
    console.log("❌ updateFriends error:", err);
  }
};

// =============================
// FRIEND INVITATIONS
// =============================
const updateFriendsPendingInvitations = async (userId) => {
  try {
    const pendingInvitations = await FriendInvitation.find({
      receiverId: userId,
    }).populate("senderId", "_id username email");

    const socketIds = serverStore.getSocketIds(userId);
    const io = serverStore.getSocketServerInstance();

    console.log(`📨 updateFriendsPendingInvitations for ${userId}: ${socketIds.length} socket(s)`);

    if (!socketIds.length) {
      console.log(`⚠️  No socket IDs found for user ${userId}`);
    }

    socketIds.forEach((socketId) => {
      io.to(socketId).emit("friends-invitations", {
        pendingInvitations: pendingInvitations || [],
      });
    });
  } catch (err) {
    console.log("❌ updateFriendsPendingInvitations error:", err);
  }
};

module.exports = {
  updateFriends,
  updateFriendsPendingInvitations,
};