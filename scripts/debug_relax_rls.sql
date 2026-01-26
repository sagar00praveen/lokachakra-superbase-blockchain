-- Debug: Temporarily relax RLS to confirm if Role check is the issue
-- Disable RLS temporarily or add a permissive policy

-- 1. Candidate Documents: Allow all authenticated to read
DROP POLICY IF EXISTS "HR/Admin can view all documents explicitly" ON candidate_documents;
CREATE POLICY "Debug: Allow all auth read docs"
ON candidate_documents FOR SELECT
TO authenticated
USING (true);

-- 2. Candidates: Allow all authenticated to read
DROP POLICY IF EXISTS "HR/Admin can view all candidates" ON candidates;
CREATE POLICY "Debug: Allow all auth read candidates"
ON candidates FOR SELECT
TO authenticated
USING (true);

-- 3. Profiles: Allow all authenticated to read
-- This helps if we switch back to role checking
CREATE POLICY "Debug: Allow all auth read profiles"
ON profiles FOR SELECT
TO authenticated
USING (true);
