
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env');
        const envFile = fs.readFileSync(envPath, 'utf8');
        const env = {};
        envFile.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                env[key.trim()] = value.trim();
            }
        });
        return env;
    } catch (e) {
        return {};
    }
};

const env = loadEnv();
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const verifyAdmin = async () => {
    console.log("Verifying Admin Status...");

    // Can't check auth.users directly with anon key without service role.
    // relying on 'profiles' table which we made readable/public-ish or readable by auth.
    // But we are anon here unless we sign in.

    // Attempt to sign in as admin (verification of password)
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: 'admin@lokachakra.com',
        password: '1234567'
    });

    if (signInError) {
        console.log("Sign In Failed:", signInError.message);
    } else {
        console.log("Sign In Successful!");
        console.log("User ID:", signInData.user.id);

        // Check Profile
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', signInData.user.id)
            .single();

        if (profileError) {
            console.log("Profile Fetch Error:", profileError.message);
        } else {
            console.log("Profile Found:", profile);
        }
    }
};

verifyAdmin();
