import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import DonorDashboard from './pages/DonorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DonorList from './pages/DonorList';
import DonorDetail from './pages/DonorDetail';
import DonationList from './pages/DonationList';
import DonationCreate from './pages/DonationCreate';
import DonationDetail from './pages/DonationDetail';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Layout wrapper for authenticated pages
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="app-container">
      <Sidebar isOpen={sidebarOpen} />
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
        <main style={{ flex: 1 }}>
          <Routes>
            {/* Donor Routes */}
            <Route path="/dashboard" element={<DonorDashboard />} />
            
            {/* Admin Routes */}
            <Route element={<ProtectedRoute role="ADMIN" />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/donors" element={<DonorList />} />
              <Route path="/donors/:id" element={<DonorDetail />} />
            </Route>

            {/* Shared Authenticated Routes */}
            <Route path="/donations" element={<DonationList />} />
            <Route path="/donations/create" element={<DonationCreate />} />
            <Route path="/donations/:id" element={<DonationDetail />} />
            <Route path="/profile" element={<Profile />} />

            {/* Fallback inside authenticated app */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Root index router dispatching based on authentication & role
const RootRedirect = () => {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />;
};

function App() {
  return (
    <Router>
      <AlertProvider>
        <AuthProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Root dispatch */}
            <Route path="/" element={<RootRedirect />} />

            {/* Protected Application Area */}
            <Route element={<ProtectedRoute />}>
              <Route path="/*" element={<AppLayout />} />
            </Route>
          </Routes>
        </AuthProvider>
      </AlertProvider>
    </Router>
  );
}

export default App;
