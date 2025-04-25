import { motion } from "framer-motion";
import { useCallback, useContext, useEffect, useState } from "react";
import {
  Loader2,
  AlertCircle,
  RefreshCcw,
  ImageIcon,
  FileText,
} from "lucide-react";
import API from "../helper/api";
import {  Context } from "../context/Context";

export default function AccessManagement() {
  const [changing, setChanging] = useState(true);
  const [fileID, setFileID] = useState(null);
  const { showNotification, files, fetching } = useContext(Context);

  const handleRevokeAccess = async (fileId, address) => {
    try {
      setFileID(fileID);
      setChanging(true);
      const { data } = await API.post(`/api/files/change-permission`, {
        fileId: fileId,
        user: address,
      });

      showNotification(data.message);
    } catch (error) {
      console.log(error);
      showNotification("Something went wrong", "error");
    } finally {
      setFileID(fileID);
      setChanging(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold">Access Management</h1>
        <p className="text-gray-400 mt-2">
          Manage user access to your secured files.
        </p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-gradient-to-br from-gray-900 to-black rounded-xl border border-gray-800 shadow-xl p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-6"></div>

        <div className="bg-gray-800/30 rounded-lg p-4 flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-400" />
            <span className="text-gray-300">
              Manage who has access to your encrypted files
            </span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 flex items-center gap-1"
            title="Refresh list"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {fetching ? (
          <div className="flex justify-center py-10 gap-5 items-center">
            <Loader2 className="w-5 h-5 text-blue-500 animate-spin" /> Loading
            Access List
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    File ID
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Name
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Size
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-400">
                    Access List
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.length > 0 ? (
                  files.map((file) => {
                    if (!file.accessList || file.accessList.length === 0)
                      return null;

                    return (
                      <tr
                        key={file.fileIdNum}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-3 px-4 text-gray-300">
                          {file.fileIdNum}
                        </td>
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
                        <td className="py-3 px-4 text-gray-400">{file.size}</td>
                        <td className="py-3 px-4 text-gray-400 capitalize">
                          {file.type}
                        </td>
                        <td className="py-3 px-4">
                          <div className="max-h-28 overflow-y-auto pr-2 space-y-1">
                            {file.accessList.map((address, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm bg-gray-900 px-2 py-1 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                  <span className="text-gray-300">
                                    {address.slice(0, 6)}...{address.slice(-4)}
                                  </span>
                                </div>
                                <button
                                  onClick={() =>
                                    handleRevokeAccess(file.fileIdNum, address)
                                  }
                                  className="text-red-400 hover:text-red-500 text-xs"
                                >
                                  {changing && fileID === file.fileId ? (
                                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                                  ) : (
                                    "Change Permission"
                                  )}
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
    </div>
  );
}
