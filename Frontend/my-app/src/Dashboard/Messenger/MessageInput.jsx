import React, {
  useState,
  useRef,
  memo,
} from "react";

import { styled } from "@mui/system";

import {
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  SendHorizonal,
  Smile,
} from "lucide-react";

import EmojiPicker from "emoji-picker-react";

import {
  useTheme,
  alpha,
} from "@mui/material/styles";

import useMediaQuery from "@mui/material/useMediaQuery";

import {
  sendDirectMessage,
} from "../../realtimeCommunication/socketConnection";

// ======================================================
// STYLES
// ======================================================

const Wrapper = styled(
  "div"
)(({ mobile }) => ({
  width: "100%",

  display: "flex",

  alignItems: "flex-end",

  gap: mobile ? "10px" : "14px",

  padding: mobile
    ? "12px"
    : "18px",

  borderTop: `1px solid ${alpha(
    "#ffffff",
    0.06
  )}`,

  background:
    "rgba(15,23,42,0.72)",

  backdropFilter:
    "blur(18px)",

  position: "relative",

  zIndex: 5,
}));

const InputContainer = styled(
  "div"
)(({ mobile, focused }) => ({
  flex: 1,

  display: "flex",

  alignItems: "flex-end",

  gap: "10px",

  minHeight: mobile
    ? "54px"
    : "60px",

  padding: mobile
    ? "10px 12px"
    : "12px 14px",

  borderRadius: mobile
    ? "18px"
    : "20px",

  background:
    "rgba(255,255,255,0.05)",

  border: focused
    ? `1px solid ${alpha(
        "#8B5CF6",
        0.45
      )}`
    : `1px solid ${alpha(
        "#ffffff",
        0.06
      )}`,

  backdropFilter:
    "blur(14px)",

  transition:
    "all 0.25s ease",
}));

const Input = styled(
  "textarea"
)(({ mobile }) => ({
  flex: 1,

  resize: "none",

  border: "none",

  outline: "none",

  background: "transparent",

  color: "#fff",

  fontSize: mobile
    ? "14px"
    : "15px",

  lineHeight: 1.5,

  maxHeight: "120px",

  overflowY: "auto",

  fontFamily: "inherit",

  "&::-webkit-scrollbar": {
    width: "4px",
  },

  "&::-webkit-scrollbar-thumb":
    {
      background:
        "rgba(255,255,255,0.12)",

      borderRadius: "20px",
    },

  "&::placeholder": {
    color: "#94A3B8",
  },
}));

const SendButton = styled(
  "button"
)(({ mobile, disabled }) => ({
  width: mobile
    ? "50px"
    : "56px",

  height: mobile
    ? "50px"
    : "56px",

  borderRadius: "18px",

  border: "none",

  cursor: disabled
    ? "not-allowed"
    : "pointer",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  color: "#fff",

  background: disabled
    ? "rgba(255,255,255,0.10)"
    : "linear-gradient(135deg,#8B5CF6,#6D28D9)",

  boxShadow: disabled
    ? "none"
    : "0 10px 28px rgba(139,92,246,0.35)",

  transition:
    "all 0.25s ease",

  opacity: disabled ? 0.7 : 1,

  "&:hover": disabled
    ? {}
    : {
        transform:
          "translateY(-2px)",
      },
}));

const EmojiWrapper = styled(
  "div"
)(({ mobile }) => ({
  position: "absolute",

  bottom: mobile
    ? "82px"
    : "95px",

  left: mobile
    ? "12px"
    : "18px",

  zIndex: 999,
}));

// ======================================================
// COMPONENT
// ======================================================

const MessageInput = ({
  selectedFriend,
}) => {
  const theme = useTheme();

  const isMobile =
    useMediaQuery(
      theme.breakpoints.down("sm")
    );

  const inputRef = useRef(null);

  const [message, setMessage] =
    useState("");

  const [focused, setFocused] =
    useState(false);

  const [
    showEmojiPicker,
    setShowEmojiPicker,
  ] = useState(false);

  const [sending, setSending] =
    useState(false);

  // ======================================================
  // AUTO RESIZE
  // ======================================================

  const autoResizeTextarea = (
    element
  ) => {
    if (!element) return;

    element.style.height =
      "auto";

    element.style.height = `${Math.min(
      element.scrollHeight,
      120
    )}px`;
  };

  // ======================================================
  // SEND MESSAGE
  // ======================================================

  const handleSendMessage =
    async () => {
      if (
        !message.trim() ||
        !selectedFriend?._id ||
        sending
      ) {
        return;
      }

      try {
        setSending(true);

        sendDirectMessage({
          receiverId:
            selectedFriend._id,

          content:
            message.trim(),
        });

        setMessage("");

        setShowEmojiPicker(
          false
        );

        if (inputRef.current) {
          inputRef.current.style.height =
            "auto";
        }
      } finally {
        setSending(false);
      }
    };

  // ======================================================
  // ENTER KEY
  // ======================================================

  const handleKeyDown = (
    e
  ) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      handleSendMessage();
    }
  };

  // ======================================================
  // EMOJI
  // ======================================================

  const handleEmojiClick = (
    emojiData
  ) => {
    setMessage((prev) => {
      const updated =
        prev + emojiData.emoji;

      setTimeout(() => {
        autoResizeTextarea(
          inputRef.current
        );
      }, 0);

      return updated;
    });
  };

  // ======================================================
  // CHANGE
  // ======================================================

  const handleChange = (e) => {
    setMessage(e.target.value);

    autoResizeTextarea(
      e.target
    );
  };

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <Wrapper
      mobile={isMobile ? 1 : 0}
    >
      {showEmojiPicker && (
        <EmojiWrapper
          mobile={
            isMobile ? 1 : 0
          }
        >
          <EmojiPicker
            onEmojiClick={
              handleEmojiClick
            }
            theme="dark"
            width={
              isMobile
                ? 300
                : 350
            }
          />
        </EmojiWrapper>
      )}

      <InputContainer
        mobile={isMobile ? 1 : 0}
        focused={
          focused ? 1 : 0
        }
      >
        <IconButton
          onClick={() =>
            setShowEmojiPicker(
              (prev) => !prev
            )
          }
        >
          <Smile
            size={20}
            color="#94A3B8"
          />
        </IconButton>

        <Input
          ref={inputRef}
          rows={1}
          mobile={
            isMobile ? 1 : 0
          }
          placeholder="Write a message..."
          value={message}
          onChange={
            handleChange
          }
          onKeyDown={
            handleKeyDown
          }
          onFocus={() =>
            setFocused(true)
          }
          onBlur={() =>
            setFocused(false)
          }
        />
      </InputContainer>

      <SendButton
        mobile={isMobile ? 1 : 0}
        disabled={
          !message.trim() ||
          sending
        }
        onClick={
          handleSendMessage
        }
      >
        {sending ? (
          <CircularProgress
            size={20}
            color="inherit"
          />
        ) : (
          <SendHorizonal
            size={18}
          />
        )}
      </SendButton>
    </Wrapper>
  );
};

export default memo(
  MessageInput
);