const activeUsers = new Map();

/**
 * Mark user as ONLINE
 * Stores userId → socketId mapping
 */
const userConnected = (io, userId, socketId) => {
  try {
    if (!userId || !socketId) return;

    activeUsers.set(userId, socketId);

    io.emit("user-presence-update", {
      userId,
      status: "online",
      lastSeen: null,
    });

  } catch (err) {
    console.log("userConnected error:", err);
  }
};

/**
 * Mark user as OFFLINE
 * Removes from active map
 */
const userDisconnected = (io, userId) => {
  try {
    if (!userId) return;

    activeUsers.delete(userId);

    io.emit("user-presence-update", {
      userId,
      status: "offline",
      lastSeen: new Date(),
    });

  } catch (err) {
    console.log("userDisconnected error:", err);
  }
};

/**
 * Get socketId of a user (for DM or calls)
 */
const getUserSocketId = (userId) => {
  return activeUsers.get(userId);
};

/**
 * Check if user is online
 */
const isUserOnline = (userId) => {
  return activeUsers.has(userId);
};

/**
 * Get all active users (debug/admin use)
 */
const getAllActiveUsers = () => {
  return Array.from(activeUsers.entries()).map(([userId, socketId]) => ({
    userId,
    socketId,
  }));
};

module.exports = {
  userConnected,
  userDisconnected,
  getUserSocketId,
  isUserOnline,
  getAllActiveUsers,
};