import React, { useState, useEffect } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { Clock, CheckCircle2, Users, FileText, TrendingUp, Filter, Download } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

import { fetchAnalyticsData } from '../../services/api';

const AnalyticsDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        openPositions: 0,
        activeCandidates: 0,
        pendingOffers: 0,
        completedOnboarding: 0
    });
    const [onboardingTrendData, setTrendData] = useState([]);
    const [departmentData, setDepartmentData] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            const data = await fetchAnalyticsData();
            setStats(data.stats);
            setTrendData(data.trendData);
            setDepartmentData(data.departmentData);
        } catch (error) {
            console.error("Failed to load analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Key metrics and onboarding insights</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Top Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Avg Time to Onboard"
                    count="5.2 Days"
                    subtitle="Estimated"
                    icon={Clock}
                    iconBgClass="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="Completed"
                    count={String(stats.completedOnboarding)}
                    subtitle="Fully Onboarded"
                    icon={CheckCircle2}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Active Candidates"
                    count={String(stats.activeCandidates)}
                    subtitle="Total in pipeline"
                    icon={Users}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Pending Offers"
                    count={String(stats.pendingOffers)}
                    subtitle="Awaiting response"
                    icon={FileText}
                    iconBgClass="bg-orange-50 text-orange-600"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Graph: Monthly Onboarding Trend */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-900">Monthly Onboarding Trend</h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                <TrendingUp size={12} /> +15%
                            </span>
                        </div>
                    </div>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={onboardingTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                                <Tooltip
                                    cursor={{ opacity: 0.1 }}
                                    contentStyle={{ borderRadius: '12px', borderColor: '#E5E7EB', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Bar dataKey="completed" name="Completed" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="pending" name="Pending" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Side Panel: Department Performance & Quick Stats */}
                <div className="space-y-8">
                    {/* Department Performance */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Department Efficiency</h3>
                        <div className="space-y-6">
                            {departmentData.map((d, index) => (
                                <div key={index}>
                                    <div className="flex justify-between text-sm font-medium mb-2">
                                        <span className="text-gray-700">{d.dept}</span>
                                        <span className="text-indigo-600">{d.rate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div
                                            className="bg-indigo-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${d.rate}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Quick Stats Panel */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                        <h3 className="text-lg font-bold mb-6">This Month Stats</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-indigo-100 text-xs font-medium uppercase mb-1">Total</p>
                                <p className="text-2xl font-bold">42</p>
                            </div>
                            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                <p className="text-emerald-100 text-xs font-medium uppercase mb-1">Completed</p>
                                <p className="text-2xl font-bold">30</p>
                            </div>
                            <div className="col-span-2 bg-white/10 rounded-xl p-4 backdrop-blur-sm flex items-center justify-between">
                                <div>
                                    <p className="text-indigo-100 text-xs font-medium uppercase mb-1">In Progress</p>
                                    <p className="text-2xl font-bold">12</p>
                                </div>
                                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <TrendingUp size={20} className="text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
