import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Plus, Search, Filter, Calendar } from 'lucide-react';

const ActiveCandidates = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    // Load candidates from localStorage, fallback to mock data if empty
    const [candidates] = useState(() => {
        const saved = JSON.parse(localStorage.getItem('candidates') || '[]');
        if (saved.length > 0) {
            return saved.map(c => ({
                id: c.id,
                name: c.fullName,
                role: c.position,
                dept: c.department,
                progress: c.status === 'completed' ? 100 : (c.status === 'offer_sent' ? 75 : (c.status === 'pending_offer' ? 50 : 25)),
                status: c.status === 'completed' ? 'Completed' : (c.status === 'offer_sent' ? 'Onboarding' : (c.status === 'pending_offer' ? 'Action Required' : 'In Progress')),
                joiningDate: c.joiningDate || 'TBD',
                initials: c.fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                color: 'bg-indigo-500', // Dynamic colors could be added
                rawStatus: c.status // Keep raw status for logic
            }));
        }
        return [
            { name: 'Sai', role: 'Software Engineer', dept: 'Sales', progress: 100, status: 'Completed', joiningDate: '2025-12-15', initials: 'S', color: 'bg-emerald-500' },
            { name: 'Nagasai Chimmilli', role: 'Software Engineer', dept: 'HR', progress: 15, status: 'Pending', joiningDate: '2026-01-20', initials: 'NC', color: 'bg-purple-500' },
            { name: 'Sai Ch', role: 'DevOps Engineer', dept: 'Engineering', progress: 45, status: 'In Progress', joiningDate: '2026-01-10', initials: 'SC', color: 'bg-blue-500' },
            { name: 'Rahul Verma', role: 'Frontend Developer', dept: 'Engineering', progress: 60, status: 'In Progress', joiningDate: '2026-01-05', initials: 'RV', color: 'bg-orange-500' },
            { name: 'Ravi Kumar', role: 'Backend Developer', dept: 'IT', progress: 0, status: 'Pending', joiningDate: '2026-02-01', initials: 'RK', color: 'bg-pink-500' },
            { name: 'Anita Desai', role: 'Product Designer', dept: 'Product', progress: 100, status: 'Completed', joiningDate: '2025-12-01', initials: 'AD', color: 'bg-indigo-500' }
        ];
    });

    const tabs = ['All', 'Pending', 'In Progress', 'Action Required', 'Completed'];

    const filteredCandidates = candidates.filter(candidate => {
        // Map tab names to status logic
        const matchesTab = activeTab === 'All' ||
            (activeTab === 'Action Required' && candidate.status === 'Action Required') ||
            (activeTab === 'Pending' && (candidate.status === 'Pending' || candidate.status === 'In Progress')) ||
            candidate.status === activeTab;

        const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Onboarding': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Action Required': return 'bg-red-100 text-red-700 border-red-200';
            case 'In Progress': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Candidates Overview</h3>
                    <p className="text-sm text-gray-500">Manage and track candidate onboarding</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/add-candidate')}
                        className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Plus size={18} />
                        Add Candidate
                    </button>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
                <div className="flex bg-gray-50 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search candidates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Candidate</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Role & Dept</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Joining Date</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-1/5">Progress</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredCandidates.map((candidate, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="py-4 px-4 pl-6">
                                    <div
                                        className="flex items-center gap-3 cursor-pointer group/item"
                                        onClick={() => navigate(`/candidate-profile/${candidate.id}`)}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-sm ${candidate.color}`}>
                                            {candidate.initials}
                                        </div>
                                        <span className="font-semibold text-gray-900 group-hover/item:text-indigo-600 transition-colors">{candidate.name}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-gray-900">{candidate.role}</span>
                                        <span className="text-xs text-gray-500">{candidate.dept}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar size={14} className="text-gray-400" />
                                        {candidate.joiningDate}
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-500 ${candidate.progress === 100 ? 'bg-emerald-500' :
                                                    candidate.progress >= 50 ? 'bg-indigo-500' : 'bg-orange-400'
                                                    }`}
                                                style={{ width: `${candidate.progress}%` }}
                                            />
                                        </div>
                                        <span className="text-xs font-bold text-gray-600 w-8 text-right">{candidate.progress}%</span>
                                    </div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(candidate.status)}`}>
                                        {candidate.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {candidate.rawStatus === 'pending_offer' ? (
                                        <button
                                            onClick={() => navigate('/send-offer-letter', { state: { candidateId: candidate.id } })}
                                            className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                                        >
                                            Send Offer
                                        </button>
                                    ) : (
                                        <button
                                            className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ActiveCandidates;
