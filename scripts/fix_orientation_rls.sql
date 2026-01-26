-- Enable RLS on orientations table
ALTER TABLE orientations ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view orientations
CREATE POLICY "Allow read access for authenticated users"
ON orientations FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert orientations
CREATE POLICY "Allow insert access for authenticated users"
ON orientations FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update/delete orientations
CREATE POLICY "Allow update/delete access for authenticated users"
ON orientations FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);


-- Enable RLS on orientation_attendees table
ALTER TABLE orientation_attendees ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to view attendees
CREATE POLICY "Allow read access for authenticated users"
ON orientation_attendees FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to insert attendees
CREATE POLICY "Allow insert access for authenticated users"
ON orientation_attendees FOR INSERT
TO authenticated
WITH CHECK (true);

-- Policy: Allow authenticated users to update/delete attendees
CREATE POLICY "Allow update/delete access for authenticated users"
ON orientation_attendees FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
