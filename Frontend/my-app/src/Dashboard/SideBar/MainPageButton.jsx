import React from "react";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import { styled } from "@mui/system";

import useResponsive from "../../hooks/useResponsive";

const HexLogo = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", zIndex: 2 }}>
    <defs>
      <linearGradient id="hex-bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff" stopOpacity="0.9"/>
        <stop offset="100%" stopColor="#fff" stopOpacity="0.7"/>
      </linearGradient>
    </defs>
    <polygon points="256,68 406,148 406,364 256,444 106,364 106,148" fill="rgba(255,255,255,0.22)"/>
    <polygon points="256,96 380,164 380,348 256,416 132,348 132,164" fill="rgba(15,23,42,0.5)"/>
    <rect x="140" y="200" width="180" height="120" rx="20" fill="rgba(255,255,255,0.15)"/>
    <rect x="150" y="210" width="160" height="100" rx="12" fill="#0F172A"/>
    <circle cx="230" cy="260" r="32" fill="rgba(255,255,255,0.2)"/>
    <circle cx="230" cy="260" r="20" fill="rgba(255,255,255,0.35)"/>
    <polygon points="223,250 223,270 241,260" fill="#fff"/>
    <path d="M326 220l22-16-22-16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M326 254l22-16-22-16" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" transform="translate(0,34)"/>
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