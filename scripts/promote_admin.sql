-- Promote the freshly created user to Admin
-- Replace 'admin@lokachakra.com' with the email used if different

UPDATE public.profiles
SET role = 'admin', full_name = 'System Admin'
WHERE email = 'admin@lokachakra.com';
