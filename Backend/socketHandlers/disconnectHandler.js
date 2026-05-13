const serverStore = require("../serverStore");

const disconnectHandler = (socket) => {
  const removedUserId = serverStore.removeConnectedUser(socket.id);

  serverStore.emitOnlineUsers();

  console.log("❌ User disconnected:", removedUserId || socket.id);
};

module.exports = disconnectHandler;