import { useState } from 'react';
import LogoSection from './LogoSection';
// Note: BackgroundAnimation is replaced by CSS effects in the new design but kept if we want to re-add later
import { Users, Monitor, User, Shield, FileText, Lock, Eye, EyeOff, ArrowLeft, Spinner, CheckCircle } from './Icons';
import './LoginPage.css';

const PORTALS = [
    {
        id: 'hr',
        title: 'HR Portal',
        description: 'Employee management, payroll, and benefits administration.',
        icon: Users,
        color: '#3b82f6', // Bright Blue
        bg: 'rgba(59, 130, 246, 0.1)',
        glow: 'rgba(59, 130, 246, 0.4)'
    },
    {
        id: 'it',
        title: 'IT Portal',
        description: 'System access, helpdesk tickets, and resource management.',
        icon: Monitor,
        color: '#10b981', // Emerald
        bg: 'rgba(16, 185, 129, 0.1)',
        glow: 'rgba(16, 185, 129, 0.4)'
    },
    {
        id: 'candidate',
        title: 'Careers',
        description: 'Job applications, interview status, and onboarding tracking.',
        icon: User,
        color: '#f59e0b', // Amber
        bg: 'rgba(245, 158, 11, 0.1)',
        glow: 'rgba(245, 158, 11, 0.4)'
    },
    {
        id: 'admin',
        title: 'Admin Console',
        description: 'Global system configuration, audit logs, and security controls.',
        icon: Shield,
        color: '#ef4444', // Red
        bg: 'rgba(239, 68, 68, 0.1)',
        glow: 'rgba(239, 68, 68, 0.4)'
    }
];

function LoginPage() {
    const [activePortal, setActivePortal] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ identifier: '', password: '', remember: false });

    const handlePortalSelect = (portalId) => {
        setActivePortal(portalId);
        setFormData({ identifier: '', password: '', remember: false });
    };

    const handleBack = () => {
        setActivePortal(null);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsLoading(false);
        alert(`Logged into ${PORTALS.find(p => p.id === activePortal).title}`);
    };

    const activePortalData = PORTALS.find(p => p.id === activePortal);

    return (
        <div className="login-page">
            <div className="ambient-glow"></div>
            <div className="ambient-glow-2"></div>

            <div className="login-container">
                {/* Header - Only show when no portal is active or simplified when active */}
                {!activePortal && <LogoSection />}

                {/* State 1: Portal Selection Grid */}
                {!activePortal && (
                    <div className="portal-grid">
                        {PORTALS.map((portal) => {
                            const Icon = portal.icon;
                            return (
                                <div
                                    key={portal.id}
                                    className="portal-card"
                                    onClick={() => handlePortalSelect(portal.id)}
                                    style={{
                                        '--active-color': portal.color,
                                        '--active-bg': portal.bg,
                                        '--active-glow': portal.glow
                                    }}
                                >
                                    <div className="portal-icon-wrapper">
                                        <Icon />
                                    </div>
                                    <h3 className="portal-title">{portal.title}</h3>
                                    <p className="portal-desc">{portal.description}</p>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* State 2: Login Interface (Split View) */}
                {activePortal && (
                    <div className="login-content-wrapper" style={{ '--active-color': activePortalData.color, '--active-bg': activePortalData.color }}>
                        {/* Left Sidebar: Branding info */}
                        <div className="login-sidebar">
                            <div className="sidebar-icon-large">
                                <activePortalData.icon />
                            </div>
                            <div className="sidebar-text">
                                <h2 className="sidebar-title">{activePortalData.title}</h2>
                                <p className="sidebar-desc">{activePortalData.description}</p>
                            </div>
                        </div>

                        {/* Right Section: Form */}
                        <div className="login-form-section">
                            <div className="form-header">
                                <button className="back-btn" onClick={handleBack} style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#64748b',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '1rem',
                                    padding: 0,
                                    fontSize: '0.9rem'
                                }}>
                                    <ArrowLeft style={{ width: '16px' }} /> Back to Portals
                                </button>
                                <h2 className="form-title">Welcome Back</h2>
                                <p className="form-subtitle">Please enter your details to sign in.</p>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="input-group">
                                    <label className="input-label">Employee ID or Email</label>
                                    <div className="input-field-wrapper">
                                        <div className="input-icon">
                                            <FileText />
                                        </div>
                                        <input
                                            type="text"
                                            name="identifier"
                                            className="form-input"
                                            placeholder="Ex: EMP12345"
                                            value={formData.identifier}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="input-group">
                                    <label className="input-label">Password</label>
                                    <div className="input-field-wrapper">
                                        <div className="input-icon">
                                            <Lock />
                                        </div>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-input"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff /> : <Eye />}
                                        </button>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <label className="remember-me">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={formData.remember}
                                            onChange={handleInputChange}
                                        />
                                        <div className="custom-checkbox">
                                            <CheckCircle />
                                        </div>
                                        <span>Remember me</span>
                                    </label>
                                    <a href="#" className="forgot-link">Forgot Password?</a>
                                </div>

                                <button type="submit" className="submit-btn" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Spinner /> Processing...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LoginPage;
