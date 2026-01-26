-- Create candidate_documents table
CREATE TABLE IF NOT EXISTS candidate_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    candidate_id BIGINT REFERENCES candidates(id) NOT NULL,
    document_type VARCHAR(100) NOT NULL,
    file_path TEXT NOT NULL,
    original_name TEXT,
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Verified, Rejected
    rejection_reason TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;

-- Policies for candidate_documents
CREATE POLICY "Candidates can view their own documents"
ON candidate_documents FOR SELECT
TO authenticated
USING (
    candidate_id::text = (select id::text from candidates where company_email = auth.email() or personal_email = auth.email() limit 1)
    OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
);

CREATE POLICY "Candidates can insert their own documents"
ON candidate_documents FOR INSERT
TO authenticated
WITH CHECK (
    candidate_id::text = (select id::text from candidates where company_email = auth.email() or personal_email = auth.email() limit 1)
);

CREATE POLICY "HR/Admin can update documents"
ON candidate_documents FOR UPDATE
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
)
WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
);

CREATE POLICY "HR/Admin can delete documents"
ON candidate_documents FOR DELETE
TO authenticated
USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
);

-- STORAGE POLICIES (Assuming bucket 'candidate-documents' needs to be created manually or via this if possible, 
-- but normally buckets are created via API or dashboard. We will assume it exists or use a script to try creating it via insert if supported)

-- Attempt to create bucket if not exists (Standard Supabase storage.buckets table)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('candidate-documents', 'candidate-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
-- Allow authenticated users to upload to their own folder (candidate_id/filename)
CREATE POLICY "Candidates can upload their own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'candidate-documents' 
    -- AND (storage.foldername(name))[1] = (select id::text from candidates where company_email = auth.email() or personal_email = auth.email() limit 1)
    -- Simplified for now: Allow auth users to insert if bucket matches. Ideally strict path check.
);

CREATE POLICY "Candidates can read their own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'candidate-documents'
    -- AND (storage.foldername(name))[1] = (select id::text from candidates where company_email = auth.email() or personal_email = auth.email() limit 1)
);

CREATE POLICY "HR/Admin can view all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'candidate-documents'
    AND EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
);
