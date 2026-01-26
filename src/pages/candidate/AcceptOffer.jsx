import React, { useState, useEffect } from 'react';
import { FileText, Upload, CheckCircle, XCircle, Download, Briefcase, DollarSign, Calendar, Building, Info, AlertTriangle, Loader2 } from 'lucide-react';
import { updateCandidateStatus, createNotification, uploadSignedOfferLetter, updateCandidateOfferStatus, rejectCandidateOffer } from '../../services/api';
import { supabase } from '../../lib/supabaseClient';

const AcceptOffer = () => {
    const [candidateId, setCandidateId] = useState(null);
    const [candidateName, setCandidateName] = useState('');
    const [offerStatus, setOfferStatus] = useState('loading'); // loading, Pending, Accepted, Rejected
    const [offerLetterUrl, setOfferLetterUrl] = useState(null);
    const [signedLetter, setSignedLetter] = useState(null);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [offerDetails, setOfferDetails] = useState({
        role: 'Senior Developer', // Default/Placeholder
        department: 'Engineering',
        joiningDate: 'TBD',
        ctc: 'TBD',
        employmentType: 'Full-time',
        offerDate: new Date().toLocaleDateString()
    });

    useEffect(() => {
        const fetchCandidate = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // Try to find candidate by company_email or personal_email
                const { data, error } = await supabase
                    .from('candidates')
                    .select('*')
                    .or(`company_email.eq.${user.email},personal_email.eq.${user.email}`)
                    .single();

                if (data) {
                    setCandidateId(data.id);
                    setCandidateName(data.name);
                    setOfferLetterUrl(data.offer_letter_url);

                    // Update offer details
                    setOfferDetails(prev => ({
                        ...prev,
                        role: data.position || prev.role,
                        department: data.department || prev.department,
                        joiningDate: data.joining_date || prev.joiningDate,
                        ctc: data.annual_ctc || prev.ctc,
                        employmentType: data.employment_type || prev.employmentType
                    }));

                    // Strict Status Check
                    if (data.offer_acceptance_status === 'accepted') {
                        setOfferStatus('Accepted');
                    } else if (data.offer_acceptance_status === 'rejected') {
                        setOfferStatus('Rejected');
                    } else {
                        setOfferStatus('Pending');
                    }
                } else {
                    console.error("No candidate record found for this user.");
                    setOfferStatus('Pending');
                }
            } else {
                setOfferStatus('Pending');
            }
        };
        fetchCandidate();
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSignedLetter(e.target.files[0]);
        }
    };

    const handleDownload = () => {
        if (offerLetterUrl) {
            window.open(offerLetterUrl, '_blank');
        } else {
            alert("No offer letter document found.");
        }
    };

    const handleAccept = async () => {
        if (!signedLetter) {
            alert("Please upload the signed offer letter to proceed.");
            return;
        }

        setIsSubmitting(true);

        try {
            let signedUrl = null;
            if (candidateId) {
                // 1. Upload Signed Letter
                try {
                    signedUrl = await uploadSignedOfferLetter(candidateId, signedLetter);
                } catch (uploadErr) {
                    console.error("Upload failed", uploadErr);
                    alert("Failed to upload document. Please try again.");
                    setIsSubmitting(false);
                    return;
                }

                // 2. Update Status using NEW function
                await updateCandidateOfferStatus(candidateId, 'accepted');

                // Keep the old status update for backward compatibility if needed, 
                // OR simply rely on the new one? 
                // The user said: "if that column is true the it is accepted ... make a column to store the rejection reason"
                // They didn't explicitly say REMOVE the old status, but "make the changes".
                // I'll update the old status too so the rest of the app (IT portal etc) signals 'offer_accepted'.
                await updateCandidateStatus(candidateId, 'offer_accepted', {
                    signed_offer_letter_url: signedUrl
                });

                // 3. Notify HR
                await createNotification({
                    recipient_role: 'hr',
                    title: 'Offer Accepted',
                    message: `${candidateName} has accepted the offer letter and uploaded the signed document.`,
                    type: 'success',
                    related_candidate_id: candidateId
                });
            } else {
                console.warn("No Candidate ID found for status update.");
            }
            setOfferStatus('Accepted');
        } catch (error) {
            console.error("Error accepting offer:", error);
            alert("Failed to accept offer. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRejectSubmit = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }
        try {
            if (candidateId) {
                // Use RPC to reset status and handle flags atomically
                await rejectCandidateOffer(candidateId, rejectReason);

                await createNotification({
                    recipient_role: 'hr',
                    title: 'Offer Rejected',
                    message: `${candidateName} has rejected the offer. Reason: ${rejectReason}`,
                    type: 'error',
                    related_candidate_id: candidateId
                });
            }
            setOfferStatus('Rejected');
            setShowRejectModal(false);
        } catch (error) {
            console.error("Error rejecting offer:", error);
            alert("Failed to reject offer. Please try again.");
        }
    };

    if (offerStatus === 'loading') {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="text-gray-500">Loading offer details...</p>
            </div>
        );
    }

    if (offerStatus === 'Accepted') {
        return (
            <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="text-green-600 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Team!</h2>
                <p className="text-gray-600 text-lg mb-8">
                    Thank you for accepting the offer. We are thrilled to have you join us as a <strong>{offerDetails.role}</strong>.
                    Your onboarding process has started, and IT is currently preparing your assets.
                </p>
                <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl w-full">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center justify-center gap-2">
                        <Info size={18} /> Next Steps
                    </h4>
                    <p className="text-blue-800">
                        Please proceed to the <strong>Onboarding</strong> section to complete your profile and view your orientation schedule.
                    </p>
                </div>
            </div>
        );
    }

    if (offerStatus === 'Rejected') {
        return (
            <div className="p-10 flex flex-col items-center justify-center min-h-[60vh] text-center max-w-2xl mx-auto">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <XCircle className="text-red-600 w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Offer Declined</h2>
                <p className="text-gray-600 text-lg">
                    You have declined the offer. We appreciate your interest and wish you the best in your future endeavors.
                    <br />HR has been notified of your decision.
                </p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8">
            <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Offer of Employment</h1>
                        <p className="text-indigo-100 text-lg">Review and accept your job offer details below.</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-lg border border-white/30 text-sm font-medium">
                        Offer Date: {offerDetails.offerDate}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Offer Details Card */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Briefcase className="text-indigo-600" size={24} />
                            Position Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Role</label>
                                <div className="text-lg font-semibold text-gray-900 mt-1">{offerDetails.role}</div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Department</label>
                                <div className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                    <Building size={16} className="text-gray-400" />
                                    {offerDetails.department}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Joining Date</label>
                                <div className="text-lg font-semibold text-gray-900 mt-1 flex items-center gap-2">
                                    <Calendar size={16} className="text-gray-400" />
                                    {offerDetails.joiningDate}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Employment Type</label>
                                <div className="text-lg font-semibold text-gray-900 mt-1">{offerDetails.employmentType}</div>
                            </div>
                            <div className="md:col-span-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                                    <DollarSign size={14} /> Total Compensation (CTC)
                                </label>
                                <div className="text-2xl font-bold text-gray-900">{offerDetails.ctc}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <FileText className="text-indigo-600" size={24} />
                            Offer Documents
                        </h2>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-indigo-100 bg-indigo-50/30 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-red-500 shadow-sm">
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Official Offer Letter.pdf</h4>
                                        <p className="text-xs text-gray-500">Please download, read carefully, and sign.</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDownload}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:border-indigo-300 hover:text-indigo-600 transition-all text-sm font-medium shadow-sm"
                                >
                                    <Download size={16} /> Download
                                </button>
                            </div>

                            <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl text-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                <input
                                    type="file"
                                    id="signed-upload"
                                    className="hidden"
                                    accept=".pdf,.jpg,.png"
                                    onChange={handleFileChange}
                                />
                                <label htmlFor="signed-upload" className="cursor-pointer block">
                                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-indigo-500 shadow-sm mx-auto mb-3">
                                        <Upload size={28} />
                                    </div>
                                    {signedLetter ? (
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{signedLetter.name}</p>
                                            <p className="text-xs text-green-600 mt-1 flex items-center justify-center gap-1">
                                                <CheckCircle size={12} /> Ready to submit
                                            </p>
                                        </div>
                                    ) : (
                                        <div>
                                            <h4 className="text-sm font-bold text-gray-900">Upload Signed Offer Letter</h4>
                                            <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (Max 5MB)</p>
                                        </div>
                                    )}
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-6">
                        <h3 className="font-bold text-gray-900 mb-4">Action Required</h3>
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Please review all details and the attached offer letter carefully before accepting.
                            Upon acceptance, your onboarding process will begin immediately.
                        </p>

                        <div className="space-y-3">
                            <button
                                onClick={handleAccept}
                                disabled={!signedLetter || isSubmitting}
                                className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center gap-2 ${signedLetter && !isSubmitting
                                    ? 'bg-green-600 hover:bg-green-700 shadow-green-200'
                                    : 'bg-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle size={20} />}
                                {isSubmitting ? 'Processing...' : 'Accept Offer'}
                            </button>

                            <button
                                onClick={() => setShowRejectModal(true)}
                                className="w-full py-3.5 bg-white border border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <XCircle size={20} />
                                Decline Offer
                            </button>
                        </div>

                        {!signedLetter && (
                            <div className="mt-4 p-3 bg-amber-50 text-amber-800 text-xs rounded-lg flex gap-2 items-start border border-amber-100">
                                <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                                Please upload your signed offer letter to enable the Accept button.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <AlertTriangle className="text-red-500" size={20} /> Decline Offer?
                            </h3>
                            <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-gray-600">
                                <XCircle size={20} />
                            </button>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            We are sorry to see you go. Please let us know the reason for declining the offer to help us improve.
                        </p>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 min-h-[100px] text-sm mb-4"
                            placeholder="Reason for declining..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowRejectModal(false)}
                                className="flex-1 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                className="flex-1 py-2.5 bg-red-600 text-white font-medium rounded-xl hover:bg-red-700 shadow-lg shadow-red-200"
                            >
                                Confirm Decline
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AcceptOffer;


