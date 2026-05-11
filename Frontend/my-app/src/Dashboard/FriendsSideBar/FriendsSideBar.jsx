import React from "react";
import { styled } from "@mui/system";

import AddFriendButton from "./AddFriendButton";
import FriendsTitle from "./FriendsTitle";
import FriendsList from "./FriendsList/FriendsList";
import PendingInvitationsList from "./PendingInvitationsList/PendingInvitationsList";

const Sidebar = styled("div")({
  height: "100%",

  background: "rgba(15,23,42,0.92)",

  borderRight: "1px solid rgba(255,255,255,0.05)",

  display: "flex",
  flexDirection: "column",

  padding: "18px 12px",

  backdropFilter: "blur(12px)",

  overflow: "hidden",
});

const Section = styled("div")({
  marginTop: "16px",
});

const FriendsSideBar = ({ setSelectedFriend }) => {
  return (
    <Sidebar>
      <AddFriendButton />

      <Section>
        <FriendsTitle title="PRIVATE MESSAGES" />

        <FriendsList
          setSelectedFriend={setSelectedFriend}
        />
      </Section>

      <Section>
        <FriendsTitle title="INVITATIONS" />

        <PendingInvitationsList />
      </Section>
    </Sidebar>
  );
};

export default FriendsSideBar;