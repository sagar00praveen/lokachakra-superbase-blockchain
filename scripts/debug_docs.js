
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load env
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

const checkDocuments = async () => {
    console.log("Checking candidate_documents table...");

    // 1. Try to fetch all (as anon relying on RLS? No, this runs as anon client)
    // Note: Anon client without auth session can't see anything if RLS is 'TO authenticated'.
    // We can't easily simulate a login here without credentials.
    // BUT we can try to see if the table exists and if we get a permission error vs a 404.

    const { data, error } = await supabase
        .from('candidate_documents')
        .select('*');

    if (error) {
        console.error("Fetch Error:", error);
    } else {
        console.log(`Fetched ${data.length} documents (might be 0 due to RLS if not authenticated).`);
    }

    // 2. We can try to sign in if we have a test user?? Use the same credentials as dev?
    // Hard to do automated. 

    // Let's print the error message clearly.
    // If table doesn't exist: "relation ... does not exist"
    // If RLS blocks: Returns [] (empty) usually, unless using service key.
};

checkDocuments();
