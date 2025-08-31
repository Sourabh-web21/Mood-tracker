import { useEffect } from "react";
import { FaHistory, FaHome, FaSignInAlt } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";

export default function Navbar({ username, setUsername }) {
  const navigate = useNavigate();

  // Sync username from localStorage (multi-tab support)
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername && storedUsername !== "undefined") {
      setUsername(storedUsername);
    }

    const handleStorageChange = () => {
      const newUsername = localStorage.getItem("username");
      setUsername(newUsername && newUsername !== "undefined" ? newUsername : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [setUsername]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUsername(null);
    navigate("/login");
  };

  return (
    <div className="h-20 bg-slate-100 flex w-full justify-around items-center px-4">
      <div className="logo flex w-1/3">
        <span className="text-2xl text-blue-800 font-bold">MOODPAD</span>
      </div>

      <div className="flex gap-4 items-center">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-t-lg ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <FaHome className="w-4 h-4" />
          <span className="hidden lg:block">Home</span>
        </NavLink>

        <NavLink
          to="/history"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-t-lg ${
              isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          <FaHistory className="w-4 h-4" />
          <span className="hidden lg:block">History</span>
        </NavLink>

         {username ? (
          <div className="flex items-center gap-3">
            <span className="px-3 py-2 text-gray-700">Welcome</span>
            <button onClick={handleLogout} className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">
              Logout
            </button>
          </div>
        ) : (
          <NavLink
            to="/login"
            className={({ isActive }) =>
              `flex items-center gap-2 px-3 py-2 rounded-t-lg ${
                isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <FaSignInAlt className="w-4 h-4" />
            <span className="hidden lg:block">SignUp/Login</span>
          </NavLink>
        )}
      </div>
    </div>
  );
}
