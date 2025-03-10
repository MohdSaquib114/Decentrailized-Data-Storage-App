import React from 'react'
import { Routes, Route } from "react-router-dom";
import Landing from './pages/Landing';
import Auth from './pages/Auth';
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      {/* <Route path="/upload" element={<Upload />} /> */}
    </Routes>
  )
}
