import {
  sendWebRTCOffer,
  sendWebRTCAnswer,
  sendWebRTCIceCandidate,
} from "./socketConnection";

let localStream = null;
let remoteStream = null;
let peerConnection = null;
let remoteVideoRefGlobal = null;
let connectedUserId = null;
let pendingCandidates = [];

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

const playVideoSafely = async (videoRef, stream) => {
  try {
    if (!videoRef?.current || !stream) return;

    const video = videoRef.current;

    if (video.srcObject !== stream) {
      video.srcObject = stream;
    }

    await video.play();
  } catch (err) {
    console.log("⚠️ Video play blocked:", err);
  }
};

const createPeerConnection = (targetUserId) => {
  try {
    if (peerConnection) {
      peerConnection.ontrack = null;
      peerConnection.onicecandidate = null;
      peerConnection.onconnectionstatechange = null;
      peerConnection.oniceconnectionstatechange = null;
      peerConnection.close();
      peerConnection = null;
    }

    peerConnection = new RTCPeerConnection(configuration);

    console.log("✅ Peer connection created");

    remoteStream = null;

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      console.log("✅ Local tracks added");
    }

    peerConnection.ontrack = (event) => {
      console.log("📡 Remote track received");

      const incomingStream = event.streams[0];

      if (!incomingStream) {
        console.log("❌ No incoming stream");
        return;
      }

      remoteStream = incomingStream;

      const video = remoteVideoRefGlobal?.current;

      if (!video) {
        console.log("❌ Remote video ref missing");
        return;
      }

      if (video.srcObject === incomingStream) {
        console.log("✅ Remote stream already attached");
        return;
      }

      video.srcObject = incomingStream;

      setTimeout(() => {
        video
          .play()
          .then(() => {
            console.log("✅ Remote video playing");
          })
          .catch((err) => {
            console.log("⚠️ Remote play failed:", err);
          });
      }, 300);

      console.log("✅ Remote stream connected", incomingStream.getTracks());
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && targetUserId) {
        sendWebRTCIceCandidate({
          targetUserId,
          candidate: event.candidate,
        });

        console.log("🧊 ICE candidate sent");
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log("📡 Connection State:", peerConnection.connectionState);

      if (onConnectionStateCallback) {
        onConnectionStateCallback(peerConnection.connectionState);
      }

      if (peerConnection.connectionState === "connected") {
        console.log("✅ Peers connected");
      }

      if (peerConnection.connectionState === "failed") {
        console.log("❌ Connection failed");
      }

      if (peerConnection.connectionState === "disconnected") {
        console.log("❌ Peer disconnected");
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log("🧊 ICE State:", peerConnection.iceConnectionState);
    };

    return peerConnection;
  } catch (err) {
    console.log("❌ Peer connection error:", err);
    return null;
  }
};

export const getLocalPreview = async (localVideoRef) => {
  try {
    if (localStream) {
      await playVideoSafely(localVideoRef, localStream);
      return localStream;
    }

    try {
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 },
          facingMode: "user",
        },
      });

      console.log("✅ Camera + Mic started");
    } catch (videoError) {
      console.log("❌ Video failed:", videoError);
      console.log("⚠️ Audio-only mode");

      localStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
    }

    await playVideoSafely(localVideoRef, localStream);

    return localStream;
  } catch (err) {
    console.log("❌ Media init failed:", err);
    return null;
  }
};

export const setRemoteVideo = (remoteVideoRef) => {
  remoteVideoRefGlobal = remoteVideoRef;

  if (remoteStream && remoteVideoRefGlobal?.current) {
    remoteVideoRefGlobal.current.srcObject = remoteStream;
  }
};

export const callToOtherUser = async (userId) => {
  try {
    if (!userId) {
      console.log("❌ Missing target user");
      return false;
    }

    if (!localStream) {
      console.log("❌ Local stream missing");
      return false;
    }

    connectedUserId = userId;

    createPeerConnection(userId);

    if (!peerConnection) return false;

    console.log("📞 Creating offer");

    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    sendWebRTCOffer({
      targetUserId: userId,
      offer,
    });

    console.log("📞 Offer sent");

    return true;
  } catch (err) {
    console.log("❌ Call error:", err);
    return false;
  }
};

export const handleWebRTCOffer = async (data, localVideoRef) => {
  try {
    console.log("📩 Offer received");

    connectedUserId = data.from;

    // Initialize local stream if not already done
    if (!localStream) {
      console.log("📹 Initializing local stream for incoming call");
      localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 24 },
          facingMode: "user",
        },
      }).catch((err) => {
        console.log("❌ Video failed, trying audio-only:", err);
        return navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
      });

      if (localVideoRef?.current) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.muted = true;
        await localVideoRef.current.play().catch(console.log);
      }
    }

    if (!localStream) {
      console.log("❌ Failed to initialize local stream");
      return;
    }

    createPeerConnection(data.from);

    if (!peerConnection) return;

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.offer)
    );

    console.log("✅ Remote description set");

    while (pendingCandidates.length > 0) {
      const candidate = pendingCandidates.shift();

      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("✅ Queued ICE added");
      } catch (err) {
        console.log("❌ Queued ICE error:", err);
      }
    }

    const answer = await peerConnection.createAnswer();

    await peerConnection.setLocalDescription(answer);

    sendWebRTCAnswer({
      targetUserId: data.from,
      answer,
    });

    console.log("✅ Answer sent");
  } catch (err) {
    console.log("❌ Offer error:", err);
  }
};

export const handleWebRTCAnswer = async (data) => {
  try {
    console.log("📩 Answer received");

    if (!peerConnection) {
      console.log("❌ Missing peer connection");
      return;
    }

    if (peerConnection.signalingState !== "have-local-offer") {
      console.log("⚠️ Invalid signaling state:", peerConnection.signalingState);
      return;
    }

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );

    console.log("✅ Remote answer set");

    while (pendingCandidates.length > 0) {
      const candidate = pendingCandidates.shift();

      try {
        await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("✅ Queued ICE added");
      } catch (err) {
        console.log("❌ Queued ICE error:", err);
      }
    }
  } catch (err) {
    console.log("❌ Answer error:", err);
  }
};

export const handleWebRTCIceCandidate = async (data) => {
  try {
    if (!data?.candidate) return;

    if (!peerConnection || !peerConnection.remoteDescription) {
      pendingCandidates.push(data.candidate);
      console.log("⏳ ICE queued");
      return;
    }

    await peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));

    console.log("✅ ICE candidate added");
  } catch (err) {
    console.log("❌ ICE error:", err);
  }
};

export const toggleMic = (enabled) => {
  try {
    if (!localStream) return;

    localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });

    console.log(enabled ? "🎤 Mic enabled" : "🔇 Mic disabled");
  } catch (err) {
    console.log("❌ Mic error:", err);
  }
};

export const toggleCamera = (enabled) => {
  try {
    if (!localStream) return;

    localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });

    console.log(enabled ? "📹 Camera enabled" : "🚫 Camera disabled");
  } catch (err) {
    console.log("❌ Camera error:", err);
  }
};

let onConnectionStateCallback = null;

export const getLocalStream = () => localStream;
export const getRemoteStream = () => remoteStream;

export const setOnConnectionStateCallback = (cb) => {
  onConnectionStateCallback = cb;
};

export const startScreenShare = async (localVideoRef) => {
  try {
    if (!peerConnection) {
      console.log("❌ Peer connection missing");
      return false;
    }

    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    const screenTrack = screenStream.getVideoTracks()[0];

    const sender = peerConnection
      .getSenders()
      .find((s) => s.track?.kind === "video");

    if (sender) {
      await sender.replaceTrack(screenTrack);
    }

    await playVideoSafely(localVideoRef, screenStream);

    console.log("✅ Screen sharing started");

    screenTrack.onended = async () => {
      const cameraTrack = localStream?.getVideoTracks()[0];

      if (sender && cameraTrack) {
        await sender.replaceTrack(cameraTrack);
        await playVideoSafely(localVideoRef, localStream);
        console.log("✅ Back to camera");
      }
    };

    return true;
  } catch (err) {
    console.log("❌ Screen share error:", err);
    return false;
  }
};

export const stopLocalStream = () => {
  try {
    if (localStream) {
      localStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (remoteStream) {
      remoteStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (peerConnection) {
      peerConnection.close();
    }

    if (remoteVideoRefGlobal?.current) {
      remoteVideoRefGlobal.current.srcObject = null;
    }

    localStream = null;
    remoteStream = null;
    peerConnection = null;
    connectedUserId = null;
    pendingCandidates = [];

    console.log("📴 Call ended");
  } catch (err) {
    console.log("❌ Stop stream error:", err);
  }
};