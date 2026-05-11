import React, { useState } from "react";

import { styled } from "@mui/system";

import {
  IconButton,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

import EmojiPicker from "emoji-picker-react";

import {
  sendDirectMessage,
} from "../../realtimeCommunication/socketConnection";

// ======================================
// STYLES
// ======================================

const InputWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "14px",
  background: "#111827",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  position: "relative",
});

const Input = styled("input")({
  flex: 1,
  background: "#1F2937",
  border: "none",
  outline: "none",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
  fontSize: "15px",
});

const EmojiWrapper = styled("div")({
  position: "absolute",
  bottom: "70px",
  left: "10px",
  zIndex: 999,
});

// ======================================
// COMPONENT
// ======================================

const MessageInput = ({ selectedFriend }) => {
  const [message, setMessage] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] =
    useState(false);

  // ======================================
  // SEND MESSAGE
  // ======================================

  const handleSendMessage = () => {
    if (!message.trim()) return;

    if (!selectedFriend?._id) return;

    sendDirectMessage({
      receiverId: selectedFriend._id,
      content: message,
    });

    setMessage("");
    setShowEmojiPicker(false);
  };

  // ======================================
  // ENTER KEY
  // ======================================

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // ======================================
  // EMOJI SELECT
  // ======================================

  const handleEmojiClick = (emojiData) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  return (
    <InputWrapper>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <EmojiWrapper>
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            theme="dark"
          />
        </EmojiWrapper>
      )}

      {/* Emoji Button */}
      <IconButton
        onClick={() =>
          setShowEmojiPicker((prev) => !prev)
        }
      >
        <EmojiEmotionsIcon
          sx={{ color: "#9CA3AF" }}
        />
      </IconButton>

      {/* Input */}
      <Input
        placeholder="Type your message..."
        value={message}
        onChange={(e) =>
          setMessage(e.target.value)
        }
        onKeyDown={handleKeyDown}
      />

      {/* Send Button */}
      <IconButton onClick={handleSendMessage}>
        <SendIcon sx={{ color: "#7B61FF" }} />
      </IconButton>

    </InputWrapper>
  );
};

export default MessageInput;