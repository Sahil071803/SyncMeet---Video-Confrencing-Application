
import React, { useMemo } from "react";

import { styled } from "@mui/system";

import {
  Typography,
  IconButton,
  Avatar,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import VideocamIcon from "@mui/icons-material/Videocam";
import LogoutIcon from "@mui/icons-material/Logout";

import { useNavigate } from "react-router-dom";

const MainContainer = styled("div")({
  height: "72px",
  minHeight: "72px",
  width: "100%",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 20px",
  background: "rgba(15,23,42,0.72)",
  borderBottom:
    "1px solid rgba(255,255,255,0.05)",
  backdropFilter: "blur(14px)",
});

const LeftSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "18px",
});

const Logo = styled("div")({
  width: "42px",
  height: "42px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background:
    "linear-gradient(135deg,#7B61FF,#5B42F3)",
  color: "#fff",
  fontWeight: 700,
  fontSize: "18px",
});

const SearchBar = styled("div")({
  width: "280px",
  height: "42px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "0 14px",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.04)",
  border:
    "1px solid rgba(255,255,255,0.05)",
  color: "#94A3B8",
});

const RightSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "10px",
});

const ActionButton = styled(IconButton)({
  width: "42px",
  height: "42px",
  background: "rgba(255,255,255,0.04)",
  color: "#CBD5E1",

  "&:hover": {
    background:
      "rgba(255,255,255,0.08)",
  },
});

const Profile = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  marginLeft: "10px",
});

const AppBar = () => {
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      );
    } catch {
      return null;
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();

    window.location.href = "/";
  };

  return (
    <MainContainer>
      <LeftSection>
        <Logo>
          {user?.username
            ?.charAt(0)
            ?.toUpperCase() || "S"}
        </Logo>

        <Typography
          sx={{
            color: "#fff",
            fontWeight: 700,
            fontSize: "20px",
          }}
        >
          SyncMeet
        </Typography>

        <SearchBar>
          <SearchIcon />

          <Typography fontSize={14}>
            Search friends...
          </Typography>
        </SearchBar>
      </LeftSection>

      <RightSection>
        <ActionButton>
          <VideocamIcon />
        </ActionButton>

        <ActionButton>
          <NotificationsIcon />
        </ActionButton>

        <Tooltip title="Logout">
          <ActionButton
            onClick={handleLogout}
          >
            <LogoutIcon />
          </ActionButton>
        </Tooltip>

        <Profile>
          <Avatar
            sx={{
              width: 42,
              height: 42,
              background:
                "linear-gradient(135deg,#7B61FF,#5B42F3)",
            }}
          >
            {user?.username
              ?.charAt(0)
              ?.toUpperCase()}
          </Avatar>

          <div>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 600,
                fontSize: "14px",
              }}
            >
              {user?.username || "User"}
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: "12px",
              }}
            >
              Online
            </Typography>
          </div>
        </Profile>
      </RightSection>
    </MainContainer>
  );
};

export default AppBar;

