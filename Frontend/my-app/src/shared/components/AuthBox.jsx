import React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";

// Full-page background wrapper
const PageWrapper = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, #5805F2, #7b2ff7)",
});

// Inner box that contains form content
const InnerBox = styled(Box)({
  width: "100%",
  maxWidth: "500px",
  backgroundColor: "#36393f",
  borderRadius: "12px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.3)",
  display: "flex",
  flexDirection: "column",
  padding: "30px",
  zIndex: 1,
});

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