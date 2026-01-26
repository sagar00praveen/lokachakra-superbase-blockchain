import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import {
    Users,
    Monitor,
    UserCheck,
    Shield,
    ChevronRight,
    Building2,
    Command
} from 'lucide-react';

const PortalSelection = () => {
    const navigate = useNavigate();
    const { login } = useDashboard();

    const portals = [
        {
            id: 'hr',
            title: 'HR',
            description: 'Talent acquisition & onboarding.',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            hover: 'group-hover:text-blue-600',
        },
        {
            id: 'it',
            title: 'IT Operations',
            description: 'Systems, assets & access control.',
            icon: Monitor,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            hover: 'group-hover:text-emerald-600',
        },
        {
            id: 'candidate',
            title: 'Candidate Portal',
            description: 'Application tracking & offers.',
            icon: UserCheck,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            hover: 'group-hover:text-purple-600',
        },
        {
            id: 'admin',
            title: 'Administration',
            description: 'Global settings & analytics.',
            icon: Shield,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            hover: 'group-hover:text-orange-600',
        }
    ];

    const handlePortalSelect = (portalId) => {
        navigate(`/login?role=${portalId}`);
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Ambient Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-5xl z-10">
                {/* Header */}
                <div className="text-center mb-16 space-y-4 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center p-4 bg-white rounded-2xl shadow-sm mb-4">
                        <Building2 size={32} className="text-gray-900" />
                    </div>
                    <h1 className="text-5xl font-semibold tracking-tight text-gray-900">
                        lokachakra
                    </h1>
                    <p className="text-xl text-gray-500 font-normal max-w-xl mx-auto leading-relaxed">
                        Select a workspace to proceed.
                    </p>
                </div>

                {/* Portal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 px-4">
                    {portals.map((portal, index) => {
                        const Icon = portal.icon;
                        return (
                            <button
                                key={portal.id}
                                onClick={() => handlePortalSelect(portal.id)}
                                className={`
                                    group relative w-full p-8 text-left
                                    bg-white/60 backdrop-blur-xl
                                    border border-white/40
                                    rounded-[32px]
                                    shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                                    hover:bg-white/80 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]
                                    transition-all duration-300 ease-out
                                    animate-fade-in-up
                                `}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-4 rounded-2xl ${portal.bg} ${portal.color} transition-colors duration-300`}>
                                            <Icon size={28} />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 tracking-tight mb-1 group-hover:text-black">
                                                {portal.title}
                                            </h3>
                                            <p className="text-gray-500 font-medium text-base">
                                                {portal.description}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                                        <ChevronRight size={20} className="text-gray-400" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center">
                    <p className="text-sm text-gray-400 font-medium flex items-center justify-center gap-2">
                        <Command size={14} />
                        <span>All systems operational</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PortalSelection;
