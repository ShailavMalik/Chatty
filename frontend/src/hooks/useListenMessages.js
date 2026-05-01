import { useEffect } from "react";

import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setMessages } = useConversation();

  const updateMessageStatus = (messageIds, updates) => {
    setMessages((currentMessages) =>
      currentMessages.map((message) => {
        if (!messageIds.includes(message._id)) {
          return message;
        }

        return {
          ...message,
          ...updates,
        };
      }),
    );
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      newMessage.shouldShake = true;
      const sound = new Audio(notificationSound);
      sound.play();
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
  }, [socket, setMessages]);
};
export default useListenMessages;
