import { useContext, useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import { motion } from "framer-motion";
import {
  File,
  FileText,
  Image,
  Music,
  Upload,
  Video,
  RefreshCw,
} from "lucide-react";
import { Context } from "../context/Context";
import { useNavigate } from "react-router-dom";
import API from "../helper/api";
export default function UploadFiles() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { showNotification, user } = useContext(Context);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files[0]);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files[0]);
  };

  const handleFiles = (file) => {
    setSelectedFiles({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.type),
      progress: 0,
      status: "Ready",
    });
  };

  const MAX_FILE_SIZE_MB = 10;

  const uploadFiles = async () => {
    if (!selectedFiles) return;

    if (selectedFiles.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      showNotification("File size exceeds 10MB limit", "error");
      return;
    }

    setUploading(true);

    setSelectedFiles((prev) => {
      return { ...prev, status: "uploading" };
    });

    const uploadToBackend = async () => {
      try {
        const arrayBuffer = await selectedFiles.file.arrayBuffer();
        const fileData = new Uint8Array(arrayBuffer);

        // Convert Uint8Array to WordArray (for CryptoJS compatibility)
        const wordArray = CryptoJS.lib.WordArray.create(fileData);

        // Generate random AES key (256-bit) and IV (128-bit)
        const key = CryptoJS.lib.WordArray.random(32); // 32 bytes = 256 bits
        const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes = 128 bits

        // Encrypt the file data using AES-256-CBC
        const encrypted = CryptoJS.AES.encrypt(wordArray, key, {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        });

        // Convert encrypted data to a Blob
        const encryptedData = CryptoJS.enc.Base64.parse(encrypted.toString()); // get Base64 raw bytes
        const encryptedBytes = new Uint8Array(
          Array.from(encryptedData.words).flatMap((word) => [
            (word >> 24) & 0xff,
            (word >> 16) & 0xff,
            (word >> 8) & 0xff,
            word & 0xff,
          ])
        );
        const encryptedBlob = new Blob([encryptedBytes], {
          type: selectedFiles.type,
        });

        // Prepare form data
        const formData = new FormData();
        formData.append("file", encryptedBlob, selectedFiles.name);
        formData.append("address", user.address);
        formData.append("key", key.toString(CryptoJS.enc.Hex)); // securely store as hex
        formData.append("iv", iv.toString(CryptoJS.enc.Hex)); // securely store as hex
        formData.append("size", selectedFiles.size);
        formData.append("type", selectedFiles.type);
        // Send to backend
        const response = await API.post("/api/files/upload", formData);

        console.log("Uploaded to IPFS, CID:", response.data.cid);
      } catch (err) {
        console.error(err);
        showNotification("Upload failed. Please try again.", "error");
        setSelectedFiles(null);
      }
    };
    await uploadToBackend();

    // Mark upload complete
    setSelectedFiles((prev) => {
      return { ...prev, status: "completed" };
    });

    showNotification(
      `File "${selectedFiles.name}" successfully uploaded to IPFS`
    );

    setUploading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getFileType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.includes("pdf")) return "document";
    if (
      mimeType.includes("word") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    )
      return "document";
    if (mimeType.includes("zip") || mimeType.includes("archive"))
      return "archive";
    return "file";
  };

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Upload Files</h1>
        <p className="text-gray-400 mt-2">
          Securely store your files on IPFS with Ethereum verification.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8"
      >
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center ${
            isDragging
              ? "border-purple-500 bg-purple-500/10"
              : "border-gray-700 hover:border-purple-500/50 hover:bg-gray-800/20"
          } transition-colors`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center py-6">
            <Upload className="w-16 h-16 text-gray-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Drag & Drop Files Here</h3>
            <p className="text-gray-400 mb-4">or click to browse your device</p>
            <input
              type="file"
              multiple
              className="hidden"
              id="file-upload"
              onChange={handleFileSelect}
            />
            <label
              htmlFor="file-upload"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold shadow-lg hover:shadow-purple-500/20 transition-all duration-300 cursor-pointer"
            >
              Select Files
            </label>
          </div>
        </div>
      </motion.div>

      {selectedFiles && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Selected Files</h2>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedFiles(null)}
                  className="px-4 py-2 text-sm text-gray-300 hover:text-white bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                  disabled={uploading}
                >
                  Clear
                </button>
                <button
                  onClick={uploadFiles}
                  className="px-4 py-2 text-sm text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md hover:shadow-purple-500/20 transition-all duration-300 flex items-center gap-2"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {selectedFiles && (
                <div className="flex items-center p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-10 h-10 rounded-lg bg-gray-800 flex items-center justify-center mr-4">
                    {selectedFiles.type === "image" && (
                      <Image className="w-5 h-5 text-blue-400" />
                    )}
                    {selectedFiles.type === "document" && (
                      <FileText className="w-5 h-5 text-purple-400" />
                    )}
                    {selectedFiles.type === "video" && (
                      <Video className="w-5 h-5 text-green-400" />
                    )}
                    {selectedFiles.type === "audio" && (
                      <Music className="w-5 h-5 text-yellow-400" />
                    )}
                    {selectedFiles.type === "archive" && (
                      <File className="w-5 h-5 text-gray-400" />
                    )}
                    {selectedFiles.type === "file" && (
                      <File className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="text-sm font-medium truncate">
                      {selectedFiles.name}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {selectedFiles.size}
                    </p>
                  </div>
                  <div className="w-24 text-right mr-4">
                    <span
                      className={`text-xs font-medium ${
                        selectedFiles.status === "Completed"
                          ? "text-green-400"
                          : selectedFiles.status === "Uploading"
                          ? "text-blue-400"
                          : "text-gray-400"
                      }`}
                    >
                      {selectedFiles.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6">
          <h2 className="text-xl font-bold mb-6">Upload Information</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-purple-400">1</span>
                  </div>
                  <span className="text-gray-300">
                    Files are encrypted in your browser before upload
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-purple-400">2</span>
                  </div>
                  <span className="text-gray-300">
                    Encrypted data is stored on IPFS network
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-purple-400">3</span>
                  </div>
                  <span className="text-gray-300">
                    File references are stored on Ethereum blockchain
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="text-xs text-purple-400">4</span>
                  </div>
                  <span className="text-gray-300">
                    Only you can access your files with your wallet
                  </span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Supported File Types</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <Image className="w-5 h-5 text-blue-400" />
                  <span className="text-sm text-gray-300">
                    Images (JPG, PNG, GIF)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <span className="text-sm text-gray-300">
                    Documents (PDF, DOC)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <Video className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">
                    Videos (MP4, MOV)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <Music className="w-5 h-5 text-yellow-400" />
                  <span className="text-sm text-gray-300">
                    Audio (MP3, WAV)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <File className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-300">
                    Archives (ZIP, RAR)
                  </span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-gray-800/50 rounded-lg">
                  <File className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-300">Other Files</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
