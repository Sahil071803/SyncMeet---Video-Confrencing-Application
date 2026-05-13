import React from "react";

import { styled } from "@mui/system";

import useResponsive from "../hooks/useResponsive";

// ======================================================
// ROOT LAYOUT
// ======================================================

const LayoutRoot = styled(
  "div"
)(({ mobile }) => ({
  width: "100%",

  minHeight: "100vh",

  position: "relative",

  overflow: "hidden",

  display: "flex",

  flexDirection: "column",

  background:
    "radial-gradient(circle at top,#111827 0%,#020617 45%,#000 100%)",

  paddingBottom: mobile
    ? "90px"
    : "0px",
}));

// ======================================================
// CONTENT WRAPPER
// ======================================================

const ContentWrapper = styled(
  "div"
)(({ mobile }) => ({
  flex: 1,

  width: "100%",

  display: "flex",

  flexDirection: "column",

  overflow: "hidden",

  position: "relative",

  padding: mobile
    ? "0"
    : "0",

  zIndex: 2,
}));

// ======================================================
// BACKGROUND GLOW
// ======================================================

const GlowOrb = styled(
  "div"
)(({ top, left, color }) => ({
  position: "absolute",

  top: top || "-140px",

  left: left || "-100px",

  width: "260px",

  height: "260px",

  borderRadius: "50%",

  background:
    color ||
    "rgba(139,92,246,0.18)",

  filter: "blur(110px)",

  pointerEvents: "none",

  zIndex: 0,
}));

// ======================================================
// COMPONENT
// ======================================================

const ResponsiveLayout = ({
  children,
}) => {
  const { isMobile } =
    useResponsive();

  return (
    <LayoutRoot
      mobile={
        isMobile
          ? 1
          : 0
      }
    >

      {/* TOP LEFT GLOW */}

      <GlowOrb />

      {/* BOTTOM RIGHT GLOW */}

      <GlowOrb
        top="auto"
        left="auto"
        color="rgba(6,182,212,0.14)"
        style={{
          right: "-120px",
          bottom: "-140px",
        }}
      />

      {/* CONTENT */}

      <ContentWrapper
        mobile={
          isMobile
            ? 1
            : 0
        }
      >

        {children}

      </ContentWrapper>

    </LayoutRoot>
  );
};

export default ResponsiveLayout;