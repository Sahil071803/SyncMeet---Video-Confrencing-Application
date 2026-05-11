import React from "react";
import { Avatar as MuiAvatar } from "@mui/material";

const Avatar = ({ username }) => {
  return (
    <MuiAvatar
      sx={{
        width: "32px",
        height: "32px",
        fontSize: "14px",
        backgroundColor: "#5865F2",
      }}
    >
      {username ? username[0].toUpperCase() : "U"}
    </MuiAvatar>
  );
};

export default Avatar;