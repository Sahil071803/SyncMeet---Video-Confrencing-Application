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

// ======================================
// GET USER SOCKET IDS
// ======================================

const getUserSocketIds = (
  userId
) => {
  if (!userId) return [];

  return serverStore.getSocketIds(
    userId
  );
};

// ======================================
// EMIT TO USER
// ======================================

const emitToUser = (
  targetUserId,
  eventName,
  payload
) => {
  const targetSocketIds =
    getUserSocketIds(
      targetUserId
    );

  console.log(
    "🎯 Target User:",
    targetUserId
  );

  console.log(
    "🎯 Target Socket IDs:",
    targetSocketIds
  );

  if (
    !targetSocketIds.length
  ) {
    console.log(
      "❌ Target user not online:",
      targetUserId
    );

    return;
  }

  targetSocketIds.forEach(
    (socketId) => {
      io.to(socketId).emit(
        eventName,
        payload
      );
    }
  );
};

// ======================================
// INIT SOCKET SERVER
// ======================================

const initSocketServer = (
  server
) => {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",

        "http://localhost:3000",

        "https://syncmeet-video-confrencing-applica.vercel.app",
      ],

      credentials: true,
    },

    pingTimeout: 60000,

    pingInterval: 25000,

    transports: [
      "websocket",
      "polling",
    ],
  });

  // STORE INSTANCE

  serverStore.setSocketServerInstance(
    io
  );

  // ======================================
  // AUTH
  // ======================================

  io.use((socket, next) => {
    authSocket(socket, next);
  });

  // ======================================
  // CONNECTION
  // ======================================

  io.on("connection", (socket) => {
    console.log(
      "🔌 Connected:",
      socket.id
    );

    const userId =
      socket.user?.userId;

    // NEW USER

    newConnectionHandler(socket);

    // ======================================
    // FRIENDS
    // ======================================

    socket.on(
      "get-friends",
      async () => {
        if (!userId)
          return;

        await updateFriends(
          userId
        );
      }
    );

    socket.on(
      "get-pending-invitations",
      async () => {
        if (!userId)
          return;

        await updateFriendsPendingInvitations(
          userId
        );
      }
    );

    socket.on(
      "get-online-users",
      () => {
        socket.emit(
          "online-users",
          {
            onlineUsers:
              serverStore.getOnlineUsers(),
          }
        );
      }
    );

    // ======================================
    // DIRECT MESSAGE
    // ======================================

    socket.on(
      "direct-message",
      async (
        data,
        callback
      ) => {
        try {
          const result =
            await directMessageHandler(
              socket,
              data
            );

          if (callback) {
            callback(result);
          }

          if (
            result?.message
          ) {
            socket.emit(
              "direct-message",
              result.message
            );

            if (
              result
                ?.receiverSockets
                ?.length
            ) {
              result.receiverSockets.forEach(
                (
                  socketId
                ) => {
                  io.to(
                    socketId
                  ).emit(
                    "direct-message",
                    result.message
                  );
                }
              );
            }
          }
        } catch (err) {
          console.log(
            "❌ direct-message error:",
            err
          );
        }
      }
    );

    // ======================================
    // WEBRTC OFFER
    // ======================================

    socket.on(
      "webrtc-offer",
      ({
        targetUserId,
        offer,
      }) => {
        try {
          if (
            !userId ||
            !targetUserId ||
            !offer
          ) {
            console.log(
              "❌ Invalid WebRTC offer data"
            );

            return;
          }

          console.log(
            "📞 WebRTC offer:",
            userId,
            "=>",
            targetUserId
          );

          emitToUser(
            targetUserId,
            "webrtc-offer",
            {
              from: userId,

              offer,
            }
          );
        } catch (err) {
          console.log(
            "❌ webrtc-offer error:",
            err
          );
        }
      }
    );

    // ======================================
    // WEBRTC ANSWER
    // ======================================

    socket.on(
      "webrtc-answer",
      ({
        targetUserId,
        answer,
      }) => {
        try {
          if (
            !userId ||
            !targetUserId ||
            !answer
          ) {
            console.log(
              "❌ Invalid WebRTC answer data"
            );

            return;
          }

          console.log(
            "✅ WebRTC answer:",
            userId,
            "=>",
            targetUserId
          );

          emitToUser(
            targetUserId,
            "webrtc-answer",
            {
              from: userId,

              answer,
            }
          );
        } catch (err) {
          console.log(
            "❌ webrtc-answer error:",
            err
          );
        }
      }
    );

    // ======================================
    // WEBRTC ICE CANDIDATE
    // ======================================

    socket.on(
      "webrtc-ice-candidate",
      ({
        targetUserId,
        candidate,
      }) => {
        try {
          if (
            !userId ||
            !targetUserId ||
            !candidate
          ) {
            console.log(
              "❌ Invalid ICE candidate data"
            );

            return;
          }

          console.log(
            "🧊 ICE candidate:",
            userId,
            "=>",
            targetUserId
          );

          emitToUser(
            targetUserId,
            "webrtc-ice-candidate",
            {
              from: userId,

              candidate,
            }
          );
        } catch (err) {
          console.log(
            "❌ webrtc-ice-candidate error:",
            err
          );
        }
      }
    );

    // ======================================
    // DISCONNECT
    // ======================================

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "🔌 Disconnected:",
          socket.id,
          reason
        );

        disconnectHandler(
          socket
        );
      }
    );
  });

  return io;
};

module.exports =
  initSocketServer;