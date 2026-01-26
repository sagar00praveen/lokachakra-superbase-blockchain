
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

const recreateAdmin = async () => {
    console.log("Re-creating Admin User via API...");

    const email = 'admin@lokachakra.com';
    const password = '1234567'; // As requested

    // 1. SignUp
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'System Admin',
                role: 'admin' // We try to set it, but trigger limits to employee usually
            }
        }
    });

    if (signUpError) {
        console.error("Admin Signup Failed:", signUpError);
        return;
    }

    if (signUpData.user) {
        console.log(`Admin Created! ID: ${signUpData.user.id}`);
        console.log("NOTE: You must manually run SQL to ensure role is 'admin' if the trigger defaulted to 'employee'.");
        console.log("I will print the SQL for you:");
        console.log(`\nUPDATE public.profiles SET role = 'admin' WHERE id = '${signUpData.user.id}';\n`);
    } else {
        console.log("Admin creation response was ambiguous:", signUpData);
    }
};

recreateAdmin();
