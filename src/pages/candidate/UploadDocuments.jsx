import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { fetchCurrentCandidate, fetchCandidateDocuments, uploadCandidateDocument, deleteCandidateDocument } from '../../services/api';

const UploadDocuments = () => {
    // Initial Config
    const requiredDocs = [
        { type: 'Aadhaar Card', required: true },
        { type: 'PAN Card', required: true },
        { type: 'Passport Size Photo', required: true },
        { type: 'Educational Certificates', required: true },
        { type: 'Bank Account Details', required: true },
        { type: 'Address Proof', required: true },
        { type: 'Experience Letters', required: false },
        { type: 'Previous Payslips', required: false },
    ];

    const [documents, setDocuments] = useState([]);
    const [candidateId, setCandidateId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const candidate = await fetchCurrentCandidate();
            if (candidate) {
                setCandidateId(candidate.id);
                const uploadedDocs = await fetchCandidateDocuments(candidate.id);

                // Merge required docs with uploaded docs
                const mergedDocs = requiredDocs.map(req => {
                    // Find the LATEST (first in array due to sort) document for this type
                    const found = uploadedDocs.find(u => u.document_type === req.type);
                    return {
                        id: found ? found.id : req.type, // Use DB ID if exists, else type as temp ID
                        name: req.type,
                        required: req.required,
                        status: found ? found.status : 'pending', // pending, uploaded (verified/pending), uploading
                        file: found ? { name: found.original_name } : null,
                        dbRecord: found || null
                    };
                });
                setDocuments(mergedDocs);
            }
        } catch (error) {
            console.error("Error loading documents:", error);
        } finally {
            setLoading(false);
        }
    };

    // Helper components for File Input
    const FileUploadCard = ({ doc }) => {
        const fileInputRef = useRef(null);

        const handleFileChange = async (e) => {
            const file = e.target.files[0];
            if (file && candidateId) {
                try {
                    updateDocStatus(doc.name, 'uploading');
                    await uploadCandidateDocument(candidateId, file, doc.name);
                    await loadData(); // Refresh to get the new pending record
                } catch (error) {
                    console.error("Upload failed:", error);
                    alert("Upload failed. Please try again.");
                    updateDocStatus(doc.name, 'pending');
                }
            }
        };

        const handleRemove = async () => {
            if (doc.dbRecord && doc.dbRecord.id && doc.status !== 'Rejected') {
                try {
                    if (confirm("Are you sure you want to delete this document?")) {
                        await deleteCandidateDocument(doc.dbRecord.id, doc.dbRecord.file_path);
                        await loadData();
                    }
                } catch (error) {
                    console.error("Delete failed:", error);
                    alert("Failed to delete document.");
                }
            }
        };

        // Determine display status based on DB status
        // DB Status: Pending, Verified, Rejected
        // UI Status: pending, uploading, uploaded (mapped from DB)

        const isUploaded = !!doc.dbRecord;
        const uploadStatus = doc.dbRecord ? doc.dbRecord.status : 'pending'; // Filter 'pending' here means DB Pending review

        return (
            <div className={`border rounded-xl p-5 bg-white shadow-sm transition-all hover:shadow-md ${isUploaded ? (uploadStatus === 'Rejected' ? 'border-red-200 bg-red-50/10' : 'border-emerald-200 bg-emerald-50/10') : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-gray-900">{doc.name}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            {doc.required ? <span className="text-red-500 font-medium">Required</span> : "Optional"}
                            • PDF, JPG, PNG (Max 5MB)
                        </p>
                    </div>
                    {isUploaded ? (
                        uploadStatus === 'Verified' ? <CheckCircle2 className="text-emerald-500" size={24} /> :
                            uploadStatus === 'Rejected' ? <AlertCircle className="text-red-500" size={24} /> :
                                <CheckCircle2 className="text-blue-500" size={24} />
                    ) : (
                        <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                            <FileText size={20} />
                        </div>
                    )}
                </div>

                <div className="mt-4">
                    {doc.status === 'uploading' ? (
                        <div className="w-full bg-gray-100 rounded-full h-2 mt-4 overflow-hidden">
                            <div className="bg-indigo-600 h-2 rounded-full animate-progress" style={{ width: '60%' }}></div>
                        </div>
                    ) : isUploaded ? (
                        <div className="space-y-3">
                            <div className={`flex items-center justify-between rounded-lg p-3 border ${uploadStatus === 'Rejected' ? 'bg-red-50 border-red-100' : 'bg-emerald-50 border-emerald-100'}`}>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <FileText size={16} className={`${uploadStatus === 'Rejected' ? 'text-red-600' : 'text-emerald-600'} shrink-0`} />
                                    <div className="min-w-0">
                                        <p className={`text-sm font-medium truncate ${uploadStatus === 'Rejected' ? 'text-red-900' : 'text-emerald-900'}`}>{doc.file?.name}</p>
                                        <p className={`text-xs ${uploadStatus === 'Rejected' ? 'text-red-600' : 'text-emerald-600'}`}>
                                            {uploadStatus} {doc.dbRecord.rejection_reason && ` - ${doc.dbRecord.rejection_reason}`}
                                        </p>
                                    </div>
                                </div>
                                {uploadStatus !== 'Rejected' && (
                                    <button
                                        onClick={handleRemove}
                                        className="text-emerald-600 hover:text-red-500 transition-colors p-1"
                                    >
                                        <X size={16} />
                                    </button>
                                )}
                            </div>

                            {/* Re-upload Button for Rejected Docs */}
                            {uploadStatus === 'Rejected' && (
                                <div
                                    onClick={() => fileInputRef.current.click()}
                                    className="border border-red-200 bg-white hover:bg-red-50 text-red-600 rounded-lg p-2 flex items-center justify-center gap-2 cursor-pointer transition-colors text-sm font-medium"
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                    />
                                    <Upload size={16} />
                                    Re-upload Document
                                </div>
                            )}
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

    const updateDocStatus = (type, status) => {
        setDocuments(prev => prev.map(doc =>
            doc.name === type ? { ...doc, status } : doc
        ));
    };

    const overallProgress = Math.round((documents.filter(d => d.dbRecord && d.dbRecord.status !== 'Rejected').length / documents.length) * 100) || 0;

    if (loading) return <div className="p-8 text-center text-gray-500">Loading documents...</div>;

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
                <button
                    disabled={overallProgress < 100} // Require all documents? Or just some? Logic can vary.
                    className={`px-8 py-3 font-semibold rounded-xl shadow-lg transition-all ${overallProgress === 100
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-200'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                >
                    {overallProgress === 100 ? 'All Documents Submitted' : 'Complete All Uploads'}
                </button>
            </div>
        </div>
    );
};

export default UploadDocuments;
