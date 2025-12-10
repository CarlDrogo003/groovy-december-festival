-- Update all events venue to Jabi Lake, Abuja
UPDATE events
SET 
  venue = 'Jabi Lake, Abuja',
  updated_at = NOW()
WHERE id IS NOT NULL;

-- Verify the update
SELECT id, name, venue, location FROM events ORDER BY date ASC;
