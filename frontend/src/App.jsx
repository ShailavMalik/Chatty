import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { useEffect } from "react";

function App() {
  const { authUser, setAuthUser } = useAuthContext();

  useEffect(() => {
    if (!authUser) return;

    const validateUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"}/api/users`,
          {
            credentials: "include",
          },
        );

        if (response.status === 401 || response.status === 404) {
          localStorage.removeItem("chat-user");
          setAuthUser(null);
        }
      } catch (error) {
        console.error("Error validating user:", error);
      }
    };

    const timer = setTimeout(validateUser, 1000);

    return () => clearTimeout(timer);
  }, [authUser, setAuthUser]);
  return (
    <div className="flex h-[100dvh] w-full items-stretch justify-center overflow-hidden bg-transparent p-0 md:items-center md:p-4">
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/login"
          element={authUser ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/signup"
          element={authUser ? <Navigate to="/" /> : <SignUp />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
