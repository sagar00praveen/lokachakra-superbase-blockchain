import React from 'react';
import { Users, Settings, Shield, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Jan', users: 40 },
    { name: 'Feb', users: 45 },
    { name: 'Mar', users: 55 },
    { name: 'Apr', users: 60 },
];

const AdminDashboard = () => {
    return (
        <div style={{ padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>System Administration</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '0.5rem', color: 'var(--color-admin-primary)' }}>
                            <Users size={20} />
                        </div>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Total Users</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>154</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--color-hr-primary)' }}>
                            <Shield size={20} />
                        </div>
                        <span style={{ color: 'var(--color-text-secondary)' }}>Active Roles</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>4</div>
                </div>

                <div style={{ padding: '1.5rem', background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{ padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '0.5rem', color: 'var(--color-it-primary)' }}>
                            <Settings size={20} />
                        </div>
                        <span style={{ color: 'var(--color-text-secondary)' }}>System Load</span>
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>24%</div>
                </div>
            </div>

            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>User Growth Analytics</h3>
                <div style={{ height: '300px', width: '100%' }}>
                    <ResponsiveContainer>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--color-text-muted)" />
                            <YAxis stroke="var(--color-text-muted)" />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--color-bg-tertiary)', borderColor: 'var(--border-color)', color: 'white' }}
                            />
                            <Bar dataKey="users" fill="var(--color-admin-primary)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div style={{ marginTop: '2rem' }}>
                <h3 style={{ color: 'white', marginBottom: '1rem' }}>User Management</h3>
                <div style={{ background: 'var(--color-bg-card)', borderRadius: '1rem', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>User</th>
                                <th style={{ padding: '1rem' }}>Role</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={{ padding: '1rem' }}>Alice Admin</td>
                                <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-admin-primary)', borderRadius: '0.25rem', fontSize: '0.8rem' }}>ADMIN</span></td>
                                <td style={{ padding: '1rem' }}>Active</td>
                                <td style={{ padding: '1rem' }}><button style={{ color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button></td>
                            </tr>
                            <tr>
                                <td style={{ padding: '1rem' }}>Bob HR</td>
                                <td style={{ padding: '1rem' }}><span style={{ padding: '0.25rem 0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--color-hr-primary)', borderRadius: '0.25rem', fontSize: '0.8rem' }}>HR</span></td>
                                <td style={{ padding: '1rem' }}>Active</td>
                                <td style={{ padding: '1rem' }}><button style={{ color: 'var(--color-text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>Edit</button></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
