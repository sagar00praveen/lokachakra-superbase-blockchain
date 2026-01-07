import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, AlertCircle, CheckCircle, ClipboardList, Clock, Activity, CheckSquare } from 'lucide-react';

const StatBox = ({ label, value, icon: Icon, color, subtext }) => (
    <div style={{
        background: 'var(--color-bg-card)',
        padding: '1.25rem',
        borderRadius: '1rem',
        border: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
            <div style={{ padding: '0.5rem', background: `rgba(${color}, 0.1)`, borderRadius: '0.5rem', color: `rgb(${color})` }}>
                <Icon size={20} />
            </div>
            {subtext && <span style={{ fontSize: '0.75rem', color: 'var(--color-success)', background: 'var(--color-success-bg)', padding: '2px 6px', borderRadius: '4px' }}>{subtext}</span>}
        </div>
        <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: 'white' }}>{value}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{label}</div>
        </div>
    </div>
);

const HRDashboard = () => {
    const navigate = useNavigate();
    const [readyForOfferCandidates, setReadyForOfferCandidates] = useState([]);

    useEffect(() => {
        const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        const ready = savedCandidates.filter(c => c.status === 'pending_offer');
        setReadyForOfferCandidates(ready);
    }, []);

    return (
        <div style={{ padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>HR Management & Ops</h2>

            {/* Task Metrics Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                <StatBox
                    label="Total Tasks"
                    value="42"
                    icon={ClipboardList}
                    color="59, 130, 246"  // Blue
                />
                <StatBox
                    label="Active Tasks"
                    value="18"
                    icon={Activity}
                    color="245, 158, 11" // Amber
                    subtext="+3 today"
                />
                <StatBox
                    label="Pending Tasks"
                    value="8"
                    icon={Clock}
                    color="239, 68, 68" // Red
                />
                <StatBox
                    label="Tasks Completed"
                    value="16"
                    icon={CheckSquare}
                    color="16, 185, 129" // Green
                    subtext="94% Rate"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Team Overview */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Users size={18} /> Team Overview
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-it-primary)' }}></div>
                                <span style={{ color: 'var(--color-text-primary)' }}>Total Employees</span>
                            </div>
                            <span style={{ fontWeight: 'bold', color: 'white' }}>124</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-candidate-primary)' }}></div>
                                <span style={{ color: 'var(--color-text-primary)' }}>On Leave</span>
                            </div>
                            <span style={{ fontWeight: 'bold', color: 'white' }}>8</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'var(--color-bg-tertiary)', borderRadius: '0.75rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-accent-primary)' }}></div>
                                <span style={{ color: 'var(--color-text-primary)' }}>New Joiners</span>
                            </div>
                            <span style={{ fontWeight: 'bold', color: 'var(--color-success)' }}>+12</span>
                        </div>
                    </div>
                </div>

                {/* Pending Tasks List */}
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                    <h3 style={{ color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <AlertCircle size={18} /> Urgent Pending Items
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ padding: '0.85rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Approve Leave Request</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Sarah Jenkins • Product Designer</div>
                            </div>
                            <button style={{ padding: '0.4rem 0.8rem', background: 'var(--color-hr-primary)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>Review</button>
                        </div>

                        <div style={{ padding: '0.85rem', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(245, 158, 11, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Performance Review</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>John Doe • Backend Dev</div>
                            </div>
                            <button style={{ padding: '0.4rem 0.8rem', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--color-text-primary)', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer' }}>Remind</button>
                        </div>
                        <div style={{ padding: '0.85rem', background: 'var(--color-bg-tertiary)', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Background Verification</div>
                                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>Candidates #104, #109</div>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Processing...</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ready for Offer Section */}
            {readyForOfferCandidates.length > 0 && (
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <h3 style={{ color: 'white', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ClipboardList size={18} /> Candidates Ready for Offer
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {readyForOfferCandidates.map(candidate => (
                            <div key={candidate.id} style={{ padding: '0.85rem', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '0.5rem', border: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ color: 'white', fontSize: '0.9rem', marginBottom: '0.2rem' }}>{candidate.fullName}</div>
                                    <div style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>{candidate.position} • {candidate.department}</div>
                                </div>
                                <button
                                    onClick={() => navigate('/send-offer-letter', { state: { candidateId: candidate.id } })}
                                    style={{ padding: '0.4rem 0.8rem', background: 'var(--color-success)', color: 'white', border: 'none', borderRadius: '0.4rem', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 'bold' }}
                                >
                                    Send Offer
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} /> Employee Performance Monitor
            </h3>
            <div style={{ background: 'var(--color-bg-card)', borderRadius: '1rem', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'var(--color-bg-tertiary)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Employee</th>
                            <th style={{ padding: '1rem' }}>Department</th>
                            <th style={{ padding: '1rem' }}>Active Tasks</th>
                            <th style={{ padding: '1rem' }}>Project Score</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '1rem' }}>Mike Ross</td>
                            <td style={{ padding: '1rem' }}>Legal</td>
                            <td style={{ padding: '1rem' }}>3 Active</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '92%', height: '100%', background: 'var(--color-success)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>92/100</span>
                            </td>
                            <td style={{ padding: '1rem' }}><span style={{ color: 'var(--color-success)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14} /> Excellent</span></td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem' }}>Rachel Zane</td>
                            <td style={{ padding: '1rem' }}>Legal</td>
                            <td style={{ padding: '1rem' }}>5 Active</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '85%', height: '100%', background: 'var(--color-hr-primary)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>85/100</span>
                            </td>
                            <td style={{ padding: '1rem' }}><span style={{ color: 'var(--color-hr-primary)', fontSize: '0.8rem' }}>Good</span></td>
                        </tr>
                        <tr>
                            <td style={{ padding: '1rem' }}>Louis Litt</td>
                            <td style={{ padding: '1rem' }}>Management</td>
                            <td style={{ padding: '1rem' }}>8 Active</td>
                            <td style={{ padding: '1rem' }}>
                                <div style={{ width: '100px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: '78%', height: '100%', background: 'var(--color-it-primary)' }}></div>
                                </div>
                                <span style={{ fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>78/100</span>
                            </td>
                            <td style={{ padding: '1rem' }}><span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>Stable</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HRDashboard;
