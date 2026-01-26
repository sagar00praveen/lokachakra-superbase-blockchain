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

const tables = ['candidates', 'employees', 'jobs', 'profiles', 'assets'];

const inspect = async () => {
    console.log('--- Supabase Schema Inspection ---');

    for (const table of tables) {
        console.log(`\nTable: [${table}]`);
        const { data, error } = await supabase.from(table).select('*').limit(1);

        if (error) {
            console.error(`Error accessing table: ${error.message}`);
            continue;
        }

        if (data && data.length > 0) {
            const keys = Object.keys(data[0]);
            console.log('Columns detected:');
            keys.forEach(key => {
                const value = data[0][key];
                const type = typeof value;
                console.log(` - ${key} (${value === null ? 'unknown (null)' : type})`);
            });
        } else {
            console.log('Table is accessible but empty. Cannot infer columns from data.');
        }
    }
};

inspect();
