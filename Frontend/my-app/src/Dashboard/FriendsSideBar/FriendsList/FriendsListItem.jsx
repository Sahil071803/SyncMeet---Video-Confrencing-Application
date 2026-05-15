import React, { memo } from "react";
import { styled, alpha } from "@mui/system";

import {
  Avatar,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";

import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";

const ItemContainer = styled("div")(({ theme, active }) => ({
  width: "100%",
  minHeight: "86px",

  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",

  padding: "14px",
  borderRadius: "24px",
  boxSizing: "border-box",

  cursor: "pointer",
  transition: "all 0.25s ease",

  position: "relative",
  overflow: "hidden",

  backdropFilter: "blur(14px)",

  border: active
    ? `1px solid ${alpha("#8B5CF6", 0.45)}`
    : `1px solid ${alpha("#ffffff", 0.06)}`,

  background: active
    ? "linear-gradient(135deg, rgba(139,92,246,0.24), rgba(59,130,246,0.08))"
    : "linear-gradient(135deg, rgba(255,255,255,0.045), rgba(255,255,255,0.025))",

  boxShadow: active
    ? "0 16px 34px rgba(139,92,246,0.18)"
    : "0 10px 24px rgba(0,0,0,0.14)",

  "&::before": {
    content: '""',
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(255,255,255,0.06), transparent 40%)",
    opacity: active ? 1 : 0,
    pointerEvents: "none",
  },

  "&:hover": {
    transform: "translateY(-2px)",
    background:
      "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.035))",
    border: `1px solid ${alpha("#8B5CF6", 0.28)}`,
  },

  [theme.breakpoints.down("sm")]: {
    minHeight: "78px",
    padding: "12px",
    borderRadius: "22px",
  },
}));

const LeftSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "13px",
  flex: 1,
  minWidth: 0,
  position: "relative",
  zIndex: 2,
});

const AvatarWrapper = styled("div")({
  position: "relative",
  flexShrink: 0,
});

const OnlineIndicator = styled("div")(({ isonline }) => ({
  width: "14px",
  height: "14px",
  borderRadius: "50%",
  background: isonline ? "#22C55E" : "#64748B",
  position: "absolute",
  bottom: "2px",
  right: "2px",
  border: "3px solid #0F172A",
  boxShadow: isonline ? "0 0 16px rgba(34,197,94,0.75)" : "none",
}));

const UserInfo = styled("div")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

const UsernameText = styled(Typography)({
  color: "#FFFFFF",
  fontWeight: 800,
  fontSize: "0.98rem",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const StatusText = styled(Typography)(({ online }) => ({
  color: online ? "#4ADE80" : "#94A3B8",
  fontSize: "0.78rem",
  marginTop: "3px",
  fontWeight: 600,
}));

const EmailText = styled(Typography)({
  color: "#64748B",
  fontSize: "0.72rem",
  marginTop: "2px",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "180px",
});

const Actions = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "5px",
  position: "relative",
  zIndex: 2,
});

const ActionButton = styled(IconButton)(({ danger }) => ({
  width: "44px",
  height: "44px",
  color: danger ? "#FCA5A5" : "#CBD5E1",
  background: danger ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.045)",
  border: danger
    ? "1px solid rgba(239,68,68,0.12)"
    : "1px solid rgba(255,255,255,0.06)",
  transition: "all 0.2s ease",

  "&:hover": {
    color: danger ? "#EF4444" : "#fff",
    background: danger ? "rgba(239,68,68,0.14)" : "rgba(139,92,246,0.18)",
  },
}));

const FriendsListItem = ({
  id,
  username,
  email,
  isOnline,
  active,
  onClick,
  onRemoveFriend,
}) => {
  const avatarLetter = username?.charAt(0) || "?";

  return (
    <ItemContainer active={active ? 1 : 0} onClick={onClick}>
      <LeftSection>
        <AvatarWrapper>
          <Avatar
            sx={{
              width: 54,
              height: 54,
              fontWeight: 900,
              background:
                "linear-gradient(135deg,#6366F1,#8B5CF6 55%,#EC4899)",
              fontSize: "1.05rem",
              boxShadow: "0 14px 26px rgba(99,102,241,0.24)",
            }}
          >
            {avatarLetter.toUpperCase()}
          </Avatar>

          <OnlineIndicator isonline={isOnline ? 1 : 0} />
        </AvatarWrapper>

        <UserInfo>
          <UsernameText>{username}</UsernameText>

          <StatusText online={isOnline ? 1 : 0}>
            {isOnline ? "Online now" : "Offline"}
          </StatusText>

          {email && <EmailText>{email}</EmailText>}
        </UserInfo>
      </LeftSection>

      <Actions>
        <Tooltip title="Open Chat">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ChatBubbleOutlineRoundedIcon sx={{ fontSize: 19 }} />
          </ActionButton>
        </Tooltip>

        <Tooltip title="Video Call">
          <ActionButton
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <VideocamRoundedIcon sx={{ fontSize: 20 }} />
          </ActionButton>
        </Tooltip>

        <Tooltip title="Remove">
          <ActionButton
            danger={1}
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFriend?.(id);
            }}
          >
            <DeleteOutlineRoundedIcon sx={{ fontSize: 20 }} />
          </ActionButton>
        </Tooltip>
      </Actions>
    </ItemContainer>
  );
};

export default memo(FriendsListItem);