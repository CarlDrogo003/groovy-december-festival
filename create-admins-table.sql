-- Create the missing ADMINS table for Groovy December Festival
-- This table was referenced in the code but never created
-- Run this in your Supabase SQL Editor

-- Create admins table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'moderator')),
    permissions JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on admins table
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Create policies for admins table (simplified to avoid circular references)
CREATE POLICY "Authenticated users can view admins" ON admins
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage admin records" ON admins
    FOR ALL USING (
        user_id = auth.uid() OR 
        email = auth.email()
    );

-- Create function to handle admin updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_admin_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS handle_admin_updated_at ON public.admins;
CREATE TRIGGER handle_admin_updated_at
    BEFORE UPDATE ON public.admins
    FOR EACH ROW EXECUTE FUNCTION public.handle_admin_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.admins TO authenticated;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS admins_user_id_idx ON public.admins(user_id);
CREATE INDEX IF NOT EXISTS admins_email_idx ON public.admins(email);
CREATE INDEX IF NOT EXISTS admins_role_idx ON public.admins(role);
CREATE INDEX IF NOT EXISTS admins_is_active_idx ON public.admins(is_active);

-- Insert initial admin record for Olatunji Joel
-- Replace with your actual user ID from auth.users
INSERT INTO public.admins (
    user_id,
    email,
    full_name,
    role,
    is_active
) VALUES (
    (SELECT id FROM auth.users WHERE email = 'groovydecember9@gmail.com'),
    'groovydecember9@gmail.com',
    'Olatunji Joel',
    'super_admin',
    true
) ON CONFLICT (email) DO UPDATE SET 
    full_name = 'Olatunji Joel',
    role = 'super_admin',
    is_active = true,
    updated_at = now();

-- Verify the admin was created
SELECT id, user_id, email, full_name, role, is_active, created_at 
FROM public.admins 
WHERE email = 'groovydecember9@gmail.com';

-- Success message
SELECT 'Admins table created and initial admin added successfully!' as message;