import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ role }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role) {
    const isAuthorized =
      role === 'ADMIN'
        ? user.role === 'ADMIN' || user.is_staff || user.is_superuser
        : user.role === role;

    if (!isAuthorized) {
      // Redirect to their default dashboard
      return <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
