const serverStore = require("../serverStore");

const newConnectionHandler = (socket) => {
  const userId = socket.user?.userId;

  if (!userId) return;

  serverStore.addNewConnectedUsers({
    userId: String(userId),
    socketId: socket.id,
  });

  console.log("User connected:", userId);
};

module.exports = newConnectionHandler;