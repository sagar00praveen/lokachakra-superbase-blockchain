import React, { useEffect, useState } from 'react';
import { Check, CheckCircle2, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchCurrentCandidate } from '../../services/api';

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await fetchCurrentCandidate();
            setCandidate(data);
        } catch (error) {
            console.error("Failed to load candidate data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!candidate) {
        return (
            <div className="text-center p-12">
                <h2 className="text-xl font-bold text-gray-700">Profile Not Found</h2>
                <p className="text-gray-500">Could not retrieve your candidate profile.</p>
            </div>
        );
    }

    // Determine Status
    const isOfferAccepted = candidate.offer_acceptance_status === 'accepted' || candidate.status === 'Completed' || candidate.status === 'Provisioned' || candidate.status === 'Active' || candidate.status === 'Allocated';
    const isOfferSent = candidate.sent_offer_letter;

    // Steps Logic
    const steps = [
        { id: 1, label: 'Accept Offer', completed: isOfferAccepted },
        { id: 2, label: 'Upload Documents', completed: Boolean(candidate.documents_uploaded) }, // Assumed field
        { id: 3, label: 'Personal Information', completed: Boolean(candidate.profile_completed) }, // Assumed
        { id: 4, label: 'Policy Acceptance', completed: Boolean(candidate.policies_accepted) }, // Assumed
        { id: 5, label: 'Device Receipt', completed: Boolean(candidate.assets_received) } // Assumed
    ];

    // For now, let's just use Offer Status as the main driver since other fields might not exist yet in DB
    // I'll assume only 'Accept Offer' is dynamic for now based on user request.

    // Recalculate based on knowns
    if (isOfferAccepted) steps[0].completed = true;

    const completedSteps = steps.filter(s => s.completed).length;
    const totalSteps = steps.length;
    const progress = Math.round((completedSteps / totalSteps) * 100);

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Top Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome, {candidate.name}!</h1>
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
                    <span className={`text-sm font-bold px-3 py-1 rounded-full ${progress === 100 ? 'text-emerald-600 bg-emerald-50' : 'text-indigo-600 bg-indigo-50'}`}>
                        {progress}% Complete
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden mb-8">
                    <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${progress === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Step Tracker Row */}
                <div className="flex flex-col md:flex-row justify-between relative">
                    <div className="hidden md:block absolute top-[15px] left-0 w-full h-0.5 bg-gray-100 -z-10" />
                    <div className="hidden md:block absolute top-[15px] left-0 h-0.5 bg-emerald-500 -z-10 transition-all duration-1000" style={{ width: `${progress}%` }} />

                    {steps.map((step) => (
                        <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-3 mb-4 md:mb-0 group">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ring-4 ring-white z-10 transition-all ${step.completed ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-gray-100 text-gray-400'
                                }`}>
                                <Check size={16} strokeWidth={3} />
                            </div>
                            <span className={`text-sm font-semibold transition-colors ${step.completed ? 'text-gray-700' : 'text-gray-400'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Cards */}
            {isOfferSent && !isOfferAccepted ? (
                // PENDING OFFER CARD
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl shadow-xl p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center shrink-0">
                                <FileText size={32} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Offer Letter Received!</h2>
                                <p className="text-indigo-100 max-w-md">
                                    Congratulations! You have received an official offer of employment. Please review and accept to proceed.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/candidate/accept-offer')}
                            className="px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 whitespace-nowrap"
                        >
                            View Offer <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            ) : isOfferAccepted ? (
                // SUCCESS / NEXT STEPS CARD
                <div className="bg-gradient-to-br from-white to-emerald-50 rounded-2xl shadow-lg border border-emerald-100 p-12 text-center relative overflow-hidden">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-200">
                        <CheckCircle2 size={48} className="text-emerald-600" strokeWidth={3} />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">You're All Set!</h2>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">
                        Your offer acceptance has been recorded. The IT team is currently preparing your assets.
                    </p>
                </div>
            ) : (
                // NO OFFER YET
                <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm text-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Waiting for Updates</h3>
                    <p className="text-gray-500">Your application is in progress. Check back soon for updates.</p>
                </div>
            )}
        </div>
    );
};

export default CandidateDashboard;
