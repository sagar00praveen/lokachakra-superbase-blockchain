import { supabase } from '../lib/supabaseClient';

export const fetchEmployees = async () => {
    const { data, error } = await supabase
        .from('employees')
        .select('*');
    if (error) throw error;
    return data;
};

export const fetchJobs = async () => {
    const { data, error } = await supabase
        .from('jobs')
        .select('*');
    if (error) throw error;
    return data;
};

export const fetchCandidates = async () => {
    const { data, error } = await supabase
        .from('candidates')
        .select('*');
    if (error) throw error;
    return data;
};

export const fetchKPIs = async () => {
    // Legacy support or simple KPIs
    const analytics = await fetchAnalyticsData();
    return {
        timeToHire: '18 days',
        openPositions: analytics.stats.openPositions,
        activeCandidates: analytics.stats.activeCandidates,
        userCount: analytics.stats.userCount,
        offerAcceptanceRate: '92%',
    };
};

export const fetchAnalyticsData = async () => {
    // Fetch base data
    const { data: candidates, error: canError } = await supabase
        .from('candidates')
        .select('id, status, department, created_at, sent_offer_letter');

    const { count: jobCount } = await supabase.from('jobs').select('*', { count: 'exact', head: true }).eq('status', 'Active');
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

    if (canError) console.error("Analytics Fetch Error:", canError);

    const safeCandidates = candidates || [];

    // 1. Stats
    const activeCandidates = safeCandidates.length;
    const pendingOffers = safeCandidates.filter(c => c.status === 'Offer Sent').length;
    const completedOnboarding = safeCandidates.filter(c => c.status === 'Completed' || c.status === 'Provisioned').length;

    // 2. Monthly Trend (Last 6 Months)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentMonth = new Date().getMonth();
    const trendData = [];

    // Simple aggregation for current year/recent months
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(currentMonth - i);
        const monthIdx = d.getMonth();
        const monthName = months[monthIdx];

        // Filter candidates created in this month (approx)
        // Note: Real apps would use precise date ranges
        const monthlyCans = safeCandidates.filter(c => {
            const cDate = new Date(c.created_at);
            return cDate.getMonth() === monthIdx && cDate.getFullYear() === d.getFullYear();
        });

        const completed = monthlyCans.filter(c => c.status === 'Completed' || c.status === 'Provisioned').length;
        const pending = monthlyCans.length - completed;

        trendData.push({ month: monthName, completed, pending });
    }

    // 3. Department Data
    const depts = {};
    safeCandidates.forEach(c => {
        if (!c.department) return;
        if (!depts[c.department]) depts[c.department] = { total: 0, completed: 0 };
        depts[c.department].total++;
        if (c.status === 'Completed' || c.status === 'Provisioned') depts[c.department].completed++;
    });

    const departmentData = Object.keys(depts).map(d => ({
        dept: d,
        rate: Math.round((depts[d].completed / depts[d].total) * 100) || 0
    }));

    return {
        stats: {
            openPositions: jobCount || 0,
            activeCandidates,
            pendingOffers,
            completedOnboarding
        },
        trendData,
        departmentData
    };
};

export const createCandidate = async (candidateData) => {
    // 1. Create Candidate Record (Application Tracking) ONLY
    // Status should effectively be 'Applied' or 'Pending IT'
    const dbPayload = {
        name: candidateData.fullName, // Mapped to 'name' column as per DB constraint
        phone: candidateData.phone,
        personal_email: candidateData.personalEmail,
        position: candidateData.position,
        department: candidateData.department,
        team: candidateData.team,
        employment_type: candidateData.employmentType,
        work_location: candidateData.workLocation,
        annual_ctc: candidateData.annualCTC,
        joining_date: candidateData.joiningDate,
        assigned_hr: candidateData.assignedHR,
        assigned_it: candidateData.assignedIT,
        reporting_manager: candidateData.reportingManager,
        status: 'Applied', // Changed from stage to status to match schema recommendation
        stage: 'Applied',  // Keeping stage for backward compatibility if needed, or remove if status is preferred
        score: 0,
    };

    // Attempt insert.
    const { data, error } = await supabase
        .from('candidates')
        .insert([dbPayload])
        .select();

    if (error) {
        console.error("Candidate DB Insert Error:", error.message);
        throw error;
    }
    return data;
};

export const provisionCandidate = async (candidate, credentials) => {
    // IT Team calls this to be create the Auth User
    // Normalize credentials (UI sends companyEmail/companyPassword, but we might want generic email/password)
    const email = credentials?.companyEmail || credentials?.email || candidate?.personal_email || candidate?.email;
    const password = credentials?.companyPassword || credentials?.password || 'password1234567';

    console.log(`Provisioning user: ${email}`);

    if (!email) {
        throw new Error("Cannot provision user: No email provided.");
    }

    // 1. UPDATE DB FIRST (To ensure persistence even if Auth switches session)
    // Fetch current status to check 'sent_offer_letter'
    console.log("Checking current status before update...");
    const { data: current, error: fetchError } = await supabase
        .from('candidates')
        .select('sent_offer_letter')
        .eq('id', candidate.id)
        .single();

    if (fetchError) console.error("Error fetching current status:", fetchError);

    let newStatus = 'Provisioned';
    // Check if sent_offer_letter is true (handle null via optional chaining, assumed false if null)
    if (current?.sent_offer_letter === true) {
        newStatus = 'Completed';
    }

    console.log(`Determined New Status: ${newStatus} (Offer Sent: ${current?.sent_offer_letter})`);

    const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update({
            stage: newStatus,
            status: newStatus,
            credentials_created: true,
            company_email: email,
            company_password_hash: password, // In real app, hash this!
            provisioned_at: new Date().toISOString()
        })
        .eq('id', candidate.id)
        .select();

    console.log("DB Update Result:", { updateData, updateError });

    if (updateError) {
        console.error("Failed to update candidate status:", updateError);
        throw new Error("Database update failed (Check Permissions): " + updateError.message);
    }

    // 2. Create Auth User
    console.log("Attempting Auth SignUp...");
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                full_name: candidate.name || candidate.full_name,
                role: 'CANDIDATE',
                personal_email: candidate.personal_email || candidate.email
            }
        }
    });

    if (authError) {
        if (authError.message.includes("User already registered") || authError.message.includes("already registered")) {
            console.warn("User already registered, utilizing existing auth record.");
        } else {
            console.error("Provisioning Auth Error:", authError);
            throw authError;
        }
    } else {
        console.log("Auth SignUp Successful:", authData);
    }

    return authData;
};

export const fetchProfiles = async () => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*');
    if (error) throw error;
    return data;
};

export const fetchUserProfile = async (userId) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
    if (error) throw error;
    return data;
};

// --- Asset Management ---

export const fetchAssets = async () => {
    const { data, error } = await supabase
        .from('assets')
        .select('*')
        .order('name');
    if (error) throw error;
    return data;
};

export const allocateAsset = async (assetId, candidateId) => {
    const { data, error } = await supabase
        .from('assets')
        .update({
            assigned_to: candidateId,
            status: 'Allocated'
        })
        .eq('id', assetId)
        .select();

    if (error) throw error;
    return data;
};

export const unallocateAsset = async (assetId) => {
    const { data, error } = await supabase
        .from('assets')
        .update({
            assigned_to: null,
            status: 'Available'
        })
        .eq('id', assetId)
        .select();

    if (error) throw error;
    return data;
};

export const fetchCandidateAssets = async (candidateId) => {
    const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('assigned_to', candidateId);

    if (error) throw error;
    return data;
};

// --- Offer Letter & Status Management ---

export const uploadOfferLetter = async (candidateId, file) => {
    // 1. Upload file to 'offer-letters' bucket
    const fileExt = file.name.split('.').pop();
    const fileName = `${candidateId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('offer-letters')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    // 2. Get public URL (optional, or store path)
    const { data: { publicUrl } } = supabase.storage
        .from('offer-letters')
        .getPublicUrl(filePath);

    return publicUrl;
};

export const uploadSignedOfferLetter = async (candidateId, file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `signed-${candidateId}-${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
        .from('offer-letters')
        .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
        .from('offer-letters')
        .getPublicUrl(filePath);

    return publicUrl;
};

export const markOfferAsSent = async (candidateId, offerUrl) => {
    // Check if credentials are created
    const { data: current, error: fetchError } = await supabase
        .from('candidates')
        .select('credentials_created')
        .eq('id', candidateId)
        .single();

    let newStatus = 'Offer Sent';
    if (!fetchError && current?.credentials_created) {
        newStatus = 'Completed';
    }

    const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update({
            status: newStatus,
            sent_offer_letter: true,
            offer_letter_url: offerUrl
        })
        .eq('id', candidateId)
        .select();

    console.log("markOfferAsSent DB Response:", { updateData, updateError, candidateId });

    if (updateError) throw updateError;
    return updateData;
};

export const updateCandidateStatus = async (candidateId, status, extraData = {}) => {
    const { data, error } = await supabase
        .from('candidates')
        .update({ status, ...extraData })
        .eq('id', candidateId)
        .select();

    if (error) throw error;
    return data;
};

export const updateCandidateOfferStatus = async (candidateId, status, reason = null) => {
    const updatePayload = {
        offer_acceptance_status: status,
    };
    if (reason) {
        updatePayload.rejection_reason = reason;
    }

    // If rejected, reset sent_offer_letter to false so HR can send a new one
    if (status === 'rejected') {
        updatePayload.sent_offer_letter = false;
    }

    // If accepted, we might still want to keep the old status update for backward compatibility or other workflows
    // But per user request, we are separating them.
    // However, if accepted, we usually want to trigger the next stage (Provisioning etc).
    // For now, I will just update the new columns.

    const { data, error } = await supabase
        .from('candidates')
        .update(updatePayload)
        .eq('id', candidateId)
        .select();

    if (error) throw error;
    return data;
};

export const rejectCandidateOffer = async (candidateId, reason) => {
    const { data, error } = await supabase
        .rpc('reject_offer', {
            candidate_id: candidateId,
            reason: reason
        });

    if (error) throw error;
    return data;
};

// --- Notifications ---

export const createNotification = async (notification) => {
    const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select();

    if (error) throw error;
    return data;
};

export const fetchNotifications = async (role) => {
    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_role', role)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const markNotificationAsRead = async (id) => {
    const { data, error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
};

export const updateCandidateAssetsSummary = async (candidateId, assets) => {
    // Simplify assets list for storage (just id, name, type, serial)
    const summary = assets.map(a => ({
        id: a.id,
        name: a.name,
        type: a.type,
        serial: a.serial || a.serial_number
    }));

    const { data, error } = await supabase
        .from('candidates')
        .update({ assigned_assets_summary: summary })
        .eq('id', candidateId)
        .select();

    if (error) throw error;
    return data;
};

export const fetchCurrentCandidate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .or(`company_email.eq.${user.email},personal_email.eq.${user.email}`)
        .single();

    if (error) {
        console.error("Error fetching current candidate:", error);
        return null;
    }
    return data;
};

// --- Orientations ---

export const createOrientation = async (sessionData, candidateIds) => {
    // 1. Create Orientation Session
    const { data: session, error: sessionError } = await supabase
        .from('orientations')
        .insert([sessionData])
        .select()
        .single();

    if (sessionError) {
        console.error("Supabase Error creating orientation:", sessionError);
        throw sessionError;
    }

    // 2. Add Attendees
    if (candidateIds && candidateIds.length > 0) {
        const attendees = candidateIds.map(cid => ({
            orientation_id: session.id,
            candidate_id: cid,
            status: 'Scheduled'
        }));

        const { error: attendeesError } = await supabase
            .from('orientation_attendees')
            .insert(attendees);

        if (attendeesError) console.error("Error adding attendees:", attendeesError);
    }

    return session;
};

export const fetchOrientations = async () => {
    // Fetch sessions
    const { data: sessions, error } = await supabase
        .from('orientations')
        .select(`
            *,
            orientation_attendees (
                candidate:candidates (id, name, position)
            )
        `)
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

    if (error) throw error;
    return sessions;
};

export const fetchCandidateOrientations = async (candidateId) => {
    const { data, error } = await supabase
        .from('orientation_attendees')
        .select(`
            status,
            orientation:orientations (*)
        `)
        .eq('candidate_id', candidateId);

    if (error) throw error;

    // Map to return a clean list of orientations with the attendee status embedded if needed
    // filtering out null orientations just in case
    return data
        .filter(item => item.orientation)
        .map(item => ({
            ...item.orientation,
            attendance_status: item.status
        }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));
};

// --- Documents ---

export const fetchCandidateDocuments = async (candidateId) => {
    const { data, error } = await supabase
        .from('candidate_documents')
        .select('*')
        .eq('candidate_id', candidateId)
        .order('uploaded_at', { ascending: false }); // Latest first

    if (error) throw error;
    return data;
};

export const uploadCandidateDocument = async (candidateId, file, docType) => {
    // 1. Upload to Storage
    const fileExt = file.name.split('.').pop();
    const safeDocType = docType.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${candidateId}/${safeDocType}-${Date.now()}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
        .from('candidate-documents')
        .upload(fileName, file);

    if (uploadError) throw uploadError;

    // 2. Insert into Table
    const { data, error } = await supabase
        .from('candidate_documents')
        .insert([{
            candidate_id: candidateId,
            document_type: docType,
            file_path: uploadData.path,
            original_name: file.name,
            status: 'Pending'
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const deleteCandidateDocument = async (docId, filePath) => {
    // 1. Delete from Table
    const { error: dbError } = await supabase
        .from('candidate_documents')
        .delete()
        .eq('id', docId);

    if (dbError) throw dbError;

    // 2. Delete from Storage
    if (filePath) {
        const { error: storageError } = await supabase.storage
            .from('candidate-documents')
            .remove([filePath]);

        if (storageError) console.error("Error removing file from storage:", storageError);
    }

    return true;
};

export const fetchAllDocuments = async () => {
    const { data, error } = await supabase
        .from('candidate_documents')
        .select(`
            *,
            candidate:candidates (id, name, position)
        `)
        .order('uploaded_at', { ascending: false });

    if (error) throw error;
    return data;
};

export const updateDocumentStatus = async (docId, status, reason = null) => {
    const updatePayload = { status, updated_at: new Date() };
    if (reason !== null) updatePayload.rejection_reason = reason;

    const { data, error } = await supabase
        .from('candidate_documents')
        .update(updatePayload)
        .eq('id', docId)
        .select();

    if (error) throw error;
    return data;
};

export const getDocumentUrl = async (path) => {
    // For private buckets, we need a signed URL
    const { data, error } = await supabase.storage
        .from('candidate-documents')
        .createSignedUrl(path, 3600); // 1 hour validity

    if (error) {
        console.error("Error creating signed URL:", error);
        return null;
    }
    return data.signedUrl;
};
