-- Clean Up Admin
-- Deleting the admin user allows us to re-create them cleanly via the API.
DELETE FROM public.profiles WHERE email = 'admin@lokachakra.com';
DELETE FROM auth.users WHERE email = 'admin@lokachakra.com';
