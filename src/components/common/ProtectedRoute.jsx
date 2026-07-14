import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    toast.error('Please login to access this page');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for role-based access
  if (requiredRole) {
    if (role !== requiredRole) {
      toast.error('You do not have permission to access this page');
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;