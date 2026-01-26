
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
        .map(([k, v]) => [k.trim(), v.trim()])
);

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugUpdate() {
    console.log("1. Authenticating as Admin...");
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: 'admin@lokachakra.com',
        password: 'password1234567'
    });

    if (authError) {
        console.error("Auth Failed:", authError.message);
        return;
    }
    console.log("Authenticated User ID:", authData.user.id);

    console.log("\n2. Fetching a candidate...");
    const { data: candidates, error: fetchError } = await supabase
        .from('candidates')
        .select('*')
        .limit(1);

    if (fetchError || !candidates.length) {
        console.error("Fetch Failed or Empty:", fetchError);
        return;
    }

    const candidate = candidates[0];
    console.log(`Target Candidate: ${candidate.name} (ID: ${candidate.id})`);
    console.log(`Current State - Sent: ${candidate.sent_offer_letter}, Stage: ${candidate.stage}`);

    console.log("\n3. Attempting UPDATE...");
    const { data: updateData, error: updateError } = await supabase
        .from('candidates')
        .update({
            sent_offer_letter: true,
            status: 'Offer Sent DB Test'
        })
        .eq('id', candidate.id)
        .select();

    if (updateError) {
        console.error("UPDATE ERROR:", JSON.stringify(updateError, null, 2));
    } else if (updateData.length === 0) {
        console.error("UPDATE SUCCESSFUL BUT NO ROWS CHANGED (Likely RLS Issue or ID mismatch)");
    } else {
        console.log("UPDATE SUCCESS:", updateData);
    }
}

debugUpdate();
