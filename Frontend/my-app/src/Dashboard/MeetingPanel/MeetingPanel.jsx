import React, { useEffect, useRef, useState, useCallback } from "react";

import { styled } from "@mui/system";
import { Typography, IconButton, Tooltip } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import EmojiEmotionsRoundedIcon from "@mui/icons-material/EmojiEmotionsRounded";
import StopScreenShareRoundedIcon from "@mui/icons-material/StopScreenShareRounded";


import {
  getLocalPreview,
  toggleCamera,
  toggleMic,
  stopLocalStream,
  setRemoteVideo,
  callToOtherUser,
  handleWebRTCOffer,
  handleWebRTCAnswer,
  handleWebRTCIceCandidate,
  startScreenShare,
  setOnConnectionStateCallback,
} from "../../realtimeCommunication/webRTCHandler";

import { getSocket, sendCallEnded, sendCallReaction } from "../../realtimeCommunication/socketConnection";

const REACTIONS = ["❤️", "😂", "🎉", "🔥", "👍"];

const Container = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  background: "linear-gradient(180deg,#020617 0%,#0B1120 100%)",

  ...(mobile && {
    paddingBottom: "90px",
    boxSizing: "border-box",
  }),
}));

const Header = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: mobile ? "14px 16px" : "20px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.05)",
  boxSizing: "border-box",
}));

const HeaderLeft = styled("div")({
  display: "flex",
  flexDirection: "column",
  gap: "4px",
});

const VideoArea = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  flex: 1,
  position: "relative",
  margin: mobile ? "10px" : "18px",
  padding: mobile ? "14px" : "0px",
  borderRadius: mobile ? "22px" : "28px",
  overflow: "hidden",
  background: "#000",
  border: "1px solid rgba(255,255,255,0.06)",
  minHeight: mobile ? "220px" : "520px",
  boxSizing: "border-box",
}));

const Video = styled("video")({
  width: "100%",
  height: "100%",
  objectFit: "cover",
  backgroundColor: "#000",
  borderRadius: "18px",
  transform: "scaleX(-1)",
  WebkitTransform: "scaleX(-1)",
  backfaceVisibility: "hidden",
});

const RemoteUserInfo = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  position: "absolute",
  left: mobile ? "18px" : "16px",
  bottom: mobile ? "18px" : "16px",
  padding: "9px 13px",
  borderRadius: "14px",
  background: "rgba(0,0,0,0.42)",
  backdropFilter: "blur(18px)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  flexDirection: "column",
  gap: "2px",
}));

const LocalVideoWrapper = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  position: "absolute",
  right: mobile ? "18px" : "16px",
  top: mobile ? "18px" : "16px",
  width: mobile ? "96px" : "220px",
  height: mobile ? "130px" : "150px",
  borderRadius: "16px",
  overflow: "hidden",
  background: "#000",
  border: "2px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 40px rgba(0,0,0,0.28)",
}));

const Controls = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexWrap: "wrap",
  gap: mobile ? "10px" : "16px",
  padding: mobile ? "12px 14px 18px" : "20px",
  boxSizing: "border-box",
  position: "relative",
}));

const ControlButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "danger" &&
    prop !== "success" &&
    prop !== "active" &&
    prop !== "mobile",
})(({ danger, success, active, mobile }) => ({
  width: mobile ? "50px" : "64px",
  height: mobile ? "50px" : "64px",
  borderRadius: mobile ? "18px" : "20px",
  color: "#fff",
  transition: "all 0.25s ease",

  background: danger
    ? "linear-gradient(135deg,#EF4444,#DC2626)"
    : success
    ? "linear-gradient(135deg,#22C55E,#16A34A)"
    : active
    ? "linear-gradient(135deg,#8B5CF6,#7C3AED)"
    : "rgba(255,255,255,0.06)",

  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",

  boxShadow: danger
    ? "0 12px 30px rgba(239,68,68,0.28)"
    : success
    ? "0 12px 30px rgba(34,197,94,0.22)"
    : active
    ? "0 12px 30px rgba(139,92,246,0.22)"
    : "none",

  "& svg": {
    fontSize: mobile ? "22px" : "26px",
  },

  "&:hover": {
    transform: "translateY(-2px) scale(1.02)",
    background: danger
      ? "linear-gradient(135deg,#F87171,#EF4444)"
      : success
      ? "linear-gradient(135deg,#4ADE80,#22C55E)"
      : active
      ? "linear-gradient(135deg,#A78BFA,#8B5CF6)"
      : "rgba(255,255,255,0.10)",
  },

  "&.Mui-disabled": {
    opacity: 0.45,
    color: "#fff",
  },
}));

const ConnectionDot = styled("span")(({ color }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  background: color || "#FACC15",
  display: "inline-block",
  flexShrink: 0,
}));

const PTTBadge = styled("div")(({ mobile }) => ({
  position: "absolute",
  bottom: "calc(100% + 8px)",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "6px 14px",
  borderRadius: "20px",
  background: "rgba(139,92,246,0.25)",
  border: "1px solid rgba(139,92,246,0.3)",
  backdropFilter: "blur(12px)",
  color: "#C4B5FD",
  fontSize: "12px",
  fontWeight: 600,
  whiteSpace: "nowrap",
  display: "flex",
  alignItems: "center",
  gap: 6,
  animation: "pttPulse 1.5s ease-in-out infinite",
  "@keyframes pttPulse": {
    "0%, 100%": { opacity: 0.7 },
    "50%": { opacity: 1 },
  },
}));

const ScreenShareBadge = styled("div")({
  padding: "4px 12px",
  borderRadius: "12px",
  background: "rgba(34,197,94,0.2)",
  border: "1px solid rgba(34,197,94,0.3)",
  color: "#4ADE80",
  fontSize: "11px",
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  gap: 5,
});

const ReactionBubble = styled("div")(({ index }) => ({
  position: "absolute",
  bottom: "40%",
  left: `${20 + index * 15}%`,
  fontSize: "32px",
  pointerEvents: "none",
  animation: "floatUp 1.8s ease-out forwards",
  zIndex: 100,
  "@keyframes floatUp": {
    "0%": { opacity: 1, transform: "translateY(0) scale(0.5)" },
    "30%": { opacity: 1, transform: "translateY(-60px) scale(1.2)" },
    "100%": { opacity: 0, transform: "translateY(-160px) scale(1)" },
  },
}));

const EmojiMenu = styled("div")(({ mobile }) => ({
  position: "absolute",
  bottom: "calc(100% + 10px)",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  gap: 4,
  padding: "8px 12px",
  borderRadius: "16px",
  background: "rgba(15,23,42,0.95)",
  border: "1px solid rgba(255,255,255,0.1)",
  backdropFilter: "blur(18px)",
  boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
  zIndex: 50,
}));

const EmojiButton = styled("button")({
  width: 40,
  height: 40,
  borderRadius: "10px",
  border: "none",
  background: "transparent",
  fontSize: "22px",
  cursor: "pointer",
  transition: "all 0.15s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    background: "rgba(139,92,246,0.2)",
    transform: "scale(1.2)",
  },
  "&:active": {
    transform: "scale(0.9)",
  },
});

const getInitialPrefs = () => {
  try {
    const prefs = JSON.parse(localStorage.getItem("syncmeet_prefs") || "{}");
    return {
      mic: prefs.autoJoinAudio !== false,
      camera: prefs.autoEnableVideo !== false,
    };
  } catch {
    return { mic: true, camera: true };
  }
};

const MeetingPanel = ({ selectedFriend }) => {
  const { isMobile } = useResponsive();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const initialPrefs = useRef(getInitialPrefs());
  const pttRef = useRef(false); // track PTT active state
  const micWasMutedRef = useRef(false);

  const [micEnabled, setMicEnabled] = useState(initialPrefs.current.mic);
  const [cameraEnabled, setCameraEnabled] = useState(initialPrefs.current.camera);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [connectionState, setConnectionState] = useState("new");
  const [pttActive, setPttActive] = useState(false);
  const [showEmojiMenu, setShowEmojiMenu] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [videoExpanded, setVideoExpanded] = useState(false);

  const pttMicStateRef = useRef(micEnabled);
  pttMicStateRef.current = micEnabled;

  // Add a floating reaction
  const addReaction = useCallback((emoji, isLocal = true) => {
    const id = Date.now() + Math.random();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  }, []);

  // Handle incoming reactions from remote peer
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handler = (data) => {
      if (data?.emoji) addReaction(data.emoji, false);
    };

    socket.on("call-reaction", handler);
    return () => socket.off("call-reaction", handler);
  }, [addReaction]);

  // Connection state callback
  useEffect(() => {
    setOnConnectionStateCallback((state) => {
      setConnectionState(state);
    });
    return () => setOnConnectionStateCallback(null);
  }, []);

  // Push-to-Talk: Spacebar handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" && !e.repeat) {
        // Only PTT if mic is muted, call is active, not typing in an input
        const tag = e.target?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

        if (!pttMicStateRef.current && callStarted) {
          pttRef.current = true;
          micWasMutedRef.current = true;
          setPttActive(true);
          toggleMic(true);
        }
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === "Space") {
        if (pttRef.current && micWasMutedRef.current) {
          pttRef.current = false;
          micWasMutedRef.current = false;
          setPttActive(false);
          // Only toggle off if the user hasn't manually toggled mic on
          if (!pttMicStateRef.current) {
            toggleMic(false);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [callStarted]);

  useEffect(() => {
    let socket = null;

    const init = async () => {
      await getLocalPreview(localVideoRef);

      if (!initialPrefs.current.mic) toggleMic(false);
      if (!initialPrefs.current.camera) toggleCamera(false);

      setRemoteVideo(remoteVideoRef);

      socket = getSocket();

      if (socket) {
        socket.off("webrtc-offer", handleWebRTCOffer);
        socket.off("webrtc-answer", handleWebRTCAnswer);
        socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate);
        socket.off("call-rejected");
        socket.off("call-ended");

        socket.on("webrtc-offer", (data) => {
          setIncomingCall(true);
          handleWebRTCOffer(data, localVideoRef);
        });
        socket.on("webrtc-answer", handleWebRTCAnswer);
        socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate);
        socket.on("call-rejected", () => {
          console.log("❌ Call was rejected by other party");
          setCallStarted(false);
          setIncomingCall(false);
          setConnectionState("new");
        });
        socket.on("call-ended", () => {
          console.log("📴 Call was ended by other party");
          setCallStarted(false);
          setIncomingCall(false);
          setConnectionState("new");
        });
      }
    };

    init();

    return () => {
      if (socket) {
        socket.off("webrtc-offer", handleWebRTCOffer);
        socket.off("webrtc-answer", handleWebRTCAnswer);
        socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate);
        socket.off("call-rejected");
        socket.off("call-ended");
      }

      stopLocalStream();
      setConnectionState("new");
    };
  }, []);

  const handleToggleMic = () => {
    const nextState = !micEnabled;

    setMicEnabled(nextState);
    toggleMic(nextState);
    // Reset PTT if user manually toggles mic
    if (pttRef.current) {
      pttRef.current = false;
      setPttActive(false);
    }
  };

  const handleToggleCamera = () => {
    const nextState = !cameraEnabled;

    setCameraEnabled(nextState);
    toggleCamera(nextState);
  };

  const handleStartCall = async () => {
    if (callStarted) return;

    if (!selectedFriend?._id) {
      console.log("❌ No friend selected");
      return;
    }

    const started = await callToOtherUser(selectedFriend._id);

    if (started) {
      setCallStarted(true);
      setConnectionState("connecting");
    }
  };

  const handleScreenShare = async () => {
    if (screenSharing) {
      setScreenSharing(false);
      // Browser's screen share stop is handled by onended callback in webRTCHandler
      return;
    }

    if (!callStarted) return;

    const started = await startScreenShare(localVideoRef);

    if (started) {
      setScreenSharing(true);
    }
  };

  const handleSendReaction = (emoji) => {
    addReaction(emoji, true);
    setShowEmojiMenu(false);

    if (selectedFriend?._id) {
      sendCallReaction({ targetUserId: selectedFriend._id, emoji });
    }
  };

  const handleEndCall = async () => {
    if (selectedFriend?._id && callStarted) {
      sendCallEnded({ targetUserId: selectedFriend._id });
    }

    stopLocalStream();

    setCallStarted(false);
    setScreenSharing(false);
    setMicEnabled(true);
    setCameraEnabled(true);
    setIncomingCall(false);
    setConnectionState("new");
    setPttActive(false);
    pttRef.current = false;

    setTimeout(() => {
      getLocalPreview(localVideoRef);
      setRemoteVideo(remoteVideoRef);
    }, 400);
  };

  const getConnectionColor = () => {
    switch (connectionState) {
      case "connected": return "#22C55E";
      case "connecting": return "#FACC15";
      case "failed": return "#EF4444";
      case "disconnected": return "#EF4444";
      default: return "#94A3B8";
    }
  };

  const getConnectionLabel = () => {
    switch (connectionState) {
      case "connected": return "Connected";
      case "connecting": return "Connecting...";
      case "failed": return "Failed";
      case "disconnected": return "Disconnected";
      default: return "Ready";
    }
  };

  return (
    <Container mobile={isMobile ? 1 : 0}>
      <Header mobile={isMobile ? 1 : 0}>
        <HeaderLeft>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: isMobile ? "19px" : "24px",
            }}
          >
            Video Meeting
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: "13px",
              display: "flex",
              alignItems: "center",
              gap: 0.8,
            }}
          >
            {callStarted ? (
              <>
                <ConnectionDot color={getConnectionColor()} />
                {getConnectionLabel()}
              </>
            ) : (
              "HD realtime communication"
            )}
          </Typography>
        </HeaderLeft>

        {screenSharing && (
          <ScreenShareBadge>
            <ScreenShareRoundedIcon sx={{ fontSize: 14 }} />
            Sharing Screen
          </ScreenShareBadge>
        )}
      </Header>

      <VideoArea mobile={isMobile ? 1 : 0}>
        <Video
          ref={videoExpanded ? localVideoRef : remoteVideoRef}
          autoPlay
          playsInline
          muted={videoExpanded}
        />

        {reactions.map((r, i) => (
          <ReactionBubble key={r.id} index={i}>
            {r.emoji}
          </ReactionBubble>
        ))}

        <RemoteUserInfo mobile={isMobile ? 1 : 0}>
          <Typography
            sx={{
              color: "#fff",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {videoExpanded ? "You" : (selectedFriend?.username || selectedFriend?.name || "Remote User")}
          </Typography>

          <Typography
            sx={{
              color: callStarted ? "#4ADE80" : "#FACC15",
              fontSize: "12px",
            }}
          >
            {callStarted ? "Connected" : "Ready"}
          </Typography>
        </RemoteUserInfo>

        <LocalVideoWrapper
          mobile={isMobile ? 1 : 0}
          onClick={() => setVideoExpanded((p) => !p)}
          style={{ cursor: "pointer" }}
        >
          <Video
            ref={videoExpanded ? remoteVideoRef : localVideoRef}
            autoPlay
            muted={!videoExpanded}
            playsInline
          />
        </LocalVideoWrapper>
      </VideoArea>

      <Controls mobile={isMobile ? 1 : 0}>
        {pttActive && (
          <PTTBadge mobile={isMobile ? 1 : 0}>
            <MicRoundedIcon sx={{ fontSize: 14 }} />
            Hold to speak
          </PTTBadge>
        )}

        <Tooltip title={micEnabled ? "Mute (Space)" : "Unmute (Space)"}>
          <ControlButton
            mobile={isMobile ? 1 : 0}
            active={!micEnabled || pttActive ? 1 : 0}
            onClick={handleToggleMic}
            sx={pttActive ? {
              boxShadow: "0 0 20px rgba(139,92,246,0.4)",
              borderColor: "rgba(139,92,246,0.4)",
            } : {}}
          >
            {micEnabled && !pttActive ? (
              <MicRoundedIcon />
            ) : (
              <MicOffRoundedIcon />
            )}
          </ControlButton>
        </Tooltip>

        <Tooltip title={cameraEnabled ? "Camera On" : "Camera Off"}>
          <ControlButton
            mobile={isMobile ? 1 : 0}
            active={!cameraEnabled ? 1 : 0}
            onClick={handleToggleCamera}
          >
            {cameraEnabled ? (
              <VideocamRoundedIcon />
            ) : (
              <VideocamOffRoundedIcon />
            )}
          </ControlButton>
        </Tooltip>

        <Tooltip title="Reactions">
          <ControlButton
            mobile={isMobile ? 1 : 0}
            onClick={() => setShowEmojiMenu((prev) => !prev)}
            sx={{ position: "relative" }}
          >
            <EmojiEmotionsRoundedIcon />
            {showEmojiMenu && (
              <EmojiMenu mobile={isMobile ? 1 : 0}>
                {REACTIONS.map((emoji) => (
                  <EmojiButton
                    key={emoji}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendReaction(emoji);
                    }}
                  >
                    {emoji}
                  </EmojiButton>
                ))}
              </EmojiMenu>
            )}
          </ControlButton>
        </Tooltip>

        <ControlButton
          success={1}
          mobile={isMobile ? 1 : 0}
          onClick={handleStartCall}
          disabled={!selectedFriend?._id || callStarted}
        >
          <PhoneRoundedIcon />
        </ControlButton>

        <Tooltip title={screenSharing ? "Stop Sharing" : "Share Screen"}>
          <ControlButton
            mobile={isMobile ? 1 : 0}
            active={screenSharing ? 1 : 0}
            onClick={handleScreenShare}
            disabled={!callStarted}
          >
            {screenSharing ? (
              <StopScreenShareRoundedIcon />
            ) : (
              <ScreenShareRoundedIcon />
            )}
          </ControlButton>
        </Tooltip>

        <ControlButton
          danger={1}
          mobile={isMobile ? 1 : 0}
          onClick={handleEndCall}
        >
          <CallEndRoundedIcon />
        </ControlButton>
      </Controls>
    </Container>
  );
};

export default MeetingPanel;
