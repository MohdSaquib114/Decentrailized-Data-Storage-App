import { motion } from "framer-motion";
import CryptoJS from "crypto-js";
import { useContext, useState } from "react";
import {
  ChevronRight,
  Download,
  File,
  FileText,
  Filter,
  ImageIcon,
  Music,
  Search,
  Share2,
  Trash2,
  Video,
  Loader2,
} from "lucide-react";
import API from "../helper/api";
import {  Context } from "../context/Context";
import { getMimeType } from "../helper/types";

export default function StoredFiles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [downloading, setDownloaing] = useState(false);

  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedFile, setSelectedFile] = useState(null);
  const { showNotification, user, files, fetching, setFiles,setDownloads } =
    useContext(Context);
  const [sharing, setSharing] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [shareAddress, setShareAddress] = useState("");
  const [fileToShare, setFileToShare] = useState(null);

  const filteredFiles = files
    ?.filter((file) =>
      file?.filename?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((file) => selectedType === "all" || file?.type === selectedType)
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc"
          ? a?.filename?.localeCompare(b?.filename)
          : b?.filename?.localeCompare(a?.filename);
      } else if (sortBy === "size") {
        const sizeA = Number.parseFloat(a?.size.split(" ")[0]);
        const sizeB = Number.parseFloat(b?.size.split(" ")[0]);
        return sortOrder === "asc" ? sizeA - sizeB : sizeB - sizeA;
      } else {
        // Sort by date
        const dateA = new Date(a?.date);
        const dateB = new Date(b?.date);
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  const handleDelete = (id) => {
    setFiles(files.filter((file) => file.id !== id));
    showNotification("File deleted successfully");
  };

  const handleDownload = async (file) => {
    try {
      setDownloaing(true);
      setSelectedFile(file);
      console.log(file);
      const res = await API.post(
        "/api/files/download",
        {
          cid: file.cid,
          address: user.address,
          fileId: file.fileIdNum,
        },
        { responseType: "arraybuffer" }
      );
      // Step 1: Convert arraybuffer to WordArray
      const encryptedWordArray = CryptoJS.lib.WordArray.create(res.data);

      // Step 2: Decrypt using AES
      const decrypted = CryptoJS.AES.decrypt(
        { ciphertext: encryptedWordArray },
        CryptoJS.enc.Hex.parse(file.aesKey),
        {
          iv: CryptoJS.enc.Hex.parse(file.aesIv),
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
      const mimeType = getMimeType(file.filename) || "application/octet-stream";
      const blob = new Blob([decryptedBytes], { type: mimeType });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.filename || "decrypted_file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setDownloads(prev=> prev+1)
    } catch (error) {
      showNotification(error.message, error);
    } finally {
      setDownloaing(false);
      setSelectedFile(null);
    }
  };

  const handleShare = (file) => {
    setFileToShare(file);
    setShareAddress("");
    setIsShareDialogOpen(true);
    setSharing(false);
  };

  const confirmShare = async () => {
    setSharing(true);
    if (!shareAddress || !fileToShare) {
      showNotification(
        "Please enter a valid address and select a file.",
        "error"
      );
      cancel();
      return;
    }
    if (!/^0x[a-fA-F0-9]{40}$/.test(shareAddress)) {
      showNotification("Invalid Ethereum address format.", "error");
      cancel();
      return;
    }
    try {
      // Call backend to handle the actual file sharing logic
      const response = await API.post("/api/files/share", {
        fileId: fileToShare.fileIdNum,
        recipientAddress: shareAddress,
        senderAddress: user.address,
      });

      if (response.status === 200) {
        // Generate a shareable URL based on the file ID and recipient address
        const shareUrl = `${window.location.origin}/shared-file?fileId=${fileToShare.fileIdNum}&id=${fileToShare.id}&recipient=${shareAddress}&owner=${user.address}`;

        // Copy the URL to clipboard
        navigator.clipboard
          .writeText(shareUrl)
          .then(() => {
            showNotification(
              `File shared. The link has been copied to your clipboard.`
            );
          })
          .catch((err) => {
            console.error("Failed to copy to clipboard: ", err);
            showNotification(
              "File shared, but failed to copy link to clipboard.",
              "error"
            );
          });
      } else {
        showNotification("Failed to share file. Please try again.", "error");
      }
    } catch (error) {
      console.error(error);
      showNotification(
        "Something went wrong while sharing the file.",
        error.message
      );
    } finally {
      setIsShareDialogOpen(false); // Close the share dialog
      setSharing(false);
    }
  };

  const cancel = () => {
    setSharing(false);
    setShareAddress("");
    setIsShareDialogOpen(false);
  };
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">My Files</h1>
        <p className="text-gray-400 mt-2">
          Browse and manage your stored files.
        </p>
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
              <button
                onClick={toggleSortOrder}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    sortOrder === "asc" ? "rotate-90" : "-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
        {fetching ? (
          <div className=" flex justify-center py-10 gap-5 items-center ">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> Loading
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Size
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Date
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles?.length > 0 ? (
                  filteredFiles?.map((file) => (
                    <tr
                      key={file.fileId + file.filename + Math.random()}
                      className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center mr-3">
                            {file.type === "image" && (
                              <ImageIcon className="w-4 h-4 text-blue-400" />
                            )}
                            {file.type === "document" && (
                              <FileText className="w-4 h-4 text-purple-400" />
                            )}
                            {file.type === "video" && (
                              <Video className="w-4 h-4 text-green-400" />
                            )}
                            {file.type === "audio" && (
                              <Music className="w-4 h-4 text-yellow-400" />
                            )}
                            {file.type === "archive" && (
                              <File className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          <span className="font-medium">{file.filename}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400 capitalize">
                        {file.type}
                      </td>
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
                            onClick={() => handleDownload(file)}
                            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700"
                            title="Download"
                          >
                            {downloading && file.cid === selectedFile.cid ? (
                              <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                            ) : (
                              <Download className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => handleShare(file)}
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
        )}
      </motion.div>
      {/* Share Dialog */}
      {isShareDialogOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Share File</h3>
            <p className="text-gray-400 mb-4">
              Enter an Ethereum address to share this file with:
            </p>

            <input
              type="text"
              value={shareAddress}
              onChange={(e) => setShareAddress(e.target.value)}
              placeholder="0x..."
              className="w-full py-2 px-4 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:border-purple-500 transition-colors mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={cancel}
                className="px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmShare}
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition-colors"
              >
                {sharing ? (
                  <div className="flex gap-1 items-center ">
                    {" "}
                    <Loader2 className="w-5 h-5 text-white animate-spin" />{" "}
                    Sharing
                  </div>
                ) : (
                  <>Share</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
