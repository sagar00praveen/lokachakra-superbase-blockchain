-- DISABLE TRIGGERS & CONSTRAINTS (DEBUGGING)
-- Run this to verify if Login works without any custom logic.

-- 1. Drop Auth Triggers (created on auth.users)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- 2. Drop Profile Triggers
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- 3. Drop Constraints on Profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_email_key;
-- Note: We keep the Primary Key (id) as it's required.

-- 4. Grant full access temporarily (to rule out permissions)
GRANT ALL ON TABLE public.profiles TO postgres, anon, authenticated, service_role;

RAISE NOTICE 'All custom triggers and constraints disabled.';
