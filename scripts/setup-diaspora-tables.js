require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createDiasporaTables() {
  console.log('🚀 Creating diaspora tables...');

  try {
    // Create diaspora_referrals table
    const { error: referralsError } = await supabase.rpc('create_table', {
      table_name: 'diaspora_referrals',
      table_sql: `
        CREATE TABLE IF NOT EXISTS diaspora_referrals (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          referral_code VARCHAR(20) UNIQUE NOT NULL,
          referrer_name VARCHAR(255) NOT NULL,
          referrer_email VARCHAR(255) NOT NULL,
          total_referrals INTEGER DEFAULT 0,
          earnings_usd DECIMAL(10,2) DEFAULT 0.00,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (referralsError) {
      console.log('Creating diaspora_referrals table directly...');
      // Try direct SQL execution
      const { error: directError } = await supabase
        .from('diaspora_referrals')
        .select('id')
        .limit(1);
      
      if (directError && directError.code === '42P01') {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        console.log(`
CREATE TABLE diaspora_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referrer_name VARCHAR(255) NOT NULL,
  referrer_email VARCHAR(255) NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  earnings_usd DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
      }
    } else {
      console.log('✅ diaspora_referrals table created');
    }

    // Create diaspora_bookings table
    const { error: bookingsError } = await supabase.rpc('create_table', {
      table_name: 'diaspora_bookings',
      table_sql: `
        CREATE TABLE IF NOT EXISTS diaspora_bookings (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          package_id VARCHAR(100),
          package_name VARCHAR(255),
          full_name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          phone VARCHAR(50),
          travelers INTEGER DEFAULT 1,
          referral_code VARCHAR(20),
          original_price DECIMAL(10,2),
          discounted_price DECIMAL(10,2),
          special_requests TEXT,
          booking_status VARCHAR(20) DEFAULT 'pending',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (bookingsError) {
      console.log('Creating diaspora_bookings table directly...');
      const { error: directError } = await supabase
        .from('diaspora_bookings')
        .select('id')
        .limit(1);
      
      if (directError && directError.code === '42P01') {
        console.log('❌ Table does not exist. Please create it manually in Supabase dashboard.');
        console.log(`
CREATE TABLE diaspora_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id VARCHAR(100),
  package_name VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  travelers INTEGER DEFAULT 1,
  referral_code VARCHAR(20),
  original_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  special_requests TEXT,
  booking_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
      }
    } else {
      console.log('✅ diaspora_bookings table created');
    }

    // Create RPC function for incrementing referral counts
    const { error: rpcError } = await supabase.rpc('create_function', {
      function_sql: `
        CREATE OR REPLACE FUNCTION increment_referral_count(ref_code TEXT, booking_amount DECIMAL)
        RETURNS VOID AS $$
        BEGIN
          UPDATE diaspora_referrals 
          SET 
            total_referrals = total_referrals + 1,
            earnings_usd = earnings_usd + 50.00,
            updated_at = NOW()
          WHERE referral_code = ref_code AND status = 'active';
        END;
        $$ LANGUAGE plpgsql;
      `
    });

    if (rpcError) {
      console.log('❌ Could not create RPC function. Please create it manually in Supabase SQL editor:');
      console.log(`
CREATE OR REPLACE FUNCTION increment_referral_count(ref_code TEXT, booking_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE diaspora_referrals 
  SET 
    total_referrals = total_referrals + 1,
    earnings_usd = earnings_usd + 50.00,
    updated_at = NOW()
  WHERE referral_code = ref_code AND status = 'active';
END;
$$ LANGUAGE plpgsql;
      `);
    } else {
      console.log('✅ RPC function created');
    }

    console.log('🎉 Diaspora tables setup complete!');
    console.log('\n📋 Next steps:');
    console.log('1. Check Supabase dashboard to verify tables were created');
    console.log('2. Set up Row Level Security (RLS) policies if needed');
    console.log('3. Test the referral system functionality');

  } catch (error) {
    console.error('❌ Error setting up tables:', error);
    console.log('\n🔧 Manual Setup Instructions:');
    console.log('Go to your Supabase dashboard > SQL Editor and run:');
    console.log(`
-- Create diaspora_referrals table
CREATE TABLE diaspora_referrals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  referral_code VARCHAR(20) UNIQUE NOT NULL,
  referrer_name VARCHAR(255) NOT NULL,
  referrer_email VARCHAR(255) NOT NULL,
  total_referrals INTEGER DEFAULT 0,
  earnings_usd DECIMAL(10,2) DEFAULT 0.00,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create diaspora_bookings table  
CREATE TABLE diaspora_bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  package_id VARCHAR(100),
  package_name VARCHAR(255),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  travelers INTEGER DEFAULT 1,
  referral_code VARCHAR(20),
  original_price DECIMAL(10,2),
  discounted_price DECIMAL(10,2),
  special_requests TEXT,
  booking_status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RPC function
CREATE OR REPLACE FUNCTION increment_referral_count(ref_code TEXT, booking_amount DECIMAL)
RETURNS VOID AS $$
BEGIN
  UPDATE diaspora_referrals 
  SET 
    total_referrals = total_referrals + 1,
    earnings_usd = earnings_usd + 50.00,
    updated_at = NOW()
  WHERE referral_code = ref_code AND status = 'active';
END;
$$ LANGUAGE plpgsql;
    `);
  }
}

createDiasporaTables();