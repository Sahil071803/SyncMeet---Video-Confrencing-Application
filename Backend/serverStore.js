const connectedUsers = new Map();

let io = null;

const setSocketServerInstance = (instance) => {
  io = instance;
};

const getSocketServerInstance = () => io;

const addNewConnectedUsers = ({ socketId, userId }) => {
  if (!socketId || !userId) return;

  const id = String(userId);

  if (!connectedUsers.has(id)) {
    connectedUsers.set(id, new Set());
  }

  connectedUsers.get(id).add(socketId);
};

const removeConnectedUser = (socketId) => {
  let removedUserId = null;

  for (const [userId, sockets] of connectedUsers.entries()) {
    if (sockets.has(socketId)) {
      sockets.delete(socketId);

      removedUserId = userId;

      if (sockets.size === 0) {
        connectedUsers.delete(userId);
      }

      break;
    }
  }

  return removedUserId;
};

const getSocketIds = (userId) => {
  return connectedUsers.get(String(userId))
    ? Array.from(connectedUsers.get(String(userId)))
    : [];
};

const getOnlineUsers = () => {
  return Array.from(connectedUsers.keys()).map((userId) => ({
    userId,
  }));
};

const emitOnlineUsers = () => {
  if (!io) return;

  io.emit("online-users", {
    onlineUsers: getOnlineUsers(),
  });
};

module.exports = {
  setSocketServerInstance,
  getSocketServerInstance,
  addNewConnectedUsers,
  removeConnectedUser,
  getSocketIds,
  getOnlineUsers,
  emitOnlineUsers,
};