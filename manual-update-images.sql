-- Manual Event Images Update SQL
-- Run this in your Supabase SQL Editor to update event images
-- This avoids the updated_at field issue

-- First, temporarily disable the updated_at trigger to avoid the error
DROP TRIGGER IF EXISTS update_events_updated_at ON events;

-- Update events with available images
UPDATE events SET image_url = '/events/tech-hub.jpg' WHERE slug = 'tech-hub';
UPDATE events SET image_url = '/events/ea-market-place.jpg' WHERE slug = 'ea-market-place';
UPDATE events SET image_url = '/events/food-court.jpg' WHERE slug = 'food-court-1-2';
UPDATE events SET image_url = '/events/culture-fest.jpg' WHERE slug = 'culture-fest';
UPDATE events SET image_url = '/events/art-craft-village.jpg' WHERE slug = 'art-craft-village';
UPDATE events SET image_url = '/events/kiddies-park.jpg' WHERE slug = 'kiddies-park';
UPDATE events SET image_url = '/events/miss-groovy-december.jpg' WHERE slug = 'miss-groovy-december';
UPDATE events SET image_url = '/events/vvip-court.jpg' WHERE slug = 'vvip-court';

-- Sports & Games
UPDATE events SET image_url = '/events/football.jpg' WHERE slug = 'football-competitions';
UPDATE events SET image_url = '/events/local-games.jpg' WHERE slug = 'local-games-arena';
UPDATE events SET image_url = '/events/hiking.jpg' WHERE slug = 'hiking-competition';
UPDATE events SET image_url = '/events/chess.jpg' WHERE slug = 'chess-competition';
UPDATE events SET image_url = '/events/snooker.jpg' WHERE slug = 'snooker-competition';
UPDATE events SET image_url = '/events/eating-competition.jpg' WHERE slug = 'eating-competition';

-- Food Festivals
UPDATE events SET image_url = '/events/tea-festival.jpg' WHERE slug = 'tea-festival';
UPDATE events SET image_url = '/events/ice-cream-festival.jpg' WHERE slug = 'ice-cream-festival';
UPDATE events SET image_url = '/events/suya-festival.jpg' WHERE slug = 'suya-festival';

-- Camping & Experiences
UPDATE events SET image_url = '/events/camping-experience.jpg' WHERE slug = 'camping-experience-1';
UPDATE events SET image_url = '/events/camping-experience.jpg' WHERE slug = 'camping-experience-2-kaspaland';

-- Special Events
UPDATE events SET image_url = '/events/first-lady-day.jpg' WHERE slug = 'first-ladys-day';
UPDATE events SET image_url = '/events/hackathon.jpg' WHERE slug = 'hackathon';
UPDATE events SET image_url = '/events/investment-forum.jpg' WHERE slug = 'ea-investment-forum';

-- Traditional Events
UPDATE events SET image_url = '/events/traditional-boxing.jpg' WHERE slug = 'traditional-boxing-competition';
UPDATE events SET image_url = '/events/traditional-wrestling.jpg' WHERE slug = 'traditional-wrestling';

-- Automotive events using motor-sport.jpg as fallback
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'drag-race-competition';
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'groovy-go-karting-competition';
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'groovy-drift-wars-competition';
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'auto-cross-competition';
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'motorbike-600cc-competition';
UPDATE events SET image_url = '/events/motor-sport.jpg' WHERE slug = 'rally-cross-competition';

-- Check results
SELECT title, slug, image_url FROM events WHERE image_url IS NOT NULL ORDER BY title;

-- Recreate the updated_at trigger if needed (optional)
-- CREATE OR REPLACE FUNCTION update_updated_at_column()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   NEW.updated_at = NOW();
--   RETURN NEW;
-- END;
-- $$ language 'plpgsql';

-- CREATE TRIGGER update_events_updated_at 
--   BEFORE UPDATE ON events 
--   FOR EACH ROW 
--   EXECUTE FUNCTION update_updated_at_column();