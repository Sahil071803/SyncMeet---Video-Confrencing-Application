import React, { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Typography, Switch, Divider, Button } from "@mui/material";
import { Bell, BellOff, Volume2, VolumeX, User, Info, Trash2, Video, Mic } from "lucide-react";
import { clearNotifications } from "../store/notificationSlice";
import useResponsive from "../hooks/useResponsive";

const SectionTitle = ({ icon: Icon, title }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2.5 }}>
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
        color: "#fff",
      }}
    >
      <Icon size={18} strokeWidth={2.2} />
    </Box>
    <Typography sx={{ color: "#fff", fontSize: 18, fontWeight: 700 }}>
      {title}
    </Typography>
  </Box>
);

const SettingRow = ({ icon: Icon, label, description, checked, onChange, disabled }) => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      p: 2,
      borderRadius: "14px",
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.05)",
      transition: "all 0.2s ease",
      opacity: disabled ? 0.4 : 1,
      "&:hover": { background: "rgba(255,255,255,0.05)" },
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 0 }}>
      {Icon && (
        <Box sx={{ color: "#94A3B8", flexShrink: 0, display: "flex" }}>
          <Icon size={20} strokeWidth={1.8} />
        </Box>
      )}
      <Box sx={{ minWidth: 0 }}>
        <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
          {label}
        </Typography>
        {description && (
          <Typography
            sx={{ color: "#64748B", fontSize: 12.5, mt: 0.3, lineHeight: 1.4 }}
          >
            {description}
          </Typography>
        )}
      </Box>
    </Box>
    <Switch
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
      sx={{
        "& .MuiSwitch-track": {
          background: "rgba(255,255,255,0.1)",
          borderRadius: "12px",
        },
        "& .MuiSwitch-thumb": { background: "#fff" },
        "& .Mui-checked + .MuiSwitch-track": {
          background: "linear-gradient(135deg,#8B5CF6,#6D28D9) !important",
        },
      }}
    />
  </Box>
);

const InfoCard = ({ label, value }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      py: 1.5,
      px: 2,
      borderRadius: "12px",
      background: "rgba(255,255,255,0.02)",
      "& + &": { mt: 0.5 },
    }}
  >
    <Typography sx={{ color: "#94A3B8", fontSize: 13.5 }}>{label}</Typography>
    <Typography sx={{ color: "#fff", fontSize: 13.5, fontWeight: 600, textAlign: "right" }}>
      {value}
    </Typography>
  </Box>
);

const SettingsPage = ({ settings = {}, onUpdateSetting }) => {
  const dispatch = useDispatch();
  const notificationCount = useSelector((state) => state.notification?.notifications?.length || 0);
  const { isMobile } = useResponsive();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const username = user?.username || user?.name || user?.email?.split("@")[0] || "User";
  const email = user?.email || "";
  const initial = username?.charAt(0)?.toUpperCase() || "U";

  const handleClearNotifications = () => {
    dispatch(clearNotifications());
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg,#071028 0%,#0B1120 100%)",
      }}
    >
      <Box sx={{ px: isMobile ? 2 : 3, pt: 2.5, pb: 1.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <Typography sx={{ color: "#fff", fontSize: isMobile ? 20 : 22, fontWeight: 800 }}>
          Settings
        </Typography>
        <Typography sx={{ color: "#64748B", fontSize: 13, mt: 0.3 }}>
          Manage your preferences and account
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          px: isMobile ? 2 : 3,
          py: 2.5,
          "&::-webkit-scrollbar": { width: 4 },
          "&::-webkit-scrollbar-track": { background: "transparent" },
          "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: 4 },
        }}
      >
        {/* PROFILE */}
        <SectionTitle icon={User} title="Profile" />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2.5,
            mb: 2,
            p: 2.5,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <Box
            sx={{
              width: isMobile ? 48 : 56,
              height: isMobile ? 48 : 56,
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
              color: "#fff",
              fontSize: isMobile ? 18 : 22,
              fontWeight: 800,
              flexShrink: 0,
              boxShadow: "0 8px 24px rgba(139,92,246,0.3)",
            }}
          >
            {initial}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>
              {username}
            </Typography>
            <Typography
              sx={{ color: "#64748B", fontSize: 13, mt: 0.2, wordBreak: "break-all" }}
            >
              {email || "No email available"}
            </Typography>
            <Typography
              sx={{
                color: "#22C55E",
                fontSize: 12,
                mt: 0.5,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22C55E", display: "inline-block",
              }} />
              Online
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

        {/* NOTIFICATIONS */}
        <SectionTitle icon={Bell} title="Notifications" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
          <SettingRow
            icon={settings.soundEnabled ? Volume2 : VolumeX}
            label="Sound Notifications"
            description="Play sounds for messages, calls, and invites"
            checked={settings.soundEnabled}
            onChange={(v) => onUpdateSetting?.("soundEnabled", v)}
          />
          <SettingRow
            icon={settings.browserNotifEnabled ? Bell : BellOff}
            label="Desktop Notifications"
            description="Show browser notifications when you're away"
            checked={settings.browserNotifEnabled}
            onChange={(v) => onUpdateSetting?.("browserNotifEnabled", v)}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderRadius: "14px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.05)",
            mb: 0.5,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Trash2 size={20} strokeWidth={1.8} color="#94A3B8" />
            <Box>
              <Typography sx={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>
                Notification History
              </Typography>
              <Typography sx={{ color: "#64748B", fontSize: 12.5, mt: 0.3 }}>
                {notificationCount} notification{notificationCount !== 1 ? "s" : ""} stored
              </Typography>
            </Box>
          </Box>
          <Button
            onClick={handleClearNotifications}
            disabled={notificationCount === 0}
            sx={{
              color: "#EF4444",
              fontSize: 13,
              fontWeight: 600,
              textTransform: "none",
              minWidth: 0,
              px: 2,
              "&:hover": { background: "rgba(239,68,68,0.1)" },
              "&.Mui-disabled": { color: "#475569" },
            }}
          >
            Clear All
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

        {/* CALL PREFERENCES */}
        <SectionTitle icon={Video} title="Call Preferences" />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}>
          <SettingRow
            icon={Mic}
            label="Auto-join Audio"
            description="Start calls with microphone enabled"
            checked={settings.autoJoinAudio}
            onChange={(v) => onUpdateSetting?.("autoJoinAudio", v)}
          />
          <SettingRow
            icon={Video}
            label="Auto-enable Video"
            description="Start calls with camera enabled"
            checked={settings.autoEnableVideo}
            onChange={(v) => onUpdateSetting?.("autoEnableVideo", v)}
          />
        </Box>

        <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.06)" }} />

        {/* ABOUT */}
        <SectionTitle icon={Info} title="About" />

        <Box
          sx={{
            p: 2.5,
            borderRadius: "16px",
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <InfoCard label="Application" value="SyncMeet" />
          <InfoCard label="Developer" value="Sahil Atram" />

          <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Typography
              sx={{ color: "#94A3B8", fontSize: 13, lineHeight: 1.7, mb: 1 }}
            >
              SyncMeet is a realtime video collaboration platform built for seamless communication.
              Features include HD video calls, instant messaging, screen sharing, and team management — 
              all wrapped in a modern, fast interface.
            </Typography>
            <Typography
              sx={{ color: "#64748B", fontSize: 12, lineHeight: 1.6 }}
            >
              Built with React, Node.js, Socket.IO, and WebRTC. Powered by modern web technologies 
              for a smooth, low-latency experience across all devices.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ height: 40 }} />
      </Box>
    </Box>
  );
};

export default SettingsPage;
