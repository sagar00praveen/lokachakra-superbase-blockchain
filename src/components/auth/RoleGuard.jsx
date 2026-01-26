
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useDashboard } from '../../context/DashboardContext';

const RoleGuard = ({ requiredRole, children }) => {
    const { currentRole, authLoading } = useDashboard();
    const location = useLocation();

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!currentRole) {
        // If no role is selected, redirect to landing/login
        return <Navigate to="/" state={{ from: location }} replace />;
    }

    if (currentRole !== requiredRole) {
        // If role doesn't match, redirect to THEIR dashboard to avoid confusion,
        // or show an Access Denied page. Redirecting to their specific dashboard is cleaner.
        // E.g. If I'm HR and try to go to /candidate/dashboard, send me to /hr/dashboard.

        const dashboardMap = {
            hr: '/hr/dashboard',
            it: '/it/dashboard',
            candidate: '/candidate/dashboard',
            admin: '/admin/dashboard'
        };

        const targetDashboard = dashboardMap[currentRole] || '/';
        return <Navigate to={targetDashboard} replace />;
    }

    return children;
};

export default RoleGuard;
