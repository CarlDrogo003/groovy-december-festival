-- Add quantity columns to vendors table for tracking individual space types
-- Execute this SQL in your Supabase SQL editor

-- Add columns for tracking quantities of each space type
ALTER TABLE vendors 
ADD COLUMN premium_booth_qty INTEGER DEFAULT 0,
ADD COLUMN standard_booth_qty INTEGER DEFAULT 0,
ADD COLUMN food_kiosk_qty INTEGER DEFAULT 0;

-- Add comments to explain the columns
COMMENT ON COLUMN vendors.premium_booth_qty IS 'Number of premium booth spaces purchased';
COMMENT ON COLUMN vendors.standard_booth_qty IS 'Number of standard booth spaces purchased';
COMMENT ON COLUMN vendors.food_kiosk_qty IS 'Number of food kiosk spaces purchased';

-- Add constraints to ensure quantities are non-negative
ALTER TABLE vendors 
ADD CONSTRAINT check_premium_booth_qty_positive CHECK (premium_booth_qty >= 0),
ADD CONSTRAINT check_standard_booth_qty_positive CHECK (standard_booth_qty >= 0),
ADD CONSTRAINT check_food_kiosk_qty_positive CHECK (food_kiosk_qty >= 0);

-- Add an index for common queries involving quantities
CREATE INDEX idx_vendors_quantities ON vendors (premium_booth_qty, standard_booth_qty, food_kiosk_qty);

-- Add a computed column for total spaces purchased (optional)
ALTER TABLE vendors 
ADD COLUMN total_spaces_purchased INTEGER GENERATED ALWAYS AS (
  COALESCE(premium_booth_qty, 0) + 
  COALESCE(standard_booth_qty, 0) + 
  COALESCE(food_kiosk_qty, 0)
) STORED;

-- Sample query to test the new columns
-- SELECT business_name, premium_booth_qty, standard_booth_qty, food_kiosk_qty, total_spaces_purchased 
-- FROM vendors 
-- WHERE total_spaces_purchased > 0;