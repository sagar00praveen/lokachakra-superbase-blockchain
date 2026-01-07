import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    ArrowLeft,
    Upload,
    FileText,
    CheckCircle2,
    X,
    AlertCircle,
    Mail,
    Send,
    Check,
    Eye,
    EyeOff,
    Lock,
    RefreshCw,
    ArrowRight,
    User,
    Key,
    Calendar
} from 'lucide-react';

const SendOfferLetter = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const location = useLocation();

    // State for candidate selection
    const [selectedCandidateId, setSelectedCandidateId] = useState(location.state?.candidateId || null);
    const [availableCandidates, setAvailableCandidates] = useState([]);

    const [currentStep, setCurrentStep] = useState(1);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Policy State
    const [selectedPolicies, setSelectedPolicies] = useState(['nda', 'code_conduct', 'it_policy']);
    const policies = [
        { id: 'nda', name: 'Non-Disclosure Agreement (NDA)' },
        { id: 'code_conduct', name: 'Code of Conduct' },
        { id: 'it_policy', name: 'IT Security Policy' },
        { id: 'remote_work', name: 'Remote Work Guidelines' },
        { id: 'benefits', name: 'Employee Benefits Guide' },
        { id: 'harassment', name: 'Anti-Harassment Policy' }
    ];

    const handlePolicyToggle = (id) => {
        setSelectedPolicies(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    // Helper to get candidate from storage
    const getCandidateFromStorage = (id) => {
        if (!id) return null;
        try {
            const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
            return savedCandidates.find(c => c.id === id) || null;
        } catch (e) {
            console.error("Error reading candidates", e);
            return null;
        }
    };

    // Initialize Form Data from Storage (Synchronous)
    const [candidateData, setCandidateData] = useState(() => {
        const candidate = getCandidateFromStorage(location.state?.candidateId);
        if (candidate) {
            return {
                name: candidate.fullName || '',
                personalEmail: candidate.personalEmail || '',
                position: candidate.position || '',
                companyName: 'LokaChakra InfoTech'
            };
        }
        return { name: '', personalEmail: '', position: '', companyName: 'LokaChakra InfoTech' };
    });

    const [credentials, setCredentials] = useState(() => {
        const candidate = getCandidateFromStorage(location.state?.candidateId);
        if (candidate && candidate.itUserInfo) {
            return {
                companyEmail: candidate.itUserInfo.email || '',
                username: candidate.itUserInfo.username || '',
                tempPassword: candidate.itUserInfo.password || ''
            };
        }
        return { companyEmail: '', username: '', tempPassword: '' };
    });

    const [emailBody, setEmailBody] = useState('');

    // Update email body when candidate data changes
    useEffect(() => {
        if (candidateData.name) {
            setEmailBody(`Dear ${candidateData.name},

We are delighted to offer you the position of ${candidateData.position} at ${candidateData.companyName}.

Please find the attached offer letter outlining the terms and conditions of your employment.

To facilitate your onboarding, we have created your temporary login credentials. Please use these to log in to our employee portal and complete your onboarding documentation.`);
        }
    }, [candidateData]);

    // Load available candidates
    useEffect(() => {
        const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
        const ready = savedCandidates.filter(c => c.status === 'pending_offer');
        setAvailableCandidates(ready);
    }, []);

    // Handle switching candidate in selection mode
    const handleCandidateSelect = (candidate) => {
        setSelectedCandidateId(candidate.id);

        // Update local state immediately
        setCandidateData({
            name: candidate.fullName,
            personalEmail: candidate.personalEmail,
            position: candidate.position,
            companyName: 'LokaChakra InfoTech'
        });

        if (candidate.itUserInfo) {
            setCredentials({
                companyEmail: candidate.itUserInfo.email,
                username: candidate.itUserInfo.username,
                tempPassword: candidate.itUserInfo.password
            });
        } else {
            setCredentials({ companyEmail: '', username: '', tempPassword: '' });
        }
    };

    const steps = [
        { number: 1, title: 'Upload Offer', icon: Upload },
        { number: 2, title: 'Review & Send', icon: Mail },
        { number: 3, title: 'Confirmation', icon: CheckCircle2 }
    ];

    // File validation
    const validateFile = (file) => {
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes

        if (!file) {
            setError('Please select a file');
            return false;
        }

        if (file.type !== 'application/pdf') {
            setError('Only PDF files are allowed');
            return false;
        }

        if (file.size > maxSize) {
            setError('File size must be less than 10MB');
            return false;
        }

        setError('');
        return true;
    };

    // Handle file selection
    const handleFileSelect = (file) => {
        if (validateFile(file)) {
            setUploadedFile(file);
        }
    };

    // Handle file input change
    const handleFileInputChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Handle drag and drop
    const handleDragEnter = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Remove uploaded file
    const handleRemoveFile = () => {
        setUploadedFile(null);
        setError('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    // Render Selection Screen if no candidate selected
    if (!selectedCandidateId) {
        return (
            <div className="animate-fade-in-up max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group transition-colors"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Dashboard</span>
                </button>

                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Select Candidate</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">
                        Select a candidate to send an offer letter to.
                    </p>
                </div>

                {availableCandidates.length > 0 ? (
                    <div className="grid gap-4">
                        {availableCandidates.map(c => (
                            <div
                                key={c.id}
                                onClick={() => handleCandidateSelect(c)}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 cursor-pointer transition-all flex justify-between items-center group"
                            >
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{c.fullName}</h3>
                                    <p className="text-sm text-gray-500">{c.position} • {c.department}</p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <ArrowRight size={20} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail size={32} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">No Candidates Ready</h3>
                        <p className="text-gray-500">
                            There are no candidates currently waiting for an offer letter.
                            Complete the IT onboarding process first.
                        </p>
                    </div>
                )}
            </div>
        );
    }

    // Handle next step
    const handleNext = () => {
        if (currentStep === 1 && uploadedFile) {
            setCurrentStep(2);
        } else if (currentStep === 2) {
            // Send Offer - Update LocalStorage
            if (selectedCandidateId) {
                const savedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
                const updated = savedCandidates.map(c => {
                    if (c.id === selectedCandidateId) {
                        return {
                            ...c,
                            status: 'offer_sent',
                            workflow: { ...c.workflow, offer_sent: true }
                        };
                    }
                    return c;
                });
                localStorage.setItem('candidates', JSON.stringify(updated));
            }
            setCurrentStep(3);
        }
    };

    return (
        <div className="animate-fade-in-up max-w-4xl mx-auto">
            {/* Back Navigation */}
            <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 group transition-colors"
            >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Candidates</span>
            </button>

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Send Offer Letter</h1>
                <p className="text-sm font-medium text-gray-500 mt-1">
                    Upload and send offer letter to candidate
                </p>
            </div>

            {/* Candidate Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs font-medium text-indigo-600 mb-1">SENDING OFFER TO</p>
                        <h3 className="text-lg font-bold text-gray-900">{candidateData.name}</h3>
                        <p className="text-sm text-gray-600 mt-1">{candidateData.position}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-xl">
                        <Mail size={16} className="text-indigo-600" />
                        <span className="text-sm font-medium text-gray-700">{candidateData.personalEmail}</span>
                    </div>
                </div>
            </div>

            {/* Step Progress Indicator */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
                <div className="flex items-center justify-between relative">
                    {/* Progress Line */}
                    <div className="absolute left-0 right-0 h-1 bg-gray-100 top-8 -z-10" />
                    <div
                        className="absolute left-0 h-1 bg-indigo-600 top-8 -z-10 transition-all duration-500"
                        style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.number;
                        const isCompleted = currentStep > step.number;

                        return (
                            <div key={step.number} className="flex flex-col items-center flex-1">
                                <div className={`
                                    w-16 h-16 rounded-2xl flex items-center justify-center mb-3 transition-all duration-300
                                    ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : ''}
                                    ${isCompleted ? 'bg-emerald-500 text-white' : ''}
                                    ${!isActive && !isCompleted ? 'bg-gray-100 text-gray-400' : ''}
                                `}>
                                    {isCompleted ? <Check size={28} /> : <Icon size={28} />}
                                </div>
                                <div className="text-center">
                                    <p className={`text-xs font-bold mb-1 ${isActive ? 'text-indigo-600' : isCompleted ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        STEP {step.number}
                                    </p>
                                    <p className={`text-sm font-semibold ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {step.title}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step 1: Upload Offer */}
            {currentStep === 1 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                    {/* Upload Area */}
                    {!uploadedFile ? (
                        <div
                            className={`
                                border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                                ${isDragging
                                    ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                                    : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                                }
                            `}
                            onDragEnter={handleDragEnter}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            <div className="flex flex-col items-center">
                                <div className={`
                                    w-20 h-20 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
                                    ${isDragging ? 'bg-indigo-600 scale-110' : 'bg-indigo-100'}
                                `}>
                                    <Upload size={40} className={isDragging ? 'text-white' : 'text-indigo-600'} />
                                </div>

                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Upload Offer Letter
                                </h3>
                                <p className="text-gray-500 font-medium mb-6">
                                    Click to upload or drag and drop
                                </p>

                                <div className="flex items-center gap-6 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <FileText size={16} />
                                        <span className="font-medium">PDF only</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <AlertCircle size={16} />
                                        <span className="font-medium">Max 10MB</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* File Preview */
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-emerald-600 mb-4">
                                <CheckCircle2 size={20} />
                                <span className="font-semibold">File uploaded successfully!</span>
                            </div>

                            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                                            <FileText size={28} className="text-red-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{uploadedFile.name}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {formatFileSize(uploadedFile.size)}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleRemoveFile}
                                        className="p-2 hover:bg-red-100 rounded-xl transition-colors group"
                                    >
                                        <X size={20} className="text-gray-400 group-hover:text-red-600" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
                            <AlertCircle size={18} className="text-red-600 shrink-0" />
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Step 2: Review & Send */}
            {currentStep === 2 && (
                <div className="space-y-6 animate-fade-in-up">
                    {/* Section 1: Uploaded File Review */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <FileText size={24} className="text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Offer Letter Attached</p>
                                    <h4 className="font-bold text-gray-900">{uploadedFile?.name}</h4>
                                    <p className="text-xs text-gray-400">{uploadedFile ? formatFileSize(uploadedFile.size) : '0 KB'}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setCurrentStep(1)}
                                className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <RefreshCw size={16} />
                                Change File
                            </button>
                        </div>
                    </div>

                    {/* Section 2: Email Preview */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center gap-3">
                            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center border border-gray-200">
                                <Mail size={16} className="text-gray-500" />
                            </div>
                            <h3 className="font-bold text-gray-900">Email Preview</h3>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Email Header */}
                            <div className="grid gap-4">
                                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-500 text-right">To:</label>
                                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 font-medium">
                                        {candidateData.personalEmail}
                                    </div>
                                </div>
                                <div className="grid grid-cols-[100px_1fr] items-center gap-4">
                                    <label className="text-sm font-semibold text-gray-500 text-right">Subject:</label>
                                    <div className="px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 font-bold">
                                        Offer Letter – {candidateData.position} at {candidateData.companyName}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-100" />

                            {/* Email Body */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Message Body</label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none min-h-[120px] resize-none"
                                />
                            </div>

                            {/* Credentials Block */}
                            <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-6 relative overflow-hidden mb-6">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                                <h3 className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Lock size={16} /> IT Generated Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                                    <div>
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Company Email</p>
                                        <div className="flex items-center gap-2 font-mono text-sm text-indigo-900 bg-white/60 p-2 rounded-lg border border-indigo-100">
                                            <Mail size={14} className="text-indigo-400" />
                                            {credentials.companyEmail || 'Pending Generation'}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Username</p>
                                        <div className="flex items-center gap-2 font-mono text-sm text-indigo-900 bg-white/60 p-2 rounded-lg border border-indigo-100">
                                            <User size={14} className="text-indigo-400" />
                                            {credentials.username || 'Pending Generation'}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-indigo-400 font-semibold mb-1">Temporary Password</p>
                                        <div className="flex items-center gap-2 font-mono text-sm text-indigo-900 bg-white/60 p-2 rounded-lg border border-indigo-100">
                                            <Key size={14} className="text-indigo-400" />
                                            <span className="flex-1">
                                                {showPassword ? (credentials.tempPassword || 'Pending Generation') : '••••••••••••'}
                                            </span>
                                            <button
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-indigo-400 hover:text-indigo-600 transition-colors"
                                            >
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Policy Selection Section */}
                            <div className="mb-6">
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <FileText size={16} /> Attach Policies & Documents
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {policies.map((policy) => (
                                        <label key={policy.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                                            <input
                                                type="checkbox"
                                                checked={selectedPolicies.includes(policy.id)}
                                                onChange={() => handlePolicyToggle(policy.id)}
                                                className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">{policy.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Step 3: Confirmation */}
            {currentStep === 3 && (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 animate-fade-in-up">
                    <div className="text-center py-12">
                        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-100 animate-bounce-short">
                            <CheckCircle2 size={48} className="text-emerald-600" />
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 mb-4">Offer Letter Sent!</h3>
                        <p className="text-gray-500 font-medium max-w-md mx-auto mb-8">
                            The offer letter and login credentials have been securely emailed to
                            <span className="font-bold text-gray-900"> {candidateData.name}</span>.
                        </p>

                        <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto mb-8 text-left">
                            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Check size={18} className="text-emerald-500" />
                                Next Steps
                            </h4>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                                    Candidate reviews and digitally signs the offer
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                                    IT system access is automatically provisioned
                                </li>
                                <li className="flex items-start gap-3 text-sm text-gray-600">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1.5"></div>
                                    Candidate receives onboarding checklist
                                </li>
                            </ul>
                        </div>

                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-8 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-black transition-colors shadow-lg"
                        >
                            Return to Dashboard
                        </button>
                    </div>
                </div>
            )}

            {/* Action Buttons (Hidden on Step 3) */}
            {currentStep < 3 && (
                <div className="flex items-center justify-between mt-8">
                    <button
                        onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/dashboard')}
                        className="px-6 py-3 text-gray-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        {currentStep > 1 ? 'Back' : 'Cancel'}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={currentStep === 1 && !uploadedFile}
                        className={`
                            px-8 py-3 font-semibold rounded-xl transition-all duration-200 flex items-center gap-2
                            ${currentStep === 1 && !uploadedFile
                                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300'
                            }
                        `}
                    >
                        {currentStep === 2 ? (
                            <>
                                <Send size={20} />
                                Send Offer Letter
                            </>
                        ) : (
                            <>
                                Continue to Review
                                <ArrowLeft size={20} className="rotate-180" />
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SendOfferLetter;
