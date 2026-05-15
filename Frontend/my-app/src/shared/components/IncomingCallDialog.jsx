import React, { useEffect, useState } from "react";
import { styled } from "@mui/system";
import {
  Dialog,
  DialogContent,
  Typography,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import PhoneRoundedIcon from "@mui/icons-material/PhoneRounded";
import CallEndRoundedIcon from "@mui/icons-material/CallEndRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import { useSelector } from "react-redux";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    background: "linear-gradient(180deg, #0F172A 0%, #020617 100%)",
    borderRadius: "24px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    minWidth: "min(320px, calc(100vw - 32px))",
    maxWidth: "400px",
    margin: "16px",
  },
}));

const Content = styled(DialogContent)({
  padding: "24px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "20px",
});

const AvatarContainer = styled(Box)({
  position: "relative",
});

const PulsingAvatar = styled(Avatar)({
  width: "96px",
  height: "96px",
  fontSize: "42px",
  fontWeight: 700,
  background: "linear-gradient(135deg, #8B5CF6, #6D28D9)",
  animation: "pulse 2s infinite",
  "@keyframes pulse": {
    "0%, 100%": {
      boxShadow: "0 0 0 0 rgba(139, 92, 246, 0.7)",
    },
    "50%": {
      boxShadow: "0 0 0 20px rgba(139, 92, 246, 0)",
    },
  },
});

const CallInfo = styled(Box)({
  textAlign: "center",
});

const ActionButtons = styled(Box)({
  display: "flex",
  gap: "16px",
  width: "100%",
  justifyContent: "center",
});

const ActionButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== "accept",
})(({ accept }) => ({
  width: "64px",
  height: "64px",
  borderRadius: "50%",
  background: accept
    ? "linear-gradient(135deg, #22C55E, #16A34A)"
    : "linear-gradient(135deg, #EF4444, #DC2626)",
  color: "#fff",
  "&:hover": {
    background: accept
      ? "linear-gradient(135deg, #4ADE80, #22C55E)"
      : "linear-gradient(135deg, #F87171, #EF4444)",
    transform: "scale(1.05)",
  },
  transition: "all 0.2s ease",
}));

const IncomingCallDialog = ({ open, callerId, onAccept, onReject }) => {
  const friends = useSelector((state) => state.friends?.friends || []);
  const [callerName, setCallerName] = useState("Unknown");

  useEffect(() => {
    if (callerId && friends.length > 0) {
      const caller = friends.find(
        (f) => f._id === callerId || f.id === callerId || f.userId === callerId
      );
      setCallerName(caller?.username || "Unknown");
    }
  }, [callerId, friends]);

  return (
    <StyledDialog open={open} onClose={onReject}>
      <Content>
        <AvatarContainer>
          <PulsingAvatar>{callerName.charAt(0).toUpperCase()}</PulsingAvatar>
        </AvatarContainer>

        <CallInfo>
          <Typography
            sx={{
              color: "#fff",
              fontSize: "22px",
              fontWeight: 700,
              mb: 1,
            }}
          >
            {callerName}
          </Typography>
          <Typography
            sx={{
              color: "#94A3B8",
              fontSize: "14px",
            }}
          >
            Incoming video call...
          </Typography>
        </CallInfo>

        <ActionButtons>
          <ActionButton accept={1} onClick={onAccept}>
            <VideocamRoundedIcon sx={{ fontSize: "28px" }} />
          </ActionButton>
          <ActionButton onClick={onReject}>
            <CallEndRoundedIcon sx={{ fontSize: "28px" }} />
          </ActionButton>
        </ActionButtons>
      </Content>
    </StyledDialog>
  );
};

export default IncomingCallDialog;
