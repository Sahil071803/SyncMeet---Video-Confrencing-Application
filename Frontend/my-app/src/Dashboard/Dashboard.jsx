import React, {
  useEffect,
  useState,
} from "react";

import { styled } from "@mui/system";

import { useSelector } from "react-redux";

import DashboardAppBar from "./AppBar/AppBar";

import SideBar from "./SideBar/SideBar";

import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";

import Messenger from "./Messenger/Messenger";

import MeetingPanel from "./MeetingPanel/MeetingPanel";

import {
  connectWithSocketServer,
  disconnectSocket,
} from "../realtimeCommunication/socketConnection";

import {
  registerSocketEvents,
} from "../realtimeCommunication/socketEvents";

// ======================================
// STYLES
// ======================================

const DashboardWrapper = styled("div")({
  width: "100%",

  height: "100%",

  display: "flex",

  flexDirection: "column",

  overflow: "hidden",
});

const ContentWrapper = styled("div")({
  flex: 1,

  display: "grid",

  gridTemplateColumns:
    "72px 320px 1fr 280px",

  overflow: "hidden",
});

// ======================================
// COMPONENT
// ======================================

const Dashboard = () => {
  const [
    selectedFriend,
    setSelectedFriend,
  ] = useState(null);

  const { friends } = useSelector(
    (state) => state.friends
  );

  // ======================================
  // DEFAULT SELECT FRIEND
  // ======================================

  useEffect(() => {
    if (
      friends?.length > 0 &&
      !selectedFriend
    ) {
      setSelectedFriend(friends[0]);
    }
  }, [friends, selectedFriend]);

  // ======================================
  // SOCKET INITIALIZATION
  // ======================================

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) return;

    const userDetails =
      JSON.parse(storedUser);

    if (!userDetails?.token) return;

    const socket =
      connectWithSocketServer(
        userDetails
      );

    if (socket) {
      // REGISTER SOCKET EVENTS

      registerSocketEvents(
        socket
      );

      // INITIAL DATA

      socket.emit(
        "get-friends"
      );

      socket.emit(
        "get-online-users"
      );

      socket.emit(
        "get-pending-invitations"
      );
    }

    return () => {
      disconnectSocket();

      console.log(
        "🔌 Socket disconnected"
      );
    };
  }, []);

  return (
    <DashboardWrapper>
      <DashboardAppBar />

      <ContentWrapper>
        {/* SIDEBAR */}

        <SideBar />

        {/* FRIENDS */}

        <FriendsSideBar
          setSelectedFriend={
            setSelectedFriend
          }
        />

        {/* MESSENGER */}

        <Messenger
          selectedFriend={
            selectedFriend
          }
        />

        {/* VIDEO PANEL */}

        <MeetingPanel
          selectedFriend={
            selectedFriend
          }
        />
      </ContentWrapper>
    </DashboardWrapper>
  );
};

export default Dashboard;