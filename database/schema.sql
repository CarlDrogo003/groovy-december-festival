-- Supabase Database Schema for Groovy December Festival
-- Run these SQL commands in your Supabase SQL Editor

-- Enable RLS (Row Level Security) on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'vendor', 'contestant', 'user')),
    phone TEXT,
    company TEXT, -- For vendors
    bio TEXT, -- For contestants
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admin can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admin can update all profiles" ON profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    slug TEXT UNIQUE NOT NULL,
    date DATE NOT NULL,
    time TIME,
    location TEXT,
    image_url TEXT,
    capacity INTEGER,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on events table
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies for events table
CREATE POLICY "Anyone can view active events" ON events
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all events" ON events
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create event registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    additional_info JSONB,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    payment_reference TEXT,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(event_id, user_id)
);

-- Enable RLS on event registrations
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for event registrations
CREATE POLICY "Users can view their own registrations" ON event_registrations
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create registrations" ON event_registrations
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can view all registrations" ON event_registrations
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create pageant contestants table
CREATE TABLE IF NOT EXISTS pageant_contestants (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 18 AND age <= 35),
    height TEXT,
    occupation TEXT,
    education TEXT,
    bio TEXT,
    photo_url TEXT,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    contestant_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on pageant contestants
ALTER TABLE pageant_contestants ENABLE ROW LEVEL SECURITY;

-- Create policies for pageant contestants
CREATE POLICY "Users can view approved contestants" ON pageant_contestants
    FOR SELECT USING (application_status = 'approved');

CREATE POLICY "Users can view their own application" ON pageant_contestants
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their application" ON pageant_contestants
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their pending application" ON pageant_contestants
    FOR UPDATE USING (user_id = auth.uid() AND application_status = 'pending');

CREATE POLICY "Admin can manage all contestants" ON pageant_contestants
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create sponsors table
CREATE TABLE IF NOT EXISTS sponsors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    logo_url TEXT,
    website TEXT,
    description TEXT,
    sponsorship_level TEXT CHECK (sponsorship_level IN ('platinum', 'gold', 'silver', 'bronze')),
    amount DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on sponsors
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Create policies for sponsors
CREATE POLICY "Anyone can view active sponsors" ON sponsors
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage all sponsors" ON sponsors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_type TEXT,
    description TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    website TEXT,
    logo_url TEXT,
    application_status TEXT DEFAULT 'pending' CHECK (application_status IN ('pending', 'approved', 'rejected')),
    booth_number TEXT,
    booth_fee DECIMAL(10,2),
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on vendors
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policies for vendors
CREATE POLICY "Anyone can view approved vendors" ON vendors
    FOR SELECT USING (application_status = 'approved');

CREATE POLICY "Users can view their own vendor profile" ON vendors
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create vendor profile" ON vendors
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their vendor profile" ON vendors
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admin can manage all vendors" ON vendors
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create raffle entries table
CREATE TABLE IF NOT EXISTS raffle_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    ticket_number TEXT UNIQUE NOT NULL,
    entry_date TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_winner BOOLEAN DEFAULT false,
    prize_claimed BOOLEAN DEFAULT false
);

-- Enable RLS on raffle entries
ALTER TABLE raffle_entries ENABLE ROW LEVEL SECURITY;

-- Create policies for raffle entries
CREATE POLICY "Users can view their own entries" ON raffle_entries
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create entries" ON raffle_entries
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin can manage all entries" ON raffle_entries
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to relevant tables
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER pageant_contestants_updated_at BEFORE UPDATE ON pageant_contestants
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER sponsors_updated_at BEFORE UPDATE ON sponsors
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Insert initial admin user (update with your actual admin email)
-- INSERT INTO profiles (id, email, full_name, role)
-- VALUES ('your-admin-user-id-here', 'admin@groovydecember.ng', 'Admin User', 'admin')
-- ON CONFLICT (id) DO UPDATE SET role = 'admin';