import React, { useState } from 'react';
import { X, Mail, Lock, User, CheckCircle2 } from 'lucide-react';

const CredentialProvisioningModal = ({ candidate, onClose, onSubmit, isProcessing }) => {
    const [email, setEmail] = useState(() => {
        // Suggest email: firstname.lastname@lokachakra.com
        const names = candidate.name.toLowerCase().split(' ');
        const handle = names.length > 1 ? `${names[0]}.${names[1]}` : names[0];
        return `${handle}@lokachakra.com`;
    });
    const [password, setPassword] = useState('Welcome@2026'); // Default temp password

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(candidate, { companyEmail: email, companyPassword: password });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-fade-in-up">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">

                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                        disabled={isProcessing}
                    >
                        <X size={18} />
                    </button>
                    <h3 className="text-xl font-bold">Provision Credentials</h3>
                    <p className="text-emerald-100 text-sm mt-1">
                        Create official access for {candidate.name}
                    </p>
                </div>

                {/* Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Company Email
                            </label>
                            <div className="relative group">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700"
                                    placeholder="username@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 ml-1">
                                Temporary Password
                            </label>
                            <div className="relative group">
                                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-medium text-gray-700"
                                    placeholder="Enter password"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-2 ml-1">
                                Share this securely with the candidate for their first login.
                            </p>
                        </div>

                        {/* Summary Info */}
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                            <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600 shrink-0">
                                <User size={16} />
                            </div>
                            <div>
                                <h4 className="text-sm font-semibold text-blue-900">Account Access</h4>
                                <p className="text-xs text-blue-700 mt-0.5 leading-relaxed">
                                    Candidate will be assigned the <strong>CANDIDATE</strong> role and granted access to the onboarding portal.
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isProcessing}
                                className={`
                                    w-full py-3.5 rounded-xl text-white font-semibold shadow-lg shadow-emerald-200
                                    transform active:scale-[0.98] transition-all duration-200
                                    bg-emerald-600 hover:bg-emerald-700
                                    flex items-center justify-center gap-2
                                    ${isProcessing ? 'opacity-80 cursor-wait' : ''}
                                `}
                            >
                                {isProcessing ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={18} />
                                        Create Credentials
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CredentialProvisioningModal;
