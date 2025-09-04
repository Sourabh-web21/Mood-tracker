import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
export default function Login({ setUsername }) { // ✅ receive prop
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = isLogin ? "login" : "signup";

    try {
      const res = await axios.post(`${API_URL}/api/${endpoint}`, {
        email,
        password,
        ...(isLogin ? {} : { name }),
      });

      if (!isLogin) {
        setIsLogin(true);
        setEmail("");
        setPassword("");
        setName("");
        setError("Signup successful! Please log in.");
        return;
      }

      // Login flow
      const token = res.data.token;
      const usernameValue = res.data.name || res.data.email;

      localStorage.setItem("token", token);
      localStorage.setItem("username", usernameValue);

      setUsername(usernameValue); // ✅ immediately update Navbar
      navigate("/"); // Redirect to homepage
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600">
      <div className="bg-white shadow-xl rounded-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && (
          <div className="mb-4 text-red-600 text-center text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />

          <button
            type="submit"
            className="bg-amber-500 text-white py-3 rounded-lg font-semibold hover:bg-amber-600 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-amber-600 font-medium hover:underline"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
