import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, MapPin, Plus, ExternalLink, Monitor, CalendarCheck, AlertCircle, ChevronRight } from 'lucide-react';

const ITOrientation = () => {
    const [filterMode, setFilterMode] = useState('All'); // All, Virtual, In-person
    const [currentTime, setCurrentTime] = useState(new Date('2026-01-05T10:00:00')); // Simulating current time based on system context

    // Mock Data with distinct dates to demonstrate status updates
    const [sessions, setSessions] = useState([
        {
            id: 'ORT-001',
            title: 'IT Security & Compliance',
            date: '2026-01-05',
            startTime: '11:00 AM',
            endTime: '12:30 PM',
            mode: 'Virtual',
            attendees: 24,
            maxCapacity: 50,
            meetLink: 'https://meet.google.com/abc-defg-hij',
            trainer: 'Sarah Connor',
            description: 'Critical security protocols and compliance training for all new hires.'
        },
        {
            id: 'ORT-002',
            title: 'Developer Environment Setup',
            date: '2026-01-07',
            startTime: '14:00 PM',
            endTime: '16:00 PM',
            mode: 'In-person',
            attendees: 12,
            maxCapacity: 15,
            location: 'Building A, Room 302',
            trainer: 'John Smith',
            description: 'Hands-on session to set up local dev environments and access repositories.'
        },
        {
            id: 'ORT-003',
            title: 'Company Tools Overview',
            date: '2026-01-08',
            startTime: '10:00 AM',
            endTime: '11:00 AM',
            mode: 'Virtual',
            attendees: 45,
            maxCapacity: 100,
            meetLink: 'https://meet.google.com/xyz-uvwx-yza',
            trainer: 'Emily Blunt',
            description: 'Introduction to Slack, Jira, Confluence, and HR portal navigation.'
        },
        {
            id: 'ORT-004',
            title: 'VPN & Remote Access',
            date: '2026-01-03', // Past date
            startTime: '09:00 AM',
            endTime: '10:00 AM',
            mode: 'Virtual',
            attendees: 30,
            maxCapacity: 50,
            meetLink: 'https://meet.google.com/past-link',
            trainer: 'Mike Ross',
            description: 'Configuring secure remote access.'
        }
    ]);

    // Helper to check status based on date
    const getSessionStatus = (dateStr, startTimeStr) => {
        const sessionDate = new Date(dateStr);
        const today = new Date(currentTime);
        today.setHours(0, 0, 0, 0);
        sessionDate.setHours(0, 0, 0, 0);

        if (sessionDate < today) return 'Completed';
        if (sessionDate.getTime() === today.getTime()) return 'Today';
        return 'Upcoming';
    };

    const filteredSessions = sessions.filter(session => {
        const status = getSessionStatus(session.date);
        // We focus on Upcoming and Today sessions for the "Upcoming Orientations" screen
        const isUpcoming = status === 'Upcoming' || status === 'Today';
        const matchesMode = filterMode === 'All' || session.mode === filterMode;
        return isUpcoming && matchesMode;
    });

    const handleJoinMeeting = (link) => {
        window.open(link, '_blank');
    };

    return (
        <div className="p-8 space-y-8 min-h-screen bg-gray-50">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upcoming Orientations</h1>
                    <p className="text-gray-500 mt-1">Manage and join scheduled IT onboarding sessions</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="bg-white border border-gray-200 p-1 rounded-xl flex">
                        {['All', 'Virtual', 'In-person'].map(mode => (
                            <button
                                key={mode}
                                onClick={() => setFilterMode(mode)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterMode === mode
                                        ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-medium">
                        <Plus size={20} />
                        Schedule Session
                    </button>
                </div>
            </div>

            {/* Sessions Grid */}
            {filteredSessions.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => {
                        const status = getSessionStatus(session.date);
                        return (
                            <div key={session.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col h-full">
                                {/* Date Ribbon */}
                                <div className={`h-2 w-full ${status === 'Today' ? 'bg-indigo-500' : 'bg-gray-200'}`} />

                                <div className="p-6 flex-1 flex flex-col">
                                    {/* Top Row: Mode & Status */}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-2">
                                            <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${session.mode === 'Virtual'
                                                    ? 'bg-purple-50 text-purple-700 border border-purple-100'
                                                    : 'bg-orange-50 text-orange-700 border border-orange-100'
                                                }`}>
                                                {session.mode === 'Virtual' ? <Video size={12} /> : <MapPin size={12} />}
                                                {session.mode}
                                            </span>
                                            {status === 'Today' && (
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
                                                    <CalendarCheck size={12} />
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title & Description */}
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                        {session.title}
                                    </h3>

                                    {/* Date & Time Block */}
                                    <div className="flex gap-4 my-4 p-3 bg-gray-50 rounded-xl">
                                        <div className="flex flex-col items-center justify-center px-4 border-r border-gray-200 text-center min-w-[80px]">
                                            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                                                {new Date(session.date).toLocaleString('default', { month: 'short' })}
                                            </span>
                                            <span className="text-2xl font-bold text-gray-900">
                                                {new Date(session.date).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex flex-col justify-center gap-1">
                                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                                <Clock size={16} className="text-gray-400" />
                                                {session.startTime} - {session.endTime}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                by {session.trainer}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Attendees */}
                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <Users size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-600">
                                                <span className="text-gray-900 font-bold">{session.attendees}</span>
                                                <span className="text-gray-400">/{session.maxCapacity} Registered</span>
                                            </span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="mt-6">
                                        {session.mode === 'Virtual' ? (
                                            <button
                                                onClick={() => handleJoinMeeting(session.meetLink)}
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-medium shadow-md shadow-indigo-100 active:scale-[0.98]"
                                            >
                                                <Video size={18} />
                                                Join Meeting
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
                                            >
                                                <MapPin size={18} />
                                                View Location Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                /* Empty State */
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-gray-100 shadow-sm border-dashed">
                    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <Calendar size={32} className="text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Upcoming Sessions</h3>
                    <p className="text-gray-500 max-w-md mb-8">
                        There are no orientation sessions scheduled {filterMode !== 'All' ? `for ${filterMode.toLowerCase()} mode` : ''} at the moment.
                    </p>
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-indigo-600 rounded-xl hover:bg-gray-50 transition-colors font-semibold">
                        <Plus size={20} />
                        Schedule New Session
                    </button>
                </div>
            )}
        </div>
    );
};

export default ITOrientation;
