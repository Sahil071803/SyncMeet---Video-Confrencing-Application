import React, { useState } from "react";
import { Avatar, Typography, Tooltip, Box } from "@mui/material";
import InvitationDecisionButtons from "./InvitationDecisionButtons";

const PendingInvitationsListItem = ({
  id,
  username,
  mail,
  acceptFriendInvitation,
  rejectFriendInvitation,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAcceptInvitation = async () => {
    if (loading || !acceptFriendInvitation) return;

    try {
      setLoading(true);
      await acceptFriendInvitation(id);
    } catch (err) {
      console.error("Accept error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectInvitation = async () => {
    if (loading || !rejectFriendInvitation) return;

    try {
      setLoading(true);
      await rejectFriendInvitation(id);
    } catch (err) {
      console.error("Reject error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tooltip title={mail || ""}>
      <Box
        sx={{
          width: "100%",
          height: 56,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#fff",
          px: 1.5,
          transition: "0.2s",
          "&:hover": { backgroundColor: "#40444b" },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar sx={{ mr: 1 }}>
            {username?.[0]?.toUpperCase() || "?"}
          </Avatar>

          <Typography variant="body1">
            {username || "Unknown User"}
          </Typography>
        </Box>

        <InvitationDecisionButtons
          disabled={loading}
          acceptInvitationHandler={handleAcceptInvitation}
          rejectInvitationHandler={handleRejectInvitation}
        />
      </Box>
    </Tooltip>
  );
};

export default PendingInvitationsListItem;