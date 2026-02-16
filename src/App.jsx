import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Certifications from './pages/Certifications'; // New main page
import Assessment from './pages/Assessment';
import Certificate from './pages/Certificate';
import MyCertificates from './pages/MyCertificates';
import Leaderboard from './pages/Leaderboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './components/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Prepare from './pages/Prepare';
import AdminDashboard from './pages/AdminDashboard';
import Roadmap from './pages/Roadmap';
import ResumeBuilder from './pages/ResumeBuilder';
import APIKeyModal from './components/APIKeyModal';
import { useState } from 'react';

function App() {
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);

  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar onOpenKeyModal={() => setIsKeyModalOpen(true)} />
          <APIKeyModal isOpen={isKeyModalOpen} onClose={() => setIsKeyModalOpen(false)} />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              {/* <Route path="/signup" element={<Signup />} /> */}

              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Certifications />
                </ProtectedRoute>
              } />
              <Route path="/prepare/:certId" element={
                <ProtectedRoute>
                  <Prepare />
                </ProtectedRoute>
              } />
              <Route path="/assessment/:certId" element={
                <ProtectedRoute>
                  <Assessment />
                </ProtectedRoute>
              } />
              <Route path="/certificate/:certId" element={
                <ProtectedRoute>
                  <Certificate />
                </ProtectedRoute>
              } />
              <Route path="/my-certificates" element={
                <ProtectedRoute>
                  <MyCertificates />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/roadmap" element={
                <ProtectedRoute>
                  <Roadmap />
                </ProtectedRoute>
              } />
              <Route path="/resume" element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

