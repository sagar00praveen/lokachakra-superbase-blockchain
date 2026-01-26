
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Manual simple env parser
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
        console.error("Could not read .env file");
        return {};
    }
};

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env. Found:", Object.keys(env));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStatus() {
    console.log("Authenticating...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@lokachakra.com',
        password: 'password1234567'
    });

    if (authError) {
        console.error("Auth Error:", authError.message);
        // Fallback: try fetching anyway, maybe public read is allowed but empty?
    } else {
        console.log("Authenticated as:", authData.user.email);
    }

    console.log("Fetching candidates with new columns...");
    const { data, error } = await supabase
        .from('candidates')
        .select('id, name, status, sent_offer_letter, credentials_created')
        .order('id', { ascending: false })
        .limit(5);

    if (error) {
        console.error("Error fetching candidates:", JSON.stringify(error, null, 2));
        return;
    }

    console.table(data);
}

checkStatus();
