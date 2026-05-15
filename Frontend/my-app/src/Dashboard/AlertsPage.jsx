import React, { useCallback } from "react";
import { styled } from "@mui/system";
import { Box, Typography, IconButton } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import useResponsive from "../hooks/useResponsive";
import {
  markAsRead,
  markAllAsRead,
  clearNotifications,
} from "../store/notificationSlice";
import {
  MessageCircle,
  Phone,
  UserPlus,
  Bell,
  CheckCheck,
  Trash2,
  PhoneOff,
  Info,
} from "lucide-react";

const Container = styled(Box)({
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",
  background: "linear-gradient(180deg,#071028 0%,#0B1120 100%)",
});

const Header = styled(Box)(({ mobile }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: mobile ? "14px 16px" : "20px 24px",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  flexShrink: 0,
}));

const HeaderActions = styled(Box)({
  display: "flex",
  alignItems: "center",
  gap: "8px",
});

const ActionBtn = styled(IconButton)({
  width: "44px",
  height: "44px",
  borderRadius: "12px",
  color: "#94A3B8",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.06)",
  "&:hover": { background: "rgba(255,255,255,0.08)", color: "#fff" },
});

const List = styled(Box)(({ mobile }) => ({
  flex: 1,
  overflowY: "auto",
  padding: mobile ? "12px 14px" : "16px 24px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
  "&::-webkit-scrollbar": { width: "5px" },
  "&::-webkit-scrollbar-thumb": { background: "rgba(255,255,255,0.08)", borderRadius: "20px" },
}));

const NotifCard = styled(Box, {
  shouldForwardProp: (prop) => prop !== "unread" && prop !== "mobile",
})(({ unread, mobile }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: mobile ? "10px" : "14px",
  padding: mobile ? "12px 14px" : "16px 18px",
  borderRadius: "18px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  background: unread ? "rgba(139,92,246,0.06)" : "rgba(255,255,255,0.03)",
  border: unread ? "1px solid rgba(139,92,246,0.15)" : "1px solid rgba(255,255,255,0.05)",
  "&:hover": {
    background: "rgba(255,255,255,0.06)",
    transform: "translateX(3px)",
  },
}));

const IconBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "mobile",
})(({ color, mobile }) => ({
  width: mobile ? "40px" : "44px",
  height: mobile ? "40px" : "44px",
  borderRadius: "14px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  background: `${color}18`,
  color,
}));

const Content = styled(Box)({ flex: 1, minWidth: 0 });
const NotifTitle = styled(Typography)({ color: "#fff", fontSize: "14px", fontWeight: 600 });
const NotifMsg = styled(Typography)({ color: "#94A3B8", fontSize: "13px", marginTop: "4px", lineHeight: 1.5 });
const NotifTime = styled(Typography)({ color: "#64748B", fontSize: "11px", marginTop: "6px" });

const EmptyState = styled(Box)({
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  padding: "40px",
  gap: "16px",
});

const EmptyIcon = styled(Box)({
  width: "80px",
  height: "80px",
  borderRadius: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "rgba(139,92,246,0.1)",
  border: "1px solid rgba(139,92,246,0.15)",
  color: "#8B5CF6",
});

const getIcon = (type) => {
  switch (type) {
    case "message": return <MessageCircle size={22} />;
    case "call": return <Phone size={22} />;
    case "call-ended": return <PhoneOff size={22} />;
    case "friend-request": return <UserPlus size={22} />;
    default: return <Bell size={22} />;
  }
};

const getColor = (type) => {
  switch (type) {
    case "message": return "#8B5CF6";
    case "call": return "#22C55E";
    case "call-ended": return "#EF4444";
    case "friend-request": return "#3B82F6";
    default: return "#94A3B8";
  }
};

const formatDateTime = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  if (diff < 60000) return "Just now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)} minutes ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return date.toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const AlertsPage = () => {
  const { isMobile } = useResponsive();
  const dispatch = useDispatch();
  const { notifications } = useSelector((state) => state.notification || {});

  const handleMarkRead = useCallback((id) => {
    dispatch(markAsRead(id));
  }, [dispatch]);

  const handleMarkAllRead = useCallback(() => {
    dispatch(markAllAsRead());
  }, [dispatch]);

  const handleClear = useCallback(() => {
    dispatch(clearNotifications());
  }, [dispatch]);

  return (
    <Container>
      <Header mobile={isMobile ? 1 : 0}>
        <Box>
          <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: isMobile ? "18px" : "20px" }}>
            Notifications
          </Typography>
          <Typography sx={{ color: "#94A3B8", fontSize: "13px", mt: "4px" }}>
            Recent activity and updates
          </Typography>
        </Box>
        <HeaderActions>
          {notifications.some((n) => !n.read) && (
            <ActionBtn onClick={handleMarkAllRead} title="Mark all read">
              <CheckCheck size={18} />
            </ActionBtn>
          )}
          {notifications.length > 0 && (
            <ActionBtn onClick={handleClear} title="Clear all">
              <Trash2 size={18} />
            </ActionBtn>
          )}
        </HeaderActions>
      </Header>

      <List mobile={isMobile ? 1 : 0}>
        {notifications.length === 0 ? (
          <EmptyState>
            <EmptyIcon><Bell size={34} /></EmptyIcon>
            <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "22px" }}>
              No Notifications Yet
            </Typography>
            <Typography sx={{ color: "#94A3B8", maxWidth: "340px", lineHeight: 1.7 }}>
              Notifications about messages, calls, friend requests, and meeting updates will appear here.
            </Typography>
          </EmptyState>
        ) : (
          notifications.map((n) => (
            <NotifCard key={n.id} unread={!n.read ? 1 : 0} mobile={isMobile ? 1 : 0} onClick={() => handleMarkRead(n.id)}>
              <IconBox color={getColor(n.type)} mobile={isMobile ? 1 : 0}>{getIcon(n.type)}</IconBox>
              <Content>
                <NotifTitle>{n.title}</NotifTitle>
                <NotifMsg>{n.message}</NotifMsg>
                <NotifTime>{formatDateTime(n.timestamp)}</NotifTime>
              </Content>
            </NotifCard>
          ))
        )}
      </List>
    </Container>
  );
};

export default AlertsPage;
