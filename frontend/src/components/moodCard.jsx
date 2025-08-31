import { motion } from 'framer-motion';

function MoodCard({ emoji, onClick }) {
  return (
    <motion.div
      className=' rounded-full bg-amber-200 w-30 h-30 text-center text-7xl py-4 lg:w-50 lg:h-50 lg:py-7 lg:text-9xl cursor-pointer'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      whileHover={{
        scale: 1.2,
        rotateY: 10,
        rotateX: 5,
        boxShadow: "0px 15px 30px rgba(0,0,100,0.4)"
      }}
      onClick={onClick}
    >
     {emoji}

    </motion.div>
  );
}

export default MoodCard;
