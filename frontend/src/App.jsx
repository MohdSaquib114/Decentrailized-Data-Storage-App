import React from 'react'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard, {DashboardHome} from './pages/Dashboard';
import UploadFiles from './pages/UploadFiles';
import StoredFiles from './pages/Files';



export default function App() {
  return (
    // <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="upload" element={<UploadFiles />} />
          <Route path="files" element={<StoredFiles />} />
        </Route>
      </Routes>
    // </Router>
  )
}
