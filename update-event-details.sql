-- Event Information Update SQL
-- Updates dates, locations, registration fees, and descriptions with prize information
-- Extracted from official Groovy December Festival flyers
-- Run this in your Supabase SQL Editor

-- All required columns already exist in the events table
-- Proceeding with event updates from flyer information

-- Hiking Competition (19/12/25, Karshi Waterfall, ₦50,000, Winner: ₦1,500,000)
UPDATE events SET 
  date = '2025-12-19',
  venue = 'Karshi Waterfall',
  location = 'Karshi Waterfall',
  registration_fee = 50000,
  description = 'Hiking adventure to Karshi Waterfall. Registration Fee: ₦50,000. Ultimate winner goes home with ₦1,500,000.',
  featured = true
WHERE slug = 'hiking-competition';

-- Groovy Kids Arena (15-31/12/25, FCT Exhibition Pavilion, Adult ₦1,000 / Kids ₦500)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 1000,
  description = 'Bring your kids to Groovy Kids Arena! Entry: Adults ₦1,000 | Kids ₦500. December 15-31, 2025.',
  featured = true,
  category = 'Entertainment'
WHERE slug = 'groovy-kids-arena';

-- FCT Ministers\' Day (17/12/25, FCT Exhibition Pavilion, FREE)
UPDATE events SET 
  date = '2025-12-17',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Behold the enablers of tourism in Abuja. Special FCT Ministers\' Day Celebration on December 17, 2025.',
  category = 'Special',
  featured = false
WHERE slug = 'fct-ministers-day';

-- Miss Groovy December 2025 (Audition: 17-20/12, Grand Finale: 26/12, ₦50,000 registration)
UPDATE events SET 
  date = '2025-12-17',
  start_date = '2025-12-17',
  end_date = '2025-12-20',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 50000,
  description = 'Register for Miss Groovy December 2025 Competition! Audition: Dec 17-20 | Grand Finale: Dec 26. Ages 20-30. Star Prize: Toyota Camry + Cash. Registration: ₦50,000.',
  category = 'Entertainment',
  featured = true
WHERE slug = 'miss-groovy-december';

-- Groovy Stage Play (19/12/25, FCT Exhibition Pavilion)
UPDATE events SET 
  date = '2025-12-19',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Watch Groovy Stage Play happening December 19, 2025. Tickets now on sale! Abujians, do not wait to be told.',
  category = 'Entertainment',
  featured = true
WHERE slug = 'groovy-stage-play';

-- Suya & Kilishi Festival (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Book your space at Groovy December Suya & Kilishi Festival! December 15-31, 2025. Savor authentic Nigerian cuisine.',
  category = 'Food',
  featured = false
WHERE slug = 'suya-festival';

-- Tea & Coffee Festival (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Book your stand at Groovy December Tea & Coffee Festival! December 15-31, 2025. Premium beverage showcase.',
  category = 'Food',
  featured = false
WHERE slug = 'tea-festival';

-- Traditional Boxing & Wrestling (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Register to attend Groovy December - Watch Traditional Boxing & Wrestling. December 15-31, 2025.',
  category = 'Sports',
  featured = false
WHERE slug = 'traditional-boxing-competition';

-- Culture Fest (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Register to attend Groovy December Culture Fest! Celebrate Nigerian cultural heritage. December 15-31, 2025.',
  category = 'Cultural',
  featured = false
WHERE slug = 'culture-fest';

-- Eating Competition (15-31/12/25, ₦500,000 worth of prizes)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Register to attend Groovy December Eating Competition! December 15-31, 2025. ₦500,000 worth of prizes to be won.',
  category = 'Food',
  featured = true
WHERE slug = 'eating-competition';

-- Emerging Market Place (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Register to exhibit at Groovy December Emerging Market Place! December 15-31, 2025. Premium vendor opportunity.',
  category = 'Marketplace',
  featured = false
WHERE slug = 'ea-market-place';

-- Food Court (15-31/12/25)
UPDATE events SET 
  date = '2025-12-15',
  start_date = '2025-12-15',
  end_date = '2025-12-31',
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  registration_fee = 0,
  description = 'Book your stand at Groovy December Food Court! December 15-31, 2025. Limited spaces available.',
  category = 'Food',
  featured = false
WHERE slug = 'food-court-1-2';

-- Check updated results
SELECT 
  title, 
  date, 
  venue,
  location, 
  registration_fee, 
  category,
  featured,
  start_date,
  end_date,
  description 
FROM events 
WHERE slug IN ('hiking-competition', 'groovy-kids-arena', 'fct-ministers-day', 'miss-groovy-december', 'groovy-stage-play', 'suya-festival', 'tea-festival', 'traditional-boxing-competition', 'culture-fest', 'eating-competition', 'ea-market-place', 'food-court-1-2')
ORDER BY date, title;

-- Set venue and location for ALL events to the FCT Exhibition Pavilion (as requested)
-- WARNING: this will update every row in the `events` table when executed.
UPDATE events SET
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja';

-- Verify venue/location changes
SELECT id, slug, title, venue, location
FROM events
ORDER BY slug;