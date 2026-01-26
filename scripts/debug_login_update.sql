-- DEBUG LOGIN UPDATE
-- Run this in Supabase SQL Editor to find the REAL error.

DO $$
DECLARE
    v_user_id UUID;
    v_now TIMESTAMP WITH TIME ZONE := NOW();
BEGIN
    RAISE NOTICE 'Starting Debug Login Test...';

    -- 1. Get Admin ID
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@lokachakra.com';
    
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Admin user not found!';
    END IF;

    RAISE NOTICE 'Found Admin ID: %', v_user_id;

    -- 2. Try to UPDATE auth.users (This mimics what Login does)
    -- If there is a hidden broken trigger, THIS WILL FAIL with a specific message.
    UPDATE auth.users 
    SET last_sign_in_at = v_now
    WHERE id = v_user_id;
    
    RAISE NOTICE 'UPDATE auth.users Success!';

    -- 3. Try to INSERT into auth.sessions (This also happens during login)
    -- We'll delete it immediately, just testing the insert
    INSERT INTO auth.sessions (id, user_id, created_at, updated_at)
    VALUES (gen_random_uuid(), v_user_id, v_now, v_now);
    
    RAISE NOTICE 'INSERT auth.sessions Success!';

    -- Rollback everything so we don't leave trash (actually DO blocks commit usually, but we can rely on testing)
    -- Actually, if we error, it auto-aborts. If we reach here, it works.
END
$$;
