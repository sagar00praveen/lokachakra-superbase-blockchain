import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';

const UploadDocuments = () => {
    // Mock Document Configuration
    const initialDocs = [
        { id: 'aadhar', name: 'Aadhaar Card', required: true, status: 'pending', file: null },
        { id: 'pan', name: 'PAN Card', required: true, status: 'pending', file: null },
        { id: 'photo', name: 'Passport Size Photo', required: true, status: 'pending', file: null },
        { id: 'education', name: 'Educational Certificates', required: true, status: 'pending', file: null },
        { id: 'bank', name: 'Bank Account Details', required: true, status: 'pending', file: null },
        { id: 'address', name: 'Address Proof', required: true, status: 'pending', file: null },
        { id: 'experience', name: 'Experience Letters', required: false, status: 'pending', file: null },
        { id: 'payslips', name: 'Previous Payslips', required: false, status: 'pending', file: null },
    ];

    const [documents, setDocuments] = useState(initialDocs);

    // Helper components for File Input
    const FileUploadCard = ({ doc }) => {
        const fileInputRef = useRef(null);

        const handleFileChange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Simulate upload delay
                updateDocStatus(doc.id, 'uploading');
                setTimeout(() => {
                    updateDocStatus(doc.id, 'uploaded', file);
                }, 1500);
            }
        };

        return (
            <div className={`border rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md ${doc.status === 'uploaded' ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {doc.required ? <span className="text-red-500 font-medium">Required</span> : "Optional"}
                            • PDF, JPG, PNG (Max 5MB)
                        </p>
                    </div>
                    {doc.status === 'uploaded' ? (
                        <CheckCircle2 className="text-emerald-500" size={24} />
                    ) : (
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <FileText size={20} />
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    {doc.status === 'uploaded' ? (
                        <div className="flex items-center justify-between bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <FileText size={16} className="text-emerald-600 shrink-0" />
                                <span className="text-sm font-medium text-emerald-900 truncate">{doc.file?.name}</span>
                            </div>
                            <button
                                onClick={() => removeFile(doc.id)}
                                className="text-emerald-600 hover:text-red-500 transition-colors p-1"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : doc.status === 'uploading' ? (
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-indigo-600 h-2 rounded-full animate-progress" style={{ width: '60%' }}></div>
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer transition-colors"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <Upload size={20} className="text-indigo-500 mb-2" />
                            <span className="text-sm font-semibold text-gray-600">Choose File</span>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const updateDocStatus = (id, status, file = null) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status, file } : doc
        ));
    };

    const removeFile = (id) => {
        setDocuments(prev => prev.map(doc =>
            doc.id === id ? { ...doc, status: 'pending', file: null } : doc
        ));
    };

    const overallProgress = Math.round((documents.filter(d => d.status === 'uploaded').length / documents.length) * 100);

    return (
        <div className="space-y-6 animate-fade-in-up max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Upload Documents</h1>
                    <p className="text-sm font-medium text-gray-500 mt-1">Submit required documents for onboarding verification.</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-indigo-600">{overallProgress}% Completed</span>
                    <div className="w-32 h-2 bg-gray-100 rounded-full mt-1">
                        <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${overallProgress}%` }}></div>
                    </div>
                </div>
            </div>

            {/* Instruction Banner */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="text-sm font-bold text-blue-800">File Upload Guidelines</h3>
                    <ul className="text-sm text-blue-700 mt-1 space-y-1 list-disc list-inside">
                        <li>Accepted formats: PDF, JPEG, PNG.</li>
                        <li>Maximum file size per document: 5MB.</li>
                        <li>Ensure scanned copies are clear and readable.</li>
                    </ul>
                </div>
            </div>

            {/* Documents Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {documents.map((doc) => (
                    <FileUploadCard key={doc.id} doc={doc} />
                ))}
            </div>

            {/* Bottom Actions */}
            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all">
                    Submit for Verification
                </button>
            </div>
        </div>
    );
};

export default UploadDocuments;
