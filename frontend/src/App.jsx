import React from 'react'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import UploadFiles from './pages/UploadFiles';
import StoredFiles from './pages/Files';
import SharedFile from './pages/SharedFile';
import AccessManagement from './pages/AccessList';
import DashboardHome from './pages/DashboardHome';



export default function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/shared-file" element={<SharedFile/>} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadFiles />} />
          <Route path="files" element={<StoredFiles />} />
          <Route path="access" element={<AccessManagement />} />
        </Route>
      </Routes>
    // </Router>
  )
}
