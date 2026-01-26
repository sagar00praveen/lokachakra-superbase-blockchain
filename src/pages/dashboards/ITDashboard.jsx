import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Monitor, Server, Key, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TeamPerformanceCard from '../../components/dashboard/TeamPerformanceCard';
import { fetchCandidates, provisionCandidate } from '../../services/api';
import CredentialProvisioningModal from '../../components/dashboard/CredentialProvisioningModal';

const ITDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        pending: 0,
        completed: 0
    });
    const [pendingRequests, setPendingRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Provisioning State
    const [activeCandidate, setActiveCandidate] = useState(null); // The candidate currently being provisioned
    const [isProvisioning, setIsProvisioning] = useState(false);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchCandidates();
            // Filter candidates:
            // 1. Applied: Waiting for Offer (IT sees them but can't act)
            // 2. offer_sent: Offer Sent (IT needs to create credentials)
            // 3. Provisioned: Credentials done (IT needs to assign assets)
            const pending = data.filter(c =>
                c.status === 'Applied' ||
                c.status === 'offer_sent' ||
                c.status === 'Provisioned' ||
                c.status === 'offer_accepted'
            );

            setPendingRequests(pending);
            setStats({
                pending: pending.length,
                completed: data.filter(c => c.status === 'Active' || c.status === 'Allocated').length
            });
        } catch (error) {
            console.error("Failed to load candidates", error);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessClick = (candidate) => {
        setActiveCandidate(candidate);
    };

    const handleAssignAssetsClick = (candidate) => {
        navigate('/it/assets/allocate', { state: { candidateId: candidate.id, candidateName: candidate.name || candidate.full_name } });
    };

    const handleProvisionSubmit = async (candidate, credentials) => {
        setIsProvisioning(true);
        try {
            await provisionCandidate(candidate, credentials);
            alert(`Credentials created for ${candidate.name}!\nEmail: ${credentials.email}`);
            setActiveCandidate(null); // Close modal
            loadData(); // Refresh list
        } catch (error) {
            alert(`Failed to provision: ${error.message}`);
        } finally {
            setIsProvisioning(false);
        }
    };

    return (
        <div className="space-y-8 relative">
            {/* Modal */}
            {activeCandidate && (
                <CredentialProvisioningModal
                    candidate={activeCandidate}
                    onClose={() => setActiveCandidate(null)}
                    onSubmit={handleProvisionSubmit}
                    isProcessing={isProvisioning}
                />
            )}

            {/* Welcome Banner and Stats Cards ... (Keep existing if possible, but for replacement safety I will include them) */}
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to IT Portal</h2>
                <p className="text-emerald-100">Manage accounts, credentials, and system access</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Pending Requests"
                    count={stats.pending}
                    subtitle="Awaiting action"
                    icon={Clock}
                    iconBgClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="Accounts Created"
                    count={stats.completed}
                    subtitle="Total Active"
                    icon={Key}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Systems Configured"
                    count="18"
                    subtitle="Active setups"
                    icon={Server}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Active Tickets"
                    count="5"
                    subtitle="Support requests"
                    icon={AlertCircle}
                    iconBgClass="bg-red-50 text-red-600"
                />
            </div>

            {/* Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamPerformanceCard
                    title="IT Team Performance"
                    rate={50}
                    colorClass="text-emerald-500"
                    metrics={[
                        { label: 'Pending', value: stats.pending, icon: 'clock' },
                        { label: 'In Progress', value: 2, icon: 'alert' },
                        { label: 'Completed', value: stats.completed, icon: 'check' }
                    ]}
                />
                <TeamPerformanceCard
                    title="Account Setup Progress"
                    rate={75}
                    colorClass="text-blue-500"
                    metrics={[
                        { label: 'Email Accounts', value: 24, icon: 'check' },
                        { label: 'System Access', value: 18, icon: 'check' },
                        { label: 'Pending Setup', value: 6, icon: 'clock' }
                    ]}
                />
            </div>

            {/* Pending Requests Table */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Pending IT Requests</h3>
                        <p className="text-sm text-gray-500">Account creation and system setup requests</p>
                    </div>
                    <button onClick={loadData} className="px-4 py-2 bg-emerald-50 text-emerald-600 text-sm font-medium rounded-lg hover:bg-emerald-100 transition-colors">
                        Refresh
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Type</th>
                                <th className="text-left py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="text-center py-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">Loading requests...</td>
                                </tr>
                            ) : pendingRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="py-8 text-center text-gray-500">No pending requests found.</td>
                                </tr>
                            ) : (
                                pendingRequests.map((request) => (
                                    <tr key={request.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-sm text-white shadow-sm">
                                                    {request.name ? request.name.charAt(0) : '?'}
                                                </div>
                                                <span className="font-semibold text-gray-900">{request.name || request.full_name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-sm font-medium text-gray-600">{request.email || request.personal_email}</td>
                                        <td className="py-4 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                                                New Joining
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${['Provisioned', 'Active'].includes(request.status)
                                                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                                                    : 'bg-orange-50 text-orange-700 border-orange-100'
                                                }`}>
                                                {request.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            {/* Logic: 
                                                - Applied: Text "Offer Not Sent"
                                                - offer_sent: Button "Process" (Create Credentials)
                                                - Provisioned: Button "Assign Assets"
                                            */}
                                            {request.status === 'Applied' && (
                                                <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    Offer Not Sent
                                                </span>
                                            )}

                                            {(request.status === 'offer_sent' || request.status === 'offer_accepted') && !request.provisioned_at && (
                                                <button
                                                    onClick={() => handleProcessClick(request)}
                                                    className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-all duration-200 
                                                        flex items-center gap-2 mx-auto shadow-sm shadow-emerald-200"
                                                >
                                                    <CheckCircle2 size={16} />
                                                    Process Creds
                                                </button>
                                            )}

                                            {request.status === 'Provisioned' && (
                                                <button
                                                    onClick={() => handleAssignAssetsClick(request)}
                                                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 
                                                        flex items-center gap-2 mx-auto shadow-sm shadow-blue-200"
                                                >
                                                    <Server size={16} />
                                                    Assign Assets
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ITDashboard;
