import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const avatarFallback =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 216 216'%3E%3Crect width='216' height='216' rx='108' fill='%23dbeafe'/%3E%3Ccircle cx='108' cy='92' r='46' fill='%23f8dcc6'/%3E%3Cpath d='M62 92c4-28 28-50 46-50 22 0 46 18 50 46-7-6-18-10-27-10-13 0-20 5-23 9-4-4-10-9-21-9-10 0-17 4-25 14z' fill='%231f2937'/%3E%3Cellipse cx='90' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Cellipse cx='126' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Ccircle cx='90' cy='98' r='4' fill='%23111827'/%3E%3Ccircle cx='126' cy='98' r='4' fill='%23111827'/%3E%3Cpath d='M98 115c6 4 14 4 20 0' fill='none' stroke='%23111827' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M80 140c8-10 18-15 28-15s20 5 28 15c-11 9-21 13-28 13s-17-4-28-13z' fill='%232563eb'/%3E%3C/svg%3E";

  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center  hover:bg-sky-500 rounded-md p-2 py-1 cursor-pointer
				${isSelected ? "bg-sky-600" : ""}
			`}
        onClick={() => setSelectedConversation(conversation)}>
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img
              src={conversation.profilePic || avatarFallback}
              alt={`${conversation.fullName} avatar`}
              onError={(event) => {
                event.currentTarget.src = avatarFallback;
              }}
            />
          </div>
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex items-center gap-3 justify-between">
            <p className="font-bold text-black">{conversation.fullName}</p>
          </div>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};
export default Conversation;

// STARTER CODE SNIPPET
// const Conversation = () => {
// 	return (
// 		<>
// 			<div className='flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer'>
// 				<div className='avatar online'>
// 					<div className='w-12 rounded-full'>
// 						<img
// 							src='https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png'
// 							alt='user avatar'
// 						/>
// 					</div>
// 				</div>

// 				<div className='flex flex-col flex-1'>
// 					<div className='flex gap-3 justify-between'>
// 						<p className='font-bold text-gray-200'>John Doe</p>
// 						<span className='text-xl'>🎃</span>
// 					</div>
// 				</div>
// 			</div>

// 			<div className='divider my-0 py-0 h-1' />
// 		</>
// 	);
// };
// export default Conversation;
