import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, DollarSign, BarChart2, Settings, LogOut, User, Bell, Video, CheckSquare, Upload, ShieldCheck, Monitor, FolderCheck, UserCheck } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const Sidebar = () => {
    const { user, currentRole, logout } = useDashboard();
    const navigate = useNavigate();
    const location = useLocation();

    // Define menus for each role
    const roleMenus = {
        hr: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/hr/dashboard' },
            { icon: FileText, label: 'Add Candidate', path: '/hr/add-candidate' },
            { icon: Video, label: 'Orientations', path: '/hr/orientations' },
            { icon: FolderCheck, label: 'Documents', path: '/hr/documents' },
        ],
        it: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/it/dashboard' },
            { icon: FileText, label: 'IT Request', path: '/it/requests' },
            { icon: Monitor, label: 'Asset Management', path: '/it/assets' },
            { icon: Video, label: 'Orientation', path: '/it/orientations' },
            { icon: Settings, label: 'Settings', path: '/it/settings' },
        ],
        candidate: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/candidate/dashboard' },
            { icon: Bell, label: 'Notifications', path: '/candidate/notifications' },
            { icon: Video, label: 'My Orientations', path: '/candidate/orientations' },
            { icon: CheckSquare, label: 'Accept Offer', path: '/candidate/accept-offer' },
            { icon: Upload, label: 'Upload Documents', path: '/candidate/documents' },
            { icon: User, label: 'Personal Information', path: '/candidate/profile' },
            { icon: ShieldCheck, label: 'Policy Acceptance', path: '/candidate/policies' },
            { icon: Monitor, label: 'Device Receipt', path: '/candidate/device' },
        ],
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: Users, label: 'Teams Overview', path: '/admin/teams' },
            { icon: UserCheck, label: 'Employees', path: '/admin/employees' },
            { icon: BarChart2, label: 'Analytics', path: '/admin/analytics' },
            { icon: DollarSign, label: 'Payroll', path: '/admin/payroll' },
            { icon: Users, label: 'User Management', path: '/admin/users' },
            { icon: Settings, label: 'Settings', path: '/admin/settings' },
        ]
    };

    // Default to HR if no role (or handle gracefully)
    const menuItems = roleMenus[currentRole] || roleMenus['hr'];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col justify-between z-20 shadow-sm font-sans">
            <div className="p-6">
                <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => navigate('/')}>
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <span className="text-white font-bold text-xl">L</span>
                    </div>
                    <div>
                        <span className="text-xl font-bold text-gray-800 tracking-tight block leading-none">LokaChakra</span>
                        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                            {currentRole ? `${currentRole} PORTAL` : 'HR NEXUS'}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-3 pl-3 tracking-wider">Menu</div>
                    {menuItems.map((item, index) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={index}
                                onClick={() => navigate(item.path)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'} />
                                {item.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="p-4 mx-4 mb-4 border-t border-gray-100">
                <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <User size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{user ? user.name : 'Guest User'}</p>
                        <p className="text-xs text-gray-500 truncate capitalize">{user ? user.role : 'Select Role'}</p>
                    </div>
                    <button onClick={handleLogout} title="Change Portal">
                        <LogOut size={18} className="text-gray-300 group-hover:text-red-500 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
