# Supabase Authentication Setup Guide

## Problem Identified
The authentication system was not working because:

1. **Missing profiles table**: Auth context expects a `profiles` table that doesn't exist
2. **Incorrect redirect paths**: ProtectedRoute was redirecting to `/auth` instead of `/admin/login`
3. **Poor magic link handling**: No proper callback URL or session management
4. **Missing user roles**: No way to distinguish between admin and regular users

## Solution Implemented

### 1. Fixed Login Page (`/admin/login`)
- ✅ Added proper email/password authentication
- ✅ Added magic link authentication with proper redirects
- ✅ Added sign up functionality for new users
- ✅ Improved UI with loading states and error handling
- ✅ Added URL parameter handling for verification

### 2. Fixed ProtectedRoute Component
- ✅ Updated fallback path to `/admin/login`
- ✅ Better role-based access control
- ✅ Improved loading states

### 3. Database Setup Required

**IMPORTANT**: You must run the SQL script to set up the database properly.

#### Steps to Set Up Database:

1. **Open Supabase Dashboard**
   - Go to your Supabase project
   - Navigate to "SQL Editor"

2. **Run the Auth Setup Script**
   - Copy the contents of `database/auth-setup.sql`
   - Paste and run in SQL Editor

3. **What the Script Does:**
   - Creates `profiles` table with user roles
   - Sets up Row Level Security (RLS)
   - Creates automatic profile creation on user signup
   - Sets up proper permissions
   - Creates admin role assignment logic

### 4. Environment Variables
Make sure these are set in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Admin User Setup

After running the SQL script, you can create admin users in two ways:

#### Option A: Email Domain Auto-Assignment
- Users with emails ending in `@groovydecember.ng` automatically get admin role

#### Option B: Manual Admin Assignment
Run this in Supabase SQL Editor (replace with your email):

```sql
-- First, the user must sign up through the app
-- Then run this to make them an admin:
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## Testing the Fix

### 1. Test Sign Up
1. Go to `/admin/login`
2. Click "Need an account? Sign up"
3. Enter email and password
4. Check email for verification link
5. Click verification link
6. Sign in with credentials

### 2. Test Magic Link
1. Go to `/admin/login`
2. Enter email only
3. Click "Send Magic Link"
4. Check email and click magic link
5. Should be redirected to admin dashboard

### 3. Test Role Protection
1. Sign up with regular email (not @groovydecember.ng)
2. Try to access `/admin`
3. Should be redirected back to login with unauthorized error
4. Update role to 'admin' in database
5. Try accessing `/admin` again - should work

## Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Check your `.env.local` file has the correct Supabase credentials

### Issue: "Error fetching profile"
**Solution**: Make sure you've run the `auth-setup.sql` script to create the profiles table

### Issue: "Unauthorized access"
**Solution**: Make sure the user's role in the profiles table is set to 'admin'

### Issue: Magic link not working
**Solution**: Check that your site URL is properly configured in Supabase Auth settings

## Next Steps

1. **Run the SQL script** - This is critical for auth to work
2. **Test the login flow** - Try both password and magic link authentication
3. **Create your admin account** - Sign up and then update your role to 'admin'
4. **Configure Supabase Auth settings** - Make sure site URL and redirect URLs are correct

The authentication system should now work properly!