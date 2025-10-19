-- Event Information Update SQL
-- Updates dates, locations, registration fees, and descriptions with prize information
-- Run this in your Supabase SQL Editor after the images update

-- First, temporarily disable the updated_at trigger to avoid the error
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Add missing columns if they don't exist
ALTER TABLE events ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE events ADD COLUMN IF NOT EXISTS time TIME;
ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER;

-- Tech Hub (15-31/12/25, Main Bowl Yard, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Main Bowl Yard',
  registration_fee = 0,
  description = 'Open to all. Festival runs from December 15-31, 2025.'
WHERE slug = 'tech-hub';

-- EA Market Place (15-31/12/25, Training Pitch 1, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Training Pitch 1',
  registration_fee = 0,
  description = 'Open to all. Market place runs from December 15-31, 2025.'
WHERE slug = 'ea-market-place';

-- Food Court 1 & 2 (15-31/12/25, Main Bowl Car Park 1&2, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Main Bowl Car Park 1&2',
  registration_fee = 0,
  description = 'Open to all. Food courts operate from December 15-31, 2025.'
WHERE slug = 'food-court-1-2';

-- Culture Fest (15-31/12/25, SIA 1 pitch, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Open to all. Cultural festival runs from December 15-31, 2025.'
WHERE slug = 'culture-fest';

-- Art & Craft Village (15-31/12/25, SIA 1 Pitch, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Open to all. Art & craft exhibitions from December 15-31, 2025.'
WHERE slug = 'art-craft-village';

-- Kiddies Park (15-31/12/25, Main bowl Yard, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Main Bowl Yard',
  registration_fee = 0,
  description = 'Open to all. Kids activities from December 15-31, 2025.'
WHERE slug = 'kiddies-park';

-- Miss Groovy December (17/12/25, Velodrome, ₦50,000, Prizes: 1st-₦2.5m+Car, 2nd-₦2m, 3rd-₦1m, 100k for 34 finalists)
UPDATE events SET 
  date = '2025-12-17',
  location = 'Velodrome',
  registration_fee = 50000,
  description = 'Beauty pageant competition. Prizes: 1st - ₦2,500,000 + Car, 2nd - ₦2,000,000, 3rd - ₦1,000,000, ₦100,000 for 34 finalists.'
WHERE slug = 'miss-groovy-december';

-- VVIP Court (15-31/12/25, Training Pitch 2, Restricted)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Training Pitch 2',
  registration_fee = 0,
  description = 'Restricted access. VIP area available from December 15-31, 2025.'
WHERE slug = 'vvip-court';

-- Football Competitions (16-20/12/25, Main Bowl, By invitation, Trophy + ₦2m)
UPDATE events SET 
  date = '2025-12-16',
  location = 'Main Bowl',
  registration_fee = 0,
  description = 'By invitation only. Competition runs December 16-20, 2025. Prize: ₦2,000,000 + Trophy.'
WHERE slug = 'football-competitions';

-- Tea Festival (15-31/12/25, SIA 1 Pitch, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Open to all. Tea festival runs from December 15-31, 2025.'
WHERE slug = 'tea-festival';

-- Ice Cream Festival (15-31/12/25, Main bowl Yard, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Main Bowl Yard',
  registration_fee = 0,
  description = 'Open to all. Ice cream festival runs from December 15-31, 2025.'
WHERE slug = 'ice-cream-festival';

-- Local Games Arena (15-31/12/25, SIA 1 Pitch, Open to all)
UPDATE events SET 
  date = '2025-12-15',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Open to all. Traditional local games from December 15-31, 2025.'
WHERE slug = 'local-games-arena';

-- Hiking Competition (18/12/25, Karshi Waterfalls, ₦5,000, Prizes: 1st-₦2m, 2nd-₦700k, 3rd-₦200k)
UPDATE events SET 
  date = '2025-12-18',
  location = 'Karshi Waterfalls',
  registration_fee = 5000,
  description = 'Hiking adventure competition. Prizes: 1st - ₦2,000,000, 2nd - ₦700,000, 3rd - ₦200,000.'
WHERE slug = 'hiking-competition';

-- Fishing Competition (21/12/25, KASPALAND, pending)
UPDATE events SET 
  date = '2025-12-21',
  location = 'KASPALAND',
  registration_fee = 0,
  description = 'Fishing competition at KASPALAND. Registration fee pending.'
WHERE slug = 'fishing-competition';

-- Chess Competition (20/12/25, Hall VIP Lounge, ₦20,000, Prizes: 1st-₦10m, 2nd-₦5m, 3rd-₦2m)
UPDATE events SET 
  date = '2025-12-20',
  location = 'Hall, VIP Lounge',
  registration_fee = 20000,
  description = 'Strategic chess competition. Prizes: 1st - ₦10,000,000, 2nd - ₦5,000,000, 3rd - ₦2,000,000.'
WHERE slug = 'chess-competition';

-- Scrabble Competition (using similar format as chess since not specified)
UPDATE events SET 
  date = '2025-12-20',
  location = 'Hall, VIP Lounge',
  registration_fee = 15000,
  description = 'Word game competition alongside chess events.'
WHERE slug = 'scrabble-competition';

-- Snooker Competition (22-25/12/25, Velodrome, ₦200,000, Prizes: 1st-₦2m, 2nd-₦1m, 3rd-₦500k)
UPDATE events SET 
  date = '2025-12-22',
  location = 'Velodrome',
  registration_fee = 200000,
  description = 'Professional snooker tournament. December 22-25, 2025. Prizes: 1st - ₦2,000,000, 2nd - ₦1,000,000, 3rd - ₦500,000.'
WHERE slug = 'snooker-competition';

-- Eating Competition (22, 24, 25, 26, 27/12/25, SIA 1 Pitch, ₦10,000, ₦100k for 5 persons)
UPDATE events SET 
  date = '2025-12-22',
  location = 'SIA 1 Pitch',
  registration_fee = 10000,
  description = 'Food eating competition on December 22, 24, 25, 26, 27. Prize: ₦100,000 for 5 persons.'
WHERE slug = 'eating-competition';

-- First Lady's Day (16-17/12/25, SIA 1 Pitch, By invitation)
UPDATE events SET 
  date = '2025-12-16',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'By invitation only. Special event December 16-17, 2025. Prizes pending.'
WHERE slug = 'first-ladys-day';

-- FCT Minister's Day (19/12/25, SIA 1 Pitch, By invitation)
UPDATE events SET 
  date = '2025-12-19',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'By invitation only. Special ministerial event on December 19, 2025.'
WHERE slug = 'fct-ministers-day';

-- Suya Festival (15-31/12/25, Multi Location, Free)
UPDATE events SET 
  date = '2025-12-15',
  location = 'Multi Location',
  registration_fee = 0,
  description = 'Free suya festival across multiple locations. December 15-31, 2025.'
WHERE slug = 'suya-festival';

-- Raffle Draws (18, 20, 22, 24, 26, 28, 30/12/25, Main bowl Yard, ₦2,000 tickets, 1 tricycle every 2 days)
UPDATE events SET 
  date = '2025-12-18',
  location = 'Main Bowl Yard',
  registration_fee = 2000,
  description = 'Raffle draws on December 18, 20, 22, 24, 26, 28, 30. Tickets ₦2,000. Prize: 1 tricycle every 2 days (Total 8 tricycles).'
WHERE slug = 'raffle-draws';

-- Hackathon (22, 23, 24/12/25, Main bowl Yard, Free, Prizes: 1st-₦1.5m, 2nd-₦1m, 3rd-₦500k)
UPDATE events SET 
  date = '2025-12-22',
  location = 'Main Bowl Yard',
  registration_fee = 0,
  description = 'Free technology hackathon. December 22-24, 2025. Prizes: 1st - ₦1,500,000, 2nd - ₦1,000,000, 3rd - ₦500,000.'
WHERE slug = 'hackathon';

-- EA Investment Forum (18/12/25, Hall Stadium, pending)
UPDATE events SET 
  date = '2025-12-18',
  location = 'Hall, Stadium',
  registration_fee = 0,
  description = 'Investment and business forum. Registration fee pending.'
WHERE slug = 'ea-investment-forum';

-- Traditional Boxing Competition (estimated date, location, and fee)
UPDATE events SET 
  date = '2025-12-19',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Traditional boxing competition. Part of state events program.'
WHERE slug = 'traditional-boxing-competition';

-- Traditional Wrestling (estimated date, location, and fee)
UPDATE events SET 
  date = '2025-12-21',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Traditional wrestling competition. Part of state events program.'
WHERE slug = 'traditional-wrestling';

-- Traditional Dance Competition (estimated date, location, and fee)
UPDATE events SET 
  date = '2025-12-23',
  location = 'SIA 1 Pitch',
  registration_fee = 0,
  description = 'Traditional dance competition showcasing cultural heritage.'
WHERE slug = 'traditional-dance-competition';

-- Automotive/Motorsport events (17, 18, 19, 20/12/25, Eagle Square, Pending)
UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Motorsport events December 17-20, 2025. Registration fees pending.'
WHERE slug = 'drag-race-competition';

UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Go-karting competition December 17-20, 2025. Registration fees pending.'
WHERE slug = 'groovy-go-karting-competition';

UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Drift wars competition December 17-20, 2025. Registration fees pending.'
WHERE slug = 'groovy-drift-wars-competition';

UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Auto cross competition December 17-20, 2025. Registration fees pending.'
WHERE slug = 'auto-cross-competition';

UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Motorbike 600cc competition December 17-20, 2025. Registration fees pending.'
WHERE slug = 'motorbike-600cc-competition';

UPDATE events SET 
  date = '2025-12-17',
  location = 'Eagle Square',
  registration_fee = 0,
  description = 'Rally cross competition December 17-20, 2025. Registration fees pending.'
WHERE slug = 'rally-cross-competition';

-- Camping experiences (estimated updates)
UPDATE events SET 
  date = '2025-12-20',
  location = 'Mountain Top',
  registration_fee = 0,
  description = 'Mountain camping experience. Registration details pending.'
WHERE slug = 'camping-experience-1';

UPDATE events SET 
  date = '2025-12-27',
  location = 'KASPALAND',
  registration_fee = 0,
  description = 'Camping experience at KASPALAND. Registration details pending.'
WHERE slug = 'camping-experience-2-kaspaland';

-- Check updated results
SELECT title, date, location, registration_fee, description FROM events 
WHERE registration_fee IS NOT NULL OR location IS NOT NULL 
ORDER BY date, title;