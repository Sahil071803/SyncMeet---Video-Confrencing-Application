import { io } from "socket.io-client";

const PROD_SOCKET = "https://syncmeet-video-confrencing-application.onrender.com";

const getSocketUrl = () => {
  try {
    const envUrl = import.meta.env.VITE_SOCKET_URL;
    if (envUrl) return envUrl;
    if (typeof window !== "undefined") {
      const host = window.location.hostname;
      if (host.includes("vercel.app")) return PROD_SOCKET;
      return `${window.location.protocol}//${host}:5002`;
    }
  } catch {}
  return PROD_SOCKET;
};

const SOCKET_URL = getSocketUrl();

let socket = null;
let isConnecting = false;
let isManualDisconnect = false;

const cleanupSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }

  isConnecting = false;
};

const forceLogout = () => {
  cleanupSocket();

  localStorage.removeItem("user");
  localStorage.removeItem("token");

  sessionStorage.clear();

  window.location.replace("/login");
};

export const connectWithSocketServer = (
  userDetails
) => {
  try {
    const token =
      userDetails?.token;

    if (!token) {
      console.log(
        "❌ Missing auth token"
      );

      forceLogout();
      return null;
    }

    if (socket?.connected) {
      return socket;
    }

    if (isConnecting) {
      return socket;
    }

    isManualDisconnect = false;
    isConnecting = true;

    socket = io(SOCKET_URL, {
      auth: { token },

      transports: [
        "websocket",
        "polling",
      ],

      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log(
        "✅ Socket Connected:",
        socket.id
      );

      isConnecting = false;

      socket.emit("get-friends");
      socket.emit("get-online-users");
      socket.emit(
        "get-pending-invitations"
      );
    });

    socket.on(
      "disconnect",
      (reason) => {
        console.log(
          "❌ Socket Disconnected:",
          reason
        );

        isConnecting = false;

        if (isManualDisconnect)
          return;

        if (
          reason ===
          "io server disconnect"
        ) {
          socket.connect();
        }
      }
    );

    socket.on(
      "connect_error",
      (error) => {
        console.log(
          "❌ Socket Connect Error:",
          error.message
        );

        isConnecting = false;

        const message =
          error?.message?.toLowerCase() ||
          "";

        if (
          message.includes(
            "not_authorized"
          ) ||
          message.includes(
            "unauthorized"
          ) ||
          message.includes("jwt") ||
          message.includes("token")
        ) {
          forceLogout();
        }
      }
    );

    socket.io.on(
      "reconnect",
      () => {
        console.log(
          "✅ Socket Reconnected"
        );

        socket.emit("get-friends");
        socket.emit("get-online-users");
        socket.emit(
          "get-pending-invitations"
        );
      }
    );

    socket.io.on(
      "reconnect_failed",
      () => {
        console.log(
          "❌ Reconnect Failed"
        );

        isConnecting = false;
      }
    );

    return socket;
  } catch (err) {
    console.log(
      "❌ Socket Initialization Error:",
      err
    );

    isConnecting = false;
    return null;
  }
};

const safeEmit = (
  eventName,
  data
) => {
  if (!socket) {
    console.log(
      `❌ Cannot emit "${eventName}" - socket missing`
    );

    return false;
  }

  if (!socket.connected) {
    socket.connect();

    socket.once(
      "connect",
      () => {
        socket.emit(
          eventName,
          data
        );
      }
    );

    return false;
  }

  socket.emit(eventName, data);
  return true;
};

export const sendDirectMessage = (
  data
) => {
  if (
    !data?.receiverId
  ) {
    return false;
  }

  const messageData = {
    receiverId: data.receiverId,
  };

  if (data.content?.trim()) {
    messageData.content = data.content.trim();
  }

  if (data.messageType) {
    messageData.messageType = data.messageType;
  }

  if (data.fileUrl) {
    messageData.fileUrl = data.fileUrl;
  }

  if (data.fileName) {
    messageData.fileName = data.fileName;
  }

  if (data.fileSize) {
    messageData.fileSize = data.fileSize;
  }

  return safeEmit(
    "direct-message",
    messageData
  );
};

export const sendWebRTCOffer = (
  data
) => {
  return safeEmit(
    "webrtc-offer",
    data
  );
};

export const sendWebRTCAnswer = (
  data
) => {
  return safeEmit(
    "webrtc-answer",
    data
  );
};

export const sendWebRTCIceCandidate =
  (data) => {
    return safeEmit(
      "webrtc-ice-candidate",
      data
    );
  };

export const sendCallRejected = (data) => {
  return safeEmit(
    "call-rejected",
    data
  );
};

export const sendCallEnded = (data) => {
  return safeEmit(
    "call-ended",
    data
  );
};

export const sendCallReaction = (data) => {
  return safeEmit(
    "call-reaction",
    data
  );
};

export const getSocket = () =>
  socket;

export const isSocketConnected =
  () => !!socket?.connected;

export { getPendingOffer } from "./socketEvents.js";

export const disconnectSocket =
  () => {
    try {
      isManualDisconnect = true;

      cleanupSocket();

      console.log(
        "🔌 Socket manually disconnected"
      );
    } catch (err) {
      console.log(
        "❌ Disconnect Error:",
        err
      );
    }
  };