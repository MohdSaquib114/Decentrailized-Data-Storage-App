
import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../context/AuthContext"
import { useNavigate, useLocation, Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Database,
  Upload,
  FolderOpen,
  Home,
  Settings,
  LogOut,
  Search,
  Filter,
  Clock,
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
  Lock,
  Shield,
  ChevronRight,
  BarChart3,
  PieChart,

  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react"

// Mock data for demonstration
export const mockFiles = [
  {
    id: 1,
    name: "profile-photo.jpg",
    type: "image",
    size: "2.4 MB",
    date: "2023-05-15",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 2,
    name: "project-proposal.pdf",
    type: "document",
    size: "1.8 MB",
    date: "2023-05-10",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 3,
    name: "presentation.pptx",
    type: "document",
    size: "5.2 MB",
    date: "2023-05-08",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 4,
    name: "budget-2023.xlsx",
    type: "document",
    size: "0.9 MB",
    date: "2023-05-05",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 5,
    name: "vacation-video.mp4",
    type: "video",
    size: "28.7 MB",
    date: "2023-04-28",
    cid: "Qm...",
    status: "Stored",
  },
  { id: 6, name: "song-mix.mp3", type: "audio", size: "4.5 MB", date: "2023-04-20", cid: "Qm...", status: "Stored" },
  { id: 7, name: "backup.zip", type: "archive", size: "156.3 MB", date: "2023-04-15", cid: "Qm...", status: "Stored" },
  { id: 8, name: "notes.txt", type: "document", size: "0.1 MB", date: "2023-04-10", cid: "Qm...", status: "Stored" },
]

const mockActivity = [
  { id: 1, action: "Uploaded", file: "profile-photo.jpg", date: "2023-05-15 14:30" },
  { id: 2, action: "Shared", file: "project-proposal.pdf", date: "2023-05-14 09:45" },
  { id: 3, action: "Downloaded", file: "budget-2023.xlsx", date: "2023-05-12 16:20" },
  { id: 4, action: "Uploaded", file: "presentation.pptx", date: "2023-05-08 11:15" },
  { id: 5, action: "Deleted", file: "old-notes.txt", date: "2023-05-05 10:30" },
]

export default function Dashboard() {
  const { user,notification,setNotification,setUser } = useContext(AuthContext)
  const navigate = useNavigate()
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)


  // Redirect to auth page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth")
    }
  }, [user, navigate])

  if (!user) {
    return null
  }

  

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
              notification.type === "success" ? "bg-green-500/90" : "bg-red-500/90"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 py-3 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-4 p-2 rounded-lg hover:bg-gray-800 md:hidden"
          >
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarOpen ? "rotate-180" : ""}`} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              EtherStore
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="Search files..."
              className="w-64 py-2 px-4 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium hidden sm:inline">{truncateAddress(user.address)}</span>
          </div>

          <button
            onClick={() => navigate("/settings")}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.3 }}
              className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-gray-800 flex-shrink-0 overflow-y-auto fixed md:relative h-[calc(100vh-60px)] z-40"
            >
              <div className="p-6 flex flex-col h-full">
                <nav className="space-y-1 flex-1">
                  <NavItem
                    icon={<Home className="w-5 h-5" />}
                    label="Dashboard"
                    to="/dashboard"
                    active={location.pathname === "/dashboard"}
                  />
                  <NavItem
                    icon={<Upload className="w-5 h-5" />}
                    label="Upload Files"
                    to="/dashboard/upload"
                    active={location.pathname === "/dashboard/upload"}
                  />
                  <NavItem
                    icon={<FolderOpen className="w-5 h-5" />}
                    label="My Files"
                    to="/dashboard/files"
                    active={location.pathname === "/dashboard/files"}
                  />
                  <NavItem
                    icon={<Share2 className="w-5 h-5" />}
                    label="Shared Files"
                    to="/dashboard/shared"
                    active={location.pathname === "/dashboard/shared"}
                  />
                  <NavItem
                    icon={<Clock className="w-5 h-5" />}
                    label="Recent Activity"
                    to="/dashboard/activity"
                    active={location.pathname === "/dashboard/activity"}
                  />
                  <NavItem
                    icon={<BarChart3 className="w-5 h-5" />}
                    label="Analytics"
                    to="/dashboard/analytics"
                    active={location.pathname === "/dashboard/analytics"}
                  />
                </nav>

                <div className="pt-6 mt-6 border-t border-gray-800">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Storage Used</h3>
                      <span className="text-xs text-gray-400">200 MB / 1 GB</span>
                    </div>
                    <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                        style={{ width: "20%" }}
                      ></div>
                    </div>
                    <button className="mt-3 text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1">
                      Upgrade Storage
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      // Handle logout
                      setUser(null)
                      navigate("/auth")
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

// Dashboard Home Component
export function DashboardHome() {
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
          value="8"
          icon={<FileText className="w-6 h-6 text-purple-400" />}
          change="+2 this week"
          positive={true}
        />
        <StatCard
          title="Storage Used"
          value="200 MB"
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

// Stored Files Component

// Shared Files Component (Placeholder)
function SharedFiles() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Shared Files</h1>
        <p className="text-gray-400 mt-2">Manage files shared with you and by you.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-12 text-center"
      >
        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Shared Files Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We're working on secure file sharing features. Check back soon for updates!
        </p>
      </motion.div>
    </div>
  )
}

// Activity Log Component (Placeholder)
function ActivityLog() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Activity Log</h1>
        <p className="text-gray-400 mt-2">Track all actions performed on your account.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6 mb-8"
      >
        <h2 className="text-xl font-bold mb-6">Recent Activity</h2>

        <div className="space-y-6">
          {mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start p-4 rounded-lg bg-gray-800/50">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mr-4">
                {activity.action === "Uploaded" && <Upload className="w-5 h-5 text-green-400" />}
                {activity.action === "Downloaded" && <Download className="w-5 h-5 text-blue-400" />}
                {activity.action === "Shared" && <Share2 className="w-5 h-5 text-purple-400" />}
                {activity.action === "Deleted" && <Trash2 className="w-5 h-5 text-red-400" />}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium">
                  <span className="text-gray-300">{activity.action}</span> {activity.file}
                </h3>
                <p className="text-xs text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

// Analytics Component (Placeholder)
function Analytics() {
  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-400 mt-2">Insights about your storage usage and activity.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-12 text-center"
      >
        <PieChart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Analytics Coming Soon</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          We're building powerful analytics tools to help you understand your storage usage patterns.
        </p>
      </motion.div>
    </div>
  )
}

// Reusable Components

const ParticleBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-purple-500/20"
          initial={{
            x: Math.random() * 100 + "%",
            y: Math.random() * 100 + "%",
            opacity: Math.random() * 0.5 + 0.3,
          }}
          animate={{
            x: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
            y: [Math.random() * 100 + "%", Math.random() * 100 + "%", Math.random() * 100 + "%"],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  )
}

const NavItem = ({ icon, label, to, active }) => (
  <motion.a
    whileHover={{ x: 5 }}
    href={to}
    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
      active
        ? "bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`}
  >
    {icon}
    <span>{label}</span>
    {active && <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 ml-auto"></div>}
  </motion.a>
)

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

