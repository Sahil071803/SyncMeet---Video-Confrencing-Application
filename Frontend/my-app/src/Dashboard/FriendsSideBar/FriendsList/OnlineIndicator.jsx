import React from "react";

import { styled } from "@mui/system";

const Indicator = styled("div")({
  width: "10px",

  height: "10px",

  borderRadius: "50%",

  background: "#22C55E",

  boxShadow: "0 0 12px #22C55E",

  animation: "pulse 1.5s infinite",

  "@keyframes pulse": {
    "0%": {
      transform: "scale(1)",
      opacity: 1,
    },

    "50%": {
      transform: "scale(1.3)",
      opacity: 0.6,
    },

    "100%": {
      transform: "scale(1)",
      opacity: 1,
    },
  },
});

const OnlineIndicator = () => {
  return <Indicator />;
};

export default OnlineIndicator;