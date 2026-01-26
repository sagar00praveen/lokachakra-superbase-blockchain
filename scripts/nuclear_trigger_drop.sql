-- NUCLEAR TRIGGER DROP
-- This script will find and DROP ALL triggers on the 'auth.users' table.
-- This is necessary because a hidden/broken UPDATE trigger is preventing Login.

DO $$ 
DECLARE 
    trg RECORD;
    t_name TEXT;
BEGIN 
    -- Loop through all triggers on auth.users
    FOR trg IN 
        SELECT trigger_name 
        FROM information_schema.triggers 
        WHERE event_object_schema = 'auth' 
        AND event_object_table = 'users'
    LOOP 
        t_name := trg.trigger_name;
        
        -- DANGEROUS: Execute Drop
        -- We wrap in dynamic SQL
        EXECUTE 'DROP TRIGGER IF EXISTS ' || quote_ident(t_name) || ' ON auth.users CASCADE';
        
        RAISE NOTICE 'Dropped trigger: %', t_name;
    END LOOP; 
END 
$$;

-- AFTER CLEANUP: Re-add ONLY the safe INSERT trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'employee')
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Also ensure no triggers on public.profiles that usually cause issues on update
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
