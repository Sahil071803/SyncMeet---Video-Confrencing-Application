import React from "react";
import { styled } from "@mui/system";
import { IconButton, Typography } from "@mui/material";

import ChatRoundedIcon from "@mui/icons-material/ChatRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import VideocamRoundedIcon from "@mui/icons-material/VideocamRounded";
import NotificationsRoundedIcon from "@mui/icons-material/NotificationsRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

const Container = styled("div")({
  position: "fixed",
  left: "50%",
  bottom: 0,
  transform: "translateX(-50%)",
  width: "calc(100% - 20px)",
  maxWidth: "460px",
  minHeight: "72px",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-around",
  padding: "8px 10px calc(10px + env(safe-area-inset-bottom))",
  borderRadius: "24px 24px 0 0",
  background: "rgba(15,23,42,0.9)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderBottom: "none",
  boxShadow: "0 -12px 40px rgba(0,0,0,0.35)",
  zIndex: 9999,
  boxSizing: "border-box",
});

const NavItem = styled("div")(({ active }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "3px",
  minWidth: "52px",
  transition: "all 0.25s ease",
  transform: active ? "translateY(-2px)" : "translateY(0)",
}));

const IconWrapper = styled("div")(({ active }) => ({
  width: active ? "42px" : "38px",
  height: active ? "42px" : "38px",
  borderRadius: "15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.25s ease",
  background: active
    ? "linear-gradient(135deg,#8B5CF6,#6D28D9)"
    : "transparent",
  boxShadow: active ? "0 10px 24px rgba(139,92,246,0.28)" : "none",
}));

const Label = styled(Typography)(({ active }) => ({
  color: active ? "#fff" : "#94A3B8",
  fontSize: "10px",
  fontWeight: active ? 700 : 500,
  lineHeight: 1,
  transition: "all 0.25s ease",
}));

const navItems = [
  {
    key: "messages",
    label: "Chats",
    icon: ChatRoundedIcon,
  },
  {
    key: "participants",
    label: "Friends",
    icon: GroupsRoundedIcon,
  },
  {
    key: "meeting",
    label: "Meeting",
    icon: VideocamRoundedIcon,
  },
  {
    key: "alerts",
    label: "Alerts",
    icon: NotificationsRoundedIcon,
  },
  {
    key: "settings",
    label: "Settings",
    icon: SettingsRoundedIcon,
  },
];

const MobileBottomNavigation = ({
  activeSection = "meeting",
  setActiveSection,
}) => {
  const handleChange = (key) => {
    setActiveSection?.(key);
  };

  return (
    <Container>
      {navItems.map(({ key, label, icon: Icon }) => {
        const active = activeSection === key;

        return (
          <NavItem key={key} active={active ? 1 : 0}>
            <IconButton
              disableRipple
              onClick={() => handleChange(key)}
              sx={{
                padding: 0,
                position: "relative",
                zIndex: 2,
                "&:hover": {
                  background: "transparent",
                },
              }}
            >
              <IconWrapper active={active ? 1 : 0}>
                <Icon
                  sx={{
                    color: active ? "#fff" : "#94A3B8",
                    fontSize: active ? 23 : 21,
                    transition: "all 0.25s ease",
                  }}
                />
              </IconWrapper>
            </IconButton>

            <Label active={active ? 1 : 0}>{label}</Label>
          </NavItem>
        );
      })}
    </Container>
  );
};

export default MobileBottomNavigation;