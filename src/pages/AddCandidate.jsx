import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCandidate } from '../services/api';
import {
    ArrowLeft,
    User,
    Briefcase,
    Users,
    Mail,
    Phone,
    MapPin,
    Calendar,
    DollarSign,
    Building2,
    UserCheck,
    CheckCircle2,
    Info
} from 'lucide-react';

const AddCandidate = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        personalEmail: '',
        position: '',
        department: '',
        team: '',
        employmentType: '',
        workLocation: '',
        annualCTC: '',
        joiningDate: '',
        assignedHR: '',
        assignedIT: '',
        reportingManager: ''
    });

    const [errors, setErrors] = useState({});

    // Mock data for dropdowns
    const departments = ['Engineering', 'Sales', 'HR', 'Finance', 'Marketing', 'Operations'];
    const teams = ['Frontend', 'Backend', 'DevOps', 'QA', 'Design', 'Product'];
    const employmentTypes = ['Full-time', 'Intern', 'Contract', 'Part-time'];
    const locations = ['Hyderabad', 'Bangalore', 'Mumbai', 'Remote', 'Hybrid'];
    const hrMembers = [
        { name: 'Priya Sharma', workload: 3 },
        { name: 'Rahul Verma', workload: 5 },
        { name: 'Anita Desai', workload: 2 }
    ];
    const itMembers = [
        { name: 'Vikram Singh', workload: 4 },
        { name: 'Suresh Kumar', workload: 2 },
        { name: 'Neha Patel', workload: 6 }
    ];
    const managers = ['John Doe', 'Jane Smith', 'Raj Malhotra', 'Sneha Reddy'];

    const workflowSteps = [
        { step: 1, title: 'HR creates candidate profile', active: true },
        { step: 2, title: 'IT creates email & login credentials', active: false },
        { step: 3, title: 'HR sends offer letter', active: false },
        { step: 4, title: 'Candidate completes onboarding', active: false }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (formData.personalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.personalEmail)) {
            newErrors.personalEmail = 'Please enter a valid email address';
        }

        if (formData.phone && !/^[0-9]{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const [submitted, setSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        console.log("Validating form...", formData);

        if (!validateForm()) {
            console.log("Validation failed", errors);
            setSubmitError("Please check the form for errors (indicated in red).");
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        setIsSubmitting(true);
        try {
            console.log("Submitting to API...");
            const result = await createCandidate(formData);
            console.log("API Success:", result);
            setSubmitted(true);
        } catch (error) {
            console.error("Failed to create candidate", error);
            setSubmitError(error.message || "Failed to create candidate. Please check your connection or permissions.");
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Auto-redirect effect when submitted becomes true
    React.useEffect(() => {
        if (submitted) {
            const timer = setTimeout(() => {
                navigate('/hr/dashboard');
            }, 3000); // 3 seconds delay
            return () => clearTimeout(timer);
        }
    }, [submitted, navigate]);

    if (submitted) {
        return (
            <div className="animate-fade-in-up max-w-2xl mx-auto text-center pt-12">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-12">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-200">
                        <CheckCircle2 size={48} className="text-emerald-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Candidate Profile Created!</h2>
                    <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
                        <span className="font-bold text-gray-900">{formData.fullName}</span> has been added to the system.
                        <br /><br />
                        <span className="text-indigo-600 font-medium bg-indigo-50 px-3 py-1 rounded-lg">Next Step: IT Provisioning</span>
                        <br />
                        Redirecting to Dashboard...
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/hr/dashboard')}
                            className="w-full sm:w-auto px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-lg"
                        >
                            Return to Dashboard Now
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const inputClass = (fieldName) => `
    w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm font-medium text-gray-700
    focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 
    transition-all duration-200 outline-none
    ${errors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
  `;

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            {/* Back Navigation */}
            <button
                onClick={() => navigate('/hr/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group transition-colors"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Candidates</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add New Candidate</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    Create candidate profile – IT will create login credentials
                </p>
            </div>

            {/* Onboarding Workflow Info Box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Info size={18} className="text-indigo-600" />
                    <h3 className="font-semibold text-indigo-900">Onboarding Workflow</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {workflowSteps.map((item) => (
                        <div
                            key={item.step}
                            className={`flex items-start gap-3 p-3 rounded-xl ${item.active ? 'bg-indigo-600 text-white' : 'bg-white/60 text-gray-600'
                                }`}
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${item.active ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600'
                                }`}>
                                {item.step}
                            </div>
                            <span className="text-sm font-medium leading-tight">{item.title}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* Section 1: Personal Information */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <User size={20} className="text-blue-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Personal Information</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className={inputClass('fullName')}
                            />
                            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 98765 43210"
                                    className={`${inputClass('phone')} pl-10`}
                                />
                            </div>
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Personal Email
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="email"
                                    name="personalEmail"
                                    value={formData.personalEmail}
                                    onChange={handleChange}
                                    placeholder="personal@email.com"
                                    className={`${inputClass('personalEmail')} pl-10`}
                                />
                            </div>
                            {errors.personalEmail && <p className="text-red-500 text-xs mt-1">{errors.personalEmail}</p>}
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <Info size={12} />
                                Company email will be created by IT team
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Job Details */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-emerald-50 rounded-xl">
                            <Briefcase size={20} className="text-emerald-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Job Details</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                            <input
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g., Software Engineer"
                                className={inputClass('position')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
                            <div className="relative">
                                <Building2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="department"
                                    value={formData.department}
                                    onChange={handleChange}
                                    className={`${inputClass('department')} pl-10 appearance-none cursor-pointer`}
                                >
                                    <option value="">Select Department</option>
                                    {departments.map(dept => (
                                        <option key={dept} value={dept}>{dept}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Team</label>
                            <select
                                name="team"
                                value={formData.team}
                                onChange={handleChange}
                                className={`${inputClass('team')} appearance-none cursor-pointer`}
                            >
                                <option value="">Select Team</option>
                                {teams.map(team => (
                                    <option key={team} value={team}>{team}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Employment Type</label>
                            <select
                                name="employmentType"
                                value={formData.employmentType}
                                onChange={handleChange}
                                className={`${inputClass('employmentType')} appearance-none cursor-pointer`}
                            >
                                <option value="">Select Type</option>
                                {employmentTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Work Location</label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="workLocation"
                                    value={formData.workLocation}
                                    onChange={handleChange}
                                    className={`${inputClass('workLocation')} pl-10 appearance-none cursor-pointer`}
                                >
                                    <option value="">Select Location</option>
                                    {locations.map(loc => (
                                        <option key={loc} value={loc}>{loc}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Annual CTC (INR)</label>
                            <div className="relative">
                                <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="annualCTC"
                                    value={formData.annualCTC}
                                    onChange={handleChange}
                                    placeholder="e.g., 12,00,000"
                                    className={`${inputClass('annualCTC')} pl-10`}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Joining Date</label>
                            <div className="relative">
                                <Calendar size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="date"
                                    name="joiningDate"
                                    value={formData.joiningDate}
                                    onChange={handleChange}
                                    className={`${inputClass('joiningDate')} pl-10`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Team Assignment */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                        <div className="p-2 bg-purple-50 rounded-xl">
                            <Users size={20} className="text-purple-600" />
                        </div>
                        <h2 className="text-lg font-bold text-gray-900">Team Assignment</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to HR</label>
                            <select
                                name="assignedHR"
                                value={formData.assignedHR}
                                onChange={handleChange}
                                className={`${inputClass('assignedHR')} appearance-none cursor-pointer`}
                            >
                                <option value="">Select HR Member</option>
                                {hrMembers.map(hr => (
                                    <option key={hr.name} value={hr.name}>
                                        {hr.name} ({hr.workload} candidates)
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Assign to IT</label>
                            <select
                                name="assignedIT"
                                value={formData.assignedIT}
                                onChange={handleChange}
                                className={`${inputClass('assignedIT')} appearance-none cursor-pointer`}
                            >
                                <option value="">Select IT Member</option>
                                {itMembers.map(it => (
                                    <option key={it.name} value={it.name}>
                                        {it.name} ({it.workload} tasks)
                                    </option>
                                ))}
                            </select>
                            <p className="text-xs text-gray-400 mt-2">Creates login credentials</p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Reporting Manager <span className="text-gray-400 font-normal">(Optional)</span>
                            </label>
                            <select
                                name="reportingManager"
                                value={formData.reportingManager}
                                onChange={handleChange}
                                className={`${inputClass('reportingManager')} appearance-none cursor-pointer`}
                            >
                                <option value="">Select Manager</option>
                                {managers.map(mgr => (
                                    <option key={mgr} value={mgr}>{mgr}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl 
                            shadow-lg shadow-indigo-200 transition-all duration-200 flex items-center gap-2
                            ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-indigo-700 hover:shadow-indigo-300'}
                        `}
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating...
                            </>
                        ) : (
                            <>
                                <UserCheck size={20} />
                                Create Candidate Profile
                            </>
                        )}
                    </button>
                </div>
                {submitError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center animate-pulse">
                        {submitError}
                    </div>
                )}
            </form>
        </div>
    );
};

export default AddCandidate;
