import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5002";

let socket = null;

let isConnecting = false;

// ======================================
// CONNECT SOCKET SERVER
// ======================================

export const connectWithSocketServer = (
  userDetails
) => {
  const token = userDetails?.token;

  if (!token) {
    console.log(
      "❌ Missing auth token"
    );

    return;
  }

  // ==============================
  // PREVENT DUPLICATE CONNECTIONS
  // ==============================

  if (socket?.connected) {
    console.log(
      "⚠️ Socket already connected"
    );

    return socket;
  }

  if (isConnecting) {
    console.log(
      "⚠️ Socket connection already in progress"
    );

    return socket;
  }

  isConnecting = true;

  // ==============================
  // CREATE SOCKET
  // ==============================

  socket = io(SOCKET_URL, {
    auth: {
      token,
    },

    transports: ["websocket"],
  });

  // ==============================
  // CONNECT
  // ==============================

  socket.on("connect", () => {
    console.log(
      "✅ Socket connected:",
      socket.id
    );

    isConnecting = false;
  });

  // ==============================
  // DISCONNECT
  // ==============================

  socket.on("disconnect", (reason) => {
    console.log(
      "❌ Socket disconnected:",
      reason
    );
  });

  // ==============================
  // CONNECT ERROR
  // ==============================

  socket.on(
    "connect_error",
    (error) => {
      console.log(
        "❌ Socket connect error:",
        error.message
      );

      isConnecting = false;
    }
  );

  return socket;
};

// ======================================
// SEND DIRECT MESSAGE
// ======================================

export const sendDirectMessage = (
  data
) => {
  if (!socket?.connected) {
    console.log(
      "❌ Cannot send message. Socket not connected."
    );

    return;
  }

  socket.emit("direct-message", {
    receiverId: data.receiverId,

    content: data.content.trim(),
  });
};

// ======================================
// VIDEO CALL EVENTS
// ======================================

export const sendWebRTCOffer = (
  data
) => {
  if (!socket?.connected) return;

  socket.emit("webrtc-offer", data);
};

export const sendWebRTCAnswer = (
  data
) => {
  if (!socket?.connected) return;

  socket.emit("webrtc-answer", data);
};

export const sendWebRTCIceCandidate =
  (data) => {
    if (!socket?.connected) return;

    socket.emit(
      "webrtc-ice-candidate",
      data
    );
  };

// ======================================
// GET SOCKET
// ======================================

export const getSocket = () => {
  return socket;
};

// ======================================
// DISCONNECT SOCKET
// ======================================

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();

    socket = null;

    isConnecting = false;

    console.log(
      "🔌 Socket manually disconnected"
    );
  }
};