import React from 'react';
import { DollarSign, FileText, Download } from 'lucide-react';

const CandidateDashboard = () => {
    return (
        <div style={{ padding: '0 0.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'white' }}>My Offer & Payroll</h2>

            <div style={{ background: 'linear-gradient(135deg, var(--color-bg-card) 0%, rgba(20, 20, 20, 0.8) 100%)', border: '1px solid var(--border-color)', borderRadius: '1.5rem', padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>TOTAL ANNUAL COMPENSATION</div>
                    <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>$145,000.00</div>
                    <div style={{ display: 'flex', gap: '2rem', color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                        <div><strong style={{ color: 'white' }}>$120,000</strong> Base Salary</div>
                        <div><strong style={{ color: 'white' }}>$25,000</strong> Signing Bonus</div>
                    </div>
                </div>
            </div>

            <h3 style={{ color: 'white', marginBottom: '1rem' }}>Recent Payslips</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ padding: '0.75rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '0.5rem', color: 'var(--color-hr-primary)' }}>
                            <FileText size={24} />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 600 }}>Payslip - December 2025</div>
                            <div style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>Processed on Jan 1, 2026</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                        <span style={{ color: 'white', fontWeight: 600 }}>$8,450.00</span>
                        <button style={{ background: 'transparent', border: 'none', color: 'var(--color-hr-primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                            <Download size={14} /> Download PDF
                        </button>
                    </div>
                </div>
            </div>

            <h3 style={{ color: 'white', margin: '2rem 0 1rem' }}>Tax Breakdown (Estimated)</h3>
            <div style={{ background: 'var(--color-bg-card)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    <span>Federal Tax</span>
                    <span style={{ color: 'white' }}>$23,400</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', color: 'var(--color-text-secondary)' }}>
                    <span>State Tax</span>
                    <span style={{ color: 'white' }}>$8,200</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                    <span>Social Security</span>
                    <span style={{ color: 'white' }}>$6,400</span>
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
