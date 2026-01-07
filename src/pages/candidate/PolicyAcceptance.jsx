import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, CheckCircle2, Shield, Calendar, AlertCircle } from 'lucide-react';

const PolicyAcceptance = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [date, setDate] = useState('');
    const [error, setError] = useState('');

    // Auto-fill date on mount
    useEffect(() => {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        setDate(formattedDate);
    }, []);

    const policies = [
        { id: 1, title: 'Code of Conduct', version: 'v2025.1', size: '2.4 MB' },
        { id: 2, title: 'IT Information Security Policy', version: 'v2024.4', size: '1.8 MB' },
        { id: 3, title: 'Employee Handbook', version: 'v2025.0', size: '5.2 MB' },
        { id: 4, title: 'Anti-Harassment Policy', version: 'v2024.2', size: '1.2 MB' },
    ];

    const handleSubmit = () => {
        if (fullName.trim().length < 3) {
            setError('Please enter your full legal name to sign.');
            return;
        }
        // Proceed logic here
        console.log('Accepted by:', fullName);
        navigate('/dashboard'); // Or next step
    };

    return (
        <div className="space-y-6 animate-fade-in-up max-w-4xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Policy Acceptance</h1>
                <p className="text-gray-500 font-medium mt-1">
                    Please review and accept the mandatory company policies to proceed.
                </p>
            </div>

            {/* Required Updates / Policies List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                        <FileText size={20} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">Required Policies</h2>
                </div>

                <div className="space-y-3">
                    {policies.map((policy) => (
                        <div
                            key={policy.id}
                            className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">{policy.title}</h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Version: {policy.version} • {policy.size}
                                    </p>
                                </div>
                            </div>
                            <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                                View
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Digital Signature Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Digital Signature</h2>
                        <p className="text-sm text-gray-500">I certify that I have read and agree to all the policies listed above.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Type Full Legal Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={fullName}
                            onChange={(e) => {
                                setFullName(e.target.value);
                                if (error) setError('');
                            }}
                            placeholder="e.g. Rajesh Kumar"
                            className={`w-full px-4 py-3 bg-gray-50 border ${error ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-indigo-100'} rounded-xl focus:ring-4 transition-all outline-none font-medium`}
                        />
                        {error && (
                            <div className="flex items-center gap-2 mt-2 text-red-600">
                                <AlertCircle size={14} />
                                <span className="text-xs font-medium">{error}</span>
                            </div>
                        )}
                    </div>

                    {/* Date Display */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                            Date
                        </label>
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 font-medium cursor-not-allowed select-none">
                            <Calendar size={18} />
                            {date}
                        </div>
                    </div>
                </div>

                <div className="mt-8 p-4 bg-gray-50 rounded-xl text-xs text-gray-500 leading-relaxed">
                    By clicking "Accept & Continue", you acknowledge that this electronic signature carries the same legal weight as a handwritten signature.
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pt-4">
                <button
                    onClick={() => navigate(-1)}
                    className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                >
                    Back
                </button>
                <button
                    onClick={handleSubmit}
                    className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] transition-all duration-200"
                >
                    Accept & Continue
                </button>
            </div>
        </div>
    );
};

export default PolicyAcceptance;
