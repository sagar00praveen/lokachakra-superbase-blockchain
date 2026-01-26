-- Add offer_acceptance_status and rejection_reason columns
ALTER TABLE candidates 
ADD COLUMN IF NOT EXISTS offer_acceptance_status VARCHAR(50) DEFAULT 'in_progress',
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Verify columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'candidates' 
AND column_name IN ('offer_acceptance_status', 'rejection_reason');
