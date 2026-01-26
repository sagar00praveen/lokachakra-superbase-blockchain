-- Debug: Drop triggers that might affect auth
-- We suspect an UPDATE trigger on auth.users might be failing.

-- DROP standard trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Check for common update triggers (sometimes people copy-paste 'on_auth_user_updated')
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;

-- Also check profile triggers
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Let's also make sure the function itself is valid or drop it if we rely on manual profile creation for now?
-- No, we need it for signup. But for LOGIN debug, let's keep it but ensure no UPDATE trigger points to it.

-- Ensure handle_new_user only runs on INSERT
-- We already defined it, but let's double check no other trigger calls it.

-- CRITICAL: Sometimes 'profiles' table has a trigger that updates 'updated_at' column?
-- If that trigger is broken, profile update (on login?) might fail.
-- Login doesn't update profile usually, but might?

-- Let's try to verify if we can select from information_schema via SQL (service role running SQL editor)
-- We will just output this script to be run in Dashboard.
