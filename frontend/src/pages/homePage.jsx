import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import MoodCard from "../components/moodCard";
import Track_card from "../components/track_card";
const API_URL = import.meta.env.VITE_API_URL;


function HomePage() {
  const [tracks, setTracks] = useState([]);
  const token = localStorage.getItem("token");
  const handleMoodClick = async (mood) => {
    try {
      const res = await axios.post(`${API_URL}/api/mood`, { mood },{ headers: { Authorization: `Bearer ${token}` } });
      setTracks(res.data.tracks);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100">
      {/* Title */}
      <motion.div
        className="text-primary px-6 lg:px-20 font-extrabold text-blue-900 text-center text-3xl lg:text-5xl py-10"
        initial={{ opacity: 0, translateX: 0 }}
        animate={{ opacity: 1, translateX: 20 }}
        transition={{ duration: 0.5 }}
      >
        How is your Mood Today?
      </motion.div>

      {/* Mood Cards */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center lg:justify-evenly mb-12"
        initial={{ opacity: 0, translateX: 0 }}
        animate={{ opacity: 1, translateX: 20 }}
        transition={{ duration: 0.5 }}
      >
        <MoodCard emoji="😂" onClick={() => handleMoodClick("Happy")} />
        <MoodCard emoji="😢" onClick={() => handleMoodClick("Sad")} />
        <MoodCard emoji="😡" onClick={() => handleMoodClick("Angry")} />
        <MoodCard emoji="😴" onClick={() => handleMoodClick("Tired")} />
        <MoodCard emoji="😐" onClick={() => handleMoodClick("Neutral")} />
      </motion.div>

      {/* Tracks Section */}
      {tracks.length > 0 && (
        <div className="mt-8 px-4 lg:px-10 flex flex-col items-center gap-8 w-full">
          <div className="text-4xl lg:text-5xl font-extrabold text-blue-900 mb-6">
            Songs for your mood:
          </div>

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
  );
}

export default HomePage;
