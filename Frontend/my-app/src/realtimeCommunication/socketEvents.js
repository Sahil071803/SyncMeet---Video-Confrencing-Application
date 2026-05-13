import store from "../store/store";

import {
  setOnlineUsers,
  setFriends,
  setPendingFriendsInvitations,
} from "../store/actions/friendsActions";

import { addMessage } from "../store/chatSlice";

export const registerSocketEvents = (socket) => {
  if (!socket) return;

  socket.off("online-users");
  socket.off("friends-list");
  socket.off("friends-invitations");
  socket.off("direct-message");
  socket.off("user-presence-update");

  socket.on("online-users", (data) => {
    const onlineUsers = Array.isArray(data)
      ? data
      : data?.onlineUsers || [];

    store.dispatch(setOnlineUsers(onlineUsers));
  });

  socket.on("user-presence-update", () => {
    socket.emit("get-online-users");
  });

  socket.on("friends-list", (data) => {
    store.dispatch(setFriends(data?.friends || []));
  });

  socket.on("friends-invitations", (data) => {
    store.dispatch(
      setPendingFriendsInvitations(data?.pendingInvitations || [])
    );
  });

  socket.on("direct-message", (msg) => {
    if (!msg?.content) return;

    store.dispatch(
      addMessage({
        id: msg._id || Date.now(),
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        createdAt: msg.createdAt || new Date().toISOString(),
      })
    );
  });
};