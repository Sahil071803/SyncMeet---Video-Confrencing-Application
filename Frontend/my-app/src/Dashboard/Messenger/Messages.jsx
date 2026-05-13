import React, { useEffect, useRef, useMemo, memo } from "react";

import { styled } from "@mui/system";

import { Typography } from "@mui/material";

import { useTheme, alpha } from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

const MessagesContainer = styled("div", {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  flex: 1,
  minHeight: 0,
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: mobile ? "12px" : "16px",
  padding: mobile ? "14px" : "22px",
  scrollBehavior: "smooth",
  position: "relative",

  "&::-webkit-scrollbar": {
    width: "6px",
  },

  "&::-webkit-scrollbar-thumb": {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "20px",
  },
}));

const MessageRow = styled("div", {
  shouldForwardProp: (prop) => prop !== "ownmessage",
})(({ ownmessage }) => ({
  width: "100%",
  display: "flex",
  justifyContent: ownmessage ? "flex-end" : "flex-start",
  animation: "fadeIn 0.25s ease",

  "@keyframes fadeIn": {
    from: {
      opacity: 0,
      transform: "translateY(6px)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0px)",
    },
  },
}));

const MessageBubble = styled("div", {
  shouldForwardProp: (prop) => prop !== "ownmessage" && prop !== "mobile",
})(({ ownmessage, mobile }) => ({
  maxWidth: mobile ? "88%" : "72%",
  minWidth: "90px",
  padding: mobile ? "12px 14px" : "14px 18px",
  borderRadius: ownmessage
    ? "22px 22px 6px 22px"
    : "22px 22px 22px 6px",
  background: ownmessage
    ? "linear-gradient(135deg,#8B5CF6,#6D28D9)"
    : "rgba(255,255,255,0.05)",
  border: ownmessage ? "none" : `1px solid ${alpha("#ffffff", 0.06)}`,
  backdropFilter: "blur(16px)",
  color: "#fff",
  wordBreak: "break-word",
  boxShadow: "0 10px 28px rgba(0,0,0,0.20)",
  transition: "all 0.22s ease",

  "&:hover": {
    transform: "translateY(-1px)",
  },
}));

const MessageText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "mobile",
})(({ mobile }) => ({
  fontSize: mobile ? "13px" : "14px",
  lineHeight: 1.7,
  color: "#fff",
  whiteSpace: "pre-wrap",
}));

const MessageTime = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "ownmessage",
})(({ ownmessage }) => ({
  marginTop: "8px",
  fontSize: "10px",
  opacity: 0.72,
  textAlign: ownmessage ? "right" : "left",
  color: "#E2E8F0",
}));

const EmptyState = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: "14px",
  color: "#94A3B8",
  textAlign: "center",
  padding: "24px",
});

const Messages = ({ messages = [] }) => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const bottomRef = useRef(null);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const myId = user?._id || user?.userId;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  if (!messages.length) {
    return (
      <EmptyState>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "22px" }}>
          No Messages Yet
        </Typography>

        <Typography
          sx={{
            color: "#94A3B8",
            maxWidth: "280px",
            lineHeight: 1.7,
          }}
        >
          Start your realtime conversation now 💬
        </Typography>
      </EmptyState>
    );
  }

  return (
    <MessagesContainer mobile={isMobile ? 1 : 0}>
      {messages.map((msg, index) => {
        const senderId = msg.senderId || msg.sender?._id || msg.sender;

        const ownmessage = senderId?.toString() === myId?.toString();

        const key = msg._id || msg.id || `${senderId}-${index}`;

        const messageTime = msg.createdAt
          ? new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "";

        return (
          <MessageRow key={key} ownmessage={ownmessage}>
            <MessageBubble ownmessage={ownmessage} mobile={isMobile ? 1 : 0}>
              <MessageText mobile={isMobile ? 1 : 0}>
                {msg.content || ""}
              </MessageText>

              <MessageTime ownmessage={ownmessage}>{messageTime}</MessageTime>
            </MessageBubble>
          </MessageRow>
        );
      })}

      <div ref={bottomRef} />
    </MessagesContainer>
  );
};

export default memo(Messages);