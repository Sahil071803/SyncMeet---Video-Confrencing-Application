import React from "react";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import { styled } from "@mui/system";

import useResponsive from "../../hooks/useResponsive";

const CameraLogo = ({ size = 30 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 280 192" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", zIndex: 2 }}>
    <rect x="0" y="10" width="220" height="172" rx="28" fill="rgba(255,255,255,0.2)" />
    <rect x="14" y="24" width="192" height="144" rx="16" fill="#0F172A" />
    <circle cx="110" cy="96" r="40" fill="rgba(167,139,250,0.3)" />
    <circle cx="110" cy="96" r="28" fill="url(#logo-lens)" />
    <circle cx="110" cy="96" r="10" fill="#fff" />
    <path d="M220 30l40 36-40 36" stroke="rgba(255,255,255,0.5)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
    <defs>
      <linearGradient id="logo-lens" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#A78BFA" />
        <stop offset="100%" stopColor="#7C3AED" />
      </linearGradient>
    </defs>
  </svg>
);

const StyledButton = styled(
  IconButton
)(({ mobile }) => ({
  width: mobile ? "56px" : "62px",
  height: mobile ? "56px" : "62px",
  borderRadius: mobile ? "18px" : "20px",
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 14px 32px rgba(139,92,246,0.38)",
  backdropFilter: "blur(16px)",
  transition: "all 0.28s ease",
  flexShrink: 0,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "-40%",
    left: "-20%",
    width: "140%",
    height: "140%",
    background: "linear-gradient(to bottom right, rgba(255,255,255,0.18), transparent)",
    transform: "rotate(25deg)",
  },
  "&:hover": {
    transform: "translateY(-3px) scale(1.04)",
    background: "linear-gradient(135deg,#9D6CFF,#7C3AED)",
    boxShadow: "0 18px 36px rgba(139,92,246,0.45)",
  },
  "&:active": {
    transform: "scale(0.96)",
  },
}));

const MainPageButton = () => {
  const { isMobile } = useResponsive();

  return (
    <Tooltip title="SyncMeet" placement="right">
      <StyledButton mobile={isMobile ? 1 : 0}>
        <CameraLogo size={isMobile ? 28 : 30} />
      </StyledButton>
    </Tooltip>
  );
};

export default MainPageButton;