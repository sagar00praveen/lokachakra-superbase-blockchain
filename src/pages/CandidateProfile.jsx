import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Mail,
    Phone,
    MapPin,
    Briefcase,
    User,
    Shield,
    FileText,
    CheckCircle2,
    AlertCircle,
    ArrowLeft,
    Send,
    Upload,
    Eye,
    EyeOff,
    MoreHorizontal
} from 'lucide-react';

const CandidateProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    // Mock Data (In a real app, fetch based on ID)
    const candidate = {
        id: 1,
        name: 'Rajesh Kumar',
        // Status & Progress
        status: 'In Progress',
        progress: 65,
        // Contact
        email: 'rajesh.kumar@email.com',
        phone: '+91 98765 43210',
        department: 'Engineering',
        // Job Details
        position: 'Senior Software Engineer',
        type: 'Full-Time',
        location: 'Bangalore, India',
        ctc: '₹24,00,000',
        joiningDate: '2026-01-15',
        // Assignments
        hrAssigned: 'Priya Sharma',
        itAssigned: 'Vikram Singh',
        manager: 'Amit Patel',
        // Credentials
        companyEmail: 'rajesh.k@lokachakra.com',
        username: 'rajesh.k',
        tempPassword: 'Lok@2026(Temp)',
        // Documents
        documents: [
            { name: 'Offer Letter Signed', status: 'uploaded' },
            { name: 'Aadhar Card', status: 'uploaded' },
            { name: 'PAN Card', status: 'pending' },
            { name: 'Previous Relieving Letter', status: 'pending' }
        ]
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Pending': return 'bg-orange-100 text-orange-700 border-orange-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up max-w-7xl mx-auto">
            {/* Header & Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Candidates</span>
                </button>
                <div className="flex gap-3">
                    <button className="px-4 py-2 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Edit Profile
                    </button>
                    <button className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 shadow-sm">
                        <MoreHorizontal size={20} />
                    </button>
                </div>
            </div>

            {/* Main Profile Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 shadow-inner">
                            {candidate.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(candidate.status)}`}>
                                    {candidate.status}
                                </span>
                            </div>
                            <p className="text-gray-500 font-medium">{candidate.position} • {candidate.department}</p>
                        </div>
                    </div>

                    <div className="min-w-[240px]">
                        <div className="flex justify-between text-sm font-semibold mb-2">
                            <span className="text-gray-500">Onboarding Progress</span>
                            <span className="text-indigo-600">{candidate.progress}%</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${candidate.progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Key Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Contact & Job Info */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" />
                                Personal & Job Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Mail size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Email</p>
                                        <p className="text-sm font-semibold text-gray-700">{candidate.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Phone size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Phone</p>
                                        <p className="text-sm font-semibold text-gray-700">{candidate.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Briefcase size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Employment Type</p>
                                        <p className="text-sm font-semibold text-gray-700">{candidate.type}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                                        <MapPin size={16} />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Location</p>
                                        <p className="text-sm font-semibold text-gray-700">{candidate.location}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 pt-2 border-t border-gray-50">
                                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center text-green-600">
                                        <span className="font-bold text-xs">₹</span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">Annual CTC</p>
                                        <p className="text-sm font-bold text-gray-900">{candidate.ctc}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assignments */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Shield size={16} className="text-indigo-500" />
                                Assignments
                            </h3>
                            <div className="space-y-5">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-500">Reporting Manager</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl">
                                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                                            {candidate.manager.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{candidate.manager}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-500">HR POC</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl">
                                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-xs font-bold text-pink-600">
                                            {candidate.hrAssigned.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{candidate.hrAssigned}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs font-semibold text-gray-500">IT Administrator</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-gray-50 p-2.5 rounded-xl">
                                        <div className="w-8 h-8 bg-cyan-100 rounded-full flex items-center justify-center text-xs font-bold text-cyan-600">
                                            {candidate.itAssigned.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <span className="text-sm font-semibold text-gray-800">{candidate.itAssigned}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* IT Credentials Card (Secure View) */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Shield size={120} />
                        </div>
                        <h3 className="text-sm font-bold uppercase tracking-wider mb-6 flex items-center gap-2 text-gray-300">
                            <Shield size={16} />
                            IT Credentials
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Company Email</p>
                                <p className="font-mono font-medium text-emerald-400">{candidate.companyEmail}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Username</p>
                                <p className="font-mono font-medium text-white">{candidate.username}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 mb-1">Temporary Password</p>
                                <div className="flex items-center gap-2">
                                    <p className="font-mono font-bold text-white tracking-widest">
                                        {showPassword ? candidate.tempPassword : '••••••••••••'}
                                    </p>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Actions & Docs */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/send-offer-letter')}
                                className="w-full py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-colors flex items-center justify-between group"
                            >
                                <span>Send Offer Letter</span>
                                <Send size={18} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
                            </button>
                            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-between">
                                <span>Upload Documents</span>
                                <Upload size={18} />
                            </button>
                            <button className="w-full py-3 px-4 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 text-gray-700 font-semibold rounded-xl transition-all flex items-center justify-between">
                                <span>Mark Step Complete</span>
                                <CheckCircle2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Documents List */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Documents</h3>
                            <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {candidate.documents.filter(d => d.status === 'uploaded').length}/{candidate.documents.length}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {candidate.documents.map((doc, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-gray-200 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${doc.status === 'uploaded' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-50 text-gray-400'}`}>
                                            <FileText size={16} />
                                        </div>
                                        <span className={`text-sm font-medium ${doc.status === 'uploaded' ? 'text-gray-900' : 'text-gray-500'}`}>
                                            {doc.name}
                                        </span>
                                    </div>
                                    {doc.status === 'uploaded' ? (
                                        <CheckCircle2 size={16} className="text-emerald-500" />
                                    ) : (
                                        <AlertCircle size={16} className="text-amber-500" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Policy Assignment */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white text-center">
                        <FileText size={40} className="mx-auto mb-3 opacity-80" />
                        <h3 className="font-bold text-lg mb-2">Company Policies</h3>
                        <p className="text-indigo-100 text-sm mb-4">Assign mandatory reading policies to this candidate.</p>
                        <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg font-semibold transition-colors">
                            Assign Policies
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateProfile;
