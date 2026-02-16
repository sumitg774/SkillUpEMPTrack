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
            {/* Global Promotion Banner / Ad Spot */}
            <div style={{ padding: '1rem 2rem 0', maxWidth: '1200px', margin: '0 auto' }}>
              <div style={globalBannerStyle}>
                <span style={pillStyle}>Featured</span>
                <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>🚀 Unlock Unlimited AI Resume Reviews & Roadmap Generations for $4.99/mo!</span>
                <button style={bannerBtnStyle}>Upgrade Now</button>
              </div>
            </div>

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

const globalBannerStyle = {
  background: 'linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(168,85,247,0.1) 100%)',
  border: '1px solid rgba(255,255,255,0.05)',
  borderRadius: '16px',
  padding: '0.8rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem',
  backdropFilter: 'blur(10px)'
};

const pillStyle = {
  background: 'var(--color-secondary)',
  color: 'black',
  padding: '0.2rem 0.6rem',
  borderRadius: '6px',
  fontSize: '0.7rem',
  fontWeight: '800',
  textTransform: 'uppercase'
};

const bannerBtnStyle = {
  background: 'white',
  color: 'black',
  border: 'none',
  padding: '0.5rem 1rem',
  borderRadius: '8px',
  fontSize: '0.8rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'transform 0.2s'
};
