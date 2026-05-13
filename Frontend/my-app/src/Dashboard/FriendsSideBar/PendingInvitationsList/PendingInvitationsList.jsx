import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { styled } from "@mui/system";
import { Typography } from "@mui/material";
import MarkEmailUnreadRoundedIcon from "@mui/icons-material/MarkEmailUnreadRounded";

import PendingInvitationsListItem from "./PendingInvitationsListItem";

import {
  acceptFriendInvitation,
  rejectFriendInvitation,
} from "../../../store/actions/friendsActions";

const MainContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
});

const EmptyBox = styled("div")({
  width: "100%",
  minHeight: "120px",
  borderRadius: "22px",
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
  border: "1px solid rgba(255,255,255,0.06)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",

  gap: "10px",
  padding: "18px",
  boxSizing: "border-box",
  textAlign: "center",
});

const EmptyIcon = styled("div")({
  width: "48px",
  height: "48px",
  borderRadius: "18px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  color: "#C4B5FD",
  background: "rgba(139,92,246,0.12)",
  border: "1px solid rgba(139,92,246,0.18)",
});

const PendingInvitationsList = () => {
  const dispatch = useDispatch();

  const pendingFriendsInvitations = useSelector(
    (state) => state.friends.pendingFriendsInvitations || []
  );

  const handleAccept = useCallback(
    (invitationId) => {
      dispatch(
        acceptFriendInvitation({
          id: invitationId,
        })
      );
    },
    [dispatch]
  );

  const handleReject = useCallback(
    (invitationId) => {
      dispatch(
        rejectFriendInvitation({
          id: invitationId,
        })
      );
    },
    [dispatch]
  );

  if (pendingFriendsInvitations.length === 0) {
    return (
      <EmptyBox>
        <EmptyIcon>
          <MarkEmailUnreadRoundedIcon sx={{ fontSize: 22 }} />
        </EmptyIcon>

        <Typography sx={{ color: "#fff", fontWeight: 800, fontSize: 15 }}>
          No pending requests
        </Typography>

        <Typography sx={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.6 }}>
          New participant invitations will appear here.
        </Typography>
      </EmptyBox>
    );
  }

  return (
    <MainContainer>
      {pendingFriendsInvitations.map((invitation) => {
        const sender = invitation?.senderId || {};

        return (
          <PendingInvitationsListItem
            key={invitation._id}
            id={invitation._id}
            username={sender.username || "Unknown"}
            mail={sender.email || ""}
            acceptFriendInvitation={handleAccept}
            rejectFriendInvitation={handleReject}
          />
        );
      })}
    </MainContainer>
  );
};

export default PendingInvitationsList;