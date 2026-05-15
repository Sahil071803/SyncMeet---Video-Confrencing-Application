import React, { useState } from "react";
import { Avatar, Typography, Tooltip, Box } from "@mui/material";
import { styled } from "@mui/system";
import InvitationDecisionButtons from "./InvitationDecisionButtons";

const Container = styled(Box)({
  width: "100%",
  minHeight: "64px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "18px",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(14px)",
  transition: "all 0.2s ease",
  "&:hover": {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(139,92,246,0.2)",
  },
});

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
      <Container>
        <Box sx={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              fontWeight: 700,
              background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
            }}
          >
            {username?.[0]?.toUpperCase() || "?"}
          </Avatar>

          <Box>
            <Typography sx={{ fontWeight: 600, fontSize: "14px", color: "#fff" }}>
              {username || "Unknown User"}
            </Typography>
            {mail && (
              <Typography sx={{ color: "#94A3B8", fontSize: "11px", mt: "2px" }}>
                {mail}
              </Typography>
            )}
          </Box>
        </Box>

        <InvitationDecisionButtons
          disabled={loading}
          acceptInvitationHandler={handleAcceptInvitation}
          rejectInvitationHandler={handleRejectInvitation}
        />
      </Container>
    </Tooltip>
  );
};

export default PendingInvitationsListItem;