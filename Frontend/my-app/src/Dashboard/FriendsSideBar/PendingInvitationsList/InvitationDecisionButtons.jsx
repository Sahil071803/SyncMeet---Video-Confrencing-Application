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
    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
      <IconButton
        size="small"
        disabled={disabled}
        onClick={acceptInvitationHandler}
        sx={{ color: "#3ba55d" }}
      >
        <CheckIcon />
      </IconButton>

      <IconButton
        size="small"
        disabled={disabled}
        onClick={rejectInvitationHandler}
        sx={{ color: "#ed4245" }}
      >
        <ClearIcon />
      </IconButton>
    </div>
  );
};

export default InvitationDecisionButtons;