import {
  getSocket,
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

      console.log(
        "✅ Remote stream connected"
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
          getSocket()?.emit(
            "webrtc-ice-candidate",
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
          "disconnected"
        ) {
          console.log(
            "❌ Peer disconnected"
          );
        }

        if (
          peerConnection.connectionState ===
          "connected"
        ) {
          console.log(
            "✅ Peers connected"
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
// GET LOCAL CAMERA PREVIEW
// ======================================

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

      // ======================================
      // TRY VIDEO + AUDIO
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
          "❌ Video access failed:",
          videoError
        );

        console.log(
          "⚠️ Switching to audio-only mode"
        );

        // ======================================
        // FALLBACK AUDIO ONLY
        // ======================================

        localStream =
          await navigator.mediaDevices.getUserMedia(
            {
              audio: true,

              video: false,
            }
          );

        console.log(
          "✅ Audio-only mode started"
        );
      }

      // ======================================
      // ATTACH STREAM TO VIDEO
      // ======================================

      if (
        localVideoRef?.current
      ) {
        localVideoRef.current.srcObject =
          localStream;
      }

      return localStream;
    } catch (err) {
      console.log(
        "❌ Media initialization failed:",
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

      // CHECK LOCAL STREAM

      if (!localStream) {
        console.log(
          "❌ Local stream missing"
        );

        return;
      }

      connectedUserId = userId;

      // CREATE PEER

      createPeerConnection(userId);

      // CREATE OFFER

      const offer =
        await peerConnection.createOffer();

      // SET LOCAL DESCRIPTION

      await peerConnection.setLocalDescription(
        offer
      );

      // SEND OFFER

      getSocket()?.emit(
        "webrtc-offer",
        {
          targetUserId: userId,

          offer,
        }
      );

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

      // CHECK LOCAL STREAM

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

      // ADD PENDING ICE

      for (const candidate of pendingCandidates) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(
            candidate
          )
        );
      }

      pendingCandidates = [];

      // CREATE ANSWER

      const answer =
        await peerConnection.createAnswer();

      // SET LOCAL DESCRIPTION

      await peerConnection.setLocalDescription(
        answer
      );

      // SEND ANSWER

      getSocket()?.emit(
        "webrtc-answer",
        {
          targetUserId:
            data.from,

          answer,
        }
      );

      console.log(
        "✅ Answer sent"
      );
    } catch (err) {
      console.log(
        "❌ Offer handling error:",
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
          "❌ Peer connection missing"
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

      // ADD PENDING ICE

      for (const candidate of pendingCandidates) {
        await peerConnection.addIceCandidate(
          new RTCIceCandidate(
            candidate
          )
        );
      }

      pendingCandidates = [];
    } catch (err) {
      console.log(
        "❌ Answer error:",
        err
      );
    }
  };

// ======================================
// HANDLE ICE CANDIDATE
// ======================================

export const handleWebRTCIceCandidate =
  async (data) => {
    try {
      if (!data?.candidate)
        return;

      // IF REMOTE DESCRIPTION NOT READY

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
// TOGGLE MICROPHONE
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
      "❌ Mic toggle error:",
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
      "❌ Camera toggle error:",
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

      // CLOSE PEER CONNECTION

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

      // RESET VARIABLES

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