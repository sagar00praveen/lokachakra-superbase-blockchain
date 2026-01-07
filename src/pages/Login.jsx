import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDashboard } from '../context/DashboardContext';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    CheckCircle2,
    Building2,
    Shield,
    Users,
    Monitor,
    UserCheck
} from 'lucide-react';

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
            title: 'HR Portal',
            icon: Users,
            color: 'from-blue-600 to-cyan-600',
            textColor: 'text-blue-600',
            bgLight: 'bg-blue-50',
            email: 'priya.sharma@lokachakra.com'
        },
        it: {
            title: 'IT Portal',
            icon: Monitor,
            color: 'from-emerald-600 to-teal-600',
            textColor: 'text-emerald-600',
            bgLight: 'bg-emerald-50',
            email: 'vikram.singh@lokachakra.com'
        },
        candidate: {
            title: 'Candidate Portal',
            icon: UserCheck,
            color: 'from-purple-600 to-pink-600',
            textColor: 'text-purple-600',
            bgLight: 'bg-purple-50',
            email: 'rajesh.kumar@email.com'
        },
        admin: {
            title: 'Admin Portal',
            icon: Shield,
            color: 'from-orange-600 to-red-600',
            textColor: 'text-orange-600',
            bgLight: 'bg-orange-50',
            email: 'admin@lokachakra.com'
        }
    };

    const currentRole = roles[roleParam] || roles.hr;
    const RoleIcon = currentRole.icon;

    useEffect(() => {
        setEmail(currentRole.email);
    }, [currentRole]);

    const handleLogin = (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Mock Login Delay
        setTimeout(() => {
            const userData = {
                name: currentRole.email.split('@')[0].replace('.', ' ').split(' ').map(n => n.charAt(0).toUpperCase() + n.slice(1)).join(' '),
                email: currentRole.email,
                role: roleParam.toUpperCase()
            };
            login(roleParam, userData);
            navigate('/dashboard');
        }, 1500);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side: Visuals */}
            <div className={`hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br ${currentRole.color} text-white relative overflow-hidden transition-all duration-500`}>
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                            <Building2 size={24} />
                        </div>
                        <span className="text-xl font-bold tracking-wide">HR Nexus</span>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-5xl font-bold mb-6 leading-tight">
                        Welcome to the <br />
                        <span className="opacity-90">{currentRole.title}</span>
                    </h1>
                    <p className="text-lg opacity-80 mb-8 leading-relaxed">
                        Securely access your dashboard to manage workflows, view updates, and collaborate with your team.
                    </p>

                    <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 shadow-lg">
                            <CheckCircle2 size={24} className={currentRole.textColor} />
                        </div>
                        <div>
                            <p className="font-bold text-lg">Secure Login</p>
                            <p className="text-sm opacity-75">End-to-end encrypted session</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-sm opacity-60">
                    © 2026 LokaChakra Inc. All rights reserved.
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="flex items-center justify-center p-6 bg-white">
                <div className="w-full max-w-md space-y-8 animate-fade-in-up">
                    <div className="text-center lg:text-left">
                        <div className={`inline-flex p-4 rounded-2xl ${currentRole.bgLight} ${currentRole.textColor} mb-6`}>
                            <RoleIcon size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900">Sign in to your account</h2>
                        <p className="text-gray-500 mt-2">Enter your credentials to access the portal</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-gray-700">Password</label>
                                <a href="#" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">Forgot password?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`
                                w-full py-4 rounded-xl text-white font-bold text-lg shadow-xl 
                                transform hover:-translate-y-0.5 transition-all duration-200
                                flex items-center justify-center gap-2
                                bg-gradient-to-r ${currentRole.color}
                                ${isLoading ? 'opacity-80 cursor-wait' : 'hover:shadow-2xl'}
                            `}
                        >
                            {isLoading ? (
                                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    Sign In <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-500">
                            Don't have an account? <span className="font-bold text-gray-900 cursor-pointer hover:underline">Contact IT Support</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
