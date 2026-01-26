import React, { useState, useEffect } from 'react';
import { fetchKPIs } from '../../services/api';
import { Users, Building2, TrendingUp, Activity, Shield, Settings } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TeamPerformanceCard from '../../components/dashboard/TeamPerformanceCard';

const AdminDashboard = () => {
    const [userCount, setUserCount] = useState(127); // Default or loading state

    useEffect(() => {
        const loadStats = async () => {
            try {
                const kpis = await fetchKPIs();
                if (kpis && kpis.userCount !== undefined) {
                    setUserCount(kpis.userCount);
                }
            } catch (error) {
                console.error("Failed to fetch KPIs", error);
            }
        };
        loadStats();
    }, []);

    const systemStats = [
        { label: 'Total Users', value: userCount, change: '+12%', trend: 'up' },
        { label: 'Active Sessions', value: 45, change: '+5%', trend: 'up' },
        { label: 'System Uptime', value: '99.9%', change: 'Excellent', trend: 'stable' },
        { label: 'Storage Used', value: '67%', change: '15GB free', trend: 'stable' }
    ];

    const recentActivity = [
        { user: 'Priya Sharma (HR)', action: 'Created new candidate profile', time: '5 mins ago', type: 'create' },
        { user: 'Vikram Singh (IT)', action: 'Completed account setup for Rajesh Kumar', time: '15 mins ago', type: 'complete' },
        { user: 'Admin User', action: 'Updated system settings', time: '1 hour ago', type: 'update' },
        { user: 'Anita Desai (HR)', action: 'Sent offer letter to candidate', time: '2 hours ago', type: 'send' },
        { user: 'Suresh Kumar (IT)', action: 'Created email account', time: '3 hours ago', type: 'create' }
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to Admin Portal</h2>
                <p className="text-orange-100">System administration, analytics, and global settings</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    count={userCount.toString()}
                    subtitle="+12% this month"
                    icon={Users}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Departments"
                    count="6"
                    subtitle="Active departments"
                    icon={Building2}
                    iconBgClass="bg-purple-50 text-purple-600"
                />
                <StatCard
                    title="System Health"
                    count="99.9%"
                    subtitle="Uptime this month"
                    icon={Activity}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Active Processes"
                    count="24"
                    subtitle="Onboarding in progress"
                    icon={TrendingUp}
                    iconBgClass="bg-orange-50 text-orange-600"
                />
            </div>

            {/* System Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {systemStats.map((stat, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-semibold text-gray-500 uppercase">{stat.label}</h4>
                            <span className={`
                                px-2 py-1 rounded-full text-xs font-bold
                                ${stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-600'}
                            `}>
                                {stat.change}
                            </span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamPerformanceCard
                    title="Overall System Performance"
                    rate={85}
                    colorClass="text-emerald-500"
                    metrics={[
                        { label: 'HR Tasks', value: 11, icon: 'clock' },
                        { label: 'IT Requests', value: 3, icon: 'alert' },
                        { label: 'Completed', value: 45, icon: 'check' }
                    ]}
                />
                <TeamPerformanceCard
                    title="Department Activity"
                    rate={70}
                    colorClass="text-blue-500"
                    metrics={[
                        { label: 'HR Department', value: 15, icon: 'check' },
                        { label: 'IT Department', value: 8, icon: 'check' },
                        { label: 'Other', value: 22, icon: 'check' }
                    ]}
                />
            </div>

            {/* Recent Activity Log */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                        <p className="text-sm text-gray-500">System-wide activity log</p>
                    </div>
                    <button className="px-4 py-2 bg-orange-50 text-orange-600 text-sm font-medium rounded-lg hover:bg-orange-100 transition-colors">
                        View All Logs
                    </button>
                </div>

                <div className="space-y-4">
                    {recentActivity.map((activity, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                            <div className={`
                                w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                                ${activity.type === 'create' ? 'bg-blue-100' : ''}
                                ${activity.type === 'complete' ? 'bg-emerald-100' : ''}
                                ${activity.type === 'update' ? 'bg-orange-100' : ''}
                                ${activity.type === 'send' ? 'bg-purple-100' : ''}
                            `}>
                                <Activity size={20} className={`
                                    ${activity.type === 'create' ? 'text-blue-600' : ''}
                                    ${activity.type === 'complete' ? 'text-emerald-600' : ''}
                                    ${activity.type === 'update' ? 'text-orange-600' : ''}
                                    ${activity.type === 'send' ? 'text-purple-600' : ''}
                                `} />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{activity.user}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 font-medium">{activity.time}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                        <Users size={24} className="text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">User Management</h4>
                    <p className="text-sm text-gray-600">Manage user accounts and permissions</p>
                </button>

                <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                        <Shield size={24} className="text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Security Settings</h4>
                    <p className="text-sm text-gray-600">Configure security and access controls</p>
                </button>

                <button className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all text-left group">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
                        <Settings size={24} className="text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">System Settings</h4>
                    <p className="text-sm text-gray-600">Configure global system preferences</p>
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
