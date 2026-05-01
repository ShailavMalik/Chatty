import { useAuthContext } from "../../context/AuthContext";
import { extractTime } from "../../utils/extractTime";
import useConversation from "../../zustand/useConversation";
import { BiCheck, BiCheckDouble } from "react-icons/bi";

const Message = ({ message }) => {
  const { authUser } = useAuthContext();
  const { selectedConversation } = useConversation();
  const avatarFallback =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 216 216'%3E%3Crect width='216' height='216' rx='108' fill='%23dbeafe'/%3E%3Ccircle cx='108' cy='92' r='46' fill='%23f8dcc6'/%3E%3Cpath d='M62 92c4-28 28-50 46-50 22 0 46 18 50 46-7-6-18-10-27-10-13 0-20 5-23 9-4-4-10-9-21-9-10 0-17 4-25 14z' fill='%231f2937'/%3E%3Cellipse cx='90' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Cellipse cx='126' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Ccircle cx='90' cy='98' r='4' fill='%23111827'/%3E%3Ccircle cx='126' cy='98' r='4' fill='%23111827'/%3E%3Cpath d='M98 115c6 4 14 4 20 0' fill='none' stroke='%23111827' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M80 140c8-10 18-15 28-15s20 5 28 15c-11 9-21 13-28 13s-17-4-28-13z' fill='%232563eb'/%3E%3C/svg%3E";
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic =
    fromMe ? authUser.profilePic : selectedConversation?.profilePic;
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  const isDelivered = Boolean(message.deliveredAt);
  const isSeen = Boolean(message.seenAt);

  const shakeClass = message.shouldShake ? "shake" : "";

  const renderReceipt = () => {
    if (!fromMe) return null;

    if (isSeen) {
      return <BiCheckDouble className="text-sm text-sky-300" />;
    }

    if (isDelivered) {
      return <BiCheckDouble className="text-sm text-slate-300" />;
    }

    return <BiCheck className="text-sm text-slate-300" />;
  };

  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 background-black-100 rounded-full">
          <img
            alt="Chat avatar"
            src={profilePic || avatarFallback}
            onError={(event) => {
              event.currentTarget.src = avatarFallback;
            }}
          />
        </div>
      </div>
      <div
        className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass} pb-2`}>
        {message.message}
      </div>
      <div className="chat-footer flex items-center gap-1 text-xs opacity-50">
        {formattedTime}
        {renderReceipt()}
      </div>
    </div>
  );
};
export default Message;
