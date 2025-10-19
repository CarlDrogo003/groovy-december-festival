-- Debug Admin Auth Issues
-- Run this in your Supabase SQL Editor to check your admin setup

-- 1. Check if your user exists in auth.users
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    raw_user_meta_data
FROM auth.users 
WHERE email = 'groovydecember9@gmail.com';

-- 2. Check if your profile exists and has admin role  
SELECT 
    id,
    email,
    full_name,
    role,
    created_at,
    updated_at
FROM public.profiles 
WHERE email = 'groovydecember9@gmail.com';

-- 3. Check if profiles table exists and structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
ORDER BY ordinal_position;

-- 4. Count total profiles
SELECT role, COUNT(*) as count
FROM public.profiles
GROUP BY role;

-- 5. Check RLS policies on profiles table
SELECT 
    schemaname,
    tablename,
    policyname,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'profiles';

-- If your user doesn't exist in profiles table, run this:
-- (Replace the UUID with your actual user ID from step 1)
/*
INSERT INTO public.profiles (id, email, full_name, role, created_at, updated_at)
VALUES (
    'your-user-id-from-step-1',
    'groovydecember9@gmail.com',
    'Olatunji Joel',
    'admin',
    now(),
    now()
) ON CONFLICT (id) DO UPDATE SET 
    role = 'admin',
    full_name = 'Olatunji Joel',
    updated_at = now();
*/