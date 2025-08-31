import { motion } from "framer-motion";

function Track_card({ cover, track, artist, url }) {
  return (
    <motion.div
      className="lg:w-1/4 w-1/2 lg:h-96 py-2 bg-gradient-to-b from-amber-400 to-amber-600 text-white rounded-3xl flex flex-col gap-4 justify-center items-center p-4 shadow-md"
      initial={{ opacity: 0, translateX: 0 }}
      animate={{ opacity: 1, translateX: 10 }}
      whileHover={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.7)", scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      <img
        src={cover}
        alt="album cover"
        className="w-2/3 h-48 lg:h-56 rounded-2xl object-cover shadow-inner"
      />

      <div className="text-lg lg:text-xl font-semibold line-clamp-1">{track}</div>

      <span className="lg:text-xl text-sm text-gray-100">Artist: {artist}</span>

      <motion.button
        className="w-2/3 lg:h-10 bg-gradient-to-r from-spotify to-green-500 text-white font-bold px-4 py-2 rounded-2xl flex justify-center items-center gap-2"
        onClick={() => window.open(url, "_blank")}
        whileHover={{ scale: 1.1, boxShadow: "0px 0px 15px rgba(0,0,0,0.7)" }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xl">🎧</span>
        <span className="hidden lg:block">Spotify</span>
      </motion.button>
    </motion.div>
  );
}

export default Track_card;
