import React, { useMemo } from "react";
import { styled } from "@mui/system";
import { Avatar, Typography } from "@mui/material";
import { useSelector } from "react-redux";

import Messages from "./Messages";
import MessageInput from "./MessageInput";

const MainContainer = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "linear-gradient(to bottom,#0F172A,#111827)",
});

const ChatHeader = styled("div")({
  height: "72px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "0 20px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(15,23,42,0.8)",
  backdropFilter: "blur(12px)",
});

const EmptyState = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94A3B8",
});

const Messenger = ({ selectedFriend }) => {
  const messages = useSelector(
    (state) => state.chat.messages || []
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const myId = user?._id || user?.userId;

  const filteredMessages = useMemo(() => {
    if (!selectedFriend?._id) return [];

    return messages.filter((msg) => {
      return (
        (msg.senderId === myId &&
          msg.receiverId === selectedFriend._id) ||
        (msg.senderId === selectedFriend._id &&
          msg.receiverId === myId)
      );
    });
  }, [messages, selectedFriend, myId]);

  if (!selectedFriend) {
    return <EmptyState>Select a friend 💬</EmptyState>;
  }

  return (
    <MainContainer>
      <ChatHeader>
        <Avatar sx={{ background: "#7B61FF" }}>
          {selectedFriend.username?.charAt(0)}
        </Avatar>

        <Typography sx={{ color: "#fff" }}>
          {selectedFriend.username}
        </Typography>
      </ChatHeader>

      <Messages messages={filteredMessages} />

      <MessageInput selectedFriend={selectedFriend} />
    </MainContainer>
  );
};

export default Messenger;