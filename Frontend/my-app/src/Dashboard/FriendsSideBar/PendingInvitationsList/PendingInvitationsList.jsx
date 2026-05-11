import React, { useCallback } from "react";

import { useSelector, useDispatch } from "react-redux";

import { styled } from "@mui/system";

import PendingInvitationsListItem from "./PendingInvitationsListItem";

import {
  acceptFriendInvitation,
  rejectFriendInvitation,
} from "../../../store/actions/friendsActions";

const MainContainer = styled("div")({
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

const PendingInvitationsList = () => {
  const dispatch = useDispatch();

  const pendingFriendsInvitations =
    useSelector(
      (state) =>
        state.friends
          .pendingFriendsInvitations || []
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

  if (
    pendingFriendsInvitations.length === 0
  ) {
    return (
      <div
        style={{
          padding: 10,
          color: "#94A3B8",
          textAlign: "center",
        }}
      >
        No pending invitations
      </div>
    );
  }

  return (
    <MainContainer>
      {pendingFriendsInvitations.map(
        (invitation) => {
          const sender =
            invitation?.senderId || {};

          return (
            <PendingInvitationsListItem
              key={invitation._id}
              id={invitation._id}
              username={
                sender.username || "Unknown"
              }
              mail={sender.email || ""}
              acceptFriendInvitation={
                handleAccept
              }
              rejectFriendInvitation={
                handleReject
              }
            />
          );
        }
      )}
    </MainContainer>
  );
};

export default PendingInvitationsList;