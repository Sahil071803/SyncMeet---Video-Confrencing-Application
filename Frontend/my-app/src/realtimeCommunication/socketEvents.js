import store from "../store/store";

import {
  setOnlineUsers,
  setFriends,
  setPendingFriendsInvitations,
} from "../store/actions/friendsActions";

import { addMessage } from "../store/chatSlice";

import { addNotification } from "../store/notificationSlice";

let onIncomingCallCallback = null;
let onCallRejectedCallback = null;
let onCallEndedCallback = null;
let onMessageCallback = null;
let onFriendRequestCallback = null;

export const setIncomingCallCallback = (callback) => {
  onIncomingCallCallback = callback;
};

export const setCallRejectedCallback = (callback) => {
  onCallRejectedCallback = callback;
};

export const setCallEndedCallback = (callback) => {
  onCallEndedCallback = callback;
};

export const setOnMessageCallback = (callback) => {
  onMessageCallback = callback;
};

export const setOnFriendRequestCallback = (callback) => {
  onFriendRequestCallback = callback;
};

const getFriends = () => {
  const state = store.getState();
  return state.friends?.friends || [];
};

const findFriendName = (friendId) => {
  const friend = getFriends().find(
    (f) => f._id === friendId || f.id === friendId || f.userId === friendId
  );
  return friend?.username || "Someone";
};

export const registerSocketEvents = (socket) => {
  if (!socket) return;

  socket.off("online-users");
  socket.off("friends-list");
  socket.off("friends-invitations");
  socket.off("direct-message");
  socket.off("user-presence-update");
  socket.off("incoming-call");
  socket.off("call-rejected");
  socket.off("call-ended");

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
    const invitations = data?.pendingInvitations || [];

    const prevState = store.getState();
    const prevCount = prevState.friends?.pendingFriendsInvitations?.length || 0;

    store.dispatch(setPendingFriendsInvitations(invitations));

    if (invitations.length > prevCount && invitations.length > 0) {
      const latest = invitations[0];
      const senderName = latest?.senderId?.username || "Someone";
      store.dispatch(addNotification({
        type: "friend-request",
        title: "New Friend Request",
        message: `${senderName} sent you a friend request`,
        senderId: latest?.senderId?._id || null,
        senderName,
      }));
      if (onFriendRequestCallback) {
        onFriendRequestCallback({ senderName });
      }
    }
  });

  socket.on("direct-message", (msg) => {
    if (!msg) return;

    const state = store.getState();
    const myId = state.auth?.userDetails?.userId || state.auth?.userDetails?._id;
    const isOwnMessage = msg.senderId?.toString() === myId?.toString();

    store.dispatch(
      addMessage({
        id: msg._id || Date.now(),
        senderId: msg.senderId,
        receiverId: msg.receiverId,
        content: msg.content,
        messageType: msg.messageType || "text",
        fileUrl: msg.fileUrl || "",
        fileName: msg.fileName || "",
        fileSize: msg.fileSize || 0,
        createdAt: msg.createdAt || new Date().toISOString(),
      })
    );

    if (!isOwnMessage) {
      const senderName = findFriendName(msg.senderId);
      const preview = msg.messageType === "image"
        ? "📷 Sent an image"
        : msg.messageType === "file"
          ? `📎 Sent a file: ${msg.fileName || ""}`
          : msg.content?.slice(0, 80) || "New message";

      store.dispatch(addNotification({
        type: "message",
        title: senderName,
        message: preview,
        senderId: msg.senderId,
        senderName,
      }));

      if (onMessageCallback) {
        onMessageCallback({ senderName, preview, senderId: msg.senderId });
      }
    }
  });

  socket.on("incoming-call", (data) => {
    console.log("📞 Incoming call from:", data.from);
    const callerName = findFriendName(data.from);
    store.dispatch(addNotification({
      type: "call",
      title: "Incoming Call",
      message: `${callerName} is calling you`,
      senderId: data.from,
      senderName: callerName,
    }));
    if (onIncomingCallCallback) {
      onIncomingCallCallback(data);
    }
  });

  socket.on("call-rejected", (data) => {
    console.log("❌ Call rejected by:", data.from);
    const rejectorName = findFriendName(data.from);
    store.dispatch(addNotification({
      type: "call-ended",
      title: "Call Rejected",
      message: `${rejectorName} declined your call`,
      senderId: data.from,
      senderName: rejectorName,
    }));
    if (onCallRejectedCallback) {
      onCallRejectedCallback(data);
    }
  });

  socket.on("call-ended", (data) => {
    console.log("📴 Call ended by:", data.from);
    const enderName = findFriendName(data.from);
    store.dispatch(addNotification({
      type: "call-ended",
      title: "Call Ended",
      message: `Call with ${enderName} has ended`,
      senderId: data.from,
      senderName: enderName,
    }));
    if (onCallEndedCallback) {
      onCallEndedCallback(data);
    }
  });
};
