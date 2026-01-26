import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => line.split('='))
);

const supabaseUrl = env.VITE_SUPABASE_URL.trim();
const supabaseKey = env.VITE_SUPABASE_ANON_KEY.trim();

const supabase = createClient(supabaseUrl, supabaseKey);

const createAdmin = async () => {
    const email = 'admin@lokachakra.com';
    const password = 'password1234567';

    console.log(`Creating Admin User: ${email}`);

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: 'System Admin',
                role: 'ADMIN'
            }
        }
    });

    if (error) {
        console.error('Error creating admin:', JSON.stringify(error, null, 2));
    } else {
        console.log('Admin user created successfully!');
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            console.log('User already exists (or equivalent).');
        } else {
            console.log('User ID:', data.user ? data.user.id : 'unknown');
        }
    }
};

createAdmin();
