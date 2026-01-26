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

const supabase = createClient(env.VITE_SUPABASE_URL.trim(), env.VITE_SUPABASE_ANON_KEY.trim());

const COLUMNS = ['name', 'asset_name', 'model', 'type', 'category', 'serial', 'serial_number', 'status', 'condition'];

const probe = async () => {
    console.log('Probing assets table columns...');

    for (const col of COLUMNS) {
        const payload = {};
        payload[col] = 'Test ' + col;

        // We expect either success (data returned), or specific error
        // If "Column not found", it's 42703 or PGRST...
        // PostgREST gives specific message: "Could not find the function..." or "Column ... does not exist"

        const { error } = await supabase.from('assets').insert([payload]);

        if (!error) {
            console.log(`[SUCCESS] Column '${col}' EXISTS.`);
            // Clean up
            await supabase.from('assets').delete().eq(col, payload[col]);
        } else {
            // Check error message
            if (error.code === 'PGRST204' || error.message.includes('does not exist')) {
                console.log(`[FAILED]  Column '${col}' does NOT exist.`);
            } else {
                // It might exist but failed constraints (e.g. not null for other cols)
                console.log(`[LIKELY]  Column '${col}' EXISTS (Error: ${error.message}).`);
            }
        }
    }
    console.log('Probing complete.');
};

probe();
