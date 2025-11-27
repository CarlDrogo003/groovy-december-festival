-- Test data for hotel onboarding system
-- Run this only in development/staging environments

-- Set up UUIDs for test users
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    owner1_uuid UUID := gen_random_uuid();
    owner2_uuid UUID := gen_random_uuid();
BEGIN

-- Create test admin
INSERT INTO public.admins (id, user_id, email, role, created_at)
VALUES 
  (admin_uuid, admin_uuid, 'admin@test.com', 'admin', NOW())
ON CONFLICT (id) DO NOTHING;

-- Create test hotel profiles
INSERT INTO public.hotel_profiles (id, email, full_name, phone_number, role, created_at, updated_at)
VALUES
  (owner1_uuid, 'owner1@test.com', 'Test Owner 1', '+2341234567890', 'hotel_owner', NOW(), NOW()),
  (owner2_uuid, 'owner2@test.com', 'Test Owner 2', '+2349876543210', 'hotel_owner', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Create test hotels with different statuses
INSERT INTO public.hotels (
  name, 
  description, 
  address, 
  city, 
  state, 
  country, 
  phone, 
  email, 
  website,
  check_in_time,
  check_out_time,
  amenities,
  images,
  owner_id,
  status,
  created_at,
  updated_at
)
VALUES
  (
    'Test Hotel Lagos',
    'A beautiful beachfront hotel in Lagos',
    '123 Beach Road',
    'Lagos',
    'Lagos',
    'Nigeria',
    '+2341234567890',
    'lagos@testhotel.com',
    'https://testhotel-lagos.com',
    '14:00',
    '12:00',
    ARRAY['Wi-Fi', 'Swimming Pool', 'Restaurant', 'Parking'],
    ARRAY['https://example.com/image1.jpg', 'https://example.com/image2.jpg'],
    owner1_uuid,
    'pending',
    NOW(),
    NOW()
  ),
  (
    'Test Resort Abuja',
    'Luxury resort in the heart of Abuja',
    '456 Central Avenue',
    'Abuja',
    'FCT',
    'Nigeria',
    '+2349876543210',
    'abuja@testresort.com',
    'https://testresort-abuja.com',
    '15:00',
    '11:00',
    ARRAY['Wi-Fi', 'Spa', 'Gym', '24/7 Front Desk', 'Room Service'],
    ARRAY['https://example.com/image3.jpg', 'https://example.com/image4.jpg'],
    owner2_uuid,
    'approved',
    NOW(),
    NOW()
  ),
  (
    'Test Inn Port Harcourt',
    'Comfortable accommodation in Port Harcourt',
    '789 River Road',
    'Port Harcourt',
    'Rivers',
    'Nigeria',
    '+2348765432109',
    'ph@testinn.com',
    'https://testinn-ph.com',
    '14:00',
    '12:00',
    ARRAY['Wi-Fi', 'Restaurant', 'Laundry Service'],
    ARRAY['https://example.com/image5.jpg'],
    owner2_uuid,
    'rejected',
    NOW(),
    NOW()
  );

-- Set up notification preferences for test accounts
INSERT INTO public.notification_preferences (
  user_id,
  email_notifications,
  created_at,
  updated_at
)
VALUES
  (admin_uuid, true, NOW(), NOW()),
  (owner1_uuid, true, NOW(), NOW()),
  (owner2_uuid, true, NOW(), NOW())
ON CONFLICT (user_id) DO NOTHING;

END $$;