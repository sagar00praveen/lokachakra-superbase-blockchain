import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Monitor, Laptop, Smartphone, Printer, HardDrive, Plus, X, Truck, MapPin, Save, CheckCircle, Package, ArrowRight, ArrowLeft } from 'lucide-react';

const AssetAllocation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { candidateName, candidateId } = location.state || { candidateName: 'Sarah Jenkins', candidateId: 'REQ-001' };

    const [availableAssets, setAvailableAssets] = useState([
        { id: 'AS-101', name: 'Dell Latitude 7420', type: 'Laptop', serial: 'DL-7420-001', icon: Laptop },
        { id: 'AS-102', name: 'MacBook Pro M2', type: 'Laptop', serial: 'MBP-M2-005', icon: Laptop },
        { id: 'AS-201', name: 'Dell Ultrasharp 27"', type: 'Monitor', serial: 'DU-27-045', icon: Monitor },
        { id: 'AS-202', name: 'LG 27" 4K', type: 'Monitor', serial: 'LG-4K-012', icon: Monitor },
        { id: 'AS-301', name: 'iPhone 15', type: 'Mobile', serial: 'IP-15-889', icon: Smartphone },
        { id: 'AS-401', name: 'Logitech MX Master 3', type: 'Accessory', serial: 'LOG-MX3-442', icon: HardDrive },
        { id: 'AS-402', name: 'Keychron K2', type: 'Accessory', serial: 'KC-K2-110', icon: HardDrive },
        { id: 'AS-501', name: 'Jabra Evolve 75', type: 'Headset', serial: 'JB-75-001', icon: HardDrive },
    ]);

    const [allocatedAssets, setAllocatedAssets] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Work Setup Form
    const [wfhStatus, setWfhStatus] = useState('Hybrid');
    const [deskLocation, setDeskLocation] = useState('Floor 3, Desk 12');

    // Shipment Details
    const [shippingDetails, setShippingDetails] = useState({
        courier: '',
        trackingId: '',
        address: '123 Main St, Springfield'
    });

    const handleAllocate = (asset) => {
        setAllocatedAssets([...allocatedAssets, asset]);
        setAvailableAssets(availableAssets.filter(a => a.id !== asset.id));
    };

    const handleRemove = (asset) => {
        setAvailableAssets([...availableAssets, asset]);
        setAllocatedAssets(allocatedAssets.filter(a => a.id !== asset.id));
    };

    const filteredAssets = availableAssets.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleComplete = () => {
        // Logic to save allocation
        const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');

        let found = false;
        const updatedCandidates = savedCandidates.map(c => {
            if (c.id === candidateId) {
                found = true;
                return {
                    ...c,
                    status: 'pending_offer',
                    assets: allocatedAssets,
                    workflow: { ...c.workflow, it_assets: true }
                };
            }
            return c;
        });

        if (found) {
            localStorage.setItem('candidates', JSON.stringify(updatedCandidates));
            alert(`Allocation complete for ${candidateName}! Assets assigned: ${allocatedAssets.length}. Sent to HR.`);
        } else {
            // Fallback for mock data that isn't in local storage
            console.warn("Candidate ID not found in storage, assuming mock run.");
            alert(`Allocation complete for ${candidateName}! (Mock Mode)`);
        }

        navigate('/it/requests');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar: Asset Inventory */}
            <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full shadow-lg z-10">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-900 mb-1">Asset Inventory</h2>
                    <p className="text-xs text-gray-500">Available hardware for allocation</p>
                    <div className="mt-4 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input
                            type="text"
                            placeholder="Search assets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {filteredAssets.length > 0 ? (
                        filteredAssets.map((asset) => (
                            <div
                                key={asset.id}
                                className="group p-3 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
                                onClick={() => handleAllocate(asset)}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500 group-hover:text-indigo-600 transition-colors">
                                        <asset.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-900">{asset.name}</h4>
                                        <p className="text-xs text-gray-500 font-mono">{asset.serial}</p>
                                    </div>
                                </div>
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    <Plus size={14} />
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-gray-400">
                            <Package size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No assets found</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Main Area: Allocation Drop Zone */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-8 py-5 flex justify-between items-center shadow-sm z-20">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                            <span className="font-medium text-indigo-600">Step 2 of 2</span>
                            <span>•</span>
                            <span>Asset Allocation</span>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">Allocating to {candidateName}</h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2">
                            <Save size={18} /> Save Draft
                        </button>
                        <button
                            onClick={handleComplete}
                            disabled={allocatedAssets.length === 0}
                            className={`px-6 py-2.5 text-white font-medium rounded-xl transition-all shadow-lg flex items-center gap-2 ${allocatedAssets.length > 0 ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' : 'bg-gray-300 cursor-not-allowed shadow-none'
                                }`}
                        >
                            <CheckCircle size={18} /> Complete Allocation
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8">
                    <div className="max-w-5xl mx-auto space-y-8">
                        {/* Drag & Drop Zone Simulation */}
                        <div className="bg-white rounded-3xl border-2 border-dashed border-indigo-100 p-8 min-h-[300px] transition-all bg-indigo-50/30">
                            <div className="flex justify-between items-end mb-6">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Allocated Assets</h3>
                                    <p className="text-sm text-gray-500">Tap assets from the sidebar to add them here</p>
                                </div>
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">
                                    {allocatedAssets.length} items
                                </span>
                            </div>

                            {allocatedAssets.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {allocatedAssets.map((asset) => (
                                        <div key={asset.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center justify-between group animate-in fade-in zoom-in duration-200">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                                                    <asset.icon size={20} />
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-semibold text-gray-900">{asset.name}</h4>
                                                    <p className="text-xs text-gray-500 font-mono">{asset.serial}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemove(asset)}
                                                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-40 flex flex-col items-center justify-center text-gray-400">
                                    <Package size={48} className="mb-3 opacity-20" />
                                    <p className="font-medium">Workstation is empty</p>
                                    <p className="text-sm">Select inventory from left sidebar</p>
                                </div>
                            )}
                        </div>

                        {/* Additional Sections Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Work Setup */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Monitor size={18} className="text-gray-400" /> Work Setup
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Work Mode</label>
                                        <select
                                            value={wfhStatus}
                                            onChange={(e) => setWfhStatus(e.target.value)}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        >
                                            <option value="On-site">On-site</option>
                                            <option value="Hybrid">Hybrid</option>
                                            <option value="Remote">Remote</option>
                                        </select>
                                    </div>

                                    {wfhStatus !== 'Remote' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Desk Location</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                                                <input
                                                    type="text"
                                                    value={deskLocation}
                                                    onChange={(e) => setDeskLocation(e.target.value)}
                                                    className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipment Details */}
                            <div className={`bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-opacity ${wfhStatus === 'On-site' ? 'opacity-50 pointer-events-none' : ''}`}>
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                    <Truck size={18} className="text-gray-400" /> Shipment Details
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Courier Service</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. FedEx, DHL"
                                            value={shippingDetails.courier}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, courier: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tracking ID</label>
                                        <input
                                            type="text"
                                            placeholder="Tracking Number"
                                            value={shippingDetails.trackingId}
                                            onChange={(e) => setShippingDetails({ ...shippingDetails, trackingId: e.target.value })}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssetAllocation;
