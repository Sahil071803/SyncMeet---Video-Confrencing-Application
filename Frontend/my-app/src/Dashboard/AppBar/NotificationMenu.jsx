import React, { useCallback } from "react";
import { styled, alpha } from "@mui/system";
import { Box, Typography, IconButton, Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import {
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from "../../store/notificationSlice";
import {
  MessageCircle,
  Phone,
  UserPlus,
  Bell,
  X,
  CheckCheck,
  Trash2,
  PhoneOff,
} from "lucide-react";

const Container = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "calc(100% + 8px)",
  right: 0,
  width: "360px",
  maxHeight: "min(480px, calc(100vh - 100px))",
  borderRadius: "20px",
  background: "rgba(15,23,42,0.95)",
  backdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  zIndex: 9999,
  [theme.breakpoints.down("sm")]: {
    width: "calc(100vw - 20px)",
    right: "-10px",
  },
}));

const Header = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 18px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
});

const HeaderActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "6px",
});

const ActionBtn = styled(IconButton)({
  width: "40px",
  height: "40px",
  color: "#94A3B8",
  "&:hover": { background: "rgba(255,255,255,0.06)", color: "#fff" },
});

const List = styled(Box)({
  flex: 1,
  overflowY: "auto",
  padding: "8px",
  display: "flex",
  flexDirection: "column",
  gap: "6px",
  "&::-webkit-scrollbar": { width: "4px" },
  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.1)", borderRadius: "10px" },
});

const NotifItem = styled(Box)(({ unread }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  padding: "12px 14px",
  borderRadius: "14px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  background: unread ? "rgba(139,92,246,0.08)" : "transparent",
  border: unread ? "1px solid rgba(139,92,246,0.12)" : "1px solid transparent",
  "&:hover": {
    background: "rgba(255,255,255,0.05)",
    transform: "translateX(2px)",
  },
}));

const IconBox = styled(Box)(({ color }) => ({
  width: "38px",
  height: "38px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: `${color}15`,
  color,
}));

const Content = styled(Box)({ flex: 1, minWidth: 0 });
const NotifTitle = styled(Typography)({
  color: "#fff",
  fontSize: "13px",
  fontWeight: 600,
  lineHeight: 1.3,
});
const NotifMsg = styled(Typography)({
  color: "#94A3B8",
  fontSize: "12px",
  marginTop: "3px",
  lineHeight: 1.4,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});
const NotifTime = styled(Typography)({
  color: "#64748B",
  fontSize: "10px",
  marginTop: "4px",
});

const EmptyState = styled(Box)({
  padding: "40px 20px",
  textAlign: "center",
  color: "#64748B",
});

const getNotifIcon = (type) => {
  switch (type) {
    case "message": return <MessageCircle size={18} />;
    case "call": return <Phone size={18} />;
    case "call-ended": return <PhoneOff size={18} />;
    case "friend-request": return <UserPlus size={18} />;
    default: return <Bell size={18} />;
  }
};

const getNotifColor = (type) => {
  switch (type) {
    case "message": return "#8B5CF6";
    case "call": return "#22C55E";
    case "call-ended": return "#EF4444";
    case "friend-request": return "#3B82F6";
    default: return "#94A3B8";
  }
};

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return "just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const NotificationMenu = ({ onClose }) => {
  const dispatch = useDispatch();
  const { notifications, unreadCount } = useSelector((state) => state.notification || {});

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  const handleItemClick = useCallback((id) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  return (
    <Container>
      <Header>
        <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "16px" }}>
          Notifications
          {unreadCount > 0 && (
            <Typography component="span" sx={{ color: "#8B5CF6", fontSize: "13px", ml: 1, fontWeight: 600 }}>
              ({unreadCount})
            </Typography>
          )}
        </Typography>
        <HeaderActions>
          {unreadCount > 0 && (
            <ActionBtn size="small" onClick={handleMarkAllRead} title="Mark all read">
              <CheckCheck size={16} />
            </ActionBtn>
          )}
          {notifications.length > 0 && (
            <ActionBtn size="small" onClick={handleClear} title="Clear all">
              <Trash2 size={16} />
            </ActionBtn>
          )}
          <ActionBtn size="small" onClick={onClose} title="Close">
            <X size={16} />
          </ActionBtn>
        </HeaderActions>
      </Header>

      <List>
        {notifications.length === 0 ? (
          <EmptyState>
            <Bell size={32} style={{ opacity: 0.3, marginBottom: 12 }} />
            <Typography sx={{ color: "#94A3B8", fontSize: "14px", fontWeight: 600 }}>
              No notifications yet
            </Typography>
            <Typography sx={{ color: "#64748B", fontSize: "12px", mt: 1 }}>
              New messages, calls and updates will appear here.
            </Typography>
          </EmptyState>
        ) : (
          notifications.map((n) => (
            <NotifItem key={n.id} unread={!n.read ? 1 : 0} onClick={() => handleItemClick(n.id)}>
              <IconBox color={getNotifColor(n.type)}>
                {getNotifIcon(n.type)}
              </IconBox>
              <Content>
                <NotifTitle>{n.title}</NotifTitle>
                <NotifMsg>{n.message}</NotifMsg>
                <NotifTime>{formatTime(n.timestamp)}</NotifTime>
              </Content>
            </NotifItem>
          ))
        )}
      </List>
    </Container>
  );
};

export default NotificationMenu;
