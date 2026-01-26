import React, { useState, useEffect } from 'react';
import { fetchProfiles } from '../../services/api';
import {
    Users, Plus, Search, Edit2, Trash2, X,
    CheckCircle2, AlertCircle, Shield, Mail,
    Lock, ChevronLeft, ChevronRight, MoreVertical
} from 'lucide-react';

const UserManagement = () => {
    // State
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('All');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null); // stores user ID to delete
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

    // Form State
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        role: 'HR',
        password: '',
        status: 'Active'
    });
    const [errors, setErrors] = useState({});

    // Mock Data Fetching
    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await fetchProfiles();
            if (data) {
                // Map Supabase profile structure to component's expected structure if needed
                // Assuming schema: id, full_name, role, email...
                // Component expects: id, fullName, email, role, status
                const mappedUsers = data.map(u => ({
                    id: u.id,
                    fullName: u.full_name || 'N/A',
                    email: u.email,
                    role: u.role || 'Employee', // Capitalize if needed
                    status: 'Active' // Default status as it's not in profile schema yet, or fetch if added
                }));
                setUsers(mappedUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
            // Fallback or toast
        } finally {
            setIsLoading(false);
        }
    };

    // Derived State
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesRole = roleFilter === 'All' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Handlers
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
        else if (!editingUser && users.some(u => u.email === formData.email)) newErrors.email = 'Email already exists';

        if (!editingUser && (!formData.password || formData.password.length < 8)) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (editingUser) {
            // Update User
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
            showToast('success', 'User updated successfully');
        } else {
            // Create User
            const newUser = {
                id: users.length + 1,
                ...formData,
                status: 'Active'
            };
            setUsers([...users, newUser]);
            showToast('success', 'User created successfully');
        }
        closeModal();
    };

    const handleDelete = (id) => {
        setUsers(users.filter(u => u.id !== id));
        setShowDeleteConfirm(null);
        showToast('success', 'User deleted successfully');
    };

    const openModal = (user = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                password: '', // Don't show password
                status: user.status
            });
        } else {
            setEditingUser(null);
            setFormData({
                fullName: '',
                email: '',
                role: 'HR',
                password: '',
                status: 'Active'
            });
        }
        setErrors({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage system users, roles, and access permissions</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-200"
                >
                    <Plus size={20} />
                    Add New User
                </button>
            </div>

            {/* Filters & Search */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Filter by Role:</span>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:border-indigo-500 outline-none cursor-pointer"
                    >
                        <option value="All">All Roles</option>
                        <option value="Admin">Admin</option>
                        <option value="HR">HR Team</option>
                        <option value="IT">IT Team</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
            </div>

            {/* User List Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {isLoading ? (
                                // Loading Skeleton
                                Array(4).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-10 w-48 bg-gray-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded-full"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 w-8 ml-auto bg-gray-100 rounded-lg"></div></td>
                                    </tr>
                                ))
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        No users found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                                                    {user.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900">{user.fullName}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                                    user.role === 'HR' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                        user.role === 'IT' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            'bg-gray-100 text-gray-700 border-gray-200'}
                                            `}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`
                                                inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border
                                                ${user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'}
                                            `}>
                                                <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`} />
                                                {user.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openModal(user)}
                                                    className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                                    title="Edit User"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(user.id)}
                                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Delete User"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add/Edit User Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingUser ? 'Edit User' : 'Add New User'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Users size={16} /> Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="e.g. John Doe"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-all ${errors.fullName ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                                />
                                {errors.fullName && <p className="text-xs text-red-500 font-medium">{errors.fullName}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Mail size={16} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!!editingUser}
                                    placeholder="name@company.com"
                                    className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed ${errors.email ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                                />
                                {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email}</p>}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Shield size={16} /> Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="HR">HR Team</option>
                                    <option value="IT">IT Team</option>
                                    <option value="Manager">Manager</option>
                                </select>
                            </div>

                            {!editingUser && (
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <Lock size={16} /> Password
                                    </label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Min. 8 characters"
                                        className={`w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white outline-none transition-all ${errors.password ? 'border-red-500 focus:ring-2 focus:ring-red-100' : 'border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100'}`}
                                    />
                                    {errors.password && <p className="text-xs text-red-500 font-medium">{errors.password}</p>}
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <CheckCircle2 size={16} /> Status
                                </label>
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Active"
                                            checked={formData.status === 'Active'}
                                            onChange={handleInputChange}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="status"
                                            value="Inactive"
                                            checked={formData.status === 'Inactive'}
                                            onChange={handleInputChange}
                                            className="text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-gray-700">Inactive</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                                >
                                    {editingUser ? 'Save Check' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Confirm Delete Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center space-y-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-red-600">
                            <AlertCircle size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Delete User?</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this user? This action cannot be undone.
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 px-4 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

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

export default UserManagement;
