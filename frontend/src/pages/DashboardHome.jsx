

import { motion } from "framer-motion"
import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"
import {

  Upload,
  FolderOpen,
 
  HardDrive,
  FileText,
  Image,
  Video,
  Music,
  File,
  MoreVertical,
  Download,
  Trash2,
  Share2,
  
  Shield,
  ChevronRight,
  
} from "lucide-react"
import { mockActivity, mockFiles } from "./Dashboard"
import StatCard from "../components/StatCard"
import QuickAction from "../components/QuickAction"
import { getTotalSize } from "../helper/helper"

function DashboardHome() {
      const { files } = useContext(AuthContext)
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Manage your decentralized files with Ethereum & IPFS.</p>
        </motion.div>
  
        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="Total Files"
            value={files.length}
            icon={<FileText className="w-6 h-6 text-purple-400" />}
            change="+2 this week"
            positive={true}
          />
          <StatCard
            title="Storage Used"
            value={`${getTotalSize(files)} mb`}
            icon={<HardDrive className="w-6 h-6 text-blue-400" />}
            change="20% of quota"
          />
          <StatCard
            title="Shared Files"
            value="3"
            icon={<Share2 className="w-6 h-6 text-purple-400" />}
            change="+1 this week"
            positive={true}
          />
          <StatCard
            title="Downloads"
            value="12"
            icon={<Download className="w-6 h-6 text-blue-400" />}
            change="+5 this week"
            positive={true}
          />
        </motion.div>
  
        {/* Quick Actions and Storage Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickAction
                  icon={<Upload className="w-6 h-6 text-purple-400" />}
                  title="Upload File"
                  onClick={() => {
                    // Navigate to upload page
                    window.location.href = "/dashboard/upload"
                  }}
                />
                <QuickAction
                  icon={<FolderOpen className="w-6 h-6 text-blue-400" />}
                  title="Browse Files"
                  onClick={() => {
                    // Navigate to files page
                    window.location.href = "/dashboard/files"
                  }}
                />
                <QuickAction
                  icon={<Share2 className="w-6 h-6 text-purple-400" />}
                  title="Share Files"
                  onClick={() => {
                    // Navigate to shared page
                    window.location.href = "/dashboard/shared"
                  }}
                />
                <QuickAction
                  icon={<Shield className="w-6 h-6 text-blue-400" />}
                  title="Security"
                 
                />
              </div>
            </div>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6 h-full">
              <h2 className="text-xl font-bold mb-4">Storage Overview</h2>
              <div className="flex items-center justify-center h-48">
                <div className="relative w-36 h-36">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#374151"
                      strokeWidth="3"
                      strokeDasharray="100, 100"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="3"
                      strokeDasharray="20, 100"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold">20%</span>
                    <span className="text-xs text-gray-400">Used</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
                    <span className="text-sm text-gray-300">Used Space</span>
                  </div>
                  <span className="text-sm font-medium">200 MB</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                    <span className="text-sm text-gray-300">Free Space</span>
                  </div>
                  <span className="text-sm font-medium">800 MB</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
  
        {/* Recent Files and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Files</h2>
                <button
                  onClick={() => (window.location.href = "/dashboard/files")}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {mockFiles.slice(0, 4).map((file) => (
                  <div key={file.id} className="flex items-center p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4">
                      {file.type === "image" && <Image className="w-5 h-5 text-blue-400" />}
                      {file.type === "document" && <FileText className="w-5 h-5 text-purple-400" />}
                      {file.type === "video" && <Video className="w-5 h-5 text-green-400" />}
                      {file.type === "audio" && <Music className="w-5 h-5 text-yellow-400" />}
                      {file.type === "archive" && <File className="w-5 h-5 text-gray-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate">{file.name}</h3>
                      <p className="text-xs text-gray-400">
                        {file.size} • {file.date}
                      </p>
                    </div>
                    <button className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Recent Activity</h2>
                <button
                  onClick={() => (window.location.href = "/dashboard/activity")}
                  className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                {mockActivity.slice(0, 4).map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                      {activity.action === "Uploaded" && <Upload className="w-5 h-5 text-green-400" />}
                      {activity.action === "Downloaded" && <Download className="w-5 h-5 text-blue-400" />}
                      {activity.action === "Shared" && <Share2 className="w-5 h-5 text-purple-400" />}
                      {activity.action === "Deleted" && <Trash2 className="w-5 h-5 text-red-400" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">
                        <span className="text-gray-300">{activity.action}</span> {activity.file}
                      </h3>
                      <p className="text-xs text-gray-400">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }


  export default DashboardHome