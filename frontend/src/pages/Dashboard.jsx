import { useContext, useState, useEffect } from "react";
import {  Context } from "../context/Context";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Database,
  Upload,
  FolderOpen,
  Home,
  Settings,
  LogOut,
  
  Share2,
  
  ChevronRight,
  
  AlertCircle,
  CheckCircle2,
  X,
} from "lucide-react";

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
  {
    id: 6,
    name: "song-mix.mp3",
    type: "audio",
    size: "4.5 MB",
    date: "2023-04-20",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 7,
    name: "backup.zip",
    type: "archive",
    size: "156.3 MB",
    date: "2023-04-15",
    cid: "Qm...",
    status: "Stored",
  },
  {
    id: 8,
    name: "notes.txt",
    type: "document",
    size: "0.1 MB",
    date: "2023-04-10",
    cid: "Qm...",
    status: "Stored",
  },
];

export const mockActivity = [
  {
    id: 1,
    action: "Uploaded",
    file: "profile-photo.jpg",
    date: "2023-05-15 14:30",
  },
  {
    id: 2,
    action: "Shared",
    file: "project-proposal.pdf",
    date: "2023-05-14 09:45",
  },
  {
    id: 3,
    action: "Downloaded",
    file: "budget-2023.xlsx",
    date: "2023-05-12 16:20",
  },
  {
    id: 4,
    action: "Uploaded",
    file: "presentation.pptx",
    date: "2023-05-08 11:15",
  },
  { id: 5, action: "Deleted", file: "old-notes.txt", date: "2023-05-05 10:30" },
];

export default function Dashboard() {
  const { user, notification, setNotification, setUser, files } =
    useContext(Context);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Redirect to auth page if user is not logged in
  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const truncateAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

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
              notification.type === "success"
                ? "bg-green-500/90"
                : "bg-red-500/90"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="ml-2 text-white/80 hover:text-white"
            >
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
            <ChevronRight
              className={`w-5 h-5 transition-transform ${
                isSidebarOpen ? "rotate-180" : ""
              }`}
            />
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
          <div className="flex items-center gap-2 bg-gray-800/50 rounded-full px-4 py-2 border border-gray-700">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span className="text-sm font-medium hidden sm:inline">
              {truncateAddress(user.address)}
            </span>
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
                    label="Manage Access"
                    to="/dashboard/access"
                    active={location.pathname === "/dashboard/access"}
                  />
                </nav>

                <div className="pt-6 mt-6 border-t border-gray-800">
                  <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl border border-gray-700 mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium">Storage Used</h3>
                      <span className="text-xs text-gray-400">
                        200 MB / 1 GB
                      </span>
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
                      setUser(null);
                      navigate("/auth");
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
  );
}

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
            x: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
            y: [
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
              Math.random() * 100 + "%",
            ],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

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
    {active && (
      <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 ml-auto"></div>
    )}
  </motion.a>
);
