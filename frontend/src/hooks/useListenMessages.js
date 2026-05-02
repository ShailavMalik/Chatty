import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import { useAuthContext } from "../context/AuthContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const typingTimeouts = new Map();

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const {
    selectedConversation,
    setMessages,
    incrementUnreadCount,
    setTypingConversation,
    clearTypingConversation,
  } = useConversation();
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

  const scheduleTypingClear = (conversationId) => {
    if (typingTimeouts.has(conversationId)) {
      clearTimeout(typingTimeouts.get(conversationId));
    }

    typingTimeouts.set(
      conversationId,
      setTimeout(() => {
        clearTypingConversation(conversationId);
        typingTimeouts.delete(conversationId);
      }, 1500),
    );
  };

  const clearTypingState = (conversationId) => {
    if (typingTimeouts.has(conversationId)) {
      clearTimeout(typingTimeouts.get(conversationId));
      typingTimeouts.delete(conversationId);
    }

    clearTypingConversation(conversationId);
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

      clearTypingState(senderId);

      playNotificationSound();

      if (!isActiveConversation) {
        incrementUnreadCount(senderId);
        showBrowserNotification(newMessage);
        return;
      }

      newMessage.shouldShake = true;
      setMessages((currentMessages) => [...currentMessages, newMessage]);

      socket?.emit("markMessagesSeen", {
        senderId,
        messageIds: [newMessage._id],
      });
    });

    socket?.on("typing", ({ senderId }) => {
      const senderConversationId = getId(senderId);

      if (
        !senderConversationId ||
        senderConversationId === getId(authUser?._id)
      ) {
        return;
      }

      setTypingConversation(senderConversationId);
      scheduleTypingClear(senderConversationId);
    });

    socket?.on("stopTyping", ({ senderId }) => {
      const senderConversationId = getId(senderId);

      if (!senderConversationId) {
        return;
      }

      clearTypingState(senderConversationId);
    });

    socket?.on("messageDelivered", ({ messageId, deliveredAt }) => {
      updateMessageStatus([messageId], { deliveredAt });
    });

    socket?.on("messagesSeen", ({ messageIds, seenAt }) => {
      updateMessageStatus(messageIds, { deliveredAt: seenAt, seenAt });
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("typing");
      socket?.off("stopTyping");
      socket?.off("messageDelivered");
      socket?.off("messagesSeen");

      typingTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      typingTimeouts.clear();
    };
  }, [
    authUser?._id,
    incrementUnreadCount,
    clearTypingConversation,
    selectedConversation?._id,
    setTypingConversation,
    setMessages,
    socket,
  ]);
};
export default useListenMessages;
