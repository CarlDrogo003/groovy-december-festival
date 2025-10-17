-- Add traditional boxing and wrestling events for States Events category
-- Run this in your Supabase SQL editor to add the missing events

INSERT INTO events (
  title, 
  description, 
  date, 
  venue, 
  category, 
  registration_fee, 
  featured, 
  slug,
  image_url
) VALUES 
(
  'Traditional Boxing Competition',
  'Experience the ancient art of traditional African boxing! Compete in this exciting combat sport that combines strength, strategy, and cultural heritage. Cash prizes and recognition await the champions.',
  '2024-12-21',
  'Sports Complex, Lagos',
  'Traditional',
  25000,
  false,
  'traditional-boxing-competition',
  '/events/traditional-boxing.jpg'
),
(
  'Traditional Wrestling Championship',
  'Join the ultimate test of strength and skill in traditional wrestling! This cultural sport brings together the best wrestlers from across Nigeria. Compete for glory and substantial cash prizes.',
  '2024-12-23',
  'Wrestling Arena, Lagos',
  'Traditional',
  20000,
  false,
  'traditional-wrestling',
  '/events/traditional-wrestling.jpg'
);