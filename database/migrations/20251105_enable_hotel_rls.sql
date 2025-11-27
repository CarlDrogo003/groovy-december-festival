-- Migration: Enable RLS and set up policies for hotel system tables
-- Date: 2025-11-05
-- IMPORTANT: BACKUP your database before running this migration.

BEGIN;

-- 1. Enable RLS on hotel_profiles and related tables
ALTER TABLE IF EXISTS public.hotel_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.refunds ENABLE ROW LEVEL SECURITY;

-- 2. Policies for hotel_profiles
-- Users can view their own profile
CREATE POLICY IF NOT EXISTS "Users can view own hotel profile" 
  ON public.hotel_profiles FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY IF NOT EXISTS "Users can update own hotel profile" 
  ON public.hotel_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- Festival admins can view all hotel profiles
CREATE POLICY IF NOT EXISTS "Festival admins can view all hotel profiles" 
  ON public.hotel_profiles FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Festival admins can manage all hotel profiles
CREATE POLICY IF NOT EXISTS "Festival admins can manage all hotel profiles" 
  ON public.hotel_profiles FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Hotel admins can view all hotel profiles
CREATE POLICY IF NOT EXISTS "Hotel admins can view all hotel profiles" 
  ON public.hotel_profiles FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.hotel_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 3. Policies for hotels
-- Anyone can view hotels
CREATE POLICY IF NOT EXISTS "Public can view hotels" 
  ON public.hotels FOR SELECT 
  USING (true);

-- Hotel owners can manage their hotels
CREATE POLICY IF NOT EXISTS "Hotel owners can manage their hotels" 
  ON public.hotels FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.hotel_profiles
      WHERE id = auth.uid() 
      AND role = 'hotel_owner'
      AND hotels.owner_id = id
    )
  );

-- Festival admins can manage all hotels
CREATE POLICY IF NOT EXISTS "Festival admins can manage all hotels" 
  ON public.hotels FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 4. Policies for rooms
-- Anyone can view rooms
CREATE POLICY IF NOT EXISTS "Public can view rooms" 
  ON public.rooms FOR SELECT 
  USING (true);

-- Hotel owners can manage their rooms
CREATE POLICY IF NOT EXISTS "Hotel owners can manage rooms" 
  ON public.rooms FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.hotels h
    JOIN public.hotel_profiles hp ON h.owner_id = hp.id
    WHERE hp.id = auth.uid() 
    AND hp.role = 'hotel_owner'
    AND h.id = rooms.hotel_id
  ));

-- Festival admins can manage all rooms
CREATE POLICY IF NOT EXISTS "Festival admins can manage all rooms" 
  ON public.rooms FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 5. Policies for bookings
-- Users can view their own bookings
CREATE POLICY IF NOT EXISTS "Users can view own bookings" 
  ON public.bookings FOR SELECT 
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.hotels h
      JOIN public.hotel_profiles hp ON h.owner_id = hp.id
      JOIN public.rooms r ON r.hotel_id = h.id
      WHERE hp.id = auth.uid() 
      AND bookings.room_id = r.id
    )
  );

-- Users can create bookings
CREATE POLICY IF NOT EXISTS "Users can create bookings" 
  ON public.bookings FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Hotel owners can manage bookings for their hotels
CREATE POLICY IF NOT EXISTS "Hotel owners can manage their bookings" 
  ON public.bookings FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.hotels h
    JOIN public.hotel_profiles hp ON h.owner_id = hp.id
    JOIN public.rooms r ON r.hotel_id = h.id
    WHERE hp.id = auth.uid() 
    AND hp.role = 'hotel_owner'
    AND bookings.room_id = r.id
  ));

-- Festival admins can manage all bookings
CREATE POLICY IF NOT EXISTS "Festival admins can manage all bookings" 
  ON public.bookings FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- 6. Policies for reviews
-- Anyone can view reviews
CREATE POLICY IF NOT EXISTS "Public can view reviews" 
  ON public.reviews FOR SELECT 
  USING (true);

-- Users can create/manage their own reviews
CREATE POLICY IF NOT EXISTS "Users can manage own reviews" 
  ON public.reviews FOR ALL 
  USING (auth.uid() = user_id);

-- Festival admins can manage all reviews
CREATE POLICY IF NOT EXISTS "Festival admins can manage all reviews" 
  ON public.reviews FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

COMMIT;

-- Post-migration verification queries:

-- 1. Check RLS is enabled:
-- SELECT relname AS table_name, relrowsecurity AS rls_enabled 
-- FROM pg_class 
-- WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
-- AND relname IN ('hotel_profiles', 'hotels', 'rooms', 'bookings', 'reviews');

-- 2. List policies for each table:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE schemaname = 'public' 
-- AND tablename IN ('hotel_profiles', 'hotels', 'rooms', 'bookings', 'reviews')
-- ORDER BY tablename, cmd;

-- 3. Verify foreign key relationships are intact:
-- SELECT
--   tc.table_name, kcu.column_name,
--   ccu.table_name AS foreign_table_name,
--   ccu.column_name AS foreign_column_name
-- FROM information_schema.table_constraints tc
-- JOIN information_schema.key_column_usage kcu
--   ON tc.constraint_name = kcu.constraint_name
-- JOIN information_schema.constraint_column_usage ccu
--   ON ccu.constraint_name = tc.constraint_name
-- WHERE tc.constraint_type = 'FOREIGN KEY'
-- AND tc.table_name IN ('hotel_profiles', 'hotels', 'rooms', 'bookings', 'reviews');