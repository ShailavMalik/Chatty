import { createContext, useContext, useState } from "react";
import buildAvatarDataUri from "../utils/buildAvatarDataUri";

export const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("chat-user")) || null;

    if (!storedUser) {
      return null;
    }

    if (
      !storedUser.profilePic ||
      storedUser.profilePic.startsWith("https://avatar.iran.liara.run")
    ) {
      return {
        ...storedUser,
        profilePic: buildAvatarDataUri({
          gender: storedUser.gender,
          username: storedUser.username,
          fullName: storedUser.fullName,
        }),
      };
    }

    return storedUser;
  });

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
