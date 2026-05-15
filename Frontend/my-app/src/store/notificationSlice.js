import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    notifications: [],
    unreadCount: 0,
  },
  reducers: {
    addNotification: (state, action) => {
      const notif = {
        id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
        type: action.payload.type || "info",
        title: action.payload.title || "",
        message: action.payload.message || "",
        senderId: action.payload.senderId || null,
        senderName: action.payload.senderName || null,
        timestamp: new Date().toISOString(),
        read: false,
      };
      state.notifications.unshift(notif);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => { n.read = true; });
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    removeNotification: (state, action) => {
      const idx = state.notifications.findIndex((n) => n.id === action.payload);
      if (idx !== -1) {
        if (!state.notifications[idx].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(idx, 1);
      }
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  clearNotifications,
  removeNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
