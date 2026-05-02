import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";
import { buildApiUrl } from "../utils/runtimeConfig";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation, clearUnreadCount } =
    useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          buildApiUrl(`/api/messages/${selectedConversation._id}`),
          {
            credentials: "include",
          },
        );
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setMessages(data);
        clearUnreadCount(selectedConversation._id);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [clearUnreadCount, selectedConversation?._id, setMessages]);

  return { messages, loading };
};
export default useGetMessages;
