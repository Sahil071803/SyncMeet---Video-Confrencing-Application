import {
  configureStore,
} from "@reduxjs/toolkit";

import authReducer from "./reducers/authReducer";

import alertReducer from "./reducers/alertReducer";

import friendsReducer from "./reducers/friendsReducers";

import chatReducer from "./chatSlice";

import notificationReducer from "./notificationSlice";

// ======================================
// STORE
// ======================================

const store = configureStore({
  reducer: {
    auth: authReducer,

    alert: alertReducer,

    friends: friendsReducer,

    chat: chatReducer,

    notification: notificationReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  devTools:
    process.env.NODE_ENV !==
    "production",
});

export default store;