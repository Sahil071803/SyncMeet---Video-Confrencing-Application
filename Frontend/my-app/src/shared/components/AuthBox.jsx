import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

const PageWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "radial-gradient(circle at top left, rgba(99,102,241,0.35), transparent 30%), radial-gradient(circle at bottom right, rgba(14,165,233,0.25), transparent 35%), linear-gradient(135deg, #07111f 0%, #0b1020 45%, #111827 100%)",
  padding: "12px",
  boxSizing: "border-box",
});

const InnerBox = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "460px",
  borderRadius: "28px",
  background: "rgba(15,23,42,0.72)",
  backdropFilter: "blur(22px)",
  border: "1px solid rgba(255,255,255,0.06)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  display: "flex",
  flexDirection: "column",
  padding: "36px",
  zIndex: 1,
  [theme.breakpoints.down("sm")]: {
    padding: "24px",
    borderRadius: "22px",
  },
}));

const AuthBox = ({ children }) => {
  return (
    <PageWrapper>
      <InnerBox>
        {children}
      </InnerBox>
    </PageWrapper>
  );
};

export default AuthBox;