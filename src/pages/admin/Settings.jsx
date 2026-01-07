import React, { useState, useEffect } from 'react';
import {
    Building2, Shield, Bell, Lock, Save,
    CheckCircle2, AlertCircle, ToggleLeft, ToggleRight,
    Users, Mail, Globe, Key
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('organization');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState(null);

    // Mock initial state
    const [settings, setSettings] = useState({
        organization: {
            name: 'LokaChakra Inc.',
            contactEmail: 'admin@lokachakra.com',
            timezone: 'UTC+05:30 (India Standard Time)'
        },
        roles: [
            { id: 'admin', name: 'Admin', permissions: { viewDashboard: true, manageUsers: true, accessTeams: true, editSettings: true } },
            { id: 'hr', name: 'HR Team', permissions: { viewDashboard: true, manageUsers: false, accessTeams: true, editSettings: false } },
            { id: 'it', name: 'IT Team', permissions: { viewDashboard: true, manageUsers: false, accessTeams: true, editSettings: false } },
            { id: 'manager', name: 'Manager', permissions: { viewDashboard: true, manageUsers: false, accessTeams: true, editSettings: false } }
        ],
        notifications: {
            emailAlerts: true,
            taskCompletion: true,
            newUserAdded: false
        },
        security: {
            passwordLength: 8,
            sessionTimeout: '30', // minutes
            twoFactorAuth: false
        }
    });

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsLoading(false);
        showToast('success', 'Settings saved successfully');
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const updateOrgSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            organization: { ...prev.organization, [key]: value }
        }));
    };

    const updatePermission = (roleId, permission) => {
        setSettings(prev => ({
            ...prev,
            roles: prev.roles.map(role =>
                role.id === roleId
                    ? { ...role, permissions: { ...role.permissions, [permission]: !role.permissions[permission] } }
                    : role
            )
        }));
    };

    const updateNotification = (key) => {
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [key]: !prev.notifications[key] }
        }));
    };

    const updateSecurity = (key, value) => {
        setSettings(prev => ({
            ...prev,
            security: { ...prev.security, [key]: value }
        }));
    };

    return (
        <div className="animate-fade-in-up max-w-5xl mx-auto space-y-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="text-gray-500 mt-1">Manage organization, roles, and security configurations</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={20} />}
                    <span>Save Changes</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Settings Sidebar */}
                <div className="space-y-2">
                    {[
                        { id: 'organization', label: 'Organization', icon: Building2 },
                        { id: 'roles', label: 'Roles & Permissions', icon: Users },
                        { id: 'notifications', label: 'Notifications', icon: Bell },
                        { id: 'security', label: 'Security', icon: Shield },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-white text-indigo-600 shadow-md ring-1 ring-gray-100'
                                    : 'text-gray-500 hover:bg-white/50 hover:text-gray-900'
                                }`}
                        >
                            <tab.icon size={20} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Organization Settings */}
                    {activeTab === 'organization' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Building2 className="text-indigo-600" /> Organization Details
                            </h2>
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                                    <input
                                        type="text"
                                        value={settings.organization.name}
                                        onChange={(e) => updateOrgSetting('name', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="email"
                                            value={settings.organization.contactEmail}
                                            onChange={(e) => updateOrgSetting('contactEmail', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Timezone</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <select
                                            value={settings.organization.timezone}
                                            onChange={(e) => updateOrgSetting('timezone', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option>UTC+05:30 (India Standard Time)</option>
                                            <option>UTC-08:00 (Pacific Time)</option>
                                            <option>UTC+00:00 (Coordinated Universal Time)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Roles & Permissions */}
                    {activeTab === 'roles' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Users className="text-indigo-600" /> Roles & Permissions
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-100">
                                            <th className="py-4 font-semibold text-gray-500">Role</th>
                                            <th className="py-4 font-semibold text-gray-500 text-center">View Dashboard</th>
                                            <th className="py-4 font-semibold text-gray-500 text-center">Manage Users</th>
                                            <th className="py-4 font-semibold text-gray-500 text-center">Teams Overview</th>
                                            <th className="py-4 font-semibold text-gray-500 text-center">Edit Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {settings.roles.map((role) => (
                                            <tr key={role.id} className="hover:bg-gray-50/50">
                                                <td className="py-4 font-medium text-gray-900">{role.name}</td>
                                                {Object.keys(role.permissions).map((key) => (
                                                    <td key={key} className="py-4 text-center">
                                                        <button
                                                            onClick={() => updatePermission(role.id, key)}
                                                            className={`text-2xl transition-colors ${role.permissions[key] ? 'text-indigo-600' : 'text-gray-300'}`}
                                                        >
                                                            {role.permissions[key] ? <ToggleRight /> : <ToggleLeft />}
                                                        </button>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Bell className="text-indigo-600" /> Notifications
                            </h2>
                            <div className="space-y-6 max-w-xl">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900">Email Notifications</p>
                                        <p className="text-sm text-gray-500">Receive daily summaries and critical alerts</p>
                                    </div>
                                    <button
                                        onClick={() => updateNotification('emailAlerts')}
                                        className={`text-3xl transition-colors ${settings.notifications.emailAlerts ? 'text-indigo-600' : 'text-gray-300'}`}
                                    >
                                        {settings.notifications.emailAlerts ? <ToggleRight /> : <ToggleLeft />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900">Task Completions</p>
                                        <p className="text-sm text-gray-500">Get notified when a team completes a task group</p>
                                    </div>
                                    <button
                                        onClick={() => updateNotification('taskCompletion')}
                                        className={`text-3xl transition-colors ${settings.notifications.taskCompletion ? 'text-indigo-600' : 'text-gray-300'}`}
                                    >
                                        {settings.notifications.taskCompletion ? <ToggleRight /> : <ToggleLeft />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <p className="font-semibold text-gray-900">New User Alerts</p>
                                        <p className="text-sm text-gray-500">Notify when a new employee is onboarded</p>
                                    </div>
                                    <button
                                        onClick={() => updateNotification('newUserAdded')}
                                        className={`text-3xl transition-colors ${settings.notifications.newUserAdded ? 'text-indigo-600' : 'text-gray-300'}`}
                                    >
                                        {settings.notifications.newUserAdded ? <ToggleRight /> : <ToggleLeft />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Settings */}
                    {activeTab === 'security' && (
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Shield className="text-indigo-600" /> Security
                            </h2>
                            <div className="space-y-6 max-w-xl">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Min. Password Length</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            value={settings.security.passwordLength}
                                            onChange={(e) => updateSecurity('passwordLength', e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                                            min="6" max="32"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout</label>
                                    <select
                                        value={settings.security.sessionTimeout}
                                        onChange={(e) => updateSecurity('sessionTimeout', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all cursor-pointer"
                                    >
                                        <option value="15">15 Minutes</option>
                                        <option value="30">30 Minutes</option>
                                        <option value="60">1 Hour</option>
                                        <option value="240">4 Hours</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <Lock size={20} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Require 2FA for all admin accounts</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => updateSecurity('twoFactorAuth', !settings.security.twoFactorAuth)}
                                        className={`text-3xl transition-colors ${settings.security.twoFactorAuth ? 'text-indigo-600' : 'text-gray-300'}`}
                                    >
                                        {settings.security.twoFactorAuth ? <ToggleRight /> : <ToggleLeft />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Toast Notification */}
            {toast && (
                <div className={`
                    fixed bottom-6 right-6 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in-right border
                    ${toast.type === 'success' ? 'bg-white border-green-100 text-green-700' : 'bg-white border-red-100 text-red-700'}
                `}>
                    {toast.type === 'success' ? <CheckCircle2 size={20} className="text-green-500" /> : <AlertCircle size={20} className="text-red-500" />}
                    <span className="font-semibold">{toast.message}</span>
                </div>
            )}
        </div>
    );
};

export default Settings;
