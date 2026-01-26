import React, { useState, useEffect } from 'react';
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
import { fetchAllDocuments, updateDocumentStatus, getDocumentUrl } from '../../services/api';
import { recordDocumentProofOnChain } from '../../lib/web3/blockchain';

const DocumentManagement = () => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All'); // All, Pending, Verified, Rejected

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const data = await fetchAllDocuments();
            // Transform data for display if needed
            const processed = data.map(doc => ({
                id: doc.id,
                name: doc.document_type, // or doc.original_name
                originalName: doc.original_name,
                type: doc.document_type,
                candidate: doc.candidate ? doc.candidate.name : 'Unknown Candidate',
                candidateRole: doc.candidate ? doc.candidate.position : 'N/A',
                candidateInitials: doc.candidate ? doc.candidate.name.substring(0, 2).toUpperCase() : '??',
                date: new Date(doc.uploaded_at).toLocaleDateString(),
                status: doc.status,
                path: doc.file_path,
                rejectionReason: doc.rejection_reason
            }));
            setDocuments(processed);
        } catch (error) {
            console.error("Failed to load documents:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (docId, action, reason = null) => {
        try {
            let status = 'Pending';
            if (action === 'approve') status = 'Verified';
            if (action === 'reject') status = 'Rejected';

            // 1. Update DB First
            await updateDocumentStatus(docId, status, reason);

            // 2. If Approved, Trigger Blockchain Transaction
            if (action === 'approve') {
                const doc = documents.find(d => d.id === docId);
                if (doc) {
                    try {
                        const confirmChain = window.confirm("Verify on Blockchain? (Requires Sol Wallet)");
                        if (confirmChain) {
                            // In real app, we'd hash the file content. 
                            // Here we use doc ID as proxy or fetch file to hash.
                            await recordDocumentProofOnChain(doc.id, "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
                            alert("Proof Recorded on Solana Blockchain! 🔗");
                        }
                    } catch (chainError) {
                        console.error("Blockchain Error:", chainError);
                        alert(`Blockchain Error: ${chainError.message || JSON.stringify(chainError)}`);
                    }
                }
            }

            loadDocuments(); // Refresh
        } catch (error) {
            console.error(`Failed to ${action} document:`, error);
            alert(`Failed to ${action} document.`);
        }
    };

    const handleReject = (docId) => {
        const reason = prompt("Enter rejection reason:");
        if (reason) {
            handleAction(docId, 'reject', reason);
        }
    };

    const handlePreview = async (path) => {
        const url = await getDocumentUrl(path);
        if (url) {
            window.open(url, '_blank');
        } else {
            alert("Unable to generate document link. Please check if the file exists.");
        }
    };

    // Derived Stats
    const stats = [
        { title: 'Total Documents', count: String(documents.length), subtitle: 'All uploaded files', icon: FileText, color: 'bg-indigo-50 text-indigo-600' },
        { title: 'Pending Review', count: String(documents.filter(d => d.status === 'Pending').length), subtitle: 'Action required', icon: AlertCircle, color: 'bg-orange-50 text-orange-600' },
        { title: 'Verified', count: String(documents.filter(d => d.status === 'Verified').length), subtitle: 'Approved documents', icon: CheckCircle2, color: 'bg-emerald-50 text-emerald-600' },
        { title: 'Rejected', count: String(documents.filter(d => d.status === 'Rejected').length), subtitle: 'Need re-upload', icon: XCircle, color: 'bg-red-50 text-red-600' },
    ];

    // Filter Logic
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.candidate.toLowerCase().includes(searchTerm.toLowerCase()) || doc.type.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || doc.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    // Unique Candidates list based on loaded documents
    const uniqueCandidates = Array.from(new Set(documents.map(d => d.candidate)))
        .map(name => {
            const doc = documents.find(d => d.candidate === name);
            return {
                id: doc.candidate, // using name as ID for unique grouping display simply
                name: doc.candidate,
                role: doc.candidateRole,
                initials: doc.candidateInitials,
                color: 'bg-indigo-500' // could randomize
            };
        });

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
                {/* Left Panel: Candidate List (Simplistic View based on docs) */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Candidates with Uploads</h3>

                        <div className="relative mb-5">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-indigo-500 rounded-xl text-sm transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-2 max-h-[500px] overflow-y-auto">
                            {uniqueCandidates.length === 0 ? (
                                <p className="text-gray-500 text-sm text-center">No candidates found.</p>
                            ) : (
                                uniqueCandidates.map((candidate, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 cursor-pointer transition-colors group"
                                        onClick={() => setSearchTerm(candidate.name)}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm ${candidate.color}`}>
                                            {candidate.initials}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 group-hover:text-indigo-700 text-sm">{candidate.name}</h4>
                                            <p className="text-xs text-gray-500">{candidate.role}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Document Table */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Recent Uploads</h3>
                            <div className="flex gap-2">
                                {['All', 'Pending', 'Verified', 'Rejected'].map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setFilterStatus(status)}
                                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${filterStatus === status ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
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
                                    {loading ? (
                                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">Loading documents...</td></tr>
                                    ) : filteredDocuments.length === 0 ? (
                                        <tr><td colSpan="4" className="text-center py-8 text-gray-500">No documents found.</td></tr>
                                    ) : (
                                        filteredDocuments.map((doc) => (
                                            <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-4 pl-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                                                            <FileText size={16} />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900 text-sm">{doc.name}</p>
                                                            <p className="text-xs text-gray-500">{doc.type} • {doc.date}</p>
                                                            <p className="text-xs text-gray-400 truncate max-w-[150px]" title={doc.originalName}>{doc.originalName}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4 text-sm font-medium text-gray-700">{doc.candidate}</td>
                                                <td className="py-4 px-4">
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border w-fit ${getStatusStyle(doc.status)}`}>
                                                            {doc.status}
                                                        </span>
                                                        {doc.status === 'Rejected' && doc.rejectionReason && (
                                                            <span className="text-[10px] text-red-500 max-w-[120px] leading-tight">Reason: {doc.rejectionReason}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handlePreview(doc.path)}
                                                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                            title="View"
                                                        >
                                                            <Eye size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(doc.id, 'approve')}
                                                            disabled={doc.status === 'Verified'}
                                                            className={`p-1.5 rounded-lg transition-colors ${doc.status === 'Verified' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-emerald-600 hover:bg-emerald-50'}`}
                                                            title="Approve"
                                                        >
                                                            <Check size={18} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(doc.id)}
                                                            disabled={doc.status === 'Rejected'}
                                                            className={`p-1.5 rounded-lg transition-colors ${doc.status === 'Rejected' ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-600 hover:bg-red-50'}`}
                                                            title="Reject"
                                                        >
                                                            <X size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
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
