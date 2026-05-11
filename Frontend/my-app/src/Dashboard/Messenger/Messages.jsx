import React, { useEffect, useRef, useMemo } from "react";
import { styled } from "@mui/system";

// =============================
// STYLES
// =============================
const MessagesContainer = styled("div")({
  flex: 1,
  minHeight: 0,
  padding: "24px",
  overflowY: "auto",
  display: "flex",
  flexDirection: "column",
  gap: "14px",
  scrollBehavior: "smooth",
});

const MessageWrapper = styled("div")(({ ownmessage }) => ({
  display: "flex",
  justifyContent: ownmessage ? "flex-end" : "flex-start",
}));

const MessageBubble = styled("div")(({ ownmessage }) => ({
  maxWidth: "340px",
  padding: "12px 16px",
  borderRadius: ownmessage
    ? "18px 18px 4px 18px"
    : "18px 18px 18px 4px",
  background: ownmessage
    ? "linear-gradient(135deg,#7B61FF,#5B42F3)"
    : "#1E293B",
  color: "#fff",
  fontSize: "14px",
  lineHeight: 1.5,
  wordBreak: "break-word",
}));

const EmptyState = styled("div")({
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#94A3B8",
});

// =============================
// COMPONENT
// =============================
const Messages = ({ messages = [] }) => {
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
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (!messages.length) {
    return <EmptyState>No messages yet 💬</EmptyState>;
  }

  return (
    <MessagesContainer>
      {messages.map((msg, index) => {
        const senderId = msg.senderId || msg.sender;

        const ownmessage = senderId === myId;

        const key =
          msg.id || msg._id || `${senderId}-${index}`;

        return (
          <MessageWrapper key={key} ownmessage={ownmessage}>
            <MessageBubble ownmessage={ownmessage}>
              {msg.content}
            </MessageBubble>
          </MessageWrapper>
        );
      })}

      <div ref={bottomRef} />
    </MessagesContainer>
  );
};

export default Messages;