import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import HRDashboard from './dashboards/HRDashboard';
import ITDashboard from './dashboards/ITDashboard';
import CandidateDashboard from './dashboards/CandidateDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const DashboardRouter = () => {
    const { currentRole } = useDashboard();

    // Render the appropriate dashboard based on role
    switch (currentRole) {
        case 'hr':
            return <HRDashboard />;
        case 'it':
            return <ITDashboard />;
        case 'candidate':
            return <CandidateDashboard />;
        case 'admin':
            return <AdminDashboard />;
        default:
            return (
                <div className="flex items-center justify-center h-96">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Role Selected</h2>
                        <p className="text-gray-600">Please select a portal to continue</p>
                    </div>
                </div>
            );
    }
};

export default DashboardRouter;
