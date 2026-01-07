import React, { useState } from 'react';
import { CheckSquare, Clock, Plus, Trash2, User, Mail, Shield } from 'lucide-react';
import { USERS } from '../../mock/data';

const ITDashboard = () => {
    // Task State
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Setup work station for New Joiner', priority: 'High', status: 'In Progress', progress: 60, due: 'Today' },
        { id: 2, title: 'Update System Security Patches', priority: 'Medium', status: 'Pending', progress: 0, due: 'Tomorrow' },
        { id: 3, title: 'Resolve Network Connectivity Issue (Fl. 3)', priority: 'Critical', status: 'Completed', progress: 100, due: 'Yesterday' },
        { id: 4, title: 'Configure VPN for Remote Team', priority: 'High', status: 'Pending', progress: 0, due: 'Today' },
    ]);

    // User Management State
    const [systemUsers, setSystemUsers] = useState(USERS);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'EMPLOYEE' });
    const [showAddUser, setShowAddUser] = useState(false);

    const completedCount = tasks.filter(t => t.status === 'Completed').length;
    const pendingCount = tasks.filter(t => t.status !== 'Completed').length;
    const completionPercentage = Math.round((completedCount / tasks.length) * 100);

    const updateStatus = (id, newStatus) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus, progress: newStatus === 'Completed' ? 100 : t.progress } : t));
    };

    const handleAddUser = (e) => {
        e.preventDefault();
        if (!newUser.name || !newUser.email) return;

        const user = {
            id: systemUsers.length + 1,
            ...newUser,
            avatar: newUser.name.charAt(0).toUpperCase()
        };

        setSystemUsers([...systemUsers, user]);
        setNewUser({ name: '', email: '', role: 'EMPLOYEE' });
        setShowAddUser(false);
    };

    return (
        <div style={{ padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>IT Operations & User Management</h2>

            {/* Task Statistics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <Clock size={20} color="var(--color-candidate-primary)" />
                        <div style={{ color: 'var(--color-text-secondary)' }}>Pending Tasks</div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{pendingCount}</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                        <CheckSquare size={20} color="var(--color-it-primary)" />
                        <div style={{ color: 'var(--color-text-secondary)' }}>Completion Rate</div>
                    </div>
                    <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--color-it-primary)' }}>
                        {completionPercentage}%
                    </div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', marginTop: '1rem', borderRadius: '2px' }}>
                        <div style={{ width: `${completionPercentage}%`, height: '100%', background: 'var(--color-it-primary)' }}></div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Task List Section */}
                <div>
                    <h3 style={{ color: 'white', marginBottom: '1rem' }}>Active Tasks</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.map(task => (
                            <div key={task.id} style={{ background: 'var(--color-bg-card)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        {task.priority === 'Critical' && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>CRITICAL</span>}
                                        {task.priority === 'High' && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' }}>HIGH</span>}
                                    </div>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Due: {task.due}</span>
                                </div>
                                <h4 style={{ color: 'white', fontSize: '1rem', marginBottom: '1rem' }}>{task.title}</h4>

                                {task.status !== 'Completed' ? (
                                    <button
                                        onClick={() => updateStatus(task.id, 'Completed')}
                                        style={{ width: '100%', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <CheckSquare size={16} /> Mark as Done
                                    </button>
                                ) : (
                                    <div style={{ color: 'var(--color-success)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <CheckSquare size={16} /> Completed
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* User Management Section */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ color: 'white' }}>User Management</h3>
                        <button
                            onClick={() => setShowAddUser(!showAddUser)}
                            style={{ padding: '0.5rem 1rem', background: 'var(--color-it-primary)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}
                        >
                            <Plus size={16} /> Add User
                        </button>
                    </div>

                    {showAddUser && (
                        <form onSubmit={handleAddUser} style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                            <h4 style={{ color: 'white', marginBottom: '1rem' }}>Create New User</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                                        placeholder="e.g. Sarah Connor"
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={newUser.email}
                                        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                                        placeholder="sarah@company.com"
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Role</label>
                                    <select
                                        value={newUser.role}
                                        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                                        style={{ width: '100%', padding: '0.75rem', background: 'var(--color-bg-tertiary)', border: '1px solid var(--border-color)', borderRadius: '0.5rem', color: 'white' }}
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="HR">HR Dept</option>
                                        <option value="IT_SUPPORT">IT Support</option>
                                        <option value="ADMIN">System Admin</option>
                                    </select>
                                </div>
                                <button type="submit" style={{ padding: '0.75rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}>
                                    Create User
                                </button>
                            </div>
                        </form>
                    )}

                    <div style={{ background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--color-bg-tertiary)' }}>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>User</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'left' }}>Role</th>
                                    <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {systemUsers.map(user => (
                                    <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div style={{ width: '32px', height: '32px', background: 'var(--color-bg-tertiary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid var(--border-color)' }}>
                                                    {user.avatar || user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{user.name}</div>
                                                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', fontSize: '0.75rem', border: '1px solid var(--border-color)' }}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                                            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}>
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ITDashboard;
