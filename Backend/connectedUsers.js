const connectedUsers = new Map(); 
// userId -> Set(socketId)

let io = null;

// ==========================
// SOCKET INSTANCE (SAFE)
// ==========================
const setSocketServerInstance = (instance) => {
  io = instance;
};

const getSocketServerInstance = () => io;

// ==========================
// ADD USER CONNECTION
// ==========================
const addNewConnectedUsers = ({ socketId, userId }) => {
  const id = String(userId);

  if (!connectedUsers.has(id)) {
    connectedUsers.set(id, new Set());
  }

  connectedUsers.get(id).add(socketId);
};

// ==========================
// REMOVE USER CONNECTION
// ==========================
const removeConnectedUser = (socketId) => {
  for (let [userId, socketSet] of connectedUsers.entries()) {
    if (socketSet.has(socketId)) {
      socketSet.delete(socketId);

      if (socketSet.size === 0) {
        connectedUsers.delete(userId);
      }

      break;
    }
  }
};

// ==========================
// GET SOCKET IDS OF USER
// ==========================
const getSocketIds = (userId) => {
  const set = connectedUsers.get(String(userId));
  return set ? Array.from(set) : [];
};

// ==========================
// GET SINGLE SOCKET ID
// ==========================
const getSocketId = (userId) => {
  const sockets = getSocketIds(userId);
  return sockets.length > 0 ? sockets[0] : null;
};

// ==========================
// ONLINE USERS LIST
// ==========================
const getOnlineUsers = () => {
  return Array.from(connectedUsers.keys());
};

// ==========================
// EMIT ONLINE USERS (SAFE)
// ==========================
const emitOnlineUsers = () => {
  if (!io) return;

  io.emit("online-users", {
    onlineUsers: getOnlineUsers(),
  });
};

module.exports = {
  addNewConnectedUsers,
  removeConnectedUser,
  getSocketIds,
  getSocketId,
  getOnlineUsers,
  emitOnlineUsers,
  setSocketServerInstance,
  getSocketServerInstance,
};