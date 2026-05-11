import { getSocket } from "./socketConnection";

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let remoteVideoRefGlobal = null;

let connectedUserId = null;

// =====================================
// RTC CONFIG
// =====================================

const configuration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
      ],
    },
  ],
};

// =====================================
// CREATE PEER CONNECTION
// =====================================

const createPeerConnection = (
  targetUserId
) => {
  // CLOSE OLD CONNECTION

  if (peerConnection) {
    peerConnection.ontrack = null;

    peerConnection.onicecandidate =
      null;

    peerConnection.close();

    peerConnection = null;
  }

  peerConnection =
    new RTCPeerConnection(configuration);

  // =====================================
  // CREATE REMOTE STREAM
  // =====================================

  remoteStream = new MediaStream();

  if (
    remoteVideoRefGlobal?.current
  ) {
    remoteVideoRefGlobal.current.srcObject =
      remoteStream;
  }

  // =====================================
  // ADD LOCAL TRACKS
  // =====================================

  if (localStream) {
    localStream
      .getTracks()
      .forEach((track) => {
        peerConnection.addTrack(
          track,
          localStream
        );
      });
  }

  // =====================================
  // REMOTE TRACK
  // =====================================

  peerConnection.ontrack = (
    event
  ) => {
    console.log(
      "📡 Remote track received"
    );

    event.streams[0]
      .getTracks()
      .forEach((track) => {
        remoteStream.addTrack(track);
      });

    console.log(
      "✅ Remote stream connected"
    );
  };

  // =====================================
  // ICE CANDIDATE
  // =====================================

  peerConnection.onicecandidate =
    (event) => {
      if (
        event.candidate &&
        targetUserId
      ) {
        getSocket()?.emit(
          "webrtc-ice-candidate",
          {
            targetUserId,

            candidate:
              event.candidate,
          }
        );
      }
    };

  // =====================================
  // CONNECTION STATE
  // =====================================

  peerConnection.onconnectionstatechange =
    () => {
      console.log(
        "📡 Connection State:",
        peerConnection.connectionState
      );
    };

  // =====================================
  // ICE STATE
  // =====================================

  peerConnection.oniceconnectionstatechange =
    () => {
      console.log(
        "🧊 ICE State:",
        peerConnection.iceConnectionState
      );
    };

  return peerConnection;
};

// =====================================
// GET LOCAL PREVIEW
// =====================================

export const getLocalPreview =
  async (localVideoRef) => {
    try {
      // REUSE EXISTING STREAM

      if (localStream) {
        if (
          localVideoRef?.current
        ) {
          localVideoRef.current.srcObject =
            localStream;
        }

        return localStream;
      }

      // =================================
      // SAFEST MEDIA CONSTRAINTS
      // =================================

      localStream =
        await navigator.mediaDevices.getUserMedia(
          {
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
            },

            video: {
              facingMode: "user",

              width: {
                ideal: 640,
              },

              height: {
                ideal: 480,
              },

              frameRate: {
                ideal: 24,
              },
            },
          }
        );

      // =================================
      // ATTACH LOCAL VIDEO
      // =================================

      if (
        localVideoRef?.current
      ) {
        localVideoRef.current.srcObject =
          localStream;
      }

      console.log(
        "✅ Local stream started"
      );

      return localStream;
    } catch (err) {
      console.log(
        "❌ MEDIA ERROR NAME:",
        err.name
      );

      console.log(
        "❌ MEDIA ERROR MESSAGE:",
        err.message
      );

      // FALLBACK AUDIO ONLY

      try {
        console.log(
          "⚠️ Trying audio-only fallback..."
        );

        localStream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: false,
            }
          );

        if (
          localVideoRef?.current
        ) {
          localVideoRef.current.srcObject =
            localStream;
        }

        console.log(
          "✅ Audio-only mode started"
        );

        return localStream;
      } catch (audioErr) {
        console.log(
          "❌ AUDIO FALLBACK FAILED:",
          audioErr
        );
      }
    }
  };

// =====================================
// SET REMOTE VIDEO
// =====================================

export const setRemoteVideo = (
  remoteVideoRef
) => {
  remoteVideoRefGlobal =
    remoteVideoRef;
};

// =====================================
// START CALL
// =====================================

export const callToOtherUser =
  async (userId) => {
    try {
      if (!userId) {
        console.log(
          "❌ No target user selected"
        );

        return;
      }

      connectedUserId = userId;

      createPeerConnection(userId);

      const offer =
        await peerConnection.createOffer();

      await peerConnection.setLocalDescription(
        offer
      );

      getSocket()?.emit(
        "webrtc-offer",
        {
          targetUserId: userId,

          offer,
        }
      );

      console.log(
        "📞 Calling User:",
        userId
      );
    } catch (err) {
      console.log(
        "❌ Call Error:",
        err
      );
    }
  };

// =====================================
// HANDLE OFFER
// =====================================

export const handleWebRTCOffer =
  async (data) => {
    try {
      connectedUserId =
        data.from;

      createPeerConnection(
        data.from
      );

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(
          data.offer
        )
      );

      const answer =
        await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(
        answer
      );

      getSocket()?.emit(
        "webrtc-answer",
        {
          targetUserId:
            data.from,

          answer,
        }
      );

      console.log(
        "✅ Offer handled"
      );
    } catch (err) {
      console.log(
        "❌ Offer Error:",
        err
      );
    }
  };

// =====================================
// HANDLE ANSWER
// =====================================

export const handleWebRTCAnswer =
  async (data) => {
    try {
      if (!peerConnection) {
        console.log(
          "❌ No peer connection"
        );

        return;
      }

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(
          data.answer
        )
      );

      console.log(
        "✅ Answer received"
      );
    } catch (err) {
      console.log(
        "❌ Answer Error:",
        err
      );
    }
  };

// =====================================
// HANDLE ICE
// =====================================

export const handleWebRTCIceCandidate =
  async (data) => {
    try {
      if (
        !peerConnection ||
        !data?.candidate
      ) {
        return;
      }

      await peerConnection.addIceCandidate(
        new RTCIceCandidate(
          data.candidate
        )
      );

      console.log(
        "✅ ICE candidate added"
      );
    } catch (err) {
      console.log(
        "❌ ICE Error:",
        err
      );
    }
  };

// =====================================
// TOGGLE MIC
// =====================================

export const toggleMic = (
  enabled
) => {
  if (!localStream) return;

  localStream
    .getAudioTracks()
    .forEach((track) => {
      track.enabled = enabled;
    });

  console.log(
    enabled
      ? "🎤 Mic ON"
      : "🔇 Mic OFF"
  );
};

// =====================================
// TOGGLE CAMERA
// =====================================

export const toggleCamera = (
  enabled
) => {
  if (!localStream) return;

  localStream
    .getVideoTracks()
    .forEach((track) => {
      track.enabled = enabled;
    });

  console.log(
    enabled
      ? "📹 Camera ON"
      : "🚫 Camera OFF"
  );
};

// =====================================
// STOP CALL
// =====================================

export const stopLocalStream =
  () => {
    try {
      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (remoteStream) {
        remoteStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      if (peerConnection) {
        peerConnection.close();
      }

      if (
        remoteVideoRefGlobal?.current
      ) {
        remoteVideoRefGlobal.current.srcObject =
          null;
      }

      localStream = null;

      remoteStream = null;

      peerConnection = null;

      connectedUserId = null;

      console.log(
        "📴 Call ended"
      );
    } catch (err) {
      console.log(
        "❌ Stop Error:",
        err
      );
    }
  };