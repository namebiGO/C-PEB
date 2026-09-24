import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CreatorProtectedRoute = () => {
  const { user } = useAuth();

  // Redirect if not logged in or not a CREATOR
  if (!user || user.role !== 'CREATOR') {
    return <Navigate to="/for-creators/login" replace />;
  }

  return <Outlet />;
};

export default CreatorProtectedRoute;
