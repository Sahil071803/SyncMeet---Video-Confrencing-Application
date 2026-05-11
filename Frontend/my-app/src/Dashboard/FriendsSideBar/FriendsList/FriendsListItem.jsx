import React from "react";

import {
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";

import { styled } from "@mui/system";

import OnlineIndicator from "./OnlineIndicator";

const Container = styled("div")(
  ({ active }) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    padding: "12px 14px",
    borderRadius: "18px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    position: "relative",

    backdropFilter: "blur(14px)",

    background: active
      ? "rgba(123,97,255,0.18)"
      : "rgba(255,255,255,0.03)",

    border:
      "1px solid rgba(255,255,255,0.05)",

    "&:hover": {
      transform: "translateY(-2px)",

      background:
        "rgba(255,255,255,0.06)",
    },
  })
);

const StyledAvatar = styled(Avatar)({
  width: "48px",
  height: "48px",

  fontWeight: 700,

  background:
    "linear-gradient(135deg,#7B61FF,#5B42F3)",

  boxShadow:
    "0 8px 22px rgba(91,66,243,0.4)",
});

const RemoveButton = styled(
  IconButton
)({
  color: "#EF4444",

  transition: "0.2s",

  "&:hover": {
    background:
      "rgba(239,68,68,0.12)",

    transform: "scale(1.08)",
  },
});

const FriendsListItem = ({
  username,
  isOnline,
  onClick,
  active,
  onRemoveFriend,
}) => {

  const handleRemove = (e) => {
    e.stopPropagation();

    const confirmDelete =
      window.confirm(
        `Remove ${username} from friends?`
      );

    if (!confirmDelete) {
      return;
    }

    onRemoveFriend?.();
  };

  return (
    <Container
      onClick={onClick}
      active={active}
    >
      <StyledAvatar>
        {username?.charAt(0)?.toUpperCase()}
      </StyledAvatar>

      <div
        style={{
          flex: 1,
          overflow: "hidden",
        }}
      >
        <Typography
          noWrap
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "15px",
          }}
        >
          {username}
        </Typography>

        <Typography
          sx={{
            color: isOnline
              ? "#4ADE80"
              : "#94A3B8",

            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {isOnline
            ? "Online"
            : "Offline"}
        </Typography>
      </div>

      {isOnline && <OnlineIndicator />}

      <Tooltip title="Remove friend">
        <RemoveButton
          onClick={handleRemove}
        >
          <DeleteIcon fontSize="small" />
        </RemoveButton>
      </Tooltip>
    </Container>
  );
};

export default FriendsListItem;