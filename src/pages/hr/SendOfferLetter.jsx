import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadOfferLetter, updateCandidateStatus, markOfferAsSent } from '../../services/api';

const SendOfferLetter = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { candidateId } = location.state || {};

    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, uploading, success, error
    const [errorMessage, setErrorMessage] = useState('');

    // If no candidateId provided (e.g. direct access), redirect back
    React.useEffect(() => {
        if (!candidateId) {
            navigate('/hr/dashboard');
        }
    }, [candidateId, navigate]);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setStatus('idle');
            setErrorMessage('');
        }
    };

    const handleSendOffer = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage("Please select a file to upload.");
            return;
        }

        setStatus('uploading');
        try {
            // 1. Upload File
            const publicUrl = await uploadOfferLetter(candidateId, file);
            console.log("Offer Letter Uploaded:", publicUrl);

            // 2. Update Candidate Status via dedicated flow
            await markOfferAsSent(candidateId, publicUrl);

            setStatus('success');
            setTimeout(() => {
                navigate('/hr/dashboard');
            }, 2000);
        } catch (error) {
            console.error("Error sending offer:", error);
            setStatus('error');
            setErrorMessage(error.message || "Failed to upload offer letter. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-xl font-bold text-gray-900">Send Offer Letter</h1>
            </div>

            <main className="flex-1 p-6 md:p-12 flex justify-center items-start">
                <div className="w-full max-w-lg bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <FileText size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900">Upload Offer Document</h2>
                                <p className="text-sm text-gray-500">Select the signed offer letter (PDF) to send.</p>
                            </div>
                        </div>

                        {status === 'success' ? (
                            <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3 mb-6">
                                <CheckCircle size={24} />
                                <span className="font-semibold">Offer sent successfully! Redirecting...</span>
                            </div>
                        ) : (
                            <form onSubmit={handleSendOffer} className="space-y-6">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all group cursor-pointer relative">
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <Upload className="text-gray-400 group-hover:text-indigo-600 transition-colors" size={32} />
                                        </div>
                                        {file ? (
                                            <div className="text-center">
                                                <p className="font-semibold text-indigo-600">{file.name}</p>
                                                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(0)} KB</p>
                                            </div>
                                        ) : (
                                            <div className="text-center">
                                                <p className="font-semibold text-gray-700">Click to upload or drag and drop</p>
                                                <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2 text-sm">
                                        <AlertCircle size={16} />
                                        {errorMessage}
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => navigate(-1)}
                                        className="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={!file || status === 'uploading'}
                                        className={`px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition-all flex items-center gap-2
                                            ${!file || status === 'uploading' ? 'bg-gray-300 cursor-not-allowed shadow-none' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300'}
                                        `}
                                    >
                                        {status === 'uploading' ? 'Uploading...' : 'Send Offer'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SendOfferLetter;
