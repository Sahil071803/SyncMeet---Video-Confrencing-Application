import React, { useMemo, useState, useRef, useEffect } from "react";

import {
  Avatar,
  Badge,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";

import { styled } from "@mui/system";

import {
  Bell,
  LogOut,
  Settings,
  Video,
} from "lucide-react";

import { useSelector } from "react-redux";

import useResponsive from "../../hooks/useResponsive";

import { disconnectSocket } from "../../realtimeCommunication/socketConnection";

import NotificationMenu from "./NotificationMenu";

const MainContainer = styled("div")(({ mobile, height }) => ({
  width: "100%",
  height: `${height}px`,
  minHeight: `${height}px`,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: mobile ? "0 14px" : "0 24px",
  position: "relative",
  zIndex: 1200,
  background: "rgba(2,6,23,0.78)",
  backdropFilter: "blur(18px)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  overflow: "visible",
}));

const LeftSection = styled("div")({
  display: "flex",
  alignItems: "center",
  gap: "14px",
  minWidth: 0,
});

const LogoWrapper = styled("div")(({ mobile }) => ({
  width: mobile ? "46px" : "52px",
  height: mobile ? "46px" : "52px",
  borderRadius: mobile ? "16px" : "18px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
  boxShadow: "0 10px 24px rgba(139,92,246,0.35)",
  color: "#fff",
  fontWeight: 800,
  fontSize: mobile ? "18px" : "20px",
  flexShrink: 0,
}));

const AppInfo = styled("div")({
  display: "flex",
  flexDirection: "column",
  minWidth: 0,
});

const RightSection = styled("div")(({ mobile }) => ({
  display: "flex",
  alignItems: "center",
  gap: mobile ? "4px" : "8px",
}));

const ActionButton = styled(IconButton)(({ mobile }) => ({
  width: mobile ? "42px" : "46px",
  height: mobile ? "42px" : "46px",
  borderRadius: mobile ? "14px" : "16px",
  color: "#fff",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  backdropFilter: "blur(12px)",
  transition: "all 0.25s ease",
  position: "relative",
  zIndex: 10,
  pointerEvents: "auto",
  "&:hover": {
    background: "rgba(255,255,255,0.08)",
    transform: "translateY(-2px)",
  },
}));

const ProfileWrapper = styled("div")(({ mobile }) => ({
  display: "flex",
  alignItems: "center",
  gap: mobile ? "8px" : "12px",
  marginLeft: mobile ? "4px" : "8px",
  paddingLeft: mobile ? "8px" : "12px",
  borderLeft: "1px solid rgba(255,255,255,0.06)",
}));

const NotifWrapper = styled("div")({
  position: "relative",
  display: "inline-flex",
});

const AppBar = ({ setActiveSection }) => {
  const { isMobile, appBarHeight } = useResponsive();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const unreadCount = useSelector((state) => state.notification?.unreadCount || 0);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const username = user?.username || user?.email?.split("@")[0] || "User";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    try {
      disconnectSocket();
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      sessionStorage.clear();
      window.location.replace("/login");
    } catch (err) {
      console.log("Logout Error:", err);
    }
  };

  return (
    <MainContainer mobile={isMobile ? 1 : 0} height={appBarHeight}>
      <LeftSection>
        <LogoWrapper mobile={isMobile ? 1 : 0}>S</LogoWrapper>

        {!isMobile && (
          <AppInfo>
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "18px",
                lineHeight: 1.1,
              }}
            >
              SyncMeet
            </Typography>

            <Typography
              sx={{
                color: "#94A3B8",
                fontSize: "12px",
                marginTop: "3px",
              }}
            >
              Realtime Collaboration Platform
            </Typography>
          </AppInfo>
        )}
      </LeftSection>

      <RightSection mobile={isMobile ? 1 : 0}>
        <Tooltip title="Meetings">
          <ActionButton
            mobile={isMobile ? 1 : 0}
            onClick={() => setActiveSection?.("meeting")}
          >
            <Video size={18} />
          </ActionButton>
        </Tooltip>

        <NotifWrapper ref={notifRef}>
          <Tooltip title="Notifications">
            <Badge
              overlap="circular"
              color="error"
              badgeContent={unreadCount}
              max={99}
              invisible={unreadCount === 0}
              sx={{
                "& .MuiBadge-badge": {
                  background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                  fontSize: "10px",
                  fontWeight: 700,
                  minWidth: "18px",
                  height: "18px",
                  borderRadius: "10px",
                },
              }}
            >
              <ActionButton
                mobile={isMobile ? 1 : 0}
                onClick={() => setNotifOpen((prev) => !prev)}
              >
                <Bell size={18} />
              </ActionButton>
            </Badge>
          </Tooltip>

          {notifOpen && <NotificationMenu onClose={() => setNotifOpen(false)} />}
        </NotifWrapper>

        {!isMobile && (
          <Tooltip title="Settings">
            <ActionButton
              mobile={isMobile ? 1 : 0}
              onClick={() => setActiveSection?.("settings")}
            >
              <Settings size={18} />
            </ActionButton>
          </Tooltip>
        )}

        <ProfileWrapper mobile={isMobile ? 1 : 0}>
          {!isMobile && (
            <div>
              <Typography
                sx={{
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 600,
                  lineHeight: 1.1,
                }}
              >
                {username}
              </Typography>

              <Typography
                sx={{
                  color: "#22C55E",
                  fontSize: "11px",
                  marginTop: "2px",
                }}
              >
                Online
              </Typography>
            </div>
          )}

          <Avatar
            sx={{
              width: isMobile ? 42 : 46,
              height: isMobile ? 42 : 46,
              background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
              fontWeight: 700,
              border: "2px solid rgba(255,255,255,0.08)",
            }}
          >
            {username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Tooltip title="Logout">
            <ActionButton mobile={isMobile ? 1 : 0} onClick={handleLogout}>
              <LogOut size={18} />
            </ActionButton>
          </Tooltip>
        </ProfileWrapper>
      </RightSection>
    </MainContainer>
  );
};

export default AppBar;
