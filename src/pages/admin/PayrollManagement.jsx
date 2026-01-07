import React, { useState } from 'react';
import {
    DollarSign,
    Calendar,
    Users,
    Download,
    Play,
    MoreHorizontal,
    Search,
    Filter
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const PayrollManagement = () => {
    // Mock Data
    const [employees] = useState([
        { id: 1, name: 'Rajesh Kumar', role: 'Head of Engineering', month: 'December 2025', amount: '₹2,50,000', status: 'Pending', initials: 'RK' },
        { id: 2, name: 'Priya Sharma', role: 'HR Manager', month: 'December 2025', amount: '₹1,20,000', status: 'Paid', initials: 'PS' },
        { id: 3, name: 'Vikram Singh', role: 'Senior Developer', month: 'December 2025', amount: '₹1,80,000', status: 'Pending', initials: 'VS' },
        { id: 4, name: 'Anita Desai', role: 'UI/UX Designer', month: 'December 2025', amount: '₹1,40,000', status: 'Paid', initials: 'AD' },
        { id: 5, name: 'Suresh Menon', role: 'DevOps Engineer', month: 'December 2025', amount: '₹1,60,000', status: 'Pending', initials: 'SM' },
    ]);

    const stats = [
        { title: 'Total Payroll Cost', count: '₹24,50,000', subtitle: 'For December 2025', icon: DollarSign, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Next Pay Date', count: 'Jan 01, 2026', subtitle: '5 days remaining', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
        { title: 'Pending Process', count: '14', subtitle: 'Employees pending', icon: Users, color: 'bg-orange-50 text-orange-600' },
    ];

    const getStatusStyle = (status) => {
        return status === 'Paid'
            ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
            : 'bg-orange-100 text-orange-700 border-orange-200';
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Payroll Management</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Manage salaries, run payroll, and view reports</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm">
                        <Download size={18} />
                        Download Report
                    </button>
                    <button className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200">
                        <Play size={18} />
                        Run Payroll
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <StatCard
                        key={idx}
                        title={stat.title}
                        count={stat.count}
                        subtitle={stat.subtitle}
                        icon={stat.icon}
                        iconBgClass={stat.color}
                    />
                ))}
            </div>

            {/* Payroll Table Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <h3 className="text-lg font-bold text-gray-900">Salary Disbursement</h3>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search employee..."
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-lg text-sm transition-all outline-none w-64"
                            />
                        </div>
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Employee Name</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Month</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {employees.map((emp) => (
                                <tr key={emp.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="py-4 px-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                {emp.initials}
                                            </div>
                                            <span className="font-semibold text-gray-900">{emp.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-gray-600 font-medium">{emp.role}</td>
                                    <td className="py-4 px-4 text-sm text-gray-500">{emp.month}</td>
                                    <td className="py-4 px-4 text-sm font-bold text-gray-900">{emp.amount}</td>
                                    <td className="py-4 px-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(emp.status)}`}>
                                            {emp.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <button className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
                                            <MoreHorizontal size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination (Mock) */}
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Showing 1-5 of 127 entries</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">Previous</button>
                        <button className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 font-medium border border-indigo-100 rounded-lg">1</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">2</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">3</button>
                        <button className="px-3 py-1 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollManagement;
