import React from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";

const RedirectText = styled("span")({
  color: "#8B5CF6",
  fontWeight: 600,
  cursor: "pointer",
  marginLeft: "5px",
});

const RedirectInfo = ({
  text,
  redirectText,
  additionalStyles,
  redirectHandler,
}) => {
  return (
    <Typography
      sx={{ color: "#72767d", ...additionalStyles }}
      variant="subtitle2"
    >
      {text}
      <RedirectText onClick={redirectHandler}>
        {redirectText}
      </RedirectText>
    </Typography>
  );
};

export default RedirectInfo;