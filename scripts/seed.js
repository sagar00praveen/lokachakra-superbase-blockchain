import { createClient } from '@supabase/supabase-js';
import { USERS, EMPLOYEES, JOBS, CANDIDATES, ASSETS } from '../src/mock/data.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars manually to avoid extra dependencies
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

const seedAuthUsers = async () => {
    console.log('Seeding Auth Users...');
    for (const user of USERS) {
        const { error } = await supabase.auth.signUp({
            email: user.email,
            password: 'password1234567',
            options: {
                data: {
                    full_name: user.name,
                    role: user.role,
                    avatar_url: user.avatar
                }
            }
        });
        if (error) console.error(`Error creating user ${user.email}:`, error.message);
        else console.log(`Created user: ${user.email}`);
    }
};

const seedTables = async () => {
    console.log('Seeding Tables...');

    // Employees
    const { error: empError } = await supabase.from('employees').insert(EMPLOYEES.map(e => ({
        name: e.name,
        role: e.role,
        department: e.department,
        status: e.status,
        supervisor: e.supervisor,
        join_date: e.joinDate,
        email: e.email
    })));
    if (empError) console.error('Error seeding employees:', empError.message);
    else console.log('Seeded employees.');

    // Jobs
    const { error: jobError } = await supabase.from('jobs').insert(JOBS.map(j => ({
        id: j.id, // Keeping ID if possible, but auto-increment might conflict. Let's try.
        title: j.title,
        department: j.department,
        status: j.status
    })));
    if (jobError) console.error('Error seeding jobs:', jobError.message);
    else console.log('Seeded jobs.');

    // Candidates
    const { error: candError } = await supabase.from('candidates').insert(CANDIDATES.map(c => ({
        name: c.name,
        applied_for_job_id: c.appliedFor,
        stage: c.stage,
        score: c.score
    })));
    if (candError) console.error('Error seeding candidates:', candError.message);
    else console.log('Seeded candidates.');
    // Assets
    console.log(`Seeding ${ASSETS.length} assets...`);
    const { data: assetData, error: assetError } = await supabase.from('assets').insert(ASSETS.map(a => ({
        name: a.name,
        type: a.type,
        status: a.status
    }))).select();

    if (assetError) {
        console.error('Error seeding assets:', JSON.stringify(assetError, null, 2));
    } else {
        console.log(`Seeded assets: ${assetData?.length}`);
    }
};

const run = async () => {
    await seedAuthUsers();

    // Sign in as admin to bypass RLS if possible
    try {
        const { data: { session }, error } = await supabase.auth.signInWithPassword({
            email: 'it.admin@lokachakra.com',
            password: 'password1234567'
        });
        if (error) console.log('Could not sign in as admin (RLS might fail for tables):', error.message);
        else console.log('Signed in as IT Admin for seeding tables.');
    } catch (e) {
        console.log('Sign in step failed:', e);
    }

    await seedTables();
    console.log('Seeding complete.');
};

run();
