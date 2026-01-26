import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal, Plus, Search, Filter, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { fetchCandidates } from '../../services/api';

const ActiveCandidates = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCandidates = async () => {
            try {
                const data = await fetchCandidates();
                const mappedCandidates = data.map(c => ({
                    id: c.id,
                    name: c.name,
                    role: c.position,
                    dept: c.department,
                    status: (c.status === 'offer_accepted' || c.status === 'Completed') ? 'Completed' :
                        (c.status === 'offer_sent' || c.status === 'Offer Sent') ? 'Offer Sent' :
                            (c.status === 'offer_rejected' ? 'Offer Rejected' :
                                (c.status === 'pending_offer' ? 'Action Required' :
                                    (c.status === 'Provisioned' ? 'In Progress' : 'Pending'))),
                    joiningDate: c.joining_date || 'TBD',
                    initials: c.name ? c.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??',
                    color: 'bg-indigo-500',
                    rawStatus: c.status,
                    provisionedAt: c.provisioned_at,
                    sentOffer: c.sent_offer_letter,
                    credentialsCreated: c.credentials_created,
                    offerAcceptanceStatus: c.offer_acceptance_status // Map the new column
                }));
                setCandidates(mappedCandidates);
            } catch (error) {
                console.error("Failed to fetch candidates:", error);
            } finally {
                setLoading(false);
            }
        };

        loadCandidates();
    }, []);

    const tabs = ['All', 'Pending', 'In Progress', 'Action Required', 'Offer Sent', 'Completed', 'Rejected'];

    const filteredCandidates = candidates.filter(candidate => {
        const matchesTab = activeTab === 'All' ||
            (activeTab === 'Action Required' && candidate.status === 'Action Required') ||
            (activeTab === 'Pending' && (candidate.status === 'Pending' || candidate.status === 'In Progress')) ||
            (activeTab === 'Offer Sent' && candidate.status === 'Offer Sent') ||
            (activeTab === 'Rejected' && candidate.status === 'Offer Rejected') ||
            candidate.status === activeTab;

        const matchesSearch = candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            candidate.role.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'Offer Sent': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Offer Rejected': return 'bg-red-100 text-red-700 border-red-200';
            case 'Action Required': return 'bg-orange-100 text-orange-700 border-orange-200';
            case 'In Progress': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const renderAction = (candidate) => {
        // Allow sending offer if:
        // 1. Status is in pending/provisioned state
        // 2. OR Offer was explicitly rejected (even if status is Completed/Provisioned)
        // 3. AND Offer hasn't been re-sent yet (sentOffer is false)
        const isRejected = candidate.offerAcceptanceStatus === 'rejected';
        const canSendOffer = ['Applied', 'Pending', 'pending_offer', 'Provisioned', 'offer_rejected'].includes(candidate.rawStatus) || isRejected;

        if (canSendOffer && !candidate.sentOffer) {
            // Further validation to ensure we don't show it for totally unrelated statuses if needed, 
            // but isRejected check is strong.
            if (candidate.rawStatus !== 'offer_sent') {
                return (
                    <button
                        onClick={() => navigate('/hr/send-offer-letter', { state: { candidateId: candidate.id } })}
                        className="text-indigo-600 hover:text-indigo-900 font-semibold text-xs border border-indigo-200 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                        Send Offer
                    </button>
                );
            }
        }

        if ((candidate.rawStatus === 'offer_sent' || candidate.rawStatus === 'Offer Sent') && !candidate.provisionedAt) {
            return (
                <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-100">
                    Need IT Credentials
                </span>
            );
        }

        return (
            <button
                className="text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
            >
                <MoreHorizontal size={20} />
            </button>
        );
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
                        onClick={() => navigate('/hr/add-candidate')}
                        className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                    >
                        <Plus size={18} />
                        Add Candidate
                    </button>
                </div>
            </div>

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
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Sent Offer Letter</th>
                            <th className="text-left py-4 px-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Credentials Created</th>
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
                                        onClick={() => navigate(`/hr/candidate-profile/${candidate.id}`)}
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
                                    {candidate.sentOffer ? (
                                        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                                            <CheckCircle size={16} /> Sent
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                                            <XCircle size={16} /> Pending
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    {candidate.credentialsCreated ? (
                                        <div className="flex items-center gap-2 text-emerald-600 font-semibold text-xs">
                                            <CheckCircle size={16} /> Created
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-gray-400 font-semibold text-xs">
                                            <XCircle size={16} /> Pending
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusColor(candidate.status)}`}>
                                        {candidate.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-center">
                                    {renderAction(candidate)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >
        </div >
    );
};

export default ActiveCandidates;
