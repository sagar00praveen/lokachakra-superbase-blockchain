import React, { useState } from 'react';
import {
    Monitor,
    Smartphone,
    Headphones,
    Mouse,
    Shield,
    Eye,
    EyeOff,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

const DeviceReceipt = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [acknowledged, setAcknowledged] = useState(false);

    // Mock Data
    const workstation = {
        model: 'MacBook Pro 16" (M3 Max)',
        serial: 'FVFXG1JJP1',
        assetId: 'LOKA-LT-2026-005',
        status: 'Assigned',
        specs: '32GB RAM / 1TB SSD / Space Gray'
    };

    const assets = [
        { id: 1, name: 'Magic Mouse', assetId: 'LOKA-ACC-102', serial: 'MM-998877', type: 'Peripheral', icon: Mouse },
        { id: 2, name: 'Bose QC45 Headphones', assetId: 'LOKA-AUD-055', serial: 'BO-445566', type: 'Audio', icon: Headphones },
        { id: 3, name: 'iPhone 15 (Test Device)', assetId: 'LOKA-MOB-012', serial: 'IP-112233', type: 'Mobile', icon: Smartphone },
    ];

    const credentials = {
        email: 'alex.morgan@lokachakra.com',
        username: 'alex.morgan',
        tempPassword: 'ChangeMe@2026!'
    };

    const handleAcknowledge = () => {
        setAcknowledged(true);
        // API call to confirm receipt would go here
    };

    return (
        <div className="space-y-6 animate-fade-in-up max-w-5xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Device Receipt & Acknowledgement</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">Review your assigned assets and system credentials</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Hardware */}
                <div className="space-y-6">
                    {/* Primary Workstation */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Monitor size={100} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Monitor className="text-indigo-600" size={20} />
                            Primary Workstation
                        </h3>

                        <div className="space-y-4 relative z-10">
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">Model Name</span>
                                <span className="text-sm font-bold text-gray-900">{workstation.model}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">specs</span>
                                <span className="text-sm font-medium text-gray-700">{workstation.specs}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">Serial Number</span>
                                <span className="text-sm font-mono text-gray-700">{workstation.serial}</span>
                            </div>
                            <div className="flex justify-between border-b border-gray-50 pb-2">
                                <span className="text-sm text-gray-500">Asset ID</span>
                                <span className="text-sm font-mono font-bold text-indigo-600">{workstation.assetId}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm text-gray-500">Allocation Status</span>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                    {workstation.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Additional Assets */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Additional Assets</h3>
                        <div className="space-y-4">
                            {assets.map((asset) => (
                                <div key={asset.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                                    <div className="p-2 bg-white rounded-lg text-indigo-600 shadow-sm">
                                        <asset.icon size={20} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-gray-900">{asset.name}</h4>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">S/N: {asset.serial}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-xs font-bold text-gray-400 uppercase">Asset ID</span>
                                        <span className="text-xs font-mono text-gray-700">{asset.assetId}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Credentials & Actions */}
                <div className="space-y-6">
                    {/* System Credentials */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Shield size={120} />
                        </div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Shield className="text-emerald-400" size={20} />
                            System Credentials
                        </h3>

                        <div className="space-y-6 relative z-10">
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Company Email</p>
                                <p className="font-mono text-lg font-medium text-white">{credentials.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">System Username</p>
                                <p className="font-mono text-lg font-medium text-white">{credentials.username}</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    Temporary Password
                                    <AlertTriangle size={12} className="text-amber-400" />
                                </p>
                                <div className="flex items-center justify-between">
                                    <p className="font-mono text-xl font-bold tracking-widest text-emerald-400">
                                        {showPassword ? credentials.tempPassword : '••••••••••••'}
                                    </p>
                                    <button
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">
                                    Please change this password immediately after your first login.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Acknowledgement Action */}
                    <div className={`rounded-2xl border p-6 transition-all duration-300 ${acknowledged ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-indigo-100 shadow-md shadow-indigo-50'}`}>
                        {acknowledged ? (
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-short">
                                    <CheckCircle2 size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Receipt Acknowledged</h3>
                                <p className="text-sm text-gray-600 mt-1">Confirmed on {new Date().toLocaleDateString()}</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Acknowledgement Required</h3>
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    I confirm that I have received the assets listed above in good working condition and I have noted my initial login credentials.
                                </p>
                                <button
                                    onClick={handleAcknowledge}
                                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-2"
                                >
                                    <CheckCircle2 size={20} />
                                    Acknowledge Receipt
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DeviceReceipt;
