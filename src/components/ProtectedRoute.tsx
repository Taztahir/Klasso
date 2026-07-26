import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute: React.FC = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-cream">
                <div className="w-12 h-12 border-4 border-brandPurple border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        // Pass the current location so we can redirect back after login/signup
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <Outlet />;
};
