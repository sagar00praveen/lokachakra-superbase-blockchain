
import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCircle, XCircle, Info, Trash2 } from 'lucide-react';
import { fetchNotifications, markNotificationAsRead } from '../../services/api';

const NotificationsTab = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadNotifications = async () => {
        try {
            const data = await fetchNotifications('hr');
            setNotifications(data);
        } catch (error) {
            console.error("Failed to load notifications:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        // Optional: Poll for new notifications every 30 seconds
        const interval = setInterval(loadNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await markNotificationAsRead(id);
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success': return <CheckCircle size={20} className="text-emerald-500" />;
            case 'error': return <XCircle size={20} className="text-red-500" />;
            case 'warning': return <Info size={20} className="text-amber-500" />;
            default: return <Bell size={20} className="text-indigo-500" />;
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading notifications...</div>;
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Bell size={20} className="text-indigo-600" />
                    Notifications
                </h3>
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {notifications.filter(n => !n.read).length} Unread
                </span>
            </div>

            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
                {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No notifications yet.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`p-4 hover:bg-gray-50 transition-colors flex gap-4 ${!notification.read ? 'bg-indigo-50/30' : ''}`}
                        >
                            <div className="mt-1 flex-shrink-0">
                                {getIcon(notification.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm font-semibold ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {notification.title}
                                    </h4>
                                    <span className="text-xs text-gray-400 whitespace-nowrap ml-2">
                                        {new Date(notification.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mb-2">{notification.message}</p>

                                {!notification.read && (
                                    <button
                                        onClick={() => handleMarkAsRead(notification.id)}
                                        className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                                    >
                                        <Check size={12} /> Mark as read
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default NotificationsTab;
