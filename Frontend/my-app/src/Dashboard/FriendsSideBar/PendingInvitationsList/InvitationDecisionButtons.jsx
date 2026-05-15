import React from "react";
import { IconButton } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ClearIcon from "@mui/icons-material/Clear";

const InvitationDecisionButtons = ({
  disabled,
  acceptInvitationHandler,
  rejectInvitationHandler,
}) => {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <IconButton
        disabled={disabled}
        onClick={acceptInvitationHandler}
        sx={{
          width: 44,
          height: 44,
          color: "#22C55E",
          background: "rgba(34,197,94,0.1)",
          border: "1px solid rgba(34,197,94,0.2)",
          "&:hover": { background: "rgba(34,197,94,0.2)" },
        }}
      >
        <CheckIcon sx={{ fontSize: 22 }} />
      </IconButton>

      <IconButton
        disabled={disabled}
        onClick={rejectInvitationHandler}
        sx={{
          width: 44,
          height: 44,
          color: "#EF4444",
          background: "rgba(239,68,68,0.1)",
          border: "1px solid rgba(239,68,68,0.2)",
          "&:hover": { background: "rgba(239,68,68,0.2)" },
        }}
      >
        <ClearIcon sx={{ fontSize: 22 }} />
      </IconButton>
    </div>
  );
};

export default InvitationDecisionButtons;