require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function main() {
  console.log('\nChecking hotel_profiles:');
  const { data: profiles, error: profilesError } = await supabase
    .from('hotel_profiles')
    .select('id, email, full_name, phone_number, role, created_at')
    .order('created_at', { ascending: false });
  
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError.message);
  } else {
    console.table(profiles);
  }

  console.log('\nChecking hotels:');
  const { data: hotels, error: hotelsError } = await supabase
    .from('hotels')
    .select('id, name, address, owner_id, created_at')
    .order('created_at', { ascending: false });

  if (hotelsError) {
    console.error('Error fetching hotels:', hotelsError.message);
  } else {
    console.table(hotels);
  }

  console.log('\nChecking notification_preferences:');
  const { data: prefs, error: prefsError } = await supabase
    .from('notification_preferences')
    .select('user_id, email_notifications, created_at')
    .order('created_at', { ascending: false });

  if (prefsError) {
    console.error('Error fetching notification preferences:', prefsError.message);
  } else {
    console.table(prefs);
  }
}

main().catch(console.error);