
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function verifyData() {
    console.log("--- Verifying Notifications ---");
    const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*');

    if (notifError) {
        console.error("Error fetching notifications:", notifError);
    } else {
        console.log(`Found ${notifications.length} notifications:`);
        console.log(JSON.stringify(notifications, null, 2));
    }

    console.log("\n--- Verifying Candidates Status ---");
    const { data: candidates, error: candError } = await supabase
        .from('candidates')
        .select('id, name, status, offer_letter_url')
        .order('updated_at', { ascending: false, nullsFirst: false }) // Assuming updated_at exists, if not just limit
        .limit(5);

    if (candError) {
        console.error("Error fetching candidates:", candError);
    } else {
        console.log("Recent candidates:");
        console.table(candidates);
    }
}

verifyData();
