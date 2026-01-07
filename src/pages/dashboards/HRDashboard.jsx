import React from 'react';
import { Users, UserCheck, Clock, Activity } from 'lucide-react';
import StatCard from '../../components/dashboard/StatCard';
import TeamPerformanceCard from '../../components/dashboard/TeamPerformanceCard';
import ActiveCandidates from '../../components/dashboard/ActiveCandidates';

const HRDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Welcome to HR Portal</h2>
                <p className="text-blue-100">Manage candidates, send offers, and streamline onboarding</p>
            </div>

            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Candidates"
                    count="6"
                    subtitle="All tracked candidates"
                    icon={Users}
                    iconBgClass="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="Pending"
                    count="2"
                    subtitle="Awaiting action"
                    icon={Clock}
                    iconBgClass="bg-orange-50 text-orange-600"
                />
                <StatCard
                    title="In Progress"
                    count="2"
                    subtitle="Onboarding active"
                    icon={Activity}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Completed"
                    count="2"
                    subtitle="Onboarding finished"
                    icon={UserCheck}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
            </div>

            {/* Performance Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TeamPerformanceCard
                    title="HR Team Performance"
                    rate={0}
                    colorClass="text-blue-500"
                    metrics={[
                        { label: 'Total Tasks', value: 11, icon: 'alert' },
                        { label: 'Completed', value: 0, icon: 'check' },
                        { label: 'Pending', value: 11, icon: 'clock' }
                    ]}
                />
                <TeamPerformanceCard
                    title="Onboarding Progress"
                    rate={15}
                    colorClass="text-emerald-500"
                    metrics={[
                        { label: 'In Progress', value: 6, icon: 'clock' },
                        { label: 'Documents Pending', value: 4, icon: 'alert' },
                        { label: 'Completed', value: 2, icon: 'check' }
                    ]}
                />
            </div>

            {/* Active Candidates */}
            <ActiveCandidates />
        </div>
    );
};

export default HRDashboard;
