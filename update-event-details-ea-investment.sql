-- EA Emerging Abuja Investment Forum SQL (idempotent)
-- Adds a structured `brochure_url` column (if missing) and upserts the event row.
-- Adjust `date`, `start_date`, `end_date`, `registration_fee`, `max_capacity`, and `description` as needed after review.

-- Add brochure_url column to store a PDF link
ALTER TABLE events
  ADD COLUMN IF NOT EXISTS brochure_url text;

-- Upsert (INSERT ... ON CONFLICT) for the EA Investment Forum event
-- Replace date/start_date/end_date and other fields if the brochure has different values.
INSERT INTO events (
  title, slug, date, start_date, end_date,
  venue, location, registration_fee, category, featured,
  image_url, banner_image, max_capacity, status, description, brochure_url
) VALUES (
  'Emerging Abuja Investment Forum 2025',
  'emerging-abuja-investment-forum',
  '2025-12-18', -- adjust based on brochure
  '2025-12-18', -- adjust
  NULL,
  'FCT Exhibition Pavilion & Event Center',
  'FCT Exhibition Pavilion & Event Center, Opp. Radio House, Garki, Abuja',
  0,
  'Business',
  true,
  '/events/ea-investment-forum.jpg',
  '/events/ea-investment-forum-banner.jpg',
  300,
  'published',
  'Emerging Abuja Investment Forum — see brochure for full agenda and speaker list. [Paste a short summary or excerpt here after review of the PDF]',
  '/events/brochures/ea-investment-forum.pdf'
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  date = EXCLUDED.date,
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  venue = EXCLUDED.venue,
  location = EXCLUDED.location,
  registration_fee = EXCLUDED.registration_fee,
  category = EXCLUDED.category,
  featured = EXCLUDED.featured,
  image_url = EXCLUDED.image_url,
  banner_image = EXCLUDED.banner_image,
  max_capacity = EXCLUDED.max_capacity,
  status = EXCLUDED.status,
  description = EXCLUDED.description,
  brochure_url = EXCLUDED.brochure_url;

-- Verify EA Investment Forum row
SELECT id, title, slug, date, venue, brochure_url
FROM events
WHERE slug = 'emerging-abuja-investment-forum';

-- NOTE: Please copy the PDF to `public/events/brochures/ea-investment-forum.pdf` in your project
-- or upload it to Supabase Storage and update `brochure_url` above with the storage public URL.
