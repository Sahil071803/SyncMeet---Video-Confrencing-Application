import React, { useEffect, useRef, useState } from "react";

import { styled } from "@mui/system";

import { Typography, IconButton } from "@mui/material";

import useResponsive from "../../hooks/useResponsive";

import MicRoundedIcon from "@mui/icons-material/MicRounded";
import MicOffRoundedIcon from "@mui/icons-material/MicOffRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import VideocamOffRoundedIcon from "@mui/icons-material/VideocamOffRounded";
import ScreenShareRoundedIcon from "@mui/icons-material/ScreenShareRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";

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
} from "../../realtimeCommunication/webRTCHandler";

import { getSocket } from "../../realtimeCommunication/socketConnection";

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
  background: "#000",
  borderRadius: "18px",
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
}));

const ControlButton = styled(IconButton, {
  shouldForwardProp: (prop) =>
    prop !== "danger" && prop !== "success" && prop !== "mobile",
})(({ danger, success, mobile }) => ({
  width: mobile ? "50px" : "64px",
  height: mobile ? "50px" : "64px",
  borderRadius: mobile ? "18px" : "20px",
  color: "#fff",
  transition: "all 0.25s ease",

  background: danger
    ? "linear-gradient(135deg,#EF4444,#DC2626)"
    : success
    ? "linear-gradient(135deg,#22C55E,#16A34A)"
    : "rgba(255,255,255,0.06)",

  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(18px)",

  boxShadow: danger
    ? "0 12px 30px rgba(239,68,68,0.28)"
    : success
    ? "0 12px 30px rgba(34,197,94,0.22)"
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
      : "rgba(255,255,255,0.10)",
  },
}));

const MeetingPanel = ({ selectedFriend }) => {
  const { isMobile } = useResponsive();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);

  useEffect(() => {
    const init = async () => {
      await getLocalPreview(localVideoRef);
      setRemoteVideo(remoteVideoRef);
    };

    init();

    const socket = getSocket();

    if (socket) {
      socket.on("webrtc-offer", handleWebRTCOffer);
      socket.on("webrtc-answer", handleWebRTCAnswer);
      socket.on("webrtc-ice-candidate", handleWebRTCIceCandidate);
    }

    return () => {
      if (socket) {
        socket.off("webrtc-offer", handleWebRTCOffer);
        socket.off("webrtc-answer", handleWebRTCAnswer);
        socket.off("webrtc-ice-candidate", handleWebRTCIceCandidate);
      }

      stopLocalStream();
    };
  }, []);

  const handleToggleMic = () => {
    const state = !micEnabled;

    setMicEnabled(state);
    toggleMic(state);
  };

  const handleToggleCamera = () => {
    const state = !cameraEnabled;

    setCameraEnabled(state);
    toggleCamera(state);
  };

  const handleStartCall = async () => {
    if (!selectedFriend?._id) return;

    await callToOtherUser(selectedFriend._id);
  };

  const handleEndCall = () => {
    stopLocalStream();
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

          <Typography sx={{ color: "#94A3B8", fontSize: "13px" }}>
            HD realtime communication
          </Typography>
        </HeaderLeft>
      </Header>

      <VideoArea mobile={isMobile ? 1 : 0}>
        <Video ref={remoteVideoRef} autoPlay playsInline />

        <RemoteUserInfo mobile={isMobile ? 1 : 0}>
          <Typography sx={{ color: "#fff", fontWeight: 600, fontSize: "14px" }}>
            {selectedFriend?.username || "Remote User"}
          </Typography>

          <Typography sx={{ color: "#4ADE80", fontSize: "12px" }}>
            Connected
          </Typography>
        </RemoteUserInfo>

        <LocalVideoWrapper mobile={isMobile ? 1 : 0}>
          <Video ref={localVideoRef} autoPlay muted playsInline />
        </LocalVideoWrapper>
      </VideoArea>

      <Controls mobile={isMobile ? 1 : 0}>
        <ControlButton mobile={isMobile ? 1 : 0} onClick={handleToggleMic}>
          {micEnabled ? <MicRoundedIcon /> : <MicOffRoundedIcon />}
        </ControlButton>

        <ControlButton mobile={isMobile ? 1 : 0} onClick={handleToggleCamera}>
          {cameraEnabled ? <VideocamRoundedIcon /> : <VideocamOffRoundedIcon />}
        </ControlButton>

        <ControlButton
          success={1}
          mobile={isMobile ? 1 : 0}
          onClick={handleStartCall}
        >
          <PhoneRoundedIcon />
        </ControlButton>

        <ControlButton mobile={isMobile ? 1 : 0}>
          <ScreenShareRoundedIcon />
        </ControlButton>

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