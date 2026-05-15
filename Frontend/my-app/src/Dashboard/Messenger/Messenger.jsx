import React, { useMemo } from "react";

import { styled } from "@mui/system";

import {
  Avatar,
  Typography,
  Badge,
  IconButton,
} from "@mui/material";

import {
  MoreVertical,
  Phone,
  Search,
  Video,
} from "lucide-react";

import { useSelector } from "react-redux";

import useResponsive from "../../hooks/useResponsive";

import Messages from "./Messages";

import MessageInput from "./MessageInput";

const MainContainer = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  position: "relative",
  background: "linear-gradient(180deg,#071028 0%,#0B1120 100%)",
});

const Header = styled("div")(({ mobile }) => ({
  width: "100%",
  minHeight: mobile ? "72px" : "84px",
  padding: mobile ? "0 14px" : "0 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(15,23,42,0.72)",
  backdropFilter: "blur(18px)",
  flexShrink: 0,
}));

const LeftSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  minWidth: 0,
});

const UserInfo = styled("div")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

const Actions = styled("div")(({ mobile }) => ({
  display: "flex",
  alignItems: "center",
  gap: mobile ? "2px" : "6px",
}));

const ActionButton = styled(IconButton)(({ mobile }) => ({
  width: "44px",
  height: "44px",
  borderRadius: mobile ? "12px" : "14px",
  color: "#fff",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  transition: "all 0.25s ease",

  "&:hover": {
    background: "rgba(255,255,255,0.08)",
    transform: "translateY(-2px)",
  },
}));

const ChatBody = styled("div")({
  flex: 1,
  minHeight: 0,
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
});

const EmptyState = styled("div")({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "30px",
  gap: "18px",
});

const EmptyIcon = styled("div")({
  width: "90px",
  height: "90px",
  borderRadius: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  boxShadow: "0 16px 40px rgba(139,92,246,0.30)",
  fontSize: "36px",
  color: "#fff",
});

const Messenger = ({ selectedFriend }) => {
  const { isMobile } = useResponsive();

  const messages = useSelector((state) => state.chat.messages || []);

  const onlineUsers = useSelector(
    (state) => state.friends?.onlineUsers || []
  );

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const myId = user?._id || user?.userId;

  const selectedFriendId =
    selectedFriend?._id || selectedFriend?.id || selectedFriend?.userId;

  const isFriendOnline = useMemo(() => {
    if (!selectedFriendId) return false;

    return onlineUsers.some((u) => {
      const id =
        typeof u === "string"
          ? u
          : u?.userId || u?._id || u?.id;

      return id?.toString() === selectedFriendId?.toString();
    });
  }, [onlineUsers, selectedFriendId]);

  const filteredMessages = useMemo(() => {
    if (!selectedFriendId || !myId) return [];

    return messages.filter((msg) => {
      const senderId = msg.senderId || msg.sender;
      const receiverId = msg.receiverId || msg.receiver;

      return (
        (senderId?.toString() === myId?.toString() &&
          receiverId?.toString() === selectedFriendId?.toString()) ||
        (senderId?.toString() === selectedFriendId?.toString() &&
          receiverId?.toString() === myId?.toString())
      );
    });
  }, [messages, selectedFriendId, myId]);

  if (!selectedFriend) {
    return (
      <MainContainer>
        <EmptyState>
          <EmptyIcon>💬</EmptyIcon>

          <Typography
            sx={{
              color: "#fff",
              fontWeight: 700,
              fontSize: "24px",
            }}
          >
            No Conversation Selected
          </Typography>

          <Typography
            sx={{
              color: "#94A3B8",
              maxWidth: "320px",
              lineHeight: 1.7,
            }}
          >
            Select a friend from the sidebar and start realtime messaging.
          </Typography>
        </EmptyState>
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header mobile={isMobile ? 1 : 0}>
        <LeftSection>
          <Badge
            overlap="circular"
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            variant="dot"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: isFriendOnline ? "#22C55E" : "#64748B",
                border: "2px solid #0F172A",
              },
            }}
          >
            <Avatar
              sx={{
                width: isMobile ? 46 : 54,
                height: isMobile ? 46 : 54,
                fontWeight: 700,
                background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
              }}
            >
              {selectedFriend?.username?.charAt(0)?.toUpperCase()}
            </Avatar>
          </Badge>

          <UserInfo>
            <Typography
              noWrap
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: isMobile ? "15px" : "17px",
                maxWidth: "180px",
              }}
            >
              {selectedFriend.username}
            </Typography>

            <Typography
              sx={{
                color: isFriendOnline ? "#4ADE80" : "#94A3B8",
                fontSize: "12px",
                marginTop: "2px",
              }}
            >
              {isFriendOnline ? "Online" : "Offline"}
            </Typography>
          </UserInfo>
        </LeftSection>

        <Actions mobile={isMobile ? 1 : 0}>
          {!isMobile && (
            <ActionButton mobile={isMobile ? 1 : 0}>
              <Search size={18} />
            </ActionButton>
          )}

          <ActionButton mobile={isMobile ? 1 : 0}>
            <Phone size={18} />
          </ActionButton>

          <ActionButton mobile={isMobile ? 1 : 0}>
            <Video size={18} />
          </ActionButton>

          <ActionButton mobile={isMobile ? 1 : 0}>
            <MoreVertical size={18} />
          </ActionButton>
        </Actions>
      </Header>

      <ChatBody>
        <Messages messages={filteredMessages} />

        <MessageInput selectedFriend={selectedFriend} />
      </ChatBody>
    </MainContainer>
  );
};

export default Messenger;