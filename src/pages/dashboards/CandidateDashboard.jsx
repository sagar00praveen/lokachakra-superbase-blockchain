import React from 'react';
import { Check, CheckCircle2 } from 'lucide-react';

const CandidateDashboard = () => {
    // Steps configuration
    const steps = [
        { id: 1, label: 'Accept Offer', completed: true },
        { id: 2, label: 'Upload Documents', completed: true },
        { id: 3, label: 'Personal Information', completed: true },
        { id: 4, label: 'Policy Acceptance', completed: true },
        { id: 5, label: 'Device Receipt', completed: true }
    ];

    const completedSteps = steps.filter(s => s.completed).length;
    const totalSteps = steps.length;
    const progress = (completedSteps / totalSteps) * 100;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Top Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, cand3!</h1>
                <p className="text-gray-500 mt-2 font-medium">Here is your onboarding progress status.</p>
            </div>

            {/* Overall Progress Section */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Onboarding Progress</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            <span className="font-bold text-indigo-600">{completedSteps} of {totalSteps}</span> steps completed
                        </p>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                        {progress}% Complete
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                    <div
                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step Tracker Row */}
                <div className="flex flex-col md:flex-row justify-between relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[15px] left-0 w-full h-0.5 bg-gray-100 -z-10" />
                    <div className="hidden md:block absolute top-[15px] left-0 h-0.5 bg-emerald-500 -z-10 transition-all duration-1000" style={{ width: '100%' }} />

                    {steps.map((step) => (
                        <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 mb-4 md:mb-0 group">
                            {/* Step Circle */}
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-200 ring-4 ring-white z-10 transition-transform hover:scale-110">
                                <Check size={16} strokeWidth={3} />
                            </div>
                            {/* Label */}
                            <span className="text-sm font-semibold text-gray-700 md:text-center group-hover:text-indigo-600 transition-colors">
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Success Card */}
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-12 text-center relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-100 rounded-full opacity-50 blur-3xl group-hover:opacity-75 transition-opacity" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-100 rounded-full opacity-50 blur-3xl group-hover:opacity-75 transition-opacity" />

                <div className="relative z-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200 animate-bounce-short">
                        <CheckCircle2 size={48} className="text-white" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">
                        Thank you for completing the onboarding process. Your profile is now active and you are ready to start.
                    </p>

                    <button className="mt-8 px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-md hover:shadow-lg border border-indigo-100 hover:scale-105 transition-all duration-200">
                        View My Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
