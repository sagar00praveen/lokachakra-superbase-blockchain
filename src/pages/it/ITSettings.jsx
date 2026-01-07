import React, { useState } from 'react';
import { Save, Shield, Bell, Monitor, Database, Globe, Mail, Key } from 'lucide-react';

const ITSettings = () => {
    const [settings, setSettings] = useState({
        // System Settings
        systemName: 'HR Nexus IT Portal',
        maintenanceMode: false,
        autoBackup: true,
        backupFrequency: 'daily',

        // Security Settings
        twoFactorAuth: true,
        passwordExpiry: '90',
        sessionTimeout: '30',
        ipWhitelist: false,

        // Email Settings
        smtpServer: 'smtp.company.com',
        smtpPort: '587',
        emailNotifications: true,

        // Network Settings
        vpnEnabled: true,
        remoteAccess: true,

        // Notification Settings
        emailAlerts: true,
        smsAlerts: false,
        slackIntegration: true,
    });

    const handleChange = (field, value) => {
        setSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        alert('Settings saved successfully!');
    };

    return (
        <div className="p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">IT System Settings</h1>
                    <p className="text-gray-500 mt-1">Configure IT infrastructure and security preferences</p>
                </div>
                <button
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30"
                >
                    <Save size={20} />
                    Save Changes
                </button>
            </div>

            {/* System Configuration */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <Monitor size={24} />
                        <div>
                            <h2 className="text-xl font-bold">System Configuration</h2>
                            <p className="text-indigo-100 text-sm">General system settings and preferences</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">System Name</label>
                            <input
                                type="text"
                                value={settings.systemName}
                                onChange={(e) => handleChange('systemName', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Backup Frequency</label>
                            <select
                                value={settings.backupFrequency}
                                onChange={(e) => handleChange('backupFrequency', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            >
                                <option value="hourly">Hourly</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Maintenance Mode</h3>
                            <p className="text-sm text-gray-500">Temporarily disable system access</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.maintenanceMode}
                                onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Auto Backup</h3>
                            <p className="text-sm text-gray-500">Automatically backup system data</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.autoBackup}
                                onChange={(e) => handleChange('autoBackup', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Security Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <Shield size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Security Settings</h2>
                            <p className="text-red-100 text-sm">Configure security policies and authentication</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password Expiry (days)</label>
                            <input
                                type="number"
                                value={settings.passwordExpiry}
                                onChange={(e) => handleChange('passwordExpiry', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Session Timeout (minutes)</label>
                            <input
                                type="number"
                                value={settings.sessionTimeout}
                                onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Require 2FA for all users</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.twoFactorAuth}
                                onChange={(e) => handleChange('twoFactorAuth', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">IP Whitelist</h3>
                            <p className="text-sm text-gray-500">Restrict access to whitelisted IPs only</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.ipWhitelist}
                                onChange={(e) => handleChange('ipWhitelist', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Network Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <Globe size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Network Settings</h2>
                            <p className="text-blue-100 text-sm">Configure network access and VPN</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">VPN Access</h3>
                            <p className="text-sm text-gray-500">Enable VPN for remote connections</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.vpnEnabled}
                                onChange={(e) => handleChange('vpnEnabled', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Remote Access</h3>
                            <p className="text-sm text-gray-500">Allow remote desktop connections</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.remoteAccess}
                                onChange={(e) => handleChange('remoteAccess', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
                    <div className="flex items-center gap-3 text-white">
                        <Bell size={24} />
                        <div>
                            <h2 className="text-xl font-bold">Notification Settings</h2>
                            <p className="text-purple-100 text-sm">Configure alert and notification preferences</p>
                        </div>
                    </div>
                </div>
                <div className="p-6 space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Email Alerts</h3>
                            <p className="text-sm text-gray-500">Send email notifications for system events</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.emailAlerts}
                                onChange={(e) => handleChange('emailAlerts', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div>
                            <h3 className="font-semibold text-gray-900">Slack Integration</h3>
                            <p className="text-sm text-gray-500">Send alerts to Slack channels</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={settings.slackIntegration}
                                onChange={(e) => handleChange('slackIntegration', e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ITSettings;
