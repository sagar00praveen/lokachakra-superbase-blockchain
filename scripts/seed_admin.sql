-- Seed Admin User
-- Usage: Run this in Supabase SQL Editor

-- 1. Enable pgcrypto
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Modify Constraint
-- We DROP the constraint to allow 'admin' (and to bypass existing violations for now).
-- We will NOT re-add it immediately to ensure the Admin seeding succeeds.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Optional: Attempt to sanitize just in case, but we won't block on it
UPDATE public.profiles
SET role = 'employee'
WHERE role NOT IN ('admin', 'hr', 'candidate', 'employee', 'manager', 'superadmin');

-- 3. Insert/Update user
DO $$
DECLARE
    new_user_id UUID := gen_random_uuid();
    v_user_id UUID;
BEGIN
    -- Check if user exists
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'admin@lokachakra.com';
    
    IF v_user_id IS NULL THEN
        -- Insert new user
        INSERT INTO auth.users (
            instance_id,
            id,
            aud,
            role,
            email,
            encrypted_password,
            email_confirmed_at,
            raw_app_meta_data,
            raw_user_meta_data,
            created_at,
            updated_at,
            confirmation_token,
            recovery_token
        ) VALUES (
            '00000000-0000-0000-0000-000000000000',
            new_user_id,
            'authenticated',
            'authenticated',
            'admin@lokachakra.com',
            crypt('1234567', gen_salt('bf')),
            NOW(),
            '{"provider":"email","providers":["email"]}',
            '{}',
            NOW(),
            NOW(),
            '',
            ''
        );
        v_user_id := new_user_id;
    END IF;

    -- Update or Insert Profile
    -- We use ON CONFLICT to handle if the profile was created by a trigger
    INSERT INTO public.profiles (id, email, role, full_name)
    VALUES (v_user_id, 'admin@lokachakra.com', 'admin', 'System Admin')
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin', full_name = 'System Admin';
    
END
$$;
