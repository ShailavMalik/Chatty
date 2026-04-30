import useConversation from "../../zustand/useConversation";
import MessageContainer from "../../components/messages/MessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";

const Home = () => {
  const { selectedConversation } = useConversation();
  return (
    <div className="flex h-full w-full min-h-0 flex-col overflow-hidden rounded-none bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 md:max-h-[84vh] md:max-w-5xl md:flex-row md:rounded-[1.75rem] md:shadow-2xl md:shadow-slate-900/25">
      <div
        className={`${selectedConversation ? "hidden md:flex" : "flex"} h-full w-full min-h-0 md:w-80 lg:w-96`}>
        <Sidebar />
      </div>
      <div
        className={`${selectedConversation ? "flex" : "hidden md:flex"} h-full w-full min-h-0 flex-1`}>
        <MessageContainer />
      </div>
    </div>
  );
};
export default Home;
