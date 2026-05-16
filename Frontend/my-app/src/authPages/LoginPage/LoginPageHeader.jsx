import React from "react";
import { Typography, Box } from "@mui/material";
import SyncMeetLogo from "../../shared/components/SyncMeetLogo";

const LoginPageHeader = () => {
  return (
    <Box sx={{ alignSelf: "flex-start", textAlign: "left", width: "100%" }}>
      <Box sx={{ mb: 3 }}>
        <SyncMeetLogo size={48} textVariant="short" />
      </Box>
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