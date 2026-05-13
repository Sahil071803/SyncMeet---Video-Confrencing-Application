const { Server } = require("socket.io");

const serverStore = require("./serverStore");
const authSocket = require("./middleware/authSocket");

const newConnectionHandler = require("./socketHandlers/newConnectionHandler");
const disconnectHandler = require("./socketHandlers/disconnectHandler");
const directMessageHandler = require("./socketHandlers/directMessageHandler");

const {
  updateFriends,
  updateFriendsPendingInvitations,
} = require("./socketHandlers/updates/friends");

let io;

const initSocketServer = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ["websocket", "polling"],
  });

  serverStore.setSocketServerInstance(io);

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    const userId = socket.user?.userId;

    newConnectionHandler(socket);

    socket.on("get-friends", async () => {
      if (!userId) return;
      await updateFriends(userId);
    });

    socket.on("get-pending-invitations", async () => {
      if (!userId) return;
      await updateFriendsPendingInvitations(userId);
    });

    socket.on("get-online-users", () => {
      socket.emit("online-users", {
        onlineUsers: serverStore.getOnlineUsers(),
      });
    });

    socket.on("direct-message", async (data, callback) => {
      try {
        const result = await directMessageHandler(socket, data);

        if (callback) callback(result);

        if (result?.message) {
          socket.emit("direct-message", result.message);

          if (result?.receiverSockets?.length) {
            result.receiverSockets.forEach((socketId) => {
              io.to(socketId).emit("direct-message", result.message);
            });
          }
        }
      } catch (err) {
        console.log("❌ direct-message error:", err);
      }
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", socket.id, reason);
      disconnectHandler(socket);
    });
  });

  return io;
};

module.exports = initSocketServer;