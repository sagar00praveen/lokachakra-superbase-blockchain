import React from 'react';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const TeamPerformanceCard = ({ title, rate, metrics, colorClass = "text-indigo-600" }) => {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <div className="p-1.5 bg-gray-50 rounded-lg">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest px-1">Weekly</span>
                </div>
            </div>

            <div className="flex items-center gap-8 mb-8">
                <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                        <circle cx="56" cy="56" r="46" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={289} strokeDashoffset={289 - (289 * rate / 100)} className={`${colorClass} transition-all duration-1000 ease-out`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-bold text-gray-900">{rate}%</span>
                    </div>
                </div>
                <div>
                    <p className="text-sm font-medium text-gray-500">Overall Score</p>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{rate >= 50 ? 'Good' : 'Average'}</h4>
                    <div className="text-xs text-gray-400">vs last week</div>
                </div>
            </div>

            <div className="space-y-4 mt-auto">
                {metrics.map((metric, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100/50 hover:bg-white hover:border-gray-200 transition-colors">
                        <div className="flex items-center gap-3">
                            {metric.icon === 'check' && <CheckCircle2 size={16} className="text-emerald-500" />}
                            {metric.icon === 'clock' && <Clock size={16} className="text-amber-500" />}
                            {metric.icon === 'alert' && <AlertCircle size={16} className="text-blue-500" />}
                            <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                        </div>
                        <span className="font-bold text-gray-900">{metric.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamPerformanceCard;
