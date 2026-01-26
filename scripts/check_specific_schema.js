
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkSchema() {
    console.log("Checking 'candidates' table for 'offer_letter_url'...");
    const { error: candidateError } = await supabase
        .from('candidates')
        .select('offer_letter_url')
        .limit(1);

    if (candidateError) {
        console.log("candidates.offer_letter_url check failed:", candidateError.message);
    } else {
        console.log("candidates.offer_letter_url column EXISTS.");
    }

    console.log("Checking 'notifications' table...");
    const { error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .limit(1);

    if (notifError) {
        console.log("notifications table check failed:", notifError.message);
        if (notifError.message.includes('relation "notifications" does not exist') || notifError.message.includes('404')) {
            console.log("Verdict: notifications table likely DOES NOT exist.");
        }
    } else {
        console.log("notifications table EXISTS.");
    }
}

checkSchema();
