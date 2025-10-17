# Manual Database Update SQL Commands

The automated script is encountering database schema issues. Here are the manual SQL commands you can run directly in your Supabase SQL editor to update the event images:

## SQL Commands to Run in Supabase Dashboard

```sql
-- Update Art & Craft Village
UPDATE events 
SET image_url = '/events/art-craft-village.jpg' 
WHERE slug = 'art-craft-village';

-- Update Chess Competition
UPDATE events 
SET image_url = '/events/chess.jpg' 
WHERE slug = 'chess-competition';

-- Update Culture Fest
UPDATE events 
SET image_url = '/events/culture-fest.jpg' 
WHERE slug = 'culture-fest';

-- Update EA Market Place
UPDATE events 
SET image_url = '/events/ea-market-place.jpg' 
WHERE slug = 'ea-market-place';

-- Update Eating Competition
UPDATE events 
SET image_url = '/events/eating-competition.jpg' 
WHERE slug = 'eating-competition';

-- Update Hiking Competition
UPDATE events 
SET image_url = '/events/hiking.jpg' 
WHERE slug = 'hiking-competition';

-- Update Miss Groovy December
UPDATE events 
SET image_url = '/events/miss-groovy-december.jpg' 
WHERE slug = 'miss-groovy-december';

-- Update Snooker Competition
UPDATE events 
SET image_url = '/events/snooker.jpg' 
WHERE slug = 'snooker-competition';

-- Update Suya Festival
UPDATE events 
SET image_url = '/events/suya-festival.jpg' 
WHERE slug = 'suya-festival';

-- Update Traditional Boxing Competition
UPDATE events 
SET image_url = '/events/traditional-boxing.jpg' 
WHERE slug = 'traditional-boxing-competition';

-- Update Traditional Wrestling
UPDATE events 
SET image_url = '/events/traditional-wrestling.jpg' 
WHERE slug = 'traditional-wrestling';
```

## How to Apply These Updates:

1. **Go to your Supabase Dashboard**
2. **Navigate to SQL Editor**
3. **Copy and paste the SQL commands above**
4. **Execute them one by one or all at once**

## Verification Query:

```sql
-- Check which events now have images
SELECT title, slug, image_url 
FROM events 
WHERE image_url IS NOT NULL 
ORDER BY title;
```

## Alternative: Batch Update

```sql
-- Single command to update all at once
UPDATE events SET image_url = CASE 
  WHEN slug = 'art-craft-village' THEN '/events/art-craft-village.jpg'
  WHEN slug = 'chess-competition' THEN '/events/chess.jpg'
  WHEN slug = 'culture-fest' THEN '/events/culture-fest.jpg'
  WHEN slug = 'ea-market-place' THEN '/events/ea-market-place.jpg'
  WHEN slug = 'eating-competition' THEN '/events/eating-competition.jpg'
  WHEN slug = 'hiking-competition' THEN '/events/hiking.jpg'
  WHEN slug = 'miss-groovy-december' THEN '/events/miss-groovy-december.jpg'
  WHEN slug = 'snooker-competition' THEN '/events/snooker.jpg'
  WHEN slug = 'suya-festival' THEN '/events/suya-festival.jpg'
  WHEN slug = 'traditional-boxing-competition' THEN '/events/traditional-boxing.jpg'
  WHEN slug = 'traditional-wrestling' THEN '/events/traditional-wrestling.jpg'
  ELSE image_url
END
WHERE slug IN (
  'art-craft-village', 'chess-competition', 'culture-fest', 'ea-market-place',
  'eating-competition', 'hiking-competition', 'miss-groovy-december',
  'snooker-competition', 'suya-festival', 'traditional-boxing-competition',
  'traditional-wrestling'
);
```