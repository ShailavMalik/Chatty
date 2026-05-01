import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { buildApiUrl } from "../utils/runtimeConfig";
import { useAuthContext } from "../context/AuthContext";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { setAuthUser } = useAuthContext();

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildApiUrl("/api/users"), {
          credentials: "include",
        });

        if (res.status === 401 || res.status === 404) {
          localStorage.removeItem("chat-user");
          setAuthUser(null);
          return;
        }

        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, [setAuthUser]);

  return { loading, conversations };
};
export default useGetConversations;
