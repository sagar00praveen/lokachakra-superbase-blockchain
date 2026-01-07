import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Search } from 'lucide-react';

const Header = () => {
    const location = useLocation();

    const getPageInfo = () => {
        const path = location.pathname;
        if (path.includes('/dashboard')) return { title: 'Dashboard', subtitle: 'Overview of your activities and pending tasks' };
        if (path.includes('/teams-overview')) return { title: 'Teams Overview', subtitle: 'Detailed view of all team activities and performance' };
        if (path.includes('/add-candidate')) return { title: 'Add New Candidate', subtitle: 'Create candidate profile – IT will create login credentials' };
        if (path.includes('/send-offer-letter')) return { title: 'Send Offer Letter', subtitle: 'Upload and send offer letters to candidates' };
        if (path.includes('/hr/orientations')) return { title: 'Orientation Management', subtitle: 'Schedule and manage candidate sessions' };
        if (path.includes('/hr/documents')) return { title: 'Document Management', subtitle: 'Review and verify candidate documents' };
        if (path.includes('/user-management')) return { title: 'User Management', subtitle: 'Manage users and permissions' };
        if (path.includes('/payroll')) return { title: 'Payroll', subtitle: 'Manage employee payroll and compensation' };
        if (path.includes('/analytics')) return { title: 'Analytics', subtitle: 'View performance metrics and insights' };
        if (path.includes('/candidate/orientations')) return { title: 'My Orientations', subtitle: 'View upcoming onboarding sessions' };
        if (path.includes('/candidate/policies')) return { title: 'Policy Acceptance', subtitle: 'Review and sign mandatory policies' };
        if (path.includes('/candidate/device')) return { title: 'Device Receipt', subtitle: 'Confirm asset allocation' };
        if (path.includes('/candidate/profile')) return { title: 'Personal Information', subtitle: 'Manage your profile details' };
        if (path.includes('/candidate/documents')) return { title: 'Upload Documents', subtitle: 'Submit required paperwork' };
        if (path.includes('/candidate/accept-offer')) return { title: 'Offer Acceptance', subtitle: 'Review and respond to your job offer' };
        if (path.includes('/candidate/notifications')) return { title: 'Notifications', subtitle: 'Stay updated with your onboarding' };
        if (path.includes('/it/requests')) return { title: 'IT Request', subtitle: 'Manage IT support requests and tickets' };
        if (path.includes('/it/assets')) return { title: 'Asset Management', subtitle: 'Track and manage IT assets and equipment' };
        if (path.includes('/it/orientations')) return { title: 'Orientation', subtitle: 'IT onboarding and training sessions' };
        if (path.includes('/it/settings')) return { title: 'Settings', subtitle: 'Configure IT system settings and preferences' };
        if (path.includes('/admin/employees')) return { title: 'Employee Directory', subtitle: 'View and manage all employees' };
        if (path.includes('/settings')) return { title: 'Settings', subtitle: 'Configure system settings and preferences' };

        return { title: 'LokaChakra Portal', subtitle: 'HR Nexus Management System' };
    };


    const pageInfo = getPageInfo();

    return (
        <header className="h-24 bg-white/50 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 flex items-center justify-between px-8 pl-72">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{pageInfo.title}</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">{pageInfo.subtitle}</p>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative hidden md:block group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 rounded-xl transition-all duration-200 outline-none w-64 text-sm font-medium text-gray-600 placeholder:text-gray-400"
                    />
                </div>

                <div className="h-8 w-[1px] bg-gray-200 mx-2"></div>

                <button className="relative p-2.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all duration-200">
                    <Bell size={22} />
                    <span className="absolute top-2.5 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
