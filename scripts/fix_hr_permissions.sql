-- POLICY: Allow HR/Admin to view ALL candidates
-- Check if policy exists or just create a new one to be safe (names must be unique)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'candidates' 
        AND policyname = 'HR/Admin can view all candidates'
    ) THEN
        CREATE POLICY "HR/Admin can view all candidates"
        ON candidates FOR SELECT
        TO authenticated
        USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
        );
    END IF;
END
$$;

-- POLICY: Allow HR/Admin to view ALL candidate_documents
-- We might have combined this before, but let's make a dedicated explicit policy for clarity
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'candidate_documents' 
        AND policyname = 'HR/Admin can view all documents explicitly'
    ) THEN
        CREATE POLICY "HR/Admin can view all documents explicitly"
        ON candidate_documents FOR SELECT
        TO authenticated
        USING (
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'hr'))
        );
    END IF;
END
$$;

-- Also ensure profiles are readable by authenticated users (so they can check their own role)
CREATE POLICY "Allow read access to own profile"
ON profiles FOR SELECT
TO authenticated
USING ( auth.uid() = id );
-- OR typically profiles are public-read or internal-read. 
-- Let's ensure HR can read permissions.

-- For good measure, let's just make sure the RLS is enabled.
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidate_documents ENABLE ROW LEVEL SECURITY;
