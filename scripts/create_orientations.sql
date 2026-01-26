-- Create Orientations Table
CREATE TABLE IF NOT EXISTS orientations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    mode VARCHAR(50) NOT NULL, -- Virtual, Hybrid, In-Person
    meeting_link TEXT,
    location TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Orientation Attendees Table
-- Corrected: candidate_id should match candidates table id type (BIGINT)
CREATE TABLE IF NOT EXISTS orientation_attendees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    orientation_id UUID REFERENCES orientations(id),
    candidate_id BIGINT REFERENCES candidates(id), 
    status VARCHAR(50) DEFAULT 'Scheduled',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_orientation_date ON orientations(date);
CREATE INDEX IF NOT EXISTS idx_attendees_orientation ON orientation_attendees(orientation_id);
