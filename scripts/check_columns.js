
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

async function checkColumns() {
    console.log("Checking for new columns...");
    // Try to select the new columns. If they don't exist, this will error.
    const { data, error } = await supabase
        .from('candidates')
        .select('id, name, offer_acceptance_status, rejection_reason')
        .limit(1);

    if (error) {
        console.error("Error accessing new columns:", error.message);
        console.log("Using previous logic/setup, the SQL might not have run correctly or permissions issue.");
    } else {
        console.log("Success! Columns exist and are accessible.");
        if (data.length > 0) {
            console.log("Sample Data:", data[0]);
        } else {
            console.log("Table is empty, but query succeeded.");
        }
    }
}

checkColumns();
