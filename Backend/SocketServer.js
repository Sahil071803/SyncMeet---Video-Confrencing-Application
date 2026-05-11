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

// =============================
// INIT SOCKET SERVER
// =============================
const initSocketServer = (server) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  serverStore.setSocketServerInstance(io);

  // =============================
  // AUTH
  // =============================
  io.use((socket, next) => {
    authSocket(socket, next);
  });

  // =============================
  // CONNECTION
  // =============================
  io.on("connection", (socket) => {
    console.log("🔌 Connected:", socket.id);

    newConnectionHandler(socket, io);

    const userId = socket.user?.userId;

    // =============================
    // FRIENDS (PUSH SYSTEM)
    // =============================
    socket.on("get-friends", () => {
      updateFriends(userId);
    });

    // =============================
    // INVITATIONS
    // =============================
    socket.on("get-pending-invitations", () => {
      updateFriendsPendingInvitations(userId);
    });

    // =============================
    // ONLINE USERS
    // =============================
    socket.on("get-online-users", () => {
      socket.emit("online-users", {
        onlineUsers: serverStore.getOnlineUsers(),
      });
    });

    // =============================
    // DIRECT MESSAGE
    // =============================
    socket.on("direct-message", async (data, callback) => {
      try {
        const result = await directMessageHandler(socket, data);

        if (callback) callback(result);

        if (result?.message && result?.receiverSockets?.length) {
          result.receiverSockets.forEach((socketId) => {
            io.to(socketId).emit("direct-message", result.message);
          });
        }
      } catch (err) {
        console.log("❌ direct-message error:", err);
      }
    });

    // =============================
    // DISCONNECT
    // =============================
    socket.on("disconnect", (reason) => {
      console.log("🔌 Disconnected:", socket.id, reason);
      disconnectHandler(socket, io);
    });
  });

  return io;
};

module.exports = initSocketServer;