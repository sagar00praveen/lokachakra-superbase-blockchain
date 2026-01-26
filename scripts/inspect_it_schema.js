
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

const inspect = async () => {
    console.log('--- Inspecting Assets Schema ---');

    console.log('\nChecking for *assets* table:');
    const { data: assetsData, error: assetsError } = await supabase
        .from('assets')
        .select('*')
        .limit(1);

    if (assetsError) {
        console.log('Error accessing assets table:', assetsError.message);
    } else {
        console.log('Assets table found.');
        if (assetsData && assetsData.length > 0) {
            console.log('Columns:', Object.keys(assetsData[0]));
        } else {
            console.log('Table found but empty.');
        }
    }

    console.log('\nChecking candidates table for company_email, company_password columns:');
    const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('company_email, company_password_hash') // checking fields we might need
        .limit(1);

    if (candidateError) {
        console.log('Error checking columns:', candidateError.message);
    } else {
        console.log('Columns exist.');
    }
};

inspect();
