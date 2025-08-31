import { motion } from 'framer-motion'

function history_Card({ children }) {
  return (
    <motion.div
      className="lg:w-1/4 w-72 max-w-full lg:h-96 py-2 bg-gradient-to-b from-amber-400 to-amber-600 
                 text-white rounded-3xl flex flex-col gap-3 p-4 shadow-md text-left break-words overflow-clip"
      initial={{ opacity: 0, translateX: 0 }}
      animate={{ opacity: 1, translateX: 10 }}
      whileHover={{ boxShadow: "0px 10px 25px rgba(0,0,0,0.7)", scale: 1.05 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

export default history_Card
