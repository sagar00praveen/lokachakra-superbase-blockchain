import React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, Clock, AlertCircle, Briefcase, Users } from 'lucide-react';

const TeamCard = ({
    teamName,
    memberCount,
    metrics,
    completionRate,
    colorClass = "text-indigo-600",
    pathColor = "#4f46e5"
}) => {
    // Calculate circle progress
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (completionRate / 100) * circumference;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-xl font-bold text-gray-900">{teamName}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-2">
                        <Users size={16} />
                        {memberCount} members
                    </p>
                </div>
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke="#f3f4f6"
                            strokeWidth="6"
                            fill="transparent"
                        />
                        <circle
                            cx="40"
                            cy="40"
                            r={radius}
                            stroke={pathColor}
                            strokeWidth="6"
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-900">{completionRate}%</span>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-white hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3">
                            {metric.icon === 'task' && <Briefcase size={16} className="text-gray-500" />}
                            {metric.icon === 'check' && <CheckCircle2 size={16} className="text-emerald-500" />}
                            {metric.icon === 'clock' && <Clock size={16} className="text-amber-500" />}
                            {metric.icon === 'alert' && <AlertCircle size={16} className="text-blue-500" />}
                            <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                        </div>
                        <span className="font-bold text-gray-900">{metric.value}</span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline transition-colors">
                    View Details
                </button>
            </div>
        </div>
    );
};

export default TeamCard;
