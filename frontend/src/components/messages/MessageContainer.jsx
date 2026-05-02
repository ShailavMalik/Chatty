import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { FiArrowLeft } from "react-icons/fi";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    typingConversations,
    clearTypingConversation,
  } = useConversation();

  useEffect(() => {
    // cleanup function (unmounts)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    if (selectedConversation?._id) {
      clearTypingConversation(selectedConversation._id);
    }
  }, [clearTypingConversation, selectedConversation?._id]);

  const isTyping =
    selectedConversation ?
      Boolean(typingConversations[selectedConversation._id])
    : false;

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden bg-blue-300/85 shadow-sm shadow-gray-200 backdrop-blur-3xl">
      {!selectedConversation ?
        <NoChatSelected />
      : <>
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
            </div>
          </div>
          {isTyping && (
            <div className="mx-4 mb-2 flex w-fit items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50/95 px-3 py-1 text-xs font-semibold text-emerald-950 shadow-sm shadow-emerald-950/10 backdrop-blur-sm">
              <span>{selectedConversation.fullName} is typing</span>
              <span className="flex items-center gap-1" aria-hidden="true">
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-700" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-700" />
                <span className="typing-dot h-1.5 w-1.5 rounded-full bg-emerald-700" />
              </span>
            </div>
          )}
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
