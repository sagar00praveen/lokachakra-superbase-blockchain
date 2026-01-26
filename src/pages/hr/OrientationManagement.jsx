import React, { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Video,
    Users,
    CheckCircle2,
    Plus,
    MoreHorizontal,
    MapPin,
    ArrowRight,
    X
} from 'lucide-react';
import { fetchCandidates, createOrientation, fetchOrientations } from '../../services/api';
import StatCard from '../../components/dashboard/StatCard';

const OrientationManagement = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSession, setSelectedSession] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const [loading, setLoading] = useState(true);

    const [newSession, setNewSession] = useState({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        mode: 'Virtual',
        meetingLink: '',
        location: '',
        description: '',
        candidates: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [fetchedCandidates, fetchedSessions] = await Promise.all([
                fetchCandidates(),
                fetchOrientations()
            ]);
            setCandidates(fetchedCandidates);
            setSessions(fetchedSessions);
        } catch (error) {
            console.error("Failed to load data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewSession(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCandidateToggle = (candidateId) => {
        setNewSession(prev => ({
            ...prev,
            candidates: prev.candidates.includes(candidateId)
                ? prev.candidates.filter(id => id !== candidateId)
                : [...prev.candidates, candidateId]
        }));
    };

    const handleSchedule = async (e) => {
        e.preventDefault();

        try {
            await createOrientation({
                title: newSession.title,
                date: newSession.date,
                start_time: newSession.startTime,
                end_time: newSession.endTime,
                mode: newSession.mode,
                meeting_link: newSession.meetingLink,
                location: newSession.location,
                description: newSession.description
            }, newSession.candidates);

            alert("Orientation Scheduled Successfully!");
            setIsModalOpen(false);
            setNewSession({
                title: '',
                date: '',
                startTime: '',
                endTime: '',
                mode: 'Virtual',
                meetingLink: '',
                location: '',
                description: '',
                candidates: []
            });
            loadData(); // Refresh list
        } catch (error) {
            console.error("Error scheduling orientation:", error);
            alert("Failed to schedule session. Please try again.");
        }
    };

    // PROCESS SESSIONS FOR DISPLAY
    const now = new Date();

    const processedSessions = sessions.map(session => {
        const sessionDateTime = new Date(`${session.date}T${session.end_time}`);
        const startDateTime = new Date(`${session.date}T${session.start_time}`);
        const isExpired = sessionDateTime < now;

        const dateObj = new Date(session.date);

        // Join Logic: 15 mins before start until end time
        const joinWindowStart = new Date(startDateTime.getTime() - 15 * 60000);
        const isJoinable = now >= joinWindowStart && now <= sessionDateTime;

        return {
            ...session,
            displayDate: {
                day: String(dateObj.getDate()).padStart(2, '0'),
                month: dateObj.toLocaleString('en', { month: 'short' }).toUpperCase()
            },
            formattedTime: `${session.start_time.slice(0, 5)} - ${session.end_time.slice(0, 5)}`,
            displayStatus: isExpired ? 'Completed' : 'Upcoming',
            isJoinable,
            attendeesList: session.orientation_attendees?.map(a => ({
                id: a.candidate?.id,
                name: a.candidate?.name,
                initials: a.candidate?.name ? a.candidate.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '??',
                color: 'bg-indigo-500' // could randomize
            })) || []
        };
    });

    const upcomingSessions = processedSessions.filter(s => s.displayStatus === 'Upcoming');
    const completedSessions = processedSessions.filter(s => s.displayStatus === 'Completed');

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Orientation Management</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Schedule and manage candidate onboarding sessions</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-200"
                >
                    <Plus size={18} />
                    Schedule Orientation
                </button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Scheduled"
                    count={String(upcomingSessions.length)}
                    subtitle="Upcoming sessions"
                    icon={Calendar}
                    iconBgClass="bg-indigo-50 text-indigo-600"
                />
                <StatCard
                    title="This Week"
                    count={String(upcomingSessions.filter(s => {
                        const d = new Date(s.date);
                        const today = new Date();
                        const nextWeek = new Date();
                        nextWeek.setDate(today.getDate() + 7);
                        return d >= today && d <= nextWeek;
                    }).length)}
                    subtitle="Sessions this week"
                    icon={Clock}
                    iconBgClass="bg-blue-50 text-blue-600"
                />
                <StatCard
                    title="Completed"
                    count={String(completedSessions.length)}
                    subtitle="Sessions finished"
                    icon={CheckCircle2}
                    iconBgClass="bg-emerald-50 text-emerald-600"
                />
                <StatCard
                    title="Total Attendees"
                    count="45"
                    subtitle="Candidates onboarded"
                    icon={Users}
                    iconBgClass="bg-purple-50 text-purple-600"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Upcoming Sessions */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-gray-900">Upcoming Sessions</h2>
                        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                            View Calendar <ArrowRight size={16} />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-4">
                            {upcomingSessions.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No upcoming sessions scheduled.</p>
                            ) : (
                                upcomingSessions.map((session) => (
                                    <div key={session.id} className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow group">
                                        {/* Date Badge */}
                                        <div className="flex flex-col items-center justify-center w-16 h-16 bg-gray-50 text-indigo-600 rounded-2xl border border-gray-100 shrink-0 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
                                            <span className="text-xl font-bold leading-none">{session.displayDate.day}</span>
                                            <span className="text-xs font-bold uppercase mt-1 text-gray-400 group-hover:text-indigo-400">{session.displayDate.month}</span>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-2">
                                                <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{session.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-100">
                                                        {session.displayStatus}
                                                    </span>
                                                    <button className="text-gray-400 hover:text-gray-600">
                                                        <MoreHorizontal size={18} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                                                <div className="flex items-center gap-1.5">
                                                    <Clock size={14} />
                                                    {session.formattedTime}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    {session.mode.includes('Virtual') ? <Video size={14} /> : <MapPin size={14} />}
                                                    {session.mode}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between">
                                                {/* Attendees */}
                                                <div className="flex -space-x-2">
                                                    {session.attendeesList && session.attendeesList.map((attendee, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white ${attendee.color}`}
                                                            title={attendee.name}
                                                        >
                                                            {attendee.initials}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Actions: Join & View Details */}
                                                <div className="flex gap-3">
                                                    {session.mode === 'Virtual' && session.meeting_link && (
                                                        <button
                                                            onClick={() => window.open(session.meeting_link, '_blank')}
                                                            disabled={!session.isJoinable}
                                                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 ${session.isJoinable
                                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-100'
                                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                                }`}
                                                            title={session.isJoinable ? "Click to join meeting" : "Join button activates 15 mins before start time"}
                                                        >
                                                            <Video size={16} />
                                                            Join
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => setSelectedSession(session)}
                                                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors shadow-sm shadow-indigo-100"
                                                    >
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Tips & Insights */}
                <div className="space-y-6">
                    {/* Insights Panel */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-900 mb-4">Session Insights</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500 font-medium">Session Completion Rate</span>
                                    <span className="text-indigo-600 font-bold">92%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full" style={{ width: '92%' }} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Avg Attendance</p>
                                    <p className="text-lg font-bold text-gray-900">14/15</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Satisfaction</p>
                                    <p className="text-lg font-bold text-gray-900">4.8/5</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pro Tips */}
                    <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg shadow-indigo-200">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <CheckCircle2 size={20} className="text-emerald-400" />
                            Pro Tips
                        </h3>
                        <ul className="space-y-3 text-sm text-indigo-50 opacity-90">
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Start sessions 5 mins early to allow audio checks.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Share the agenda in the chat at the beginning.
                            </li>
                            <li className="flex gap-2">
                                <span className="font-bold">•</span>
                                Record the session for those who cannot attend.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Schedule Orientation Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-xl font-bold text-gray-900">Schedule New Orientation</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleSchedule} className="p-6 space-y-6">
                            {/* Session Title */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={newSession.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Welcome & Company Introduction"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                />
                            </div>

                            {/* Date and Time */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={newSession.date}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Start Time</label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={newSession.startTime}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">End Time</label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={newSession.endTime}
                                        onChange={handleInputChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Session Mode</label>
                                <select
                                    name="mode"
                                    value={newSession.mode}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                >
                                    <option value="Virtual">Virtual (Online)</option>
                                    <option value="Hybrid">Hybrid (Online + In-Person)</option>
                                    <option value="In-Person">In-Person Only</option>
                                </select>
                            </div>

                            {/* Meeting Link or Location */}
                            {newSession.mode === 'Virtual' ? (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Meeting Link</label>
                                    <input
                                        type="url"
                                        name="meetingLink"
                                        value={newSession.meetingLink}
                                        onChange={handleInputChange}
                                        placeholder="https://meet.google.com/abc-defg-hij"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={newSession.location}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Conference Room A, Building 2"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                            )}

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
                                <textarea
                                    name="description"
                                    value={newSession.description}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Add session agenda, topics to cover, or preparation notes..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                                />
                            </div>

                            {/* Candidate Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-3">Select Candidates</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
                                    {candidates.map((candidate) => (
                                        <label
                                            key={candidate.id}
                                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newSession.candidates.includes(candidate.id)}
                                                onChange={() => handleCandidateToggle(candidate.id)}
                                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{candidate.name}</p>
                                                <p className="text-xs text-gray-500">{candidate.email || candidate.personal_email}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    {newSession.candidates.length} candidate(s) selected
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    Schedule Session
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* Session Details Modal */}
            {selectedSession && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-scale-in">
                        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
                            <h2 className="text-lg font-bold">Session Details</h2>
                            <button
                                onClick={() => setSelectedSession(null)}
                                className="p-1 hover:bg-indigo-700 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{selectedSession.title}</h3>
                                <div className="flex flex-wrap gap-3 text-sm text-gray-500 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {selectedSession.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock size={14} />
                                        {selectedSession.formattedTime}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        {selectedSession.mode.includes('Virtual') ? <Video size={14} /> : <MapPin size={14} />}
                                        {selectedSession.mode}
                                    </div>
                                </div>
                            </div>

                            {selectedSession.description && (
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Description</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {selectedSession.description}
                                    </p>
                                </div>
                            )}

                            {selectedSession.mode === 'Virtual' && selectedSession.meeting_link && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-400 uppercase mb-2">Meeting Link</h4>
                                    <a href={selectedSession.meeting_link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 underline text-break-all text-sm">
                                        {selectedSession.meeting_link}
                                    </a>
                                </div>
                            )}

                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Attendees ({selectedSession.attendeesList.length})</h4>
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                    {selectedSession.attendeesList.length > 0 ? (
                                        selectedSession.attendeesList.map((attendee, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${attendee.color} shrink-0`}>
                                                    {attendee.initials}
                                                </div>
                                                <span className="text-sm font-medium text-gray-700">{attendee.name}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400 italic">No attendees added.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                                <button
                                    onClick={() => setSelectedSession(null)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Close
                                </button>
                                {selectedSession.mode === 'Virtual' && selectedSession.meeting_link && (
                                    <button
                                        onClick={() => window.open(selectedSession.meeting_link, '_blank')}
                                        disabled={!selectedSession.isJoinable}
                                        className={`px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2 ${selectedSession.isJoinable
                                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        Join Session
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrientationManagement;
