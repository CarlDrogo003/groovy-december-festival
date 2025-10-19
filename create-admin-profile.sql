-- Create Admin Profile for Olatunji Joel
-- Run this in your Supabase SQL Editor

-- First, create the user account if it doesn't exist (you'll need to sign up through the app first)
-- Then run this SQL to create/update the profile with admin role

INSERT INTO public.profiles (
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
) VALUES (
    -- You'll need to replace this UUID with your actual user ID after signing up
    -- To get your user ID, sign up first, then run: SELECT id FROM auth.users WHERE email = 'groovydecember9@gmail.com';
    (SELECT id FROM auth.users WHERE email = 'groovydecember9@gmail.com'),
    'groovydecember9@gmail.com',
    'Olatunji Joel',
    'admin',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET 
    full_name = 'Olatunji Joel',
    role = 'admin',
    updated_at = now();

-- Verify the profile was created
SELECT id, email, full_name, role, created_at FROM public.profiles WHERE email = 'groovydecember9@gmail.com';