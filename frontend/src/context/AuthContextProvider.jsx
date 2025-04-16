import { AuthContext } from "./AuthContext";
import { useEffect, useState } from "react";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("etherstore-user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type = "success") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 5000)
  } 
  useEffect(() => {
    if (user) {
      localStorage.setItem("etherstore-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("etherstore-user");
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser,showNotification,notification,setNotification }}>
      {children}
    </AuthContext.Provider>
  );
};
