import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
import {
  Download,
  File,
  FileText,
  ImageIcon,
  Music,
  Video,
  Loader2,
  UserCircle,
  Calendar,
  Shield,
} from "lucide-react";
import API from "../helper/api";
import { getMimeType } from "../helper/types";

const SharedFile = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const fileId = queryParams.get("fileId");
  const recipient = queryParams.get("recipient");
  const owner = queryParams.get("owner");
  const id = queryParams.get("id");

  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchFile = async () => {
      setLoading(true);
      try {
        const response = await API.get(`/api/files/${id}/${fileId}/${recipient}`);

        if (response.data.success) {
          setFileData(response.data);
        } else {
          setError(response.data.message);
        }
      } catch (err) {
        console.log(err)
        setError("Error fetching the file.");
      } finally {
        setLoading(false);
      }
    };

    if (fileId && recipient) {
      fetchFile();
    }
  }, [fileId, recipient, id]);

  const handleDownload = async () => {
    if (!fileData) return;

    try {
      setDownloading(true);
      const res = await API.post(`/api/files/download`, {
        cid: fileData.cid,
        address: owner,
        fileId: fileId,
      });

      const encryptedWordArray = CryptoJS.lib.WordArray.create(res.data);
     
      // Step 2: Decrypt using AES
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedWordArray },
        CryptoJS.enc.Hex.parse(fileData.aesKey),
        {
          iv: CryptoJS.enc.Hex.parse(fileData.aesIv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }
      );
     
      // Step 3: Convert WordArray to Uint8Array
      const decryptedBytes = new Uint8Array(decrypted.sigBytes);
      for (let i = 0; i < decrypted.sigBytes; i++) {
        decryptedBytes[i] =
          (decrypted.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
      }
      // Step 4: Create Blob and trigger download
      const mimeType = getMimeType(fileData.filename) || "application/octet-stream";
      const blob = new Blob([decryptedBytes], { type: mimeType });
     
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileData.filename || "decrypted_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (error) {
      setError(error.message || "Error downloading file");
    } finally {
      setDownloading(false);
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case "image":
        return <ImageIcon className="w-8 h-8 text-pink-400" />;
      case "document":
        return <FileText className="w-8 h-8 text-blue-400" />;
      case "video":
        return <Video className="w-8 h-8 text-green-400" />;
      case "audio":
        return <Music className="w-8 h-8 text-yellow-400" />;
      default:
        return <File className="w-8 h-8 text-purple-400" />;
    }
  };

  const getFileColorClass = (type) => {
    switch (type) {
      case "image": return "from-pink-900/40 to-pink-800/10 border-pink-700/50";
      case "document": return "from-blue-900/40 to-blue-800/10 border-blue-700/50";
      case "video": return "from-green-900/40 to-green-800/10 border-green-700/50";
      case "audio": return "from-yellow-900/40 to-yellow-800/10 border-yellow-700/50";
      default: return "from-purple-900/40 to-purple-800/10 border-purple-700/50";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Secure File Share</h1>
          <p className="text-gray-400 mt-3">
            Access and download your encrypted shared file
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative"
        >
          {/* Decorative background elements */}
          <div className="absolute -top-10 -left-10 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-2xl overflow-hidden">
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Loader2 className="w-10 h-10 text-purple-500" />
                </motion.div>
                <p className="mt-4 text-gray-300">Fetching your shared file...</p>
              </div>
            ) : error ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16 px-6"
              >
                <div className="bg-red-500/10 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-red-400 mb-2">Access Error</h3>
                <p className="text-gray-400 max-w-md mx-auto">{error}</p>
              </motion.div>
            ) : fileData ? (
              <div>
                {/* Header with gradient based on file type */}
                <div className={`bg-gradient-to-r ${fileData.type === 'image' ? 'from-pink-600/20 to-purple-600/20' : 
                                                    fileData.type === 'document' ? 'from-blue-600/20 to-cyan-600/20' : 
                                                    fileData.type === 'video' ? 'from-green-600/20 to-emerald-600/20' : 
                                                    fileData.type === 'audio' ? 'from-yellow-600/20 to-amber-600/20' : 
                                                    'from-purple-600/20 to-violet-600/20'} px-8 py-6`}>
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium">Shared with you</h2>
                    <div className="flex items-center gap-2">
                      <UserCircle className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">From: {owner?.slice(0, 6)}...{owner?.slice(-4)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  {/* File info card */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className={`bg-gradient-to-br ${getFileColorClass(fileData.type)} border rounded-xl p-6 mb-8`}
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 rounded-xl bg-gray-800/50 backdrop-blur flex items-center justify-center">
                        {getFileIcon(fileData.type)}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-white mb-1">
                          {fileData.name}
                        </h2>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-gray-300 flex items-center gap-1 capitalize">
                            <File className="w-4 h-4" /> {fileData.type}
                          </span>
                          <span className="text-gray-300 flex items-center gap-1">
                            <Calendar className="w-4 h-4" /> {new Date().toLocaleDateString()}
                          </span>
                          <span className="text-gray-300">
                            {fileData.size}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Download button */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="flex justify-center"
                  >
                    <button
                      onClick={handleDownload}
                      disabled={downloading}
                      className={`flex items-center justify-center gap-2 w-full max-w-md px-6 py-4 rounded-lg text-white font-medium transition-all duration-300 ${
                        downloading ? 'bg-gray-700 cursor-not-allowed' : `bg-gradient-to-r 
                        ${fileData.type === 'image' ? 'from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500' : 
                          fileData.type === 'document' ? 'from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500' : 
                          fileData.type === 'video' ? 'from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500' : 
                          fileData.type === 'audio' ? 'from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500' : 
                          'from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500'}`
                      } shadow-lg hover:shadow-xl transform hover:-translate-y-1`}
                    >
                      {downloading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Decrypting & Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-5 h-5" />
                          <span>Download Secure File</span>
                        </>
                      )}
                    </button>
                  </motion.div>
                  
                  {/* Security notice */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 text-center"
                  >
                    <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                      <Shield className="w-4 h-4" /> End-to-end encrypted transfer
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 px-6">
                <p className="text-gray-400">No file data available</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SharedFile;