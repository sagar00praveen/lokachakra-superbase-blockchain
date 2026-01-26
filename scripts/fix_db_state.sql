-- Emergency Fix
-- 1. Drop the constraint causing issues. We will not add it back for now.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- 2. Update existing roles to be safe (ensure no NULLs)
UPDATE public.profiles SET role = 'employee' WHERE role IS NULL;

-- 3. Ensure Admin Profile exists and has correct role (if the auth user was created)
UPDATE public.profiles
SET role = 'admin', full_name = 'System Admin'
WHERE email = 'admin@lokachakra.com';
