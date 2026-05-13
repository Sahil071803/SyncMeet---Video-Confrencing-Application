import {
  sendWebRTCOffer,
  sendWebRTCAnswer,
  sendWebRTCIceCandidate,
} from "./socketConnection";

// ======================================
// GLOBAL VARIABLES
// ======================================

let localStream = null;

let remoteStream = null;

let peerConnection = null;

let remoteVideoRefGlobal =
  null;

let connectedUserId = null;

let pendingCandidates = [];

// ======================================
// RTC CONFIGURATION
// ======================================

const configuration = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun1.l.google.com:19302",
      ],
    },
  ],

  iceCandidatePoolSize: 10,
};

// ======================================
// CREATE PEER CONNECTION
// ======================================

const createPeerConnection = (
  targetUserId
) => {
  try {
    // CLOSE OLD CONNECTION

    if (peerConnection) {
      peerConnection.ontrack =
        null;

      peerConnection.onicecandidate =
        null;

      peerConnection.onconnectionstatechange =
        null;

      peerConnection.oniceconnectionstatechange =
        null;

      peerConnection.close();

      peerConnection = null;
    }

    // CREATE NEW PEER

    peerConnection =
      new RTCPeerConnection(
        configuration
      );

    console.log(
      "✅ Peer connection created"
    );

    // ======================================
    // CREATE REMOTE STREAM
    // ======================================

    remoteStream =
      new MediaStream();

    if (
      remoteVideoRefGlobal?.current
    ) {
      remoteVideoRefGlobal.current.srcObject =
        remoteStream;

      remoteVideoRefGlobal.current
        .play()
        .catch((err) => {
          console.log(
            "⚠️ Autoplay blocked:",
            err
          );
        });
    }

    // ======================================
    // ADD LOCAL TRACKS
    // ======================================

    if (localStream) {
      localStream
        .getTracks()
        .forEach((track) => {
          peerConnection.addTrack(
            track,
            localStream
          );
        });

      console.log(
        "✅ Local tracks added"
      );
    }

    // ======================================
    // RECEIVE REMOTE TRACKS
    // ======================================

    peerConnection.ontrack = (
      event
    ) => {
      console.log(
        "📡 Remote track received"
      );

      event.streams[0]
        .getTracks()
        .forEach((track) => {
          const alreadyAdded =
            remoteStream
              .getTracks()
              .find(
                (t) =>
                  t.id === track.id
              );

          if (
            !alreadyAdded
          ) {
            remoteStream.addTrack(
              track
            );
          }
        });

      if (
        remoteVideoRefGlobal?.current
      ) {
        remoteVideoRefGlobal.current.srcObject =
          remoteStream;

        remoteVideoRefGlobal.current
          .play()
          .catch((err) => {
            console.log(
              "⚠️ Remote autoplay blocked:",
              err
            );
          });
      }

      console.log(
        "✅ Remote stream connected",
        remoteStream.getTracks()
      );
    };

    // ======================================
    // SEND ICE CANDIDATES
    // ======================================

    peerConnection.onicecandidate =
      (event) => {
        if (
          event.candidate &&
          targetUserId
        ) {
          sendWebRTCIceCandidate(
            {
              targetUserId,

              candidate:
                event.candidate,
            }
          );

          console.log(
            "🧊 ICE candidate sent"
          );
        }
      };

    // ======================================
    // CONNECTION STATE
    // ======================================

    peerConnection.onconnectionstatechange =
      () => {
        console.log(
          "📡 Connection State:",
          peerConnection.connectionState
        );

        if (
          peerConnection.connectionState ===
          "connected"
        ) {
          console.log(
            "✅ Peers connected"
          );
        }

        if (
          peerConnection.connectionState ===
          "failed"
        ) {
          console.log(
            "❌ Connection failed"
          );
        }

        if (
          peerConnection.connectionState ===
          "disconnected"
        ) {
          console.log(
            "❌ Peer disconnected"
          );
        }
      };

    // ======================================
    // ICE STATE
    // ======================================

    peerConnection.oniceconnectionstatechange =
      () => {
        console.log(
          "🧊 ICE State:",
          peerConnection.iceConnectionState
        );
      };

    return peerConnection;
  } catch (err) {
    console.log(
      "❌ Peer connection error:",
      err
    );
  }
};

// ======================================
// GET LOCAL PREVIEW
// ======================================

export const getLocalPreview =
  async (localVideoRef) => {
    try {
      // REUSE STREAM

      if (localStream) {
        if (
          localVideoRef?.current
        ) {
          localVideoRef.current.srcObject =
            localStream;
        }

        return localStream;
      }

      // ======================================
      // VIDEO + AUDIO
      // ======================================

      try {
        localStream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: {
                echoCancellation: true,

                noiseSuppression: true,
              },

              video: {
                width: {
                  ideal: 1280,
                },

                height: {
                  ideal: 720,
                },

                frameRate: {
                  ideal: 24,
                },

                facingMode:
                  "user",
              },
            }
          );

        console.log(
          "✅ Camera + Mic started"
        );
      } catch (videoError) {
        console.log(
          "❌ Video failed:",
          videoError
        );

        console.log(
          "⚠️ Audio-only mode"
        );

        localStream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,
              video: false,
            }
          );
      }

      // ======================================
      // ATTACH LOCAL VIDEO
      // ======================================

      if (
        localVideoRef?.current
      ) {
        localVideoRef.current.srcObject =
          localStream;

        localVideoRef.current
          .play()
          .catch((err) => {
            console.log(
              "⚠️ Local autoplay blocked:",
              err
            );
          });
      }

      return localStream;
    } catch (err) {
      console.log(
        "❌ Media init failed:",
        err
      );

      return null;
    }
  };

// ======================================
// SET REMOTE VIDEO REF
// ======================================

export const setRemoteVideo = (
  remoteVideoRef
) => {
  remoteVideoRefGlobal =
    remoteVideoRef;
};

// ======================================
// START CALL
// ======================================

export const callToOtherUser =
  async (userId) => {
    try {
      if (!userId) {
        console.log(
          "❌ Missing target user"
        );

        return;
      }

      if (!localStream) {
        console.log(
          "❌ Local stream missing"
        );

        return;
      }

      connectedUserId = userId;

      // CREATE PEER

      createPeerConnection(userId);

      console.log(
        "📞 Creating offer"
      );

      // CREATE OFFER

      const offer =
        await peerConnection.createOffer();

      // SET LOCAL DESCRIPTION

      await peerConnection.setLocalDescription(
        offer
      );

      // SEND OFFER

      sendWebRTCOffer({
        targetUserId: userId,
        offer,
      });

      console.log(
        "📞 Offer sent"
      );
    } catch (err) {
      console.log(
        "❌ Call error:",
        err
      );
    }
  };

// ======================================
// HANDLE OFFER
// ======================================

export const handleWebRTCOffer =
  async (data) => {
    try {
      console.log(
        "📩 Offer received"
      );

      connectedUserId =
        data.from;

      if (!localStream) {
        console.log(
          "❌ Local stream missing"
        );

        return;
      }

      // CREATE PEER

      createPeerConnection(
        data.from
      );

      // SET REMOTE DESCRIPTION

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(
          data.offer
        )
      );

      console.log(
        "✅ Remote description set"
      );

      // ADD QUEUED ICE

      while (
        pendingCandidates.length > 0
      ) {
        const candidate =
          pendingCandidates.shift();

        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );

          console.log(
            "✅ Queued ICE added"
          );
        } catch (err) {
          console.log(
            "❌ Queued ICE error:",
            err
          );
        }
      }

      // CREATE ANSWER

      const answer =
        await peerConnection.createAnswer();

      // SET LOCAL DESCRIPTION

      await peerConnection.setLocalDescription(
        answer
      );

      // SEND ANSWER

      sendWebRTCAnswer({
        targetUserId:
          data.from,

        answer,
      });

      console.log(
        "✅ Answer sent"
      );
    } catch (err) {
      console.log(
        "❌ Offer error:",
        err
      );
    }
  };

// ======================================
// HANDLE ANSWER
// ======================================

export const handleWebRTCAnswer =
  async (data) => {
    try {
      console.log(
        "📩 Answer received"
      );

      if (!peerConnection) {
        console.log(
          "❌ Missing peer connection"
        );

        return;
      }

      if (
        peerConnection.signalingState !==
        "have-local-offer"
      ) {
        console.log(
          "⚠️ Invalid signaling state:",
          peerConnection.signalingState
        );

        return;
      }

      // SET REMOTE DESCRIPTION

      await peerConnection.setRemoteDescription(
        new RTCSessionDescription(
          data.answer
        )
      );

      console.log(
        "✅ Remote answer set"
      );

      // ADD QUEUED ICE

      while (
        pendingCandidates.length > 0
      ) {
        const candidate =
          pendingCandidates.shift();

        try {
          await peerConnection.addIceCandidate(
            new RTCIceCandidate(
              candidate
            )
          );

          console.log(
            "✅ Queued ICE added"
          );
        } catch (err) {
          console.log(
            "❌ Queued ICE error:",
            err
          );
        }
      }
    } catch (err) {
      console.log(
        "❌ Answer error:",
        err
      );
    }
  };

// ======================================
// HANDLE ICE
// ======================================

export const handleWebRTCIceCandidate =
  async (data) => {
    try {
      if (!data?.candidate)
        return;

      // QUEUE ICE

      if (
        !peerConnection ||
        !peerConnection.remoteDescription
      ) {
        pendingCandidates.push(
          data.candidate
        );

        console.log(
          "⏳ ICE queued"
        );

        return;
      }

      // ADD ICE

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
        "❌ ICE error:",
        err
      );
    }
  };

// ======================================
// TOGGLE MIC
// ======================================

export const toggleMic = (
  enabled
) => {
  try {
    if (!localStream)
      return;

    localStream
      .getAudioTracks()
      .forEach((track) => {
        track.enabled =
          enabled;
      });

    console.log(
      enabled
        ? "🎤 Mic enabled"
        : "🔇 Mic disabled"
    );
  } catch (err) {
    console.log(
      "❌ Mic error:",
      err
    );
  }
};

// ======================================
// TOGGLE CAMERA
// ======================================

export const toggleCamera = (
  enabled
) => {
  try {
    if (!localStream)
      return;

    localStream
      .getVideoTracks()
      .forEach((track) => {
        track.enabled =
          enabled;
      });

    console.log(
      enabled
        ? "📹 Camera enabled"
        : "🚫 Camera disabled"
    );
  } catch (err) {
    console.log(
      "❌ Camera error:",
      err
    );
  }
};

// ======================================
// STOP CALL
// ======================================

export const stopLocalStream =
  () => {
    try {
      // STOP LOCAL STREAM

      if (localStream) {
        localStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      // STOP REMOTE STREAM

      if (remoteStream) {
        remoteStream
          .getTracks()
          .forEach((track) => {
            track.stop();
          });
      }

      // CLOSE PEER

      if (peerConnection) {
        peerConnection.close();
      }

      // CLEAR VIDEO

      if (
        remoteVideoRefGlobal?.current
      ) {
        remoteVideoRefGlobal.current.srcObject =
          null;
      }

      // RESET

      localStream = null;

      remoteStream = null;

      peerConnection = null;

      connectedUserId = null;

      pendingCandidates = [];

      console.log(
        "📴 Call ended"
      );
    } catch (err) {
      console.log(
        "❌ Stop stream error:",
        err
      );
    }
  };