import React from "react";
import { styled } from "@mui/system";
import { Tooltip } from "@mui/material";

import {
  MessageCircle,
  Users,
  Video,
  Settings,
  Bell,
} from "lucide-react";

import useResponsive from "../../hooks/useResponsive";
import MainPageButton from "./MainPageButton";

const MainContainer = styled("div")(({ mobile }) => ({
  width: "100%",
  height: "100%",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "space-between",

  padding: mobile ? "10px" : "18px 0",

  position: "relative",
  overflow: "hidden",

  background: "linear-gradient(180deg,#0F172A,#111827)",
}));

const TopSection = styled("div")({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: "16px",

  position: "relative",
  zIndex: 2,
});

const BottomSection = styled("div")({
  width: "100%",

  display: "flex",
  flexDirection: "column",
  alignItems: "center",

  gap: "12px",

  position: "relative",
  zIndex: 2,
});

const Glow = styled("div")({
  position: "absolute",

  top: "-60px",
  left: "-50px",

  width: "180px",
  height: "180px",

  borderRadius: "50%",

  background: "rgba(139,92,246,0.18)",
  filter: "blur(70px)",

  pointerEvents: "none",
  zIndex: 1,
});

const NavButton = styled("button")(({ active }) => ({
  width: "58px",
  height: "58px",

  borderRadius: "18px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  cursor: "pointer",
  outline: "none",

  color: "#fff",

  background: active
    ? "linear-gradient(135deg,#8B5CF6,#6D28D9)"
    : "rgba(255,255,255,0.04)",

  border: active
    ? "1px solid rgba(255,255,255,0.10)"
    : "1px solid rgba(255,255,255,0.05)",

  backdropFilter: "blur(12px)",

  boxShadow: active
    ? "0 10px 24px rgba(139,92,246,0.30)"
    : "none",

  transition: "all 0.25s ease",

  position: "relative",
  zIndex: 3,

  "&:hover": {
    transform: "translateY(-2px)",

    background: active
      ? "linear-gradient(135deg,#9D6CFF,#7C3AED)"
      : "rgba(255,255,255,0.08)",
  },

  "&:active": {
    transform: "scale(0.96)",
  },
}));

const SideBar = ({ activeSection = "meeting", setActiveSection }) => {
  const { isMobile } = useResponsive();

  const topItems = [
    {
      id: "messages",
      icon: MessageCircle,
      label: "Messages",
    },
    {
      id: "participants",
      icon: Users,
      label: "Participants",
    },
    {
      id: "meeting",
      icon: Video,
      label: "Video Meeting",
    },
    {
      id: "alerts",
      icon: Bell,
      label: "Alerts",
    },
  ];

  const handleClick = (section) => {
    if (setActiveSection) {
      setActiveSection(section);
    }
  };

  return (
    <MainContainer mobile={isMobile ? 1 : 0}>
      <Glow />

      <TopSection>
        <MainPageButton />

        {topItems.map((item) => {
          const Icon = item.icon;
          const active = activeSection === item.id;

          return (
            <Tooltip key={item.id} title={item.label} placement="right">
              <NavButton
                type="button"
                active={active ? 1 : 0}
                onClick={() => handleClick(item.id)}
              >
                <Icon size={22} strokeWidth={2.2} />
              </NavButton>
            </Tooltip>
          );
        })}
      </TopSection>

      <BottomSection>
        <Tooltip title="Settings" placement="right">
          <NavButton
            type="button"
            active={activeSection === "settings" ? 1 : 0}
            onClick={() => handleClick("settings")}
          >
            <Settings size={22} strokeWidth={2.2} />
          </NavButton>
        </Tooltip>
      </BottomSection>
    </MainContainer>
  );
};

export default SideBar;