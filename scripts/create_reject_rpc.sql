-- Create OR REPLACE the stored procedure to handle offer rejection with RESET logic
CREATE OR REPLACE FUNCTION reject_offer(candidate_id UUID, reason TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
BEGIN
    UPDATE candidates
    SET 
        status = 'pending_offer',          -- Reset status to pending so it shows as "Action Required"
        stage = 'pending_offer',           -- Sync stage
        offer_acceptance_status = 'rejected', -- Keep track that it was rejected
        sent_offer_letter = false,         -- Reset this so "Send Offer" button appears
        rejection_reason = reason
    WHERE id = candidate_id
    RETURNING to_jsonb(candidates.*) INTO result;

    RETURN result;
END;
$$;
