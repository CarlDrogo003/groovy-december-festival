-- Migration: Migrate hotel tables to use the main festival `profiles` table
-- Date: 2025-11-05
-- IMPORTANT: BACKUP your database (Supabase SQL editor -> Dump) before running this migration.
-- This migration assumes most hotel tables are empty. If you have data in `hotel_profiles`, create a mapping script first.

BEGIN;

-- 1) Extend `profiles.role` CHECK to include 'hotel_owner'
-- Drop any existing CHECK constraints on public.profiles (usually just the role check), then add a new check including hotel_owner.
DO $$
DECLARE
  c RECORD;
BEGIN
  FOR c IN
    SELECT conname
    FROM pg_constraint
    WHERE contype = 'c' AND conrelid = 'public.profiles'::regclass
  LOOP
    EXECUTE format('ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS %I', c.conname);
  END LOOP;
  -- Add a safer role check that includes hotel_owner
  ALTER TABLE public.profiles
    ADD CONSTRAINT profiles_role_check CHECK (role IN ('admin', 'vendor', 'contestant', 'user', 'hotel_owner'));
END
$$ LANGUAGE plpgsql;

-- 2) Drop foreign key constraints that reference hotel_profiles (if any) so we can repoint them to profiles
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT conname, conrelid::regclass::text AS table_name
    FROM pg_constraint
    WHERE contype = 'f' AND confrelid = 'public.hotel_profiles'::regclass
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT IF EXISTS %I', r.table_name, r.conname);
  END LOOP;
END
$$ LANGUAGE plpgsql;

-- 3) Recreate foreign key constraints to reference public.profiles(id)
-- NOTE: These statements assume the columns are named as in the hotel-system schema.
-- If any of these constraints fail because the column doesn't exist, the migration will stop.

-- hotels.owner_id -> profiles(id)
ALTER TABLE IF EXISTS public.hotels
  DROP CONSTRAINT IF EXISTS hotels_owner_id_fkey;
ALTER TABLE IF EXISTS public.hotels
  ADD CONSTRAINT hotels_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- bookings.user_id -> profiles(id)
ALTER TABLE IF EXISTS public.bookings
  DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE IF EXISTS public.bookings
  ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- reviews.user_id -> profiles(id)
ALTER TABLE IF EXISTS public.reviews
  DROP CONSTRAINT IF EXISTS reviews_user_id_fkey;
ALTER TABLE IF EXISTS public.reviews
  ADD CONSTRAINT reviews_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- If other FK constraints referenced hotel_profiles, add them here similarly.

-- 4) Enable Row Level Security and add sensible policies for hotels, rooms, bookings, reviews

-- Enable RLS
ALTER TABLE IF EXISTS public.hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_modifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.booking_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.refunds ENABLE ROW LEVEL SECURITY;

-- Policies for hotels
-- Public can read hotels
CREATE POLICY IF NOT EXISTS "Public can view hotels" ON public.hotels FOR SELECT USING (true);

-- Hotel owners (profiles.role = 'hotel_owner') can insert hotels where owner_id = auth.uid()
CREATE POLICY IF NOT EXISTS "Hotel owners can insert hotels" ON public.hotels FOR INSERT WITH CHECK (auth.uid() = owner_id AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'hotel_owner'));

-- Hotel owners can update/delete their hotels
CREATE POLICY IF NOT EXISTS "Hotel owners can manage hotels" ON public.hotels FOR ALL USING (owner_id = auth.uid());

-- Policies for rooms
CREATE POLICY IF NOT EXISTS "Public can view rooms" ON public.rooms FOR SELECT USING (true);
CREATE POLICY IF NOT_EXISTS "Hotel owners can manage rooms" ON public.rooms FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.hotels WHERE id = rooms.hotel_id AND owner_id = auth.uid()
  )
);

-- Policies for bookings
CREATE POLICY IF NOT EXISTS "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY IF NOT EXISTS "Users can view their bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);

-- Hotel owners can view bookings for their hotels
CREATE POLICY IF NOT_EXISTS "Hotel owners can view hotel bookings" ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.rooms r JOIN public.hotels h ON r.hotel_id = h.id WHERE bookings.room_id = r.id AND h.owner_id = auth.uid()
  )
);

-- Policies for reviews
CREATE POLICY IF NOT EXISTS "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY IF NOT EXISTS "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5) Optionally drop `hotel_profiles` if it's empty (safe guard)
DO $$
DECLARE cnt integer;
BEGIN
  IF to_regclass('public.hotel_profiles') IS NOT NULL THEN
    EXECUTE 'SELECT count(*) FROM public.hotel_profiles' INTO cnt;
    IF cnt = 0 THEN
      RAISE NOTICE 'Dropping empty table public.hotel_profiles';
      DROP TABLE IF EXISTS public.hotel_profiles;
    ELSE
      RAISE NOTICE 'public.hotel_profiles has % rows - not dropped. Please migrate records manually.', cnt;
    END IF;
  ELSE
    RAISE NOTICE 'public.hotel_profiles does not exist - nothing to drop';
  END IF;
END
$$ LANGUAGE plpgsql;

COMMIT;

-- End migration

-- Post-migration manual checks (run these queries after migration completes):
-- 1) Verify FKs now point to profiles:
--   SELECT conname, conrelid::regclass::text AS table_name, ccu.table_name AS foreign_table
--   FROM information_schema.table_constraints tc
--   JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
--   JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
--   WHERE tc.constraint_type = 'FOREIGN KEY' AND ccu.table_name = 'profiles';

-- 2) Confirm RLS enabled on hotel tables:
--   SELECT relname, relrowsecurity FROM pg_class WHERE relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND relname IN ('hotels','rooms','bookings','reviews');

-- 3) If you need to resurrect hotel_profiles data, run mapping logic to convert hotel_profiles -> profiles and update owner_id values accordingly.
