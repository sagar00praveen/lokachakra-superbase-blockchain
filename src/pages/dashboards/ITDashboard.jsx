import React from 'react';
import { Monitor, Server, Key, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TeamPerformanceCard from '../../components/dashboard/TeamPerformanceCard';

const ITDashboard = () => {
    const pendingRequests = [
        { name: 'Rajesh Kumar', position: 'Senior Software Engineer', requestType: 'Full Setup', priority: 'High', dueDate: '2026-01-05', status: 'Pending' },
        { name: 'Anita Desai', position: 'Product Manager', requestType: 'Email Account', priority: 'Medium', dueDate: '2026-01-06', status: 'In Progress' },
        { name: 'Vikram Patel', position: 'Data Analyst', requestType: 'System Access', priority: 'Low', dueDate: '2026-01-07', status: 'Pending' },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to IT Portal</h2>
                <p className="text-emerald-100">Manage accounts, credentials, and system access</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Requests"
                    count="3"
                    subtitle="Awaiting action"
                    icon={Clock}
                    iconBgClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Accounts Created"
                    count="24"
                    subtitle="This month"
                    icon={Key}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Systems Configured"
                    count="18"
                    subtitle="Active setups"
                    icon={Server}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Active Tickets"
                    count="5"
                    subtitle="Support requests"
                    icon={AlertCircle}
                    iconBgClass="bg-red-50 text-red-600"
                />
            </div>

            {/* Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamPerformanceCard
                    title="IT Team Performance"
                    rate={50}
                    colorClass="text-emerald-500"
                    metrics={[
                        { label: 'Pending', value: 3, icon: 'clock' },
                        { label: 'In Progress', value: 2, icon: 'alert' },
                        { label: 'Completed', value: 19, icon: 'check' }
                    ]}
                />
                <TeamPerformanceCard
                    title="Account Setup Progress"
                    rate={75}
                    colorClass="text-blue-500"
                    metrics={[
                        { label: 'Email Accounts', value: 24, icon: 'check' },
                        { label: 'System Access', value: 18, icon: 'check' },
                        { label: 'Pending Setup', value: 6, icon: 'clock' }
                    ]}
                />
            </div>

            {/* Pending Requests Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pending IT Requests</h3>
                        <p className="text-sm text-gray-500">Account creation and system setup requests</p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors">
                        View All
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Position</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Type</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {pendingRequests.map((request, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                                                {request.name.split(' ').map(n => n[0]).join('')}
                                            </div>
                                            <span className="font-semibold text-gray-900">{request.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-600">{request.position}</td>
                                    <td className="py-4 px-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                            {request.requestType}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${request.priority === 'High' ? 'bg-red-50 text-red-700 border-red-100' :
                                                request.priority === 'Medium' ? 'bg-orange-50 text-orange-700 border-orange-100' :
                                                    'bg-gray-50 text-gray-700 border-gray-100'
                                            }`}>
                                            {request.priority}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm font-medium text-gray-600">{request.dueDate}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${request.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-orange-50 text-orange-700 border-orange-100'
                                            }`}>
                                            {request.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 opacity-0 group-hover:opacity-100 flex items-center gap-2 mx-auto">
                                            <CheckCircle2 size={16} />
                                            Process
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ITDashboard;
