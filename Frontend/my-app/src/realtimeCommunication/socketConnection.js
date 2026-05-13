import { io } from "socket.io-client";

const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || "http://localhost:5002";

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

export const connectWithSocketServer = (userDetails) => {
  try {
    const token = userDetails?.token;

    if (!token) {
      console.log("❌ Missing auth token");
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
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    socket.on("connect", () => {
      console.log("✅ Socket Connected:", socket.id);

      isConnecting = false;

      socket.emit("get-friends");
      socket.emit("get-online-users");
      socket.emit("get-pending-invitations");
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket Disconnected:", reason);

      isConnecting = false;

      if (isManualDisconnect) return;

      if (reason === "io server disconnect") {
        socket.connect();
      }
    });

    socket.on("connect_error", (error) => {
      console.log("❌ Socket Connect Error:", error.message);

      isConnecting = false;

      const message = error?.message?.toLowerCase() || "";

      if (
        message.includes("not_authorized") ||
        message.includes("unauthorized") ||
        message.includes("jwt") ||
        message.includes("token")
      ) {
        forceLogout();
      }
    });

    socket.io.on("reconnect", () => {
      console.log("✅ Socket Reconnected");

      socket.emit("get-friends");
      socket.emit("get-online-users");
      socket.emit("get-pending-invitations");
    });

    socket.io.on("reconnect_failed", () => {
      console.log("❌ Reconnect Failed");
      isConnecting = false;
    });

    return socket;
  } catch (err) {
    console.log("❌ Socket Initialization Error:", err);
    isConnecting = false;
    return null;
  }
};

const safeEmit = (eventName, data) => {
  if (!socket) {
    console.log(`❌ Cannot emit "${eventName}" - socket missing`);
    return false;
  }

  if (!socket.connected) {
    socket.connect();

    socket.once("connect", () => {
      socket.emit(eventName, data);
    });

    return false;
  }

  socket.emit(eventName, data);
  return true;
};

export const sendDirectMessage = (data) => {
  if (!data?.receiverId || !data?.content?.trim()) return false;

  return safeEmit("direct-message", {
    receiverId: data.receiverId,
    content: data.content.trim(),
  });
};

export const sendWebRTCOffer = (data) => {
  return safeEmit("webrtc-offer", data);
};

export const sendWebRTCAnswer = (data) => {
  return safeEmit("webrtc-answer", data);
};

export const sendWebRTCIceCandidate = (data) => {
  return safeEmit("webrtc-ice-candidate", data);
};

export const getSocket = () => socket;

export const isSocketConnected = () => !!socket?.connected;

export const disconnectSocket = () => {
  try {
    isManualDisconnect = true;
    cleanupSocket();

    console.log("🔌 Socket manually disconnected");
  } catch (err) {
    console.log("❌ Disconnect Error:", err);
  }
};