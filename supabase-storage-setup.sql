-- Supabase Storage Buckets Setup
-- Run these commands in your Supabase SQL Editor

-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('pageant-files', 'pageant-files', true),
  ('event-banners', 'event-banners', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for pageant files
CREATE POLICY "Public can view pageant files" ON storage.objects
FOR SELECT USING (bucket_id = 'pageant-files');

CREATE POLICY "Authenticated users can upload pageant files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'pageant-files' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update their own pageant files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'pageant-files' 
  AND auth.uid() = owner
);

CREATE POLICY "Users can delete their own pageant files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'pageant-files' 
  AND auth.uid() = owner
);

-- Storage policies for event banners (admin only)
CREATE POLICY "Public can view event banners" ON storage.objects
FOR SELECT USING (bucket_id = 'event-banners');

CREATE POLICY "Admins can manage event banners" ON storage.objects
FOR ALL USING (
  bucket_id = 'event-banners' 
  AND EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = auth.email() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Row Level Security policies for pageant contestants
-- (These should already be in place if you ran the previous schema)

-- Allow public to read approved contestants
CREATE POLICY "Public can view approved contestants" ON pageant_contestants
FOR SELECT USING (status = 'approved');

-- Allow users to insert their own applications
CREATE POLICY "Users can submit pageant applications" ON pageant_contestants
FOR INSERT WITH CHECK (true); -- Anyone can apply

-- Allow users to update their own pending applications (based on email match)
CREATE POLICY "Users can update own pending applications" ON pageant_contestants
FOR UPDATE USING (
  status = 'pending' 
  AND auth.email() = email
);

-- Allow admins to manage all contestant records
CREATE POLICY "Admins can manage contestants" ON pageant_contestants
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE email = auth.email() 
    AND role IN ('super_admin', 'admin')
  )
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_pageant_contestants_status ON pageant_contestants(status);
CREATE INDEX IF NOT EXISTS idx_pageant_contestants_nationality ON pageant_contestants(nationality);
CREATE INDEX IF NOT EXISTS idx_pageant_contestants_created_at ON pageant_contestants(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_pageant_contestants_updated_at ON pageant_contestants;
CREATE TRIGGER update_pageant_contestants_updated_at
    BEFORE UPDATE ON pageant_contestants
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger to automatically update updated_at for events
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- Uncomment these if you want some test contestants


INSERT INTO pageant_contestants (
  full_name, stage_name, email, phone, date_of_birth, nationality, 
  biography, why, platform, status
) VALUES 
(
  'Jane Smith', 
  'Miss Elegance', 
  'jane@example.com', 
  '+1234567890',
  '1995-05-15',
  'American',
  'A passionate advocate for education and women empowerment. Born and raised in California, I have dedicated my life to making a positive impact in my community.',
  'I am competing to use this platform to advocate for educational opportunities for underprivileged children. I believe every child deserves access to quality education.',
  'Educational Equity - Working to ensure all children have access to quality education regardless of their socioeconomic background.',
  'approved'
),
(
  'Maria Garcia', 
  'Miss Sunshine', 
  'maria@example.com', 
  '+1234567891',
  '1997-08-22',
  'Mexican',
  'A dedicated environmentalist and community leader. I have been working with local organizations to promote sustainable living and environmental awareness.',
  'This pageant represents an opportunity to amplify my voice for environmental conservation and inspire others to take action for our planet.',
  'Environmental Conservation - Promoting sustainable practices and raising awareness about climate change in local communities.',
  'approved'
),
(
  'Sarah Johnson', 
  'Miss Inspiration', 
  'sarah@example.com', 
  '+1234567892',
  '1996-12-03',
  'Canadian',
  'A healthcare worker and mental health advocate. Having personally overcome challenges with anxiety, I now dedicate my time to helping others find their strength.',
  'I want to use this platform to break the stigma around mental health and show that it is okay to seek help when you need it.',
  'Mental Health Awareness - Advocating for better mental health resources and working to eliminate stigma around mental health issues.',
  'approved'
);
