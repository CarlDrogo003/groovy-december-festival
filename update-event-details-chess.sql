-- Chess Competition / Rapid & Blitz Tournament 2025 (Blindfold demo)
-- Flyer details: Blindfold Chess Demonstration / Rapid & Blitz Tournament
-- Dates: 27 & 28 December 2025 (deadline for entries: 15 December 2025)
-- Venue: Velodrome of the Moshood Abiola National Stadium, Abuja
-- Eligibility: Players with FIDE ID and updated FIDE profile page. First-come first-serve up to 100 participants.
-- Registration fees (per flyer): Rapid Open: ₦25,000 | Rapid Women: ₦15,000 | Rapid U-14: ₦10,000
-- Blitz Open: ₦20,000 | Blitz Women: ₦10,000

UPDATE events SET
  title = 'Blindfold Chess Demonstration — Rapid & Blitz Tournament 2025',
  date = '2025-12-27',
  start_date = '2025-12-27',
  end_date = '2025-12-28',
  venue = 'Velodrome, Moshood Abiola National Stadium, Abuja',
  location = 'Velodrome, Moshood Abiola National Stadium, Abuja',
  registration_fee = 25000.00,
  max_capacity = 100,
  category = 'Sports',
  featured = true,
  image_url = '/events/chess.jpg',
  banner_image = '/events/chess-banner.jpg',
  status = 'published',
  description = 'Blindfold Chess Demonstration and Rapid & Blitz Tournament (Dec 27-28, 2025) at the Velodrome, Moshood Abiola National Stadium, Abuja. Eligibility: Players with a FIDE Identification Number and updated FIDE profile. Entry is on a first-come, first-served basis up to 100 participants. Registration fees (as advertised): Rapid Open ₦25,000 | Rapid Women ₦15,000 | Rapid U-14 ₦10,000. Blitz Open ₦20,000 | Blitz Women ₦10,000. Registration deadline advertised as December 15, 2025. For enquiries: +234 803 059 6162 / +234 803 301 5624; email hello@groovydecember.ng',
  time = NULL
WHERE slug = 'chess-competition';

-- Verify chess event update
SELECT title, date, start_date, end_date, venue, location, registration_fee, max_capacity, category, featured, image_url, banner_image, description
FROM events
WHERE slug = 'chess-competition';

-- Set venue and location for ALL events to the FCT Exhibition Pavilion (as requested)
-- WARNING: this will update every row in the `events` table when executed.
UPDATE events SET
  venue = 'FCT Exhibition Pavilion & Event Center',
  location = 'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja';

-- Verify venue/location changes
SELECT id, slug, title, venue, location
FROM events
ORDER BY slug;
