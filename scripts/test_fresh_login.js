
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

const testFreshLogin = async () => {
    console.log("Creating fresh user...");
    const email = `fresh_${Date.now()}@test.com`;
    const password = 'password123';

    // 1. SignUp
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: 'Fresh User' }
        }
    });

    if (signUpError) {
        console.error("Signup Failed:", signUpError);
        return;
    }

    console.log(`Signup Success for ${email}. User ID: ${signUpData.user?.id}`);

    // 2. SignIn
    console.log("Attempting Login...");
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (signInError) {
        console.error("Login Failed:", signInError);
    } else {
        console.log("Login Success! Token received.");
    }
};

testFreshLogin();
