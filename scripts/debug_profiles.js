
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

const checkProfiles = async () => {
    console.log("Checking profiles data...");

    // We need service role key to see all profiles usually, or we use the debug relaxed RLS
    // Assuming debug_relax_rls.sql was run and allows access

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');

    if (error) {
        console.error("Error fetching profiles:", error);
    } else {
        console.log(`Found ${profiles.length} profiles.`);
        profiles.forEach(p => {
            console.log(`ID: ${p.id}, Email: ${p.email}, Role: '${p.role}', Full Name: ${p.full_name}`);
            // check for hidden chars
            if (p.role) {
                console.log(`  Role length: ${p.role.length}, Char codes: ${p.role.split('').map(c => c.charCodeAt(0)).join(',')}`);
            }
        });
    }
};

checkProfiles();
