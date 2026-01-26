import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, HelpCircle, Mail, MapPin } from 'lucide-react';
import { fetchCurrentCandidate, fetchCandidateOrientations } from '../../services/api';

const MyOrientations = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadOrientations = async () => {
            try {
                const candidate = await fetchCurrentCandidate();
                if (candidate) {
                    const data = await fetchCandidateOrientations(candidate.id);

                    // Process data for display
                    const processed = data.map(item => {
                        const dateObj = new Date(item.date);
                        return {
                            ...item,
                            displayDate: {
                                day: String(dateObj.getDate()).padStart(2, '0'),
                                month: dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
                            },
                            displayTime: `${item.start_time.slice(0, 5)} - ${item.end_time.slice(0, 5)}`,
                            presenter: 'HR Team' // Placeholder as DB doesn't have presenter field yet
                        };
                    });
                    setSessions(processed);
                }
            } catch (error) {
                console.error("Failed to load orientations", error);
            } finally {
                setLoading(false);
            }
        };

        loadOrientations();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up max-w-7xl mx-auto">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Orientations</h1>
                <p className="text-gray-500 font-medium mt-1">View upcoming onboarding sessions and events</p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Main Content: Sessions List */}
                <div className="flex-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <Video size={20} />
                            </div>
                            <h2 className="text-lg font-bold text-gray-900">Upcoming Sessions</h2>
                        </div>

                        {loading ? (
                            <p className="text-gray-500 text-center py-8">Loading sessions...</p>
                        ) : (
                            <div className="space-y-4">
                                {sessions.length === 0 ? (
                                    <p className="text-gray-500 text-center py-8">No upcoming sessions scheduled.</p>
                                ) : (
                                    sessions.map((session) => (
                                        <div key={session.id} className="border border-gray-100 rounded-xl p-5 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50 transition-all duration-300 bg-white group">
                                            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                                                {/* Date Badge */}
                                                <div className="flex flex-col items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-50 to-blue-50 text-indigo-600 rounded-2xl border border-indigo-100 shrink-0">
                                                    <span className="text-lg font-bold leading-none">{session.displayDate.day}</span>
                                                    <span className="text-xs font-bold uppercase mt-1">{session.displayDate.month}</span>
                                                </div>

                                                {/* Session Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                                        {session.title}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock size={14} className="text-gray-400" />
                                                            {session.displayTime}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            {session.mode.includes('Virtual') ? <Video size={14} className="text-gray-400" /> : <MapPin size={14} className="text-gray-400" />}
                                                            {session.mode}
                                                        </div>
                                                    </div>
                                                    {session.description && (
                                                        <p className="text-xs text-gray-400 mt-2 line-clamp-1">{session.description}</p>
                                                    )}
                                                </div>

                                                {/* Action Button */}
                                                {session.mode === 'Virtual' && session.meeting_link && (
                                                    <button
                                                        onClick={() => window.open(session.meeting_link, '_blank')}
                                                        className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-indigo-200 shrink-0 mt-2 sm:mt-0"
                                                    >
                                                        Join Meeting
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar: Help Panel */}
                <div className="w-full lg:w-80 space-y-6">
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center gap-2 mb-4 text-gray-900">
                            <HelpCircle size={20} className="text-indigo-600" />
                            <h3 className="font-bold">Need Help?</h3>
                        </div>

                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Having trouble organizing your schedule or unable to join a meeting?
                            Please reach out to the HR team for immediate assistance.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">HR Contact</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                                    <Mail size={18} />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="font-medium text-gray-900 truncate">hr.support@company.com</p>
                                    <p className="text-xs text-gray-500">Mon-Fri, 9AM - 6PM</p>
                                </div>
                            </div>
                        </div>

                        <button className="w-full mt-4 py-2 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600 text-gray-600 font-medium rounded-xl transition-colors text-sm">
                            View Orientation FAQ
                        </button>
                    </div>

                    {/* Additional Tip Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                        <p className="font-bold text-lg mb-2">Pro Tip</p>
                        <p className="text-indigo-100 text-sm opacity-90 leading-relaxed">
                            Join the meeting 5 minutes early to test your audio and video settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyOrientations;
