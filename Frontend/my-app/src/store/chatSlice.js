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
    // UPDATE MESSAGE STATUS
    // =========================
    updateMessageStatus: (state, action) => {
      const { id, status, newId } =
        action.payload;

      const msg = state.messages.find(
        (m) => m.id === id
      );

      if (msg) {
        msg.status = status;

        if (newId) {
          msg.id = newId;
        }
      }
    },

    // =========================
    // CLEAR CHAT
    // =========================
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const {
  addMessage,
  setMessages,
  updateMessageStatus,
  clearMessages,
} = chatSlice.actions;

export default chatSlice.reducer;