import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import {
    Users,
    Monitor,
    UserCheck,
    Shield,
    ArrowRight,
    Building2
} from 'lucide-react';

const PortalSelection = () => {
    const navigate = useNavigate();
    const { login } = useDashboard();

    const portals = [
        {
            id: 'hr',
            title: 'HR Portal',
            description: 'Manage candidates, send offers, and handle onboarding',
            icon: Users,
            gradient: 'from-blue-500 to-cyan-500',
            hoverGradient: 'hover:from-blue-600 hover:to-cyan-600',
            features: ['Candidate Management', 'Offer Letters', 'Onboarding']
        },
        {
            id: 'it',
            title: 'IT Portal',
            description: 'Create accounts, manage credentials, and setup systems',
            icon: Monitor,
            gradient: 'from-emerald-500 to-teal-500',
            hoverGradient: 'hover:from-emerald-600 hover:to-teal-600',
            features: ['Account Creation', 'System Setup', 'Access Management']
        },
        {
            id: 'candidate',
            title: 'Candidate Portal',
            description: 'Track your application status and complete onboarding',
            icon: UserCheck,
            gradient: 'from-purple-500 to-pink-500',
            hoverGradient: 'hover:from-purple-600 hover:to-pink-600',
            features: ['Application Status', 'Document Upload', 'Profile Management']
        },
        {
            id: 'admin',
            title: 'Admin Portal',
            description: 'System administration, analytics, and global settings',
            icon: Shield,
            gradient: 'from-orange-500 to-red-500',
            hoverGradient: 'hover:from-orange-600 hover:to-red-600',
            features: ['User Management', 'Analytics', 'System Settings']
        }
    ];

    const handlePortalSelect = (portalId) => {
        navigate(`/login?role=${portalId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-6">
            <div className="w-full max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
                            <Building2 size={32} className="text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900">HR Nexus</h1>
                    </div>
                    <p className="text-xl text-gray-600 font-medium">
                        Select Your Portal
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                        Choose the portal that matches your role
                    </p>
                </div>

                {/* Portal Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                    {portals.map((portal, index) => {
                        const Icon = portal.icon;
                        return (
                            <div
                                key={portal.id}
                                className="group animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <button
                                    onClick={() => handlePortalSelect(portal.id)}
                                    className={`
                                        w-full p-8 bg-white rounded-2xl border-2 border-gray-200 
                                        hover:border-transparent hover:shadow-2xl 
                                        transition-all duration-300 text-left
                                        hover:scale-[1.02] active:scale-[0.98]
                                        relative overflow-hidden
                                    `}
                                >
                                    {/* Background Gradient on Hover */}
                                    <div className={`
                                        absolute inset-0 bg-gradient-to-br ${portal.gradient} 
                                        opacity-0 group-hover:opacity-5 transition-opacity duration-300
                                    `} />

                                    {/* Content */}
                                    <div className="relative">
                                        {/* Icon and Title */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className={`
                                                p-4 rounded-2xl bg-gradient-to-br ${portal.gradient} 
                                                shadow-lg group-hover:shadow-xl transition-all duration-300
                                                group-hover:scale-110
                                            `}>
                                                <Icon size={32} className="text-white" />
                                            </div>
                                            <ArrowRight
                                                size={24}
                                                className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all duration-300"
                                            />
                                        </div>

                                        {/* Portal Info */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                            {portal.title}
                                        </h3>
                                        <p className="text-gray-600 font-medium mb-6">
                                            {portal.description}
                                        </p>

                                        {/* Features */}
                                        <div className="space-y-2">
                                            {portal.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-center gap-2">
                                                    <div className={`
                                                        w-1.5 h-1.5 rounded-full bg-gradient-to-r ${portal.gradient}
                                                    `} />
                                                    <span className="text-sm text-gray-600 font-medium">
                                                        {feature}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    <p>Demo Portal Selection • All roles available for testing</p>
                </div>
            </div>
        </div>
    );
};

export default PortalSelection;
