import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useAuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { authUser } = useAuthContext();
  const avatarFallback =
    "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 216 216'%3E%3Crect width='216' height='216' rx='108' fill='%23dbeafe'/%3E%3Ccircle cx='108' cy='92' r='46' fill='%23f8dcc6'/%3E%3Cpath d='M62 92c4-28 28-50 46-50 22 0 46 18 50 46-7-6-18-10-27-10-13 0-20 5-23 9-4-4-10-9-21-9-10 0-17 4-25 14z' fill='%231f2937'/%3E%3Cellipse cx='90' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Cellipse cx='126' cy='96' rx='8' ry='10' fill='%23fff'/%3E%3Ccircle cx='90' cy='98' r='4' fill='%23111827'/%3E%3Ccircle cx='126' cy='98' r='4' fill='%23111827'/%3E%3Cpath d='M98 115c6 4 14 4 20 0' fill='none' stroke='%23111827' stroke-width='4' stroke-linecap='round'/%3E%3Cpath d='M80 140c8-10 18-15 28-15s20 5 28 15c-11 9-21 13-28 13s-17-4-28-13z' fill='%232563eb'/%3E%3C/svg%3E";

  return (
    <div className="flex h-full w-full min-h-0 flex-col border-r border-slate-500 bg-blue-100 p-4 shadow-lg shadow-black md:w-80 lg:w-96">
      <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/70 px-3 py-2 shadow-sm">
        <div className="avatar">
          <div className="w-11 rounded-full ring-2 ring-sky-400/40">
            <img
              src={authUser?.profilePic || avatarFallback}
              alt={`${authUser?.fullName || "Current user"} avatar`}
              onError={(event) => {
                event.currentTarget.src = avatarFallback;
              }}
            />
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900">You</p>
          <p className="truncate text-xs text-slate-600">
            {authUser?.fullName}
          </p>
          <p className="truncate text-xs text-slate-500">
            @{authUser?.username}
          </p>
        </div>
      </div>
      <SearchInput />
      <div className="divider px-3"></div>
      <Conversations />
      <LogoutButton />
    </div>
  );
};
export default Sidebar;

// STARTER CODE FOR THIS FILE
// import Conversations from "./Conversations";
// import LogoutButton from "./LogoutButton";
// import SearchInput from "./SearchInput";

// const Sidebar = () => {
// 	return (
// 		<div className='border-r border-slate-500 p-4 flex flex-col'>
// 			<SearchInput />
// 			<div className='divider px-3'></div>
// 			<Conversations />
// 			<LogoutButton />
// 		</div>
// 	);
// };
// export default Sidebar;
