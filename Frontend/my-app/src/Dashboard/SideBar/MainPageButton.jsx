import React from "react";

import {
  IconButton,
  Tooltip,
} from "@mui/material";

import { styled } from "@mui/system";

import Groups2Icon from "@mui/icons-material/Groups2";

import useResponsive from "../../hooks/useResponsive";

// ======================================================
// BUTTON
// ======================================================

const StyledButton = styled(
  IconButton
)(({ mobile }) => ({
  width: mobile
    ? "56px"
    : "62px",

  height: mobile
    ? "56px"
    : "62px",

  borderRadius: mobile
    ? "18px"
    : "20px",

  background:
    "linear-gradient(135deg,#8B5CF6,#6D28D9)",

  color: "#fff",

  position: "relative",

  overflow: "hidden",

  border:
    "1px solid rgba(255,255,255,0.08)",

  boxShadow:
    "0 14px 32px rgba(139,92,246,0.38)",

  backdropFilter: "blur(16px)",

  transition:
    "all 0.28s ease",

  flexShrink: 0,

  "&::before": {
    content: '""',

    position: "absolute",

    top: "-40%",

    left: "-20%",

    width: "140%",

    height: "140%",

    background:
      "linear-gradient(to bottom right, rgba(255,255,255,0.18), transparent)",

    transform: "rotate(25deg)",
  },

  "&:hover": {
    transform:
      "translateY(-3px) scale(1.04)",

    background:
      "linear-gradient(135deg,#9D6CFF,#7C3AED)",

    boxShadow:
      "0 18px 36px rgba(139,92,246,0.45)",
  },

  "&:active": {
    transform: "scale(0.96)",
  },
}));

// ======================================================
// COMPONENT
// ======================================================

const MainPageButton = () => {
  const { isMobile } =
    useResponsive();

  return (
    <Tooltip
      title="SyncMeet"
      placement="right"
    >

      <StyledButton
        mobile={isMobile ? 1 : 0}
      >

        <Groups2Icon
          sx={{
            fontSize: isMobile
              ? 28
              : 30,

            position: "relative",

            zIndex: 2,
          }}
        />

      </StyledButton>

    </Tooltip>
  );
};

export default MainPageButton;