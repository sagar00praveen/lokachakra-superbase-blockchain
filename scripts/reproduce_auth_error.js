
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

const reproduce = async () => {
    console.log("Attempting Login with admin...");
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'admin@lokachakra.com',
        password: '1234567'
    });

    if (error) {
        console.error("Login Error:", error);
        console.log("Status:", error.status);
    } else {
        console.log("Login Success!", data.user.id);
    }

    console.log("\nAttempting Signup with new random user...");
    const email = `test_${Date.now()}@example.com`;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: 'password123',
        options: {
            data: {
                full_name: 'Test User'
            }
        }
    });

    if (signUpError) {
        console.error("Signup Error:", signUpError);
    } else {
        console.log("Signup Success!", signUpData.user?.id);
    }
};

reproduce();
