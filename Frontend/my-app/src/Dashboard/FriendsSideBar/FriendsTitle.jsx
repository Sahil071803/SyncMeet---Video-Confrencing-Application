import React from "react";

import { Typography } from "@mui/material";

const FriendsTitle = ({ title }) => {
  return (
    <Typography
      sx={{
        color: "#64748B",

        fontSize: "11px",

        fontWeight: 700,

        letterSpacing: "1.2px",

        marginBottom: "12px",

        marginTop: "20px",

        paddingLeft: "8px",
      }}
    >
      {title}
    </Typography>
  );
};

export default FriendsTitle;