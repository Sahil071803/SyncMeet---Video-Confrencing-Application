import React from "react";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import { styled } from "@mui/system";

import useResponsive from "../../hooks/useResponsive";

const SvgLogo = ({ size = 30 }) => (
  <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: "relative", zIndex: 2 }}>
    <rect x="40" y="40" width="432" height="432" rx="96" fill="rgba(255,255,255,0.2)"/>
    <rect x="64" y="64" width="384" height="384" rx="76" fill="rgba(255,255,255,0.06)"/>
    <rect x="100" y="170" width="260" height="170" rx="32" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="14"/>
    <rect x="116" y="186" width="228" height="138" rx="20" fill="#0F172A"/>
    <circle cx="230" cy="255" r="46" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="10"/>
    <circle cx="230" cy="255" r="28" fill="rgba(255,255,255,0.3)"/>
    <circle cx="230" cy="255" r="9" fill="#fff"/>
    <path d="M348 200l-24 18 24 18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M348 310l-24-18 24-18" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"/>
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