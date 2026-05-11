import store from "../store/store";
import {
  setOnlineUsers,
  setFriends,
  setPendingFriendsInvitations,
} from "../store/actions/friendsActions";

import { addMessage } from "../store/chatSlice";

export const registerSocketEvents = (socket) => {
  if (!socket) return;

  // remove old listeners first (VERY IMPORTANT)
  socket.off("online-users");
  socket.off("friends-list");
  socket.off("friends-invitations");
  socket.off("direct-message");

  socket.on("online-users", (data) => {
    store.dispatch(setOnlineUsers(data?.onlineUsers || []));
  });

  socket.on("friends-list", (data) => {
    store.dispatch(setFriends(data?.friends || []));
  });

  socket.on("friends-invitations", (data) => {
    store.dispatch(
      setPendingFriendsInvitations(
        data?.pendingInvitations || []
      )
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