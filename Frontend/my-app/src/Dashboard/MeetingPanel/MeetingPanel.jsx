import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import { styled } from "@mui/system";

import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";

import CallEndIcon from "@mui/icons-material/CallEnd";

import PhoneIcon from "@mui/icons-material/Phone";

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

import {
  getSocket,
} from "../../realtimeCommunication/socketConnection";

// ======================================
// STYLES
// ======================================

const Container = styled("div")({
  height: "100%",

  background: "rgba(15,23,42,0.92)",

  borderLeft:
    "1px solid rgba(255,255,255,0.05)",

  backdropFilter: "blur(12px)",

  padding: "22px",

  display: "flex",

  flexDirection: "column",

  justifyContent: "space-between",
});

const Top = styled("div")({
  display: "flex",

  flexDirection: "column",

  gap: "18px",
});

const Card = styled("div")({
  padding: "18px",

  borderRadius: "18px",

  background: "rgba(255,255,255,0.04)",

  border:
    "1px solid rgba(255,255,255,0.05)",

  color: "#fff",
});

const VideoGrid = styled("div")({
  display: "grid",

  gridTemplateColumns: "1fr",

  gap: "16px",
});

const VideoContainer = styled("div")({
  width: "100%",

  height: "240px",

  borderRadius: "18px",

  overflow: "hidden",

  background: "#020617",

  border:
    "1px solid rgba(255,255,255,0.05)",

  position: "relative",
});

const VideoLabel = styled("div")({
  position: "absolute",

  top: "10px",

  left: "10px",

  padding: "4px 10px",

  borderRadius: "10px",

  background: "rgba(0,0,0,0.45)",

  color: "#fff",

  fontSize: "12px",

  zIndex: 10,
});

const Video = styled("video")({
  width: "100%",

  height: "100%",

  objectFit: "cover",
});

const Controls = styled("div")({
  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  gap: "16px",

  marginTop: "20px",
});

const CircleButton = styled("button")(
  ({ danger, success }) => ({
    width: "58px",

    height: "58px",

    borderRadius: "50%",

    border: "none",

    cursor: "pointer",

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    color: "#fff",

    background: danger
      ? "#EF4444"
      : success
      ? "#22C55E"
      : "#1E293B",

    transition: "0.2s",

    boxShadow:
      "0 4px 20px rgba(0,0,0,0.25)",

    "&:hover": {
      transform: "scale(1.08)",
    },
  })
);

// ======================================
// COMPONENT
// ======================================

const MeetingPanel = ({
  selectedFriend,
}) => {
  const localVideoRef = useRef();

  const remoteVideoRef = useRef();

  const [micEnabled, setMicEnabled] =
    useState(true);

  const [
    cameraEnabled,
    setCameraEnabled,
  ] = useState(true);

  // ======================================
  // INITIAL SETUP
  // ======================================

  useEffect(() => {
    // LOCAL PREVIEW

    getLocalPreview(localVideoRef);

    // REMOTE VIDEO

    setRemoteVideo(remoteVideoRef);

    // SOCKET EVENTS

    const socket = getSocket();

    if (socket) {
      socket.on(
        "webrtc-offer",
        handleWebRTCOffer
      );

      socket.on(
        "webrtc-answer",
        handleWebRTCAnswer
      );

      socket.on(
        "webrtc-ice-candidate",
        handleWebRTCIceCandidate
      );
    }

    // CLEANUP

    return () => {
      if (socket) {
        socket.off(
          "webrtc-offer",
          handleWebRTCOffer
        );

        socket.off(
          "webrtc-answer",
          handleWebRTCAnswer
        );

        socket.off(
          "webrtc-ice-candidate",
          handleWebRTCIceCandidate
        );
      }

      stopLocalStream();
    };
  }, []);

  // ======================================
  // TOGGLE MIC
  // ======================================

  const handleToggleMic = () => {
    const newState = !micEnabled;

    setMicEnabled(newState);

    toggleMic(newState);
  };

  // ======================================
  // TOGGLE CAMERA
  // ======================================

  const handleToggleCamera = () => {
    const newState =
      !cameraEnabled;

    setCameraEnabled(newState);

    toggleCamera(newState);
  };

  // ======================================
  // START CALL
  // ======================================

  const handleStartCall =
    async () => {
      if (!selectedFriend?._id) {
        console.log(
          "❌ No selected friend"
        );

        return;
      }

      try {
        await callToOtherUser(
          selectedFriend._id
        );

        console.log(
          "📞 Calling:",
          selectedFriend._id
        );
      } catch (err) {
        console.log(
          "❌ Call start error:",
          err
        );
      }
    };

  // ======================================
  // END CALL
  // ======================================

  const handleEndCall = () => {
    stopLocalStream();

    if (localVideoRef.current) {
      localVideoRef.current.srcObject =
        null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject =
        null;
    }

    console.log(
      "📴 Call ended"
    );
  };

  return (
    <Container>
      <Top>
        {/* HEADER */}

        <Card>
          <h3>
            Meeting Room
          </h3>

          <p
            style={{
              marginTop: "10px",

              color: "#94A3B8",
            }}
          >
            Realtime video communication
            session active.
          </p>
        </Card>

        {/* VIDEOS */}

        <VideoGrid>
          {/* LOCAL VIDEO */}

          <VideoContainer>
            <VideoLabel>
              You
            </VideoLabel>

            <Video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
            />
          </VideoContainer>

          {/* REMOTE VIDEO */}

          <VideoContainer>
            <VideoLabel>
              Remote User
            </VideoLabel>

            <Video
              ref={remoteVideoRef}
              autoPlay
              playsInline
            />
          </VideoContainer>
        </VideoGrid>

        {/* STATUS */}

        <Card>
          <h3>
            Connection Status
          </h3>

          <p
            style={{
              marginTop: "10px",

              color: "#22C55E",
            }}
          >
            Camera and microphone ready
          </p>
        </Card>
      </Top>

      {/* CONTROLS */}

      <Controls>
        {/* MIC */}

        <CircleButton
          onClick={handleToggleMic}
        >
          {micEnabled ? (
            <MicIcon />
          ) : (
            <MicOffIcon />
          )}
        </CircleButton>

        {/* CAMERA */}

        <CircleButton
          onClick={
            handleToggleCamera
          }
        >
          {cameraEnabled ? (
            <VideocamIcon />
          ) : (
            <VideocamOffIcon />
          )}
        </CircleButton>

        {/* START CALL */}

        <CircleButton
          success
          onClick={handleStartCall}
        >
          <PhoneIcon />
        </CircleButton>

        {/* END CALL */}

        <CircleButton
          danger
          onClick={handleEndCall}
        >
          <CallEndIcon />
        </CircleButton>
      </Controls>
    </Container>
  );
};

export default MeetingPanel;