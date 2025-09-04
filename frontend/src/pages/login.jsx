import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MoodCard from "../components/moodCard";
import Track_card from "../components/track_card";

const API_URL = import.meta.env.VITE_API_URL;

export default function HomePage({ setUsername }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [tracks, setTracks] = useState([]);
  const navigate = useNavigate();

  // Load username from localStorage
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) setUsername(storedUsername);
  }, [setUsername]);

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

      const token = res.data.token;
      const usernameValue = res.data.user.name || res.data.user.email;

      localStorage.setItem("token", token);
      localStorage.setItem("username", usernameValue);

      setUsername(usernameValue);
      navigate("/"); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || "Request failed");
    }
  };

  const handleMoodClick = async (mood) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/mood`,
        { mood },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTracks(res.data.tracks);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tracks");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Login / Signup form */}
      {isLogin || !localStorage.getItem("token") ? (
        <div className="min-h-screen flex items-center justify-center">
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
      ) : (
        // Mood tracker after login
        <div className="px-6 lg:px-20 py-10">
          <h2 className="text-blue-900 font-extrabold text-3xl lg:text-5xl mb-8 text-center">
            How is your Mood Today?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center lg:justify-evenly mb-12">
            <MoodCard emoji="😂" onClick={() => handleMoodClick("Happy")} />
            <MoodCard emoji="😢" onClick={() => handleMoodClick("Sad")} />
            <MoodCard emoji="😡" onClick={() => handleMoodClick("Angry")} />
            <MoodCard emoji="😴" onClick={() => handleMoodClick("Tired")} />
            <MoodCard emoji="😐" onClick={() => handleMoodClick("Neutral")} />
          </div>

          {tracks.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-8 w-full">
              <h3 className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6">
                Songs for your mood:
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {tracks.map((t, i) => (
                  <Track_card
                    key={i}
                    cover={t.cover}
                    track={t.name}
                    artist={t.artist}
                    url={t.url}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
