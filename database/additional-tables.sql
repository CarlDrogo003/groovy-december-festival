-- Additional database tables needed for Groovy December Festival
-- Run these SQL commands in your Supabase SQL Editor after running the main schema.sql

-- Create contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on contact messages
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for contact messages
CREATE POLICY "Anyone can create contact messages" ON contact_messages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all contact messages" ON contact_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin can update contact messages" ON contact_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Create vendor registrations table (for the /vendors page form)
CREATE TABLE IF NOT EXISTS vendor_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_name TEXT NOT NULL,
    owner_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    business_type TEXT NOT NULL,
    years_in_business TEXT NOT NULL,
    business_description TEXT NOT NULL,
    products_services TEXT NOT NULL,
    package_type TEXT NOT NULL CHECK (package_type IN ('starter', 'professional', 'premium')),
    package_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_reference TEXT,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on vendor registrations
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor registrations
CREATE POLICY "Anyone can create vendor registrations" ON vendor_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all vendor registrations" ON vendor_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin can update vendor registrations" ON vendor_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Create pageant registrations table (comprehensive form from pageant page)
CREATE TABLE IF NOT EXISTS pageant_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    -- Step 1: Personal Information
    full_name TEXT NOT NULL,
    stage_name TEXT,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    place_of_birth TEXT NOT NULL,
    nationality TEXT NOT NULL,
    current_address TEXT NOT NULL,
    social_media_handles TEXT,
    
    -- Step 2: Emergency Contact & Physical Information
    emergency_contact_name TEXT NOT NULL,
    emergency_contact_phone TEXT NOT NULL,
    height TEXT,
    bust_chest TEXT,
    waist TEXT,
    hips TEXT,
    dress_size TEXT,
    languages TEXT,
    
    -- Step 3: Background & Biography
    biography TEXT NOT NULL,
    why TEXT NOT NULL,
    platform TEXT NOT NULL,
    achievements TEXT,
    hobbies_skills TEXT,
    
    -- Step 4: Photo Uploads
    headshot_url TEXT,
    full_body_url TEXT,
    proof_of_identity_url TEXT,
    
    -- Step 5: Agreement & Submission
    terms_accepted BOOLEAN DEFAULT false,
    marketing_consent BOOLEAN DEFAULT false,
    
    -- Administrative fields
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    contestant_number INTEGER,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_reference TEXT,
    admin_notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on pageant registrations
ALTER TABLE pageant_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for pageant registrations
CREATE POLICY "Anyone can create pageant registrations" ON pageant_registrations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all pageant registrations" ON pageant_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin can update pageant registrations" ON pageant_registrations
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Create diaspora referrals table
CREATE TABLE IF NOT EXISTS diaspora_referrals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    referrer_name VARCHAR(255) NOT NULL,
    referrer_email VARCHAR(255) NOT NULL,
    total_referrals INTEGER DEFAULT 0,
    earnings_usd DECIMAL(10,2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on diaspora referrals
ALTER TABLE diaspora_referrals ENABLE ROW LEVEL SECURITY;

-- Create policies for diaspora referrals
CREATE POLICY "Anyone can view active referrals" ON diaspora_referrals
    FOR SELECT USING (status = 'active');

CREATE POLICY "Admin can manage all referrals" ON diaspora_referrals
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Create diaspora bookings table
CREATE TABLE IF NOT EXISTS diaspora_bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_type TEXT NOT NULL CHECK (package_type IN ('homecoming-premium', 'cultural-explorer', 'festival-focus', 'family-reunion', 'business-investment', 'youth-discovery')),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    travel_dates TEXT,
    package_amount DECIMAL(10,2) NOT NULL,
    referral_code VARCHAR(20),
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    final_amount DECIMAL(10,2) NOT NULL,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_reference TEXT,
    booking_status TEXT DEFAULT 'pending' CHECK (booking_status IN ('pending', 'confirmed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on diaspora bookings
ALTER TABLE diaspora_bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for diaspora bookings
CREATE POLICY "Anyone can create diaspora bookings" ON diaspora_bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin can view all diaspora bookings" ON diaspora_bookings
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

CREATE POLICY "Admin can update diaspora bookings" ON diaspora_bookings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE id = auth.uid()
        )
    );

-- Create the handle_updated_at function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to new tables
CREATE TRIGGER contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER vendor_registrations_updated_at BEFORE UPDATE ON vendor_registrations
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER pageant_registrations_updated_at BEFORE UPDATE ON pageant_registrations
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER diaspora_referrals_updated_at BEFORE UPDATE ON diaspora_referrals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER diaspora_bookings_updated_at BEFORE UPDATE ON diaspora_bookings
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create function for incrementing referral counts
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

-- Insert some sample referral codes for testing
INSERT INTO diaspora_referrals (referral_code, referrer_name, referrer_email, total_referrals, earnings_usd) VALUES
('ADEBAYO2025', 'Adebayo Johnson', 'adebayo@example.com', 5, 250.00),
('NKEM2025', 'Nkem Okoro', 'nkem@example.com', 3, 150.00),
('TEMI2025', 'Temilola Adeyemi', 'temi@example.com', 8, 400.00)
ON CONFLICT (referral_code) DO NOTHING;