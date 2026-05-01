import { useEffect, useRef, useState } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";
import { useAuthContext } from "../../context/AuthContext";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketContext();
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      socket?.emit("stopTyping", {
        receiverId: selectedConversation?._id,
        senderId: authUser?._id,
      });
    };
  }, [authUser?._id, selectedConversation?._id, socket]);

  const handleTyping = (value) => {
    setMessage(value);

    if (!socket || !selectedConversation || !authUser) return;

    if (!value.trim()) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }

      socket.emit("stopTyping", {
        receiverId: selectedConversation._id,
        senderId: authUser._id,
      });

      return;
    }

    socket.emit("typing", {
      receiverId: selectedConversation._id,
      senderId: authUser._id,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedConversation._id,
        senderId: authUser._id,
      });
    }, 700);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    socket?.emit("stopTyping", {
      receiverId: selectedConversation?._id,
      senderId: authUser?._id,
    });
    await sendMessage(message);
    setMessage("");
  };

  return (
    <form className="px-3 sm:px-4 py-3" onSubmit={handleSubmit}>
      <div className="relative w-full">
        <input
          type="text"
          className="block w-full rounded-full border border-slate-600 bg-slate-700/95 py-3 pl-4 pr-14 text-sm text-white placeholder:text-slate-300 shadow-lg shadow-slate-950/10 transition focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400/40"
          placeholder="Send a message"
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          aria-label="Send message"
          className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-sky-500 text-white shadow-md shadow-sky-500/30 transition hover:bg-sky-400 hover:shadow-sky-400/40 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-200 disabled:shadow-none">
          {loading ?
            <div className="loading loading-spinner"></div>
          : <BsSend />}
        </button>
      </div>
    </form>
  );
};
export default MessageInput;

// STARTER CODE SNIPPET
// import { BsSend } from "react-icons/bs";

// const MessageInput = () => {
// 	return (
// 		<form className='px-4 my-3'>
// 			<div className='w-full'>
// 				<input
// 					type='text'
// 					className='border text-sm rounded-lg block w-full p-2.5  bg-gray-700 border-gray-600 text-white'
// 					placeholder='Send a message'
// 				/>
// 				<button type='submit' className='absolute inset-y-0 end-0 flex items-center pe-3'>
// 					<BsSend />
// 				</button>
// 			</div>
// 		</form>
// 	);
// };
// export default MessageInput;
