import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    CheckCircle2,
    Building2,
    Shield,
    Users,
    Monitor,
    UserCheck,
    ChevronLeft
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const Login = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useDashboard();

    const roleParam = searchParams.get('role') || 'hr';
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Role Configuration
    const roles = {
        hr: {
            title: 'Human Resources',
            icon: Users,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
            accent: 'ring-blue-500/20'
        },
        it: {
            title: 'IT Operations',
            icon: Monitor,
            color: 'text-emerald-500',
            bg: 'bg-emerald-50',
            accent: 'ring-emerald-500/20'
        },
        candidate: {
            title: 'Candidate Portal',
            icon: UserCheck,
            color: 'text-purple-500',
            bg: 'bg-purple-50',
            accent: 'ring-purple-500/20'
        },
        admin: {
            title: 'Administration',
            icon: Shield,
            color: 'text-orange-500',
            bg: 'bg-orange-50',
            accent: 'ring-orange-500/20'
        }
    };

    const currentRole = roles[roleParam] || roles.hr;
    const RoleIcon = currentRole.icon;

    const [isSignUp, setIsSignUp] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');
        setSuccessMsg('');

        try {
            if (isSignUp) {
                // Sign Up Logic
                const { data, error } = await supabase.auth.signUp({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                if (data?.user) {
                    setSuccessMsg("Account created! You can now sign in.");
                    setIsSignUp(false); // Switch back to login
                }
            } else {
                // Sign In Logic
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email,
                    password: password,
                });

                if (error) throw error;

                if (data?.user) {
                    const userData = {
                        email: data.user.email,
                        id: data.user.id,
                        role: roleParam.toUpperCase()
                    };
                    login(roleParam, userData);

                    // Redirect to specific dashboard based on role
                    const dashboardRoutes = {
                        'hr': '/hr/dashboard',
                        'it': '/it/dashboard',
                        'candidate': '/candidate/dashboard',
                        'admin': '/admin/dashboard'
                    };

                    navigate(dashboardRoutes[roleParam] || '/');
                }
            }
        } catch (err) {
            console.error("Auth error:", err);
            setErrorMsg(err.message || "Authentication failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
            {/* Ambient Background Mesh */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-100 rounded-full blur-[120px] opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate('/')}
                className="absolute top-8 left-8 p-3 bg-white/60 backdrop-blur-xl border border-white/40 rounded-full shadow-sm hover:scale-105 transition-all z-20"
            >
                <ChevronLeft size={20} className="text-gray-600" />
            </button>

            {/* Login Card */}
            <div className="w-full max-w-[440px] z-10 animate-fade-in-up">
                <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[40px] p-10 relative overflow-hidden">

                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <div className={`
                            p-4 rounded-2xl mb-6 shadow-sm
                            ${currentRole.bg} ${currentRole.color}
                        `}>
                            <RoleIcon size={32} />
                        </div>
                        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight mb-2">
                            {isSignUp ? 'Create Account' : 'Welcome Back'}
                        </h1>
                        <p className="text-gray-500 font-medium text-sm">
                            {isSignUp ? `Register for ${currentRole.title}` : `Sign in to ${currentRole.title}`}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-white/50 border border-transparent shadow-sm rounded-2xl focus:bg-white focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    placeholder="name@company.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gray-900 transition-colors" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3.5 bg-white/50 border border-transparent shadow-sm rounded-2xl focus:bg-white focus:ring-4 focus:ring-gray-100 outline-none transition-all font-medium text-gray-900 placeholder:text-gray-400"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 size={16} className="text-emerald-500" />
                                <span className="text-xs text-gray-500 font-medium">Secure Connection</span>
                            </div>
                            <a href="#" className="text-xs font-semibold text-gray-900 hover:text-black hover:underline">
                                Help signing in?
                            </a>
                        </div>

                        {/* Success Message Display */}
                        {successMsg && (
                            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-medium flex items-center gap-2">
                                <CheckCircle2 size={16} />
                                {successMsg}
                            </div>
                        )}

                        {/* Error Message Display */}
                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-pulse">
                                <span className="block w-1.5 h-1.5 rounded-full bg-red-500" />
                                {errorMsg}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-3.5 rounded-2xl text-white font-semibold text-lg shadow-lg shadow-gray-200
                                transform active:scale-[0.98] transition-all duration-200
                                bg-gray-900 hover:bg-black
                                flex items-center justify-center gap-2 mt-2
                                ${isLoading ? 'opacity-80 cursor-wait' : ''}
                            `}
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                isSignUp ? "Create Account" : "Sign In"
                            )}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-sm text-gray-500">
                        {isSignUp ? "Already have an account? " : "Don't have an account? "}
                        <button
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setErrorMsg('');
                                setSuccessMsg('');
                            }}
                            className="font-bold text-gray-900 cursor-pointer hover:underline focus:outline-none"
                        >
                            {isSignUp ? "Sign In" : "Sign Up"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
