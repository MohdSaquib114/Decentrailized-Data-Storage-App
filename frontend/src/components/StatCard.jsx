
import { motion } from "framer-motion"
const StatCard = ({ title, value, icon, change, positive }) => (
  <motion.div
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
    className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6"
  >
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
        {icon}
      </div>
      {change && (
        <span
          className={`text-xs px-2 py-1 rounded-full ${positive ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}
        >
          {change}
        </span>
      )}
    </div>
    <h3 className="text-sm font-medium text-gray-400 mb-1">{title}</h3>
    <p className="text-2xl font-bold">{value}</p>
  </motion.div>
)
export default StatCard