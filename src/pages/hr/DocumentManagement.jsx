import React, { useState } from 'react';
import {
    FileText,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Search,
    Filter,
    Eye,
    Check,
    X,
    MoreVertical
} from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';

const DocumentManagement = () => {
    // Mock Data
    const [stats] = useState([
        { title: 'Total Documents', count: '145', subtitle: 'All uploaded files', icon: FileText, color: 'bg-indigo-50 text-indigo-600' },
        { title: 'Pending Review', count: '12', subtitle: 'Action required', icon: AlertCircle, color: 'bg-orange-50 text-orange-600' },
        { title: 'Verified', count: '128', subtitle: 'Approved documents', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Rejected', count: '5', subtitle: 'Need re-upload', icon: XCircle, color: 'bg-red-50 text-red-600' },
    ]);

    const candidates = [
        { id: 1, name: 'Rajesh Kumar', role: 'Software Engineer', initials: 'RK', color: 'bg-indigo-500' },
        { id: 2, name: 'Priya Sharma', role: 'HR Manager', initials: 'PS', color: 'bg-pink-500' },
        { id: 3, name: 'Amit Patel', role: 'Product Designer', initials: 'AP', color: 'bg-emerald-500' },
        { id: 4, name: 'Sarah Jenkins', role: 'DevOps Engineer', initials: 'SJ', color: 'bg-blue-500' },
        { id: 5, name: 'Mike Chen', role: 'Data Scientist', initials: 'MC', color: 'bg-purple-500' },
    ];

    const documents = [
        { id: 1, name: 'Aadhar Card', type: 'ID Proof', candidate: 'Rajesh Kumar', date: 'Jan 04, 2026', status: 'Pending' },
        { id: 2, name: 'PAN Card', type: 'ID Proof', candidate: 'Rajesh Kumar', date: 'Jan 04, 2026', status: 'Verified' },
        { id: 3, name: 'Relieving Letter', type: 'Employment', candidate: 'Rajesh Kumar', date: 'Jan 04, 2026', status: 'Rejected' },
        { id: 4, name: 'Educational Certs', type: 'Education', candidate: 'Priya Sharma', date: 'Jan 03, 2026', status: 'Verified' },
        { id: 5, name: 'Passport', type: 'ID Proof', candidate: 'Amit Patel', date: 'Jan 02, 2026', status: 'Pending' },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Verified': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Document Management</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">Review and verify candidate documents</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Panel: Candidate List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Candidates</h3>

                        <div className="relative mb-5">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            {candidates.map((candidate) => (
                                <div
                                    key={candidate.id}
                                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors group"
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm ${candidate.color}`}>
                                        {candidate.initials}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 text-sm">{candidate.name}</h4>
                                        <p className="text-xs text-gray-500">{candidate.role}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Document Table */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Uploads</h3>
                            <button className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                <Filter size={16} />
                                Filter
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50/50 border-b border-gray-100">
                                    <tr>
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider pl-6">Document Name</th>
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Candidate</th>
                                        <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="text-center py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {documents.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-4 pl-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                        <FileText size={16} />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                                                        <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm font-medium text-gray-700">{doc.candidate}</td>
                                            <td className="py-4 px-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(doc.status)}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <button className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="View">
                                                        <Eye size={18} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                                        <Check size={18} />
                                                    </button>
                                                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentManagement;
