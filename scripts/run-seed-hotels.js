const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Load .env.local explicitly so the script picks up the project's env vars
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in environment variables (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
  try {
    // Generate stable UUIDs for the test records
    const admin_uuid = crypto.randomUUID();
    const owner1_uuid = crypto.randomUUID();
    const owner2_uuid = crypto.randomUUID();

    // Helper: find existing profile by email or create with provided id
    async function findOrCreateProfile({ email, desiredId, full_name, phone_number }) {
      const { data: existing, error: fetchErr } = await supabase
        .from('hotel_profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();

      if (fetchErr) throw fetchErr;

      if (existing && existing.id) {
        return existing.id;
      }

      const { data: inserted, error: insertErr } = await supabase
        .from('hotel_profiles')
        .insert([
          {
            id: desiredId,
            email,
            full_name,
            phone_number,
            role: 'hotel_owner',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]);

      if (insertErr) {
        // If insert failed due to unique constraint on email, fetch the existing id again
        if (insertErr.code === '23505') {
          const { data: fallback } = await supabase.from('hotel_profiles').select('id').eq('email', email).maybeSingle();
          if (fallback && fallback.id) return fallback.id;
        }
        throw insertErr;
      }

      return inserted && inserted[0] && inserted[0].id ? inserted[0].id : desiredId;
    }

    // Ensure admin exists (lookup by email)
    const adminEmail = 'admin@test.com';
    const { data: existingAdmin } = await supabase.from('admins').select('id').eq('email', adminEmail).maybeSingle();
    let adminIdToUse = admin_uuid;
    if (existingAdmin && existingAdmin.id) {
      adminIdToUse = existingAdmin.id;
    } else {
      const { error: adminInsertErr } = await supabase.from('admins').insert([
        { id: admin_uuid, user_id: admin_uuid, email: adminEmail, role: 'admin', created_at: new Date().toISOString() },
      ]);
      if (adminInsertErr) {
        if (adminInsertErr.code === '23505') {
          const { data: fallback } = await supabase.from('admins').select('id').eq('email', adminEmail).maybeSingle();
          if (fallback && fallback.id) adminIdToUse = fallback.id;
          else throw adminInsertErr;
        } else {
          throw adminInsertErr;
        }
      }
    }

    // Create or reuse hotel owner profiles
    const owner1Email = 'owner1@test.com';
    const owner2Email = 'owner2@test.com';

    const owner1Id = await findOrCreateProfile({ email: owner1Email, desiredId: owner1_uuid, full_name: 'Test Owner 1', phone_number: '+2341234567890' });
    const owner2Id = await findOrCreateProfile({ email: owner2Email, desiredId: owner2_uuid, full_name: 'Test Owner 2', phone_number: '+2349876543210' });

    // Use the resolved owner ids for hotels and notification preferences
    const resolvedOwner1 = owner1Id;
    const resolvedOwner2 = owner2Id;

    // Insert hotels using the minimal schema (name, address, description, owner_id)
    const hotels = [
      {
        name: 'Test Hotel Lagos',
        description: 'A beautiful beachfront hotel in Lagos',
        address: '123 Beach Road, Lagos',
        owner_id: resolvedOwner1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: 'Test Resort Abuja',
        description: 'Luxury resort in the heart of Abuja',
        address: '456 Central Avenue, Abuja',
        owner_id: resolvedOwner2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        name: 'Test Inn Port Harcourt',
        description: 'Comfortable accommodation in Port Harcourt',
        address: '789 River Road, Port Harcourt',
        owner_id: resolvedOwner2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];

    ({ error } = await supabase.from('hotels').insert(hotels));
    if (error) throw error;

    // Insert notification preferences if the table exists
    try {
      // quick check if table exists by attempting a select
      const { error: checkErr } = await supabase.from('notification_preferences').select('user_id').limit(1);
      if (checkErr) {
        // If table is missing, skip notification preferences
        console.warn('Skipping notification_preferences: table not present or inaccessible:', checkErr.message || checkErr);
      } else {
        ({ error } = await supabase.from('notification_preferences').upsert([
          { user_id: adminIdToUse, email_notifications: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { user_id: resolvedOwner1, email_notifications: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
          { user_id: resolvedOwner2, email_notifications: true, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
        ], { onConflict: 'user_id' }));

        if (error) throw error;
      }
    } catch (npErr) {
      // If the error indicates the table doesn't exist, just warn and continue
      console.warn('Notification preferences seeding skipped:', npErr.message || npErr);
    }

  console.log('Seeding completed successfully.');
  console.log('Resolved ids:', { admin: adminIdToUse, owner1: resolvedOwner1, owner2: resolvedOwner2 });
  } catch (err) {
    console.error('Seeding failed:', err.message || err);
    if (err.details) console.error('Details:', err.details);
    process.exit(1);
  }
}

main();