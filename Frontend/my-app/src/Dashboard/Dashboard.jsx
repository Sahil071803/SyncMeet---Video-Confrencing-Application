import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";

import DashboardAppBar from "./AppBar/AppBar";
import SideBar from "./SideBar/SideBar";
import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";
import Messenger from "./Messenger/Messenger";
import MeetingPanel from "./MeetingPanel/MeetingPanel";
import MobileBottomNavigation from "./MobileBottomNavigation";

import useResponsive from "../hooks/useResponsive";

import {
  DashboardWrapper,
  ContentWrapper,
  GlassContainer,
  FullScreenContent,
} from "./styles";

import {
  connectWithSocketServer,
  disconnectSocket,
} from "../realtimeCommunication/socketConnection";

import { registerSocketEvents } from "../realtimeCommunication/socketEvents";

const PlaceholderPanel = ({ title, subtitle }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        minHeight: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        textAlign: "center",
        p: 3,
        background: "linear-gradient(180deg,#071028 0%,#0B1120 100%)",
      }}
    >
      <Typography sx={{ color: "#fff", fontSize: 26, fontWeight: 800 }}>
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#94A3B8",
          fontSize: 14,
          mt: 1,
          maxWidth: 340,
          lineHeight: 1.7,
        }}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

const Dashboard = () => {
  const { isMobile } = useResponsive();

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [activeSection, setActiveSection] = useState("meeting");

  const friends = useSelector((state) => state.friends?.friends || []);

  useEffect(() => {
    if (friends?.length > 0 && !selectedFriend) {
      setSelectedFriend(friends[0]);
    }
  }, [friends, selectedFriend]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) return;

    let userDetails = null;

    try {
      userDetails = JSON.parse(storedUser);
    } catch {
      userDetails = null;
    }

    if (!userDetails?.token) return;

    const socket = connectWithSocketServer(userDetails);

    if (socket) {
      registerSocketEvents(socket);
    }

    return () => {
      if (!import.meta.env.DEV) {
        disconnectSocket();
      }
    };
  }, []);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setActiveSection("messages");
  };

  const renderActiveScreen = () => {
    if (activeSection === "participants") {
      return <FriendsSideBar setSelectedFriend={handleSelectFriend} />;
    }

    if (activeSection === "messages") {
      return <Messenger selectedFriend={selectedFriend} />;
    }

    if (activeSection === "meeting") {
      return <MeetingPanel selectedFriend={selectedFriend} />;
    }

    if (activeSection === "alerts") {
      return (
        <PlaceholderPanel
          title="Alerts"
          subtitle="Notifications and recent activity will appear here."
        />
      );
    }

    if (activeSection === "settings") {
      return (
        <PlaceholderPanel
          title="Settings"
          subtitle="Profile, notifications and app preferences will appear here."
        />
      );
    }

    return <MeetingPanel selectedFriend={selectedFriend} />;
  };

  return (
    <DashboardWrapper mobile={isMobile ? 1 : 0}>
      <DashboardAppBar />

      <ContentWrapper mobile={isMobile ? 1 : 0}>
        {!isMobile && (
          <GlassContainer>
            <SideBar
              activeSection={activeSection}
              setActiveSection={setActiveSection}
            />
          </GlassContainer>
        )}

        <GlassContainer mobile={isMobile ? 1 : 0} center full>
          <FullScreenContent>{renderActiveScreen()}</FullScreenContent>
        </GlassContainer>
      </ContentWrapper>

      {isMobile && (
        <MobileBottomNavigation
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}
    </DashboardWrapper>
  );
};

export default Dashboard;