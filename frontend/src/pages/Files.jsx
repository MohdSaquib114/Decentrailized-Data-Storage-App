import  {motion} from "framer-motion"
import { mockFiles } from "./Dashboard"
import { useContext, useEffect, useState } from "react"
import { ChevronRight, Download, File, FileText, Filter, Image, Music, Search, Share2, Trash2, Video } from "lucide-react"
import API from "../helper/api"
import { AuthContext } from "../context/AuthContext"

export default function StoredFiles() {
    const [files, setFiles] = useState(mockFiles)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedType, setSelectedType] = useState("all")
    const [sortBy, setSortBy] = useState("date")
    const [sortOrder, setSortOrder] = useState("desc")
    const { showNotification,user } = useContext(AuthContext)
    
    useEffect(()=>{
        const fetchFiles = async () => {
            try {
                const {data} = await API.get(`/api/files/${user.address}`)
                const filesWithDate = data.files.map(file => ({
                  ...file,
                  date: new Date(file.createdAt).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  }),
                }));
                console.log(filesWithDate)
                setFiles(filesWithDate);
            } catch (error) {
                console.error(error);
                 showNotification("Something went wrong.", "error");
            }
             
        }
        fetchFiles()
    },[user,showNotification])
    
    const filteredFiles = files
      .filter((file) => file?.filename?.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((file) => selectedType === "all" || file?.type === selectedType)
      .sort((a, b) => {
        if (sortBy === "name") {
          return sortOrder === "asc" ? a?.filename?.localeCompare(b?.filename) : b?.filename?.localeCompare(a?.filename)
        } else if (sortBy === "size") {
          const sizeA = Number.parseFloat(a?.size.split(" ")[0])
          const sizeB = Number.parseFloat(b?.size.split(" ")[0])
          return sortOrder === "asc" ? sizeA - sizeB : sizeB - sizeA
        } else {
          // Sort by date
          const dateA = new Date(a?.date)
          const dateB = new Date(b?.date)
          return sortOrder === "asc" ? dateA - dateB : dateB - dateA
        }
      })
  
    const handleDelete = (id) => {
      setFiles(files.filter((file) => file.id !== id))
      showNotification("File deleted successfully")
    }
  
    const handleDownload = (id) => {
      // Simulate download
      showNotification("File download started")
    }
  
    const handleShare = (id) => {
      // Simulate share
      showNotification("Sharing link copied to clipboard")
    }
  
    const toggleSortOrder = () => {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    }
  
    return (
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">My Files</h1>
          <p className="text-gray-400 mt-2">Browse and manage your stored files.</p>
        </motion.div>
  
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search files..."
                className="w-full py-2 px-4 pl-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <select
                  className="appearance-none py-2 px-4 pr-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="image">Images</option>
                  <option value="document">Documents</option>
                  <option value="video">Videos</option>
                  <option value="audio">Audio</option>
                  <option value="archive">Archives</option>
                </select>
                <Filter className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
              </div>
  
              <div className="relative">
                <select
                  className="appearance-none py-2 px-4 pr-10 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Sort by Date</option>
                  <option value="name">Sort by Name</option>
                  <option value="size">Sort by Size</option>
                </select>
                <button onClick={toggleSortOrder} className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <ChevronRight
                    className={`w-4 h-4 text-gray-400 transition-transform ${sortOrder === "asc" ? "rotate-90" : "-rotate-90"}`}
                  />
                </button>
              </div>
            </div>
          </div>
  
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Size</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.length > 0 ? (
                  filteredFiles.map((file) => (
                    <tr key={file.fileId} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                            {file.type === "image" && <Image className="w-4 h-4 text-blue-400" />}
                            {file.type === "document" && <FileText className="w-4 h-4 text-purple-400" />}
                            {file.type === "video" && <Video className="w-4 h-4 text-green-400" />}
                            {file.type === "audio" && <Music className="w-4 h-4 text-yellow-400" />}
                            {file.type === "archive" && <File className="w-4 h-4 text-gray-400" />}
                          </div>
                          <span className="font-medium">{file.filename}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 capitalize">{file.type}</td>
                      <td className="py-3 px-4 text-gray-400">{file.size}</td>
                      {/* <td className="py-3 px-4 text-gray-400">{file.date}</td> */}
                      {/* <td className="py-3 px-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                          {file.status}
                        </span>
                      </td> */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleDownload(file.id)}
                            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleShare(file.id)}
                            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                            title="Share"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="p-2 text-gray-400 hover:text-red-400 rounded-full hover:bg-gray-700"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      No files found matching your criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    )
  }
  