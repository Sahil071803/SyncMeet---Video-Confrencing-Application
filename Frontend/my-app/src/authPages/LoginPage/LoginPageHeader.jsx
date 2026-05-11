import React from "react";
import { Typography, Box } from "@mui/material";

const LoginPageHeader = () => {
  return (
    <Box sx={{ alignSelf: "flex-start", textAlign: "left" }}>
      <Typography variant="h5" sx={{ color: "white", fontWeight: 600 }}>
        Welcome Back!
      </Typography>

      <Typography sx={{ color: "#b9bbbe", mt: 1 }}>
        We are happy that you are with us!
      </Typography>
    </Box>
  );
};

export default LoginPageHeader;