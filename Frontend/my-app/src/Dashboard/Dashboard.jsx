import React, { useEffect, useState, useRef, useCallback } from "react";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";

import DashboardAppBar from "./AppBar/AppBar";
import SideBar from "./SideBar/SideBar";
import FriendsSideBar from "./FriendsSideBar/FriendsSideBar";
import Messenger from "./Messenger/Messenger";
import MeetingPanel from "./MeetingPanel/MeetingPanel";
import MobileBottomNavigation from "./MobileBottomNavigation";
import IncomingCallDialog from "../shared/components/IncomingCallDialog";
import AlertsPage from "./AlertsPage";
import SettingsPage from "./SettingsPage";

import useResponsive from "../hooks/useResponsive";
import useNotificationSounds from "../hooks/useNotificationSounds";
import useBrowserNotifications from "../hooks/useBrowserNotifications";

import {
  DashboardWrapper,
  ContentWrapper,
  GlassContainer,
  FullScreenContent,
} from "./styles";

import {
  connectWithSocketServer,
  disconnectSocket,
  sendCallRejected,
} from "../realtimeCommunication/socketConnection";

import {
  registerSocketEvents,
  setIncomingCallCallback,
  setCallRejectedCallback,
  setCallEndedCallback,
  setOnMessageCallback,
  setOnFriendRequestCallback,
} from "../realtimeCommunication/socketEvents";

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  browserNotifEnabled: true,
  autoJoinAudio: true,
  autoEnableVideo: true,
};

const loadSettings = () => {
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem("syncmeet_prefs") || "{}") };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
};

const Dashboard = () => {
  const { isMobile } = useResponsive();
  const sounds = useNotificationSounds();
  const browserNotif = useBrowserNotifications();
  const friends = useSelector((state) => state.friends?.friends || []);
  const friendsRef = useRef(friends);
  const unreadCount = useSelector((state) => state.notification?.unreadCount || 0);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem("syncmeet_prefs", JSON.stringify(next));
      } catch {}
      return next;
    });
  }, []);

  // Sync settings to hooks
  useEffect(() => { sounds.setSoundEnabled(settings.soundEnabled); }, [settings.soundEnabled]);
  useEffect(() => { browserNotif.setBrowserNotifEnabled(settings.browserNotifEnabled); }, [settings.browserNotifEnabled]);

  // Update page title with unread count
  useEffect(() => {
    document.title = unreadCount > 0
      ? `(${unreadCount}) SyncMeet`
      : "SyncMeet • Video Conferencing";
  }, [unreadCount]);

  // Request browser notification permission on mount
  useEffect(() => {
    browserNotif.requestPermission();
  }, []);

  useEffect(() => {
    friendsRef.current = friends;
  }, [friends]);

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

      setIncomingCallCallback((data) => {
        console.log("📞 Incoming call received:", data);
        setIncomingCall(data);
        setCallRejected(false);
        setCallEnded(false);

        const cleanup = sounds.playCallSound();
        callSoundCleanupRef.current = cleanup;

        const f = friendsRef.current;
        const caller = f.find(
          (f) => f._id === data.from || f.id === data.from || f.userId === data.from
        );

        if (caller) {
          setSelectedFriend(caller);
          setActiveSection("meeting");
        }

        const callerName = caller?.username || "Someone";
        browserNotif.notifyCall(callerName, () => {
          setActiveSection("meeting");
        });
      });

      setCallRejectedCallback((data) => {
        console.log("❌ Call rejected:", data);
        setCallRejected(true);
        setIncomingCall(null);
        sounds.playCallEndedSound();
        if (callSoundCleanupRef.current) {
          callSoundCleanupRef.current();
          callSoundCleanupRef.current = null;
        }
      });

      setCallEndedCallback((data) => {
        console.log("📴 Call ended:", data);
        setCallEnded(true);
        setIncomingCall(null);
        sounds.playCallEndedSound();
        if (callSoundCleanupRef.current) {
          callSoundCleanupRef.current();
          callSoundCleanupRef.current = null;
        }
      });

      setOnMessageCallback(({ senderName, preview, senderId }) => {
        sounds.playMessageSound();
        const f = friendsRef.current;
        const caller = f.find(
          (f) => f._id === senderId || f.id === senderId || f.userId === senderId
        );
        browserNotif.notifyMessage(senderName, preview, () => {
          if (caller) {
            setSelectedFriend(caller);
            setActiveSection("messages");
          }
        });
      });

      setOnFriendRequestCallback(({ senderName }) => {
        sounds.playInviteSound();
        browserNotif.notifyFriendRequest(senderName);
      });
    }

    return () => {
      disconnectSocket();
    };
  }, []);

  const handleSelectFriend = (friend) => {
    setSelectedFriend(friend);
    setActiveSection("messages");
  };

  const handleAcceptCall = () => {
    console.log("✅ Call accepted");
    if (callSoundCleanupRef.current) {
      callSoundCleanupRef.current();
      callSoundCleanupRef.current = null;
    }
    setIncomingCall(null);
  };

  const handleRejectCall = () => {
    console.log("❌ Call rejected");
    if (callSoundCleanupRef.current) {
      callSoundCleanupRef.current();
      callSoundCleanupRef.current = null;
    }
    if (incomingCall?.from) {
      sendCallRejected({ targetUserId: incomingCall.from });
    }
    setIncomingCall(null);
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
      return <AlertsPage />;
    }

    if (activeSection === "settings") {
      return (
        <SettingsPage
          settings={settings}
          onUpdateSetting={updateSetting}
        />
      );
    }

    return <MeetingPanel selectedFriend={selectedFriend} />;
  };

  return (
    <DashboardWrapper mobile={isMobile ? 1 : 0}>
      <DashboardAppBar
        setActiveSection={setActiveSection}
      />

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

      <IncomingCallDialog
        open={!!incomingCall}
        callerId={incomingCall?.from}
        onAccept={handleAcceptCall}
        onReject={handleRejectCall}
      />
    </DashboardWrapper>
  );
};

export default Dashboard;
