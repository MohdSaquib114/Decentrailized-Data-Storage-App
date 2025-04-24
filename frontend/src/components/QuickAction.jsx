
import { motion } from "framer-motion"
const QuickAction = ({ icon, title, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3 p-4 rounded-xl bg-gray-800/50 hover:bg-gray-800 transition-colors"
    >
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-sm font-medium">{title}</span>
    </motion.button>
  )

  export default QuickAction