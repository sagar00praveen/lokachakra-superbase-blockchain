import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeamCard from '../components/dashboard/TeamCard';
import { Users, Briefcase, AlertCircle } from 'lucide-react';

const TeamsOverview = () => {
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Mock API Call
        const fetchTeams = async () => {
            setIsLoading(true);
            try {
                // Simulate network delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                const mockData = [
                    {
                        id: 'hr',
                        name: 'HR Team',
                        memberCount: 8,
                        metrics: [
                            { label: 'Total Tasks', value: 124, icon: 'task' },
                            { label: 'Completed Tasks', value: 98, icon: 'check' },
                            { label: 'Pending Tasks', value: 26, icon: 'clock' },
                            { label: 'Active Candidates', value: 12, icon: 'alert' }
                        ],
                        metricColors: { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                        pathColor: '#3b82f6'
                    },
                    {
                        id: 'it',
                        name: 'IT Team',
                        memberCount: 12,
                        metrics: [
                            { label: 'Total Tasks', value: 85, icon: 'task' },
                            { label: 'Completed Tasks', value: 78, icon: 'check' },
                            { label: 'Pending Tasks', value: 7, icon: 'clock' },
                            { label: 'Available Assets', value: 15, icon: 'alert' }
                        ],
                        metricColors: { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                        pathColor: '#10b981'
                    },
                    {
                        id: 'engineering',
                        name: 'Engineering',
                        memberCount: 24,
                        metrics: [
                            { label: 'Total Tasks', value: 340, icon: 'task' },
                            { label: 'Completed Tasks', value: 210, icon: 'check' },
                            { label: 'Pending Tasks', value: 130, icon: 'clock' },
                            { label: 'Active Sprints', value: 4, icon: 'alert' }
                        ],
                        metricColors: { text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
                        pathColor: '#8b5cf6'
                    },
                    {
                        id: 'sales',
                        name: 'Sales Team',
                        memberCount: 15,
                        metrics: [
                            { label: 'Total Tasks', value: 150, icon: 'task' },
                            { label: 'Completed Tasks', value: 120, icon: 'check' },
                            { label: 'Pending Tasks', value: 30, icon: 'clock' },
                            { label: 'Leads Closed', value: 45, icon: 'alert' }
                        ],
                        metricColors: { text: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
                        pathColor: '#f59e0b'
                    }
                ];
                setTeams(mockData);
            } catch (error) {
                console.error("Failed to fetch teams:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTeams();
    }, []);

    const calculateCompletionRate = (metrics) => {
        const total = metrics.find(m => m.label === 'Total Tasks')?.value || 0;
        const completed = metrics.find(m => m.label === 'Completed Tasks')?.value || 0;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-pulse">
                <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-96 bg-gray-200 rounded-2xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (teams.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-3xl border border-dashed border-gray-300">
                <div className="p-4 bg-gray-50 rounded-full mb-4">
                    <Users size={32} className="text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">No Teams Found</h3>
                <p className="text-gray-500 text-center mt-2 max-w-sm">
                    There are no teams currently active in the system. Start by creating a new team.
                </p>
                <button className="mt-6 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200">
                    Create Team
                </button>
            </div>
        );
    }

    return (
        <div className="animate-fade-in-up space-y-8">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Teams Overview</h1>
                    <p className="text-base font-medium text-gray-500 mt-2">Detailed view of all team activities and performance</p>
                </div>
                <button className="px-5 py-2.5 bg-white border border-gray-200 hover:border-indigo-200 hover:text-indigo-600 text-gray-700 font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2">
                    <Briefcase size={18} />
                    Manage Teams
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4 gap-6">
                {teams.map((team) => (
                    <div
                        key={team.id}
                        onClick={() => navigate(`/admin/teams/${team.id}`)}
                        className="cursor-pointer group"
                    >
                        <TeamCard
                            teamName={team.name}
                            memberCount={team.memberCount}
                            metrics={team.metrics}
                            completionRate={calculateCompletionRate(team.metrics)}
                            pathColor={team.pathColor}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamsOverview;
