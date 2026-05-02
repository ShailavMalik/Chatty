import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, setMessages, incrementUnreadCount } =
    useConversation();
  const { authUser } = useAuthContext();

  const updateMessageStatus = (messageIds, updates) => {
    const stringMessageIds = messageIds.map((id) => getId(id));
    setMessages((currentMessages) =>
      currentMessages.map((message) => {
        const messageIdString = getId(message._id);
        if (!stringMessageIds.includes(messageIdString)) {
          return message;
        }

        return {
          ...message,
          ...updates,
        };
      }),
    );
  };

  const getId = (value) => value?.toString?.() || String(value || "");

  const playNotificationSound = () => {
    const sound = new Audio(notificationSound);
    sound.volume = 0.8;
    sound.play().catch(() => {});
  };

  const showBrowserNotification = async (newMessage) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return;
    }

    if (Notification.permission !== "granted") {
      return;
    }

    const options = {
      body: newMessage.message,
      icon: "/pwa-icon.svg",
      badge: "/pwa-icon.svg",
      tag: `chatty-${newMessage.senderId}`,
      renotify: true,
    };

    if ("serviceWorker" in navigator && navigator.serviceWorker.ready) {
      const registration = await navigator.serviceWorker.ready;
      registration.showNotification("New message", options).catch(() => {});
      return;
    }

    new Notification("New message", options);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      if (!authUser?._id) {
        return;
      }

      const senderId = getId(newMessage.senderId);
      const receiverId = getId(newMessage.receiverId);
      const currentUserId = getId(authUser._id);
      const selectedConversationId = getId(selectedConversation?._id);
      const isIncomingMessage =
        receiverId === currentUserId && senderId !== currentUserId;
      const isActiveConversation = selectedConversationId === senderId;

      if (!isIncomingMessage) {
        return;
      }

      playNotificationSound();

      if (!isActiveConversation) {
        incrementUnreadCount(senderId);
        showBrowserNotification(newMessage);
        return;
      }

      newMessage.shouldShake = true;
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    });

    socket?.on("messageDelivered", ({ messageId, deliveredAt }) => {
      updateMessageStatus([messageId], { deliveredAt });
    });

    socket?.on("messagesSeen", ({ messageIds, seenAt }) => {
      updateMessageStatus(messageIds, { deliveredAt: seenAt, seenAt });
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("messageDelivered");
      socket?.off("messagesSeen");
    };
  }, [
    authUser?._id,
    incrementUnreadCount,
    selectedConversation?._id,
    setMessages,
    socket,
  ]);
};
export default useListenMessages;
