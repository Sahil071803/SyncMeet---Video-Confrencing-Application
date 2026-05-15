import { useCallback, useRef } from "react";

const useBrowserNotifications = () => {
  const permissionRef = useRef(Notification.permission);
  const enabledRef = useRef(true);

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied";
    if (Notification.permission === "default") {
      permissionRef.current = await Notification.requestPermission();
    }
    return permissionRef.current;
  }, []);

  const sendBrowserNotification = useCallback((title, options = {}) => {
    if (!enabledRef.current) return null;
    if (!("Notification" in window)) return null;
    if (Notification.permission !== "granted") return null;

    try {
      const notif = new Notification(title, {
        icon: "/vite.svg",
        badge: "/vite.svg",
        tag: options.tag || "syncmeet-general",
        ...options,
      });

      if (options.onClick) {
        notif.onclick = (e) => {
          e.preventDefault();
          window.focus();
          options.onClick();
          notif.close();
        };
      }

      setTimeout(() => notif.close(), 8000);
      return notif;
    } catch {
      return null;
    }
  }, []);

  const notifyMessage = useCallback((senderName, messagePreview, onClick) => {
    const title = `${senderName} sent a message`;
    sendBrowserNotification(title, {
      body: messagePreview || "New message",
      tag: `msg-${Date.now()}`,
      onClick,
    });
  }, [sendBrowserNotification]);

  const notifyCall = useCallback((callerName, onClick) => {
    sendBrowserNotification(`Incoming call from ${callerName}`, {
      body: "Tap to answer",
      tag: "incoming-call",
      onClick,
    });
  }, [sendBrowserNotification]);

  const notifyFriendRequest = useCallback((senderName) => {
    sendBrowserNotification("New Friend Request", {
      body: `${senderName} sent you a friend request`,
      tag: "friend-request",
    });
  }, [sendBrowserNotification]);

  const setBrowserNotifEnabled = useCallback((val) => {
    enabledRef.current = val;
  }, []);

  return {
    requestPermission,
    notifyMessage,
    notifyCall,
    notifyFriendRequest,
    sendBrowserNotification,
    setBrowserNotifEnabled,
    browserNotifEnabled: enabledRef,
  };
};

export default useBrowserNotifications;
