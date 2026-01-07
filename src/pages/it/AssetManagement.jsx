import React, { useState } from 'react';
import { Search, Monitor, Laptop, Smartphone, Printer, HardDrive, Plus, Filter, MoreVertical, X, CheckCircle, RefreshCw, AlertTriangle, UserPlus, Edit2 } from 'lucide-react';

const AssetManagement = () => {
    const [filterType, setFilterType] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [formData, setFormData] = useState({
        name: '', type: 'Laptop', brand: '', model: '', serialNumber: '', status: 'Available'
    });
    const [assignData, setAssignData] = useState({ user: '', email: '', department: '' });

    const [assets, setAssets] = useState([
        {
            id: 'AS-001',
            name: 'Dell Latitude 7420',
            brand: 'Dell',
            model: 'Latitude 7420',
            type: 'Laptop',
            assignedTo: 'Sarah Jenkins',
            email: 'sarah.jenkins@example.com',
            department: 'Product',
            status: 'Assigned',
            serialNumber: 'DL7420-2023-001',
            specs: 'i7, 16GB RAM, 512GB SSD',
        },
        {
            id: 'AS-002',
            name: 'HP Monitor 27"',
            brand: 'HP',
            model: 'E27G4',
            type: 'Monitor',
            assignedTo: 'Michael Ross',
            email: 'michael.ross@example.com',
            department: 'Legal',
            status: 'Assigned',
            serialNumber: 'HP27-2023-045',
            specs: '4K IPS, USB-C Hub',
        },
        {
            id: 'AS-003',
            name: 'Apple iPhone 14 Pro',
            brand: 'Apple',
            model: 'iPhone 14 Pro',
            type: 'Mobile',
            assignedTo: 'Rachel Zane',
            email: 'rachel.zane@example.com',
            department: 'Legal',
            status: 'Assigned',
            serialNumber: 'IP14P-2023-112',
            specs: '256GB, Space Black',
        },
        {
            id: 'AS-004',
            name: 'HP LaserJet Pro',
            brand: 'HP',
            model: 'LaserJet Pro M404n',
            type: 'Printer',
            assignedTo: null,
            department: 'IT',
            status: 'Available',
            serialNumber: 'HPLJ-2022-089',
            specs: 'Color Laser, Network Ready',
        },
        {
            id: 'AS-005',
            name: 'Lenovo ThinkPad X1',
            brand: 'Lenovo',
            model: 'ThinkPad X1 Carbon',
            type: 'Laptop',
            assignedTo: 'Dwight Schrute',
            email: 'dwight.schrute@example.com',
            department: 'Sales',
            status: 'Maintenance',
            serialNumber: 'LTX1-2023-078',
            specs: 'i9, 32GB RAM, 1TB SSD',
        },
        {
            id: 'AS-006',
            name: 'SanDisk Extreme Pro',
            brand: 'SanDisk',
            model: 'Extreme Pro',
            type: 'Storage',
            assignedTo: null,
            department: 'IT',
            status: 'Available',
            serialNumber: 'SD2TB-2023-034',
            specs: '2TB NVMe, Portable',
        },
    ]);

    const filteredAssets = assets.filter(asset => {
        const matchesStatus = filterType === 'All' || asset.status === filterType;
        const matchesSearch =
            asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
            asset.brand.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const handleAddAsset = (e) => {
        e.preventDefault();
        // Validation for duplicate serial number
        if (assets.some(a => a.serialNumber === formData.serialNumber)) {
            alert('Error: Serial number must be unique.');
            return;
        }

        const newAsset = {
            id: `AS-00${assets.length + 1}`,
            ...formData,
            name: `${formData.brand} ${formData.model}`,
            specs: 'N/A', // Default place holder
            assignedTo: null
        };
        setAssets([...assets, newAsset]);
        setShowAddModal(false);
        setFormData({ name: '', type: 'Laptop', brand: '', model: '', serialNumber: '', status: 'Available' });
    };

    const handleAssignAsset = (e) => {
        e.preventDefault();
        setAssets(assets.map(a => a.id === selectedAsset.id ? { ...a, status: 'Assigned', assignedTo: assignData.user, email: assignData.email, department: assignData.department } : a));
        setShowAssignModal(false);
        setAssignData({ user: '', email: '', department: '' });
        setSelectedAsset(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Assigned': return 'bg-green-100 text-green-700 border-green-200';
            case 'Available': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Maintenance': return 'bg-amber-100 text-amber-700 border-amber-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getAssetIcon = (type) => {
        switch (type) {
            case 'Laptop': return <Laptop size={20} className="text-indigo-600" />;
            case 'Monitor': return <Monitor size={20} className="text-indigo-600" />;
            case 'Mobile': return <Smartphone size={20} className="text-indigo-600" />;
            case 'Printer': return <Printer size={20} className="text-indigo-600" />;
            case 'Storage': return <HardDrive size={20} className="text-indigo-600" />;
            default: return <Monitor size={20} className="text-indigo-600" />;
        }
    };

    // Stats calculation
    const stats = {
        total: assets.length,
        available: assets.filter(a => a.status === 'Available').length,
        assigned: assets.filter(a => a.status === 'Assigned').length,
        maintenance: assets.filter(a => a.status === 'Maintenance').length
    };

    return (
        <div className="p-8 space-y-6 min-h-screen bg-gray-50">
            {/* Header Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search ID, Serial, Brand..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none shadow-sm cursor-pointer"
                    >
                        <option value="All">All Status</option>
                        <option value="Available">Available</option>
                        <option value="Assigned">Assigned</option>
                        <option value="Maintenance">Maintenance</option>
                    </select>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium"
                >
                    <Plus size={20} />
                    Add Asset
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
                            <Monitor className="text-indigo-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">TOTAL</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-sm text-gray-500 mt-1">Total Assets</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <CheckCircle className="text-blue-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">AVAILABLE</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.available}</p>
                    <p className="text-sm text-gray-500 mt-1">Ready for Allocation</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <UserPlus className="text-green-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">ASSIGNED</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.assigned}</p>
                    <p className="text-sm text-gray-500 mt-1">Currently Deployed</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                            <RefreshCw className="text-amber-600" size={24} />
                        </div>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">MAINTENANCE</span>
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.maintenance}</p>
                    <p className="text-sm text-gray-500 mt-1">Under Repair</p>
                </div>
            </div>

            {/* Assets Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Asset ID</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Serial Number</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Brand & Model</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned To</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssets.map((asset) => (
                                <tr key={asset.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-sm font-medium text-gray-900">{asset.id}</td>
                                    <td className="px-6 py-4 font-mono text-sm text-gray-500">{asset.serialNumber}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getAssetIcon(asset.type)}
                                            <span className="text-sm text-gray-700">{asset.type}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{asset.brand}</div>
                                        <div className="text-xs text-gray-500">{asset.model}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(asset.status)}`}>
                                            {asset.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {asset.assignedTo ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs font-bold text-indigo-600">
                                                    {asset.assignedTo.charAt(0)}
                                                </div>
                                                <span className="text-sm text-gray-700 font-medium">{asset.assignedTo}</span>
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400 italic">Unassigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {asset.status === 'Available' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedAsset(asset);
                                                        setShowAssignModal(true);
                                                    }}
                                                    className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-xs font-medium"
                                                >
                                                    Assign
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-indigo-600 transition-colors">
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Asset Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">Add New Asset</h2>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddAsset} className="p-6 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Model</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        value={formData.model}
                                        onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                                <input
                                    required
                                    type="text"
                                    placeholder="e.g. SN-2024-XXXX"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    value={formData.serialNumber}
                                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="Laptop">Laptop</option>
                                        <option value="Monitor">Monitor</option>
                                        <option value="Mobile">Mobile</option>
                                        <option value="Printer">Printer</option>
                                        <option value="Storage">Storage</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Available">Available</option>
                                        <option value="Maintenance">Maintenance</option>
                                        <option value="Retired">Retired</option>
                                    </select>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Add Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Asset Modal */}
            {showAssignModal && selectedAsset && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Assign Asset</h2>
                                <p className="text-sm text-gray-500">{selectedAsset.brand} {selectedAsset.model} ({selectedAsset.serialNumber})</p>
                            </div>
                            <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAssignAsset} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (Employee Name)</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    value={assignData.user}
                                    onChange={(e) => setAssignData({ ...assignData, user: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    value={assignData.email}
                                    onChange={(e) => setAssignData({ ...assignData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                <select
                                    required
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    value={assignData.department}
                                    onChange={(e) => setAssignData({ ...assignData, department: e.target.value })}
                                >
                                    <option value="">Select Department</option>
                                    <option value="IT">IT</option>
                                    <option value="HR">HR</option>
                                    <option value="Sales">Sales</option>
                                    <option value="Legal">Legal</option>
                                    <option value="Product">Product</option>
                                    <option value="Engineering">Engineering</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">Confirm Assignment</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssetManagement;
