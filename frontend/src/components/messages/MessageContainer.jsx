import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { FiArrowLeft } from "react-icons/fi";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { socket } = useSocketContext();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    if (!socket || !selectedConversation) return;

    const handleTyping = ({ senderId }) => {
      if (senderId === selectedConversation._id) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (senderId === selectedConversation._id) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
      setIsTyping(false);
    };
  }, [socket, selectedConversation]);

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-blue-300/85 shadow-sm shadow-gray-200 backdrop-blur-3xl">
      {!selectedConversation ?
        <NoChatSelected />
      : <>
          {/* Header */}
          <div className="mb-2 flex items-center gap-3 border-b border-white/15 bg-slate-700/75 px-4 py-3 text-sm text-white shadow-sm">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 md:hidden"
              onClick={() => setSelectedConversation(null)}
              aria-label="Back to conversations">
              <FiArrowLeft />
            </button>
            <div className="min-w-0 flex-1">
              <span className="label-text text-slate-200">To:</span>{" "}
              <span className="truncate font-bold text-white">
                {selectedConversation.fullName}
              </span>
              {isTyping && (
                <span className="ml-3 text-sm font-semibold text-emerald-300">
                  typing...
                </span>
              )}
            </div>
          </div>
          <Messages />
          <MessageInput />
        </>
      }
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const { authUser } = useAuthContext();
  return (
    <div className="flex h-full min-h-[16rem] items-center justify-center p-6 text-center">
      <div className="flex flex-col items-center gap-2 px-4 font-semibold text-slate-100 md:text-slate-900">
        <p>Welcome 👋 {authUser.fullName} ❄</p>
        <p>Select a chat to start messaging</p>
        <TiMessages className="text-3xl text-center md:text-6xl" />
      </div>
    </div>
  );
};

// STARTER CODE SNIPPET
// import MessageInput from "./MessageInput";
// import Messages from "./Messages";

// const MessageContainer = () => {
// 	return (
// 		<div className='md:min-w-[450px] flex flex-col'>
// 			<>
// 				{/* Header */}
// 				<div className='bg-slate-500 px-4 py-2 mb-2'>
// 					<span className='label-text'>To:</span> <span className='text-gray-900 font-bold'>John doe</span>
// 				</div>

// 				<Messages />
// 				<MessageInput />
// 			</>
// 		</div>
// 	);
// };
// export default MessageContainer;
