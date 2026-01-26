import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.resolve(__dirname, '../.env');
const envContent = fs.readFileSync(envPath, 'utf-8');
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(line => line.includes('='))
        .map(line => line.split('='))
);

const supabase = createClient(env.VITE_SUPABASE_URL.trim(), env.VITE_SUPABASE_ANON_KEY.trim());

const verify = async () => {
    const { data, error } = await supabase.from('assets').select('*');
    if (error) {
        console.error('Error fetching assets:', error);
    } else {
        console.log(`Found ${data.length} assets.`);
        console.log(JSON.stringify(data, null, 2));
    }
};

verify();
