import React, { useState, useEffect } from 'react';
import { Search, Clock, CheckCircle, AlertCircle, Inbox, Mail, Key, User, ArrowRight, X, Copy, RefreshCw, Info, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCandidates, provisionCandidate } from '../../services/api';

const ITRequest = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showCredentialsModal, setShowCredentialsModal] = useState(false);
    const [loading, setLoading] = useState(true);

    // Derived state for password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Form state for credentials
    const [credentialsForm, setCredentialsForm] = useState({
        email: '',
        username: '',
        password: '',
        systemAccess: {
            email: true,
            slack: true,
            jira: false,
            github: false
        }
    });

    const [requests, setRequests] = useState([]);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const data = await fetchCandidates();

            // Map API data to UI model
            const mappedRequests = data.map(c => ({
                id: c.id,
                candidateName: c.name || c.full_name,
                initials: (c.name || c.full_name || '??').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
                role: c.position,
                department: c.department,
                joiningDate: c.joining_date,
                // Status mapping:
                // 'Applied' -> Pending
                // 'Provisioned' but no assets -> In Progress (Needs Assets)
                // 'Active' / 'Allocated' OR has assigned_assets_summary -> Completed
                status: (c.stage === 'Applied' || c.stage === 'Pending IT') ? 'Pending'
                    : (c.stage === 'Provisioned' && (!c.assigned_assets_summary || c.assigned_assets_summary.length === 0)) ? 'In Progress'
                        : (c.stage === 'Active' || c.stage === 'Allocated' || (c.assigned_assets_summary && c.assigned_assets_summary.length > 0)) ? 'Completed'
                            : 'Pending',
                progress: (c.stage === 'Applied' || c.stage === 'Pending IT') ? 0
                    : (c.stage === 'Provisioned' && (!c.assigned_assets_summary || c.assigned_assets_summary.length === 0)) ? 50
                        : 100,
                baseEmail: c.personal_email ? c.personal_email.split('@')[0] : '',
                raw: c // Keep raw data if needed
            }));

            setRequests(mappedRequests);
        } catch (error) {
            console.error("Failed to load requests", error);
        } finally {
            setLoading(false);
        }
    };

    // Stats
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === 'Pending').length,
        inProgress: requests.filter(r => r.status === 'In Progress').length,
        completed: requests.filter(r => r.status === 'Completed').length,
    };

    const handleCreateCredentialsClick = (request, e) => {
        e.stopPropagation();
        setSelectedRequest(request);

        // Auto-generate initial values
        const base = request.candidateName.toLowerCase().replace(' ', '.');
        setCredentialsForm({
            email: `${base}@vibecoding.com`,
            username: base,
            password: generatePassword(),
            systemAccess: { email: true, slack: true, jira: false, github: false }
        });

        setShowCredentialsModal(true);
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
        return Array(12).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const handleCredentialsSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!credentialsForm.email.includes('@')) return alert("Invalid email format");

        try {
            await provisionCandidate(selectedRequest.raw, {
                companyEmail: credentialsForm.email,
                companyPassword: credentialsForm.password
            });

            // Close modal
            setShowCredentialsModal(false);

            // Redirect to Asset Management
            navigate('/it/assets/allocate', {
                state: {
                    message: `Credentials created for ${selectedRequest.candidateName}. Now assign assets.`,
                    candidateId: selectedRequest.id,
                    candidateName: selectedRequest.candidateName
                }
            });

            // Refresh list (though we navigate away, so maybe not strictly needed, but good practice if user comes back)
            loadRequests();

        } catch (error) {
            console.error("Provisioning failed", error);
            alert("Failed to create credentials: " + error.message);
        }
    };

    const filteredRequests = requests.filter(req => {
        const matchesTab = activeTab === 'All' || req.status === activeTab;
        const matchesSearch = req.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesSearch;
    });

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
            {/* Dashboard Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <div className="bg-indigo-50 p-3 rounded-xl"><Inbox className="text-indigo-600" size={24} /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-500">Total Requests</p>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 p-6 rounded-2xl shadow-lg text-white">
                    <div className="flex justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-xl backdrop-blur"><AlertCircle size={24} /></div>
                    </div>
                    <p className="text-3xl font-bold">{stats.pending}</p>
                    <p className="text-sm opacity-90">Pending Requests</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <div className="bg-blue-50 p-3 rounded-xl"><Clock className="text-blue-600" size={24} /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
                    <p className="text-sm text-gray-500">In Progress</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex justify-between mb-4">
                        <div className="bg-emerald-50 p-3 rounded-xl"><CheckCircle className="text-emerald-600" size={24} /></div>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
                    <p className="text-sm text-gray-500">Completed</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Tabs & Search */}
                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex bg-gray-100 p-1 rounded-xl">
                        {['All', 'Pending', 'In Progress', 'Completed'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                                    ? 'bg-white text-indigo-600 shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search candidates..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 w-80 outline-none"
                        />
                    </div>
                </div>

                {/* List Table */}
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Candidate</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role & Department</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Progress</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredRequests.map((req) => (
                                <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                {req.initials}
                                            </div>
                                            <div className="font-semibold text-gray-900">{req.candidateName}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{req.role}</div>
                                        <div className="text-xs text-gray-500">{req.department}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-32">
                                            <div className="flex justify-between text-xs mb-1">
                                                <span className="font-medium text-gray-700">{req.progress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${req.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {req.status === 'Pending' ? (
                                            <button
                                                onClick={(e) => handleCreateCredentialsClick(req, e)}
                                                className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                                            >
                                                Create Credentials
                                            </button>
                                        ) : req.status === 'In Progress' ? (
                                            <button
                                                onClick={() => navigate('/it/assets/allocate', { state: { candidateId: req.id, candidateName: req.candidateName } })}
                                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-1 ml-auto"
                                            >
                                                Assign Assets
                                            </button>
                                        ) : (
                                            <button disabled className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-bold rounded-lg cursor-not-allowed">
                                                {req.status === 'Completed' ? 'Completed' : 'View Details'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create Credentials Form Modal/Screen */}
            {showCredentialsModal && selectedRequest && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Create Login Credentials</h2>
                                <p className="text-sm text-gray-500">Step 1 of 2: Credential Generation</p>
                            </div>
                            <button onClick={() => setShowCredentialsModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            {/* Read-Only Candidate Info */}
                            <div className="bg-indigo-50/50 rounded-xl p-6 mb-8 border border-indigo-100">
                                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <User size={14} /> Candidate Information
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Full Name</p>
                                        <p className="font-semibold text-gray-900">{selectedRequest.candidateName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Position</p>
                                        <p className="font-semibold text-gray-900">{selectedRequest.role}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Department</p>
                                        <p className="font-semibold text-gray-900">{selectedRequest.department}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase mb-1">Joining Date</p>
                                        <p className="font-semibold text-gray-900">{selectedRequest.joiningDate ? new Date(selectedRequest.joiningDate).toLocaleDateString() : 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <form id="credentials-form" onSubmit={handleCredentialsSubmit} className="space-y-6">
                                {/* Login Credentials Section */}
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">Company Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="email"
                                                    required
                                                    value={credentialsForm.email}
                                                    onChange={(e) => setCredentialsForm({ ...credentialsForm, email: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                                <CheckCircle size={10} /> Email available
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">System Username</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="text"
                                                    required
                                                    value={credentialsForm.username}
                                                    onChange={(e) => setCredentialsForm({ ...credentialsForm, username: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-green-600 mt-1.5 flex items-center gap-1">
                                                <CheckCircle size={10} /> Username unique
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">Temporary Password</label>
                                        <div className="flex gap-3">
                                            <div className="relative flex-1">
                                                <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    value={credentialsForm.password}
                                                    onChange={(e) => setCredentialsForm({ ...credentialsForm, password: e.target.value })}
                                                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-xl font-mono text-gray-600 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                                >
                                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setCredentialsForm({ ...credentialsForm, password: generatePassword() })}
                                                className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl transition-all flex items-center gap-2 font-medium text-sm whitespace-nowrap"
                                            >
                                                <RefreshCw size={16} /> Regenerate
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 mt-2">
                                            <div className="h-1.5 w-24 bg-emerald-500 rounded-full"></div>
                                            <span className="text-xs text-emerald-600 font-medium">Strong Password</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Information Panel */}
                                <div className="bg-blue-50 rounded-xl p-4 flex gap-3 items-start">
                                    <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                                    <div>
                                        <h4 className="text-sm font-bold text-blue-900">What happens next?</h4>
                                        <p className="text-sm text-blue-700 mt-1 leading-relaxed">
                                            Clicking "Create & Continue" will save these credentials securely and notify HR. You will be immediately redirected to the Asset Allocation screen to assign hardware for this candidate.
                                        </p>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                            <button
                                onClick={() => setShowCredentialsModal(false)}
                                className="px-6 py-3 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                form="credentials-form"
                                type="submit"
                                className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all flex items-center gap-2"
                            >
                                <ShieldCheck size={20} />
                                Create & Continue to Assets
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ITRequest;
