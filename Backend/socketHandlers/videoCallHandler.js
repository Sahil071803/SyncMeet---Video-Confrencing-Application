const serverStore = require("../serverStore");

const getSockets = (userId) => {
  return serverStore.getSocketIds(userId);
};

const getIO = () => {
  return serverStore.getSocketServerInstance();
};

// 📞 CALL REQUEST
const callUser = (socket, data) => {
  const { callToUserId } = data;

  const sockets = getSockets(callToUserId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("incoming-call", {
      from: socket.user.userId,
    });
  });
};

// ✅ CALL ACCEPT
const acceptCall = (socket, data) => {
  const { callerId } = data;

  const sockets = getSockets(callerId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("call-accepted", {
      answererId: socket.user.userId,
    });
  });
};

// ❌ CALL REJECT
const rejectCall = (socket, data) => {
  const { callerId } = data;

  const sockets = getSockets(callerId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("call-rejected");
  });
};

// 🎥 WEBRTC SIGNALING
const sendOffer = (socket, data) => {
  const { targetUserId, offer } = data;

  const sockets = getSockets(targetUserId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("webrtc-offer", {
      offer,
      from: socket.user.userId,
    });
  });
};

const sendAnswer = (socket, data) => {
  const { targetUserId, answer } = data;

  const sockets = getSockets(targetUserId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("webrtc-answer", {
      answer,
      from: socket.user.userId,
    });
  });
};

const sendIceCandidate = (socket, data) => {
  const { targetUserId, candidate } = data;

  const sockets = getSockets(targetUserId);

  sockets.forEach(socketId => {
    getIO().to(socketId).emit("webrtc-ice-candidate", {
      candidate,
      from: socket.user.userId,
    });
  });
};

module.exports = {
  callUser,
  acceptCall,
  rejectCall,
  sendOffer,
  sendAnswer,
  sendIceCandidate,
};