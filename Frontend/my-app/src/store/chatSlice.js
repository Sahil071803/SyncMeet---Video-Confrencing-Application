import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",

  initialState: {
    messages: [],
  },

  reducers: {

    // =========================
    // ADD MESSAGE
    // =========================
    addMessage: (state, action) => {
      const msg = action.payload;

      if (!msg?.id) return;

      const exists = state.messages.some(
        (m) => m.id === msg.id
      );

      if (!exists) {
        state.messages.push(msg);
      }
    },

    // =========================
    // SET MESSAGES
    // =========================
    setMessages: (state, action) => {
      state.messages = action.payload || [];
    },

    // =========================
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setMessages, clearMessages } = chatSlice.actions;

export default chatSlice.reducer;