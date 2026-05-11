const updateVideoCallState = (io, data) => {
  try {
    const {
      roomId,
      type,
      userId,
      signalData,
      callerId,
      receiverId,
      callId,
    } = data;

    const payload = {
      type,          // "incoming-call" | "accept-call" | "reject-call" | "end-call" | "ice-candidate"
      userId,
      callerId,
      receiverId,
      callId,
      signalData,
      timestamp: new Date(),
    };

    /**
     * ROOM BASED EMISSION (recommended for WebRTC)
     */
    if (roomId) {
      io.to(roomId).emit("video-call-update", payload);
      return;
    }

    /**
     * USER TARGETED EMISSION (fallback)
     */
    if (receiverId) {
      io.to(receiverId).emit("video-call-update", payload);
      return;
    }

  } catch (err) {
    console.log("videoCall update error:", err);
  }
};

module.exports = {
  updateVideoCallState,
};