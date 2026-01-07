import React, { useState } from 'react';
import { Bell, CheckCircle, Clock, AlertCircle, Mail, Check, Filter, Info } from 'lucide-react';

const Notifications = () => {
    const [filter, setFilter] = useState('All'); // All, Important, Unread

    // Mock Data
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: "Offer Letter Generated",
            message: "Congratulations! Your official offer letter has been generated and is ready for review.",
            time: "2 hours ago",
            type: "important", // important, info, success
            read: false,
            category: "HR"
        },
        {
            id: 2,
            title: "Welcome to the Team",
            message: "A warm welcome from the HR team. We look forward to having you with us.",
            time: "1 day ago",
            type: "info",
            read: true,
            category: "General"
        },
        {
            id: 3,
            title: "Document Verification Pending",
            message: "Please upload your educational certificates for verification.",
            time: "2 days ago",
            type: "important",
            read: false,
            category: "HR"
        },
        {
            id: 4,
            title: "IT Assets Allocated",
            message: "Your laptop and peripherals have been assigned. Please complete the Device Receipt form.",
            time: "3 days ago",
            type: "success",
            read: true,
            category: "IT"
        },
        {
            id: 5,
            title: "Orientation Scheduled",
            message: "Your onboarding orientation is scheduled for Jan 15th at 10:00 AM.",
            time: "3 days ago",
            type: "info",
            read: false,
            category: "Training"
        }
    ]);

    const handleMarkAsRead = (id) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const handleMarkAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const filteredNotifications = notifications.filter(n => {
        if (filter === 'All') return true;
        if (filter === 'Important') return n.type === 'important';
        if (filter === 'Unread') return !n.read;
        return true;
    });

    const getIcon = (type) => {
        switch (type) {
            case 'important': return <AlertCircle className="text-amber-500" size={20} />;
            case 'success': return <CheckCircle className="text-green-500" size={20} />;
            case 'info': return <Info className="text-blue-500" size={20} />;
            default: return <Bell className="text-gray-500" size={20} />;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <Bell className="text-indigo-600" /> Notifications
                    </h1>
                    <p className="text-gray-500 mt-1">Stay updated with your onboarding progress.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1"
                    >
                        <Check size={16} /> Mark all as read
                    </button>
                    <div className="bg-white border border-gray-200 p-1 rounded-xl flex shadow-sm">
                        {['All', 'Important', 'Unread'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === f
                                        ? 'bg-gray-100 text-gray-900 font-semibold'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                    }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-5 rounded-2xl border transition-all hover:shadow-md ${notification.read
                                    ? 'bg-white border-gray-100'
                                    : 'bg-indigo-50/30 border-indigo-100'
                                }`}
                        >
                            <div className="flex gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${notification.read ? 'bg-gray-100' : 'bg-white shadow-sm'
                                    }`}>
                                    {getIcon(notification.type)}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className={`font-semibold text-gray-900 ${!notification.read && 'font-bold'}`}>
                                            {notification.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 whitespace-nowrap flex items-center gap-1">
                                            <Clock size={12} /> {notification.time}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                        {notification.message}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-md">
                                            {notification.category}
                                        </span>
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 border-dashed">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell className="text-gray-300" size={24} />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
                        <p className="text-gray-500 text-sm">You're all caught up!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
