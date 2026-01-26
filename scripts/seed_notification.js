
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

async function seedNotification() {
    console.log("Seeding test notification for HR...");

    const notification = {
        recipient_role: 'hr',
        title: 'Test Notification',
        message: 'This is a test notification generated manually to verify the system.',
        type: 'info',
        read: false,
        created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('notifications')
        .insert([notification])
        .select();

    if (error) {
        console.error("Error inserting notification:", error);
    } else {
        console.log("Success! Notification inserted:", data);
    }
}

seedNotification();
