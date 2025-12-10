import React from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { profile, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-200">Access Denied</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">You must be logged in to view this page.</p>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
