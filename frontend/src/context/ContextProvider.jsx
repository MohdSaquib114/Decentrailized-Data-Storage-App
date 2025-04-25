import API from "../helper/api";
import {  Context } from "./Context";
import { useEffect, useState } from "react";

export const Provider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("etherstore-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [notification, setNotification] = useState(null);
  const [files, setFiles] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [downloads, setDownloads] = useState(0);
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };
  useEffect(() => {
    if (user) {
      localStorage.setItem("etherstore-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("etherstore-user");
    }
  }, [user]);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!user?.address) return;
      setFetching(true);
      try {
        const { data } = await API.get(`/api/files/${user.address}`);

        const filesWithDate = data.data?.map((file) => ({
          ...file,
          date: new Date(file.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
        }));

        const res = await API.get(`/api/files/access-list/${user.address}`);

        const filesWithAccessList = filesWithDate.map((file) => {
          const accessInfo = res.data.filesWithAccessList.find(
            (entry) => entry.fileId === String(file.fileIdNum)
          );
          return {
            ...file,
            accessList: accessInfo ? accessInfo.accessList : [],
          };
        });
        setFiles(filesWithAccessList);
      } catch (error) {
        console.error(error);
        showNotification("Something went wrong.", "error");
      } finally {
        setFetching(false);
      }
    };
    fetchFiles();
  }, [user]);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        notification,
        setNotification,
        showNotification,
        files,
        setFiles,
        fetching,
        downloads,
        setDownloads,
      }}
    >
      {children}
    </Context.Provider>
  );
};
