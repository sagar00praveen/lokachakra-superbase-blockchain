import React from 'react';
import { Users, UserCheck, ClipboardList, Monitor } from 'lucide-react';
import StatCard from '../components/dashboard/StatCard';
import TeamPerformanceCard from '../components/dashboard/TeamPerformanceCard';
import ActiveCandidates from '../components/dashboard/ActiveCandidates';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Candidates"
                    count="6"
                    subtitle="6 active in system"
                    icon={Users}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Onboarding Complete"
                    count="0"
                    subtitle="Successfully onboarded"
                    icon={UserCheck}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Pending HR Tasks"
                    count="11"
                    subtitle="11 out of 11 total"
                    icon={ClipboardList}
                    iconBgClass="bg-amber-50 text-amber-600"
                />
                <StatCard
                    title="Pending IT Requests"
                    count="3"
                    subtitle="0 in progress"
                    icon={Monitor}
                    iconBgClass="bg-indigo-50 text-indigo-600"
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
                    title="IT Team Performance"
                    rate={50}
                    colorClass="text-emerald-500"
                    metrics={[
                        { label: 'Pending', value: 3, icon: 'clock' },
                        { label: 'In Progress', value: 0, icon: 'alert' },
                        { label: 'Completed', value: 3, icon: 'check' }
                    ]}
                />
            </div>

            {/* Active Candidates */}
            <ActiveCandidates />
        </div>
    );
};

export default Dashboard;
