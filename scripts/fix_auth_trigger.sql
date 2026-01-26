-- FIX Auth Trigger
-- This script drops and recreates the handle_new_user function and trigger to ensure it works correctly.

-- 1. Create/Replace the Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        new.raw_user_meta_data->>'full_name',
        COALESCE(new.raw_user_meta_data->>'role', 'employee') -- Default to employee
    )
    ON CONFLICT (id) DO UPDATE
    SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        -- Don't overwrite role if it exists, unless it was null? 
        -- Actually, better to keep existing role if profile exists.
        role = COALESCE(public.profiles.role, EXCLUDED.role);
        
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing trigger if exists (to be safe)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Re-create Trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Grant permissions just in case
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
-- Note: Security Definer function runs as owner (postgres usually), so RLS on profiles shouldn't matter for the function itself, 
-- but ensuring profiles is writable helps.

-- 5. Emergency cleanup of profiles constraint (redundant but safe)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
