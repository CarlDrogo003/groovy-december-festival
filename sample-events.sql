-- Sample competition events for Groovy December Festival
-- These can be inserted into the events table in Supabase

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
  'Tech Startup Pitch Competition',
  'Present your innovative startup idea to industry leaders and investors. Compete for ₦5,000,000 in total prizes plus incubation opportunities. Teams of up to 5 members can participate in this high-stakes competition.',
  '2024-12-15',
  'Innovation Hub, Lagos',
  'Technology',
  50000,
  true,
  'tech-startup-pitch-competition',
  '/assets/flyers/tech-startup-pitch.png'
),
(
  'Fashion Design Showcase',
  'Design the future of African fashion! Showcase your creativity in this prestigious competition with ₦3,500,000 in prizes. Win a spot at Lagos Fashion Week and work with industry professionals.',
  '2024-12-20',
  'Fashion District, Victoria Island',
  'Cultural',
  75000,
  true,
  'fashion-design-showcase',
  '/assets/flyers/fashion-design-showcase.png'
),
(
  'DJ Battle Championship',
  'Drop the beat and win the crown! ₦2,500,000 in cash prizes awaits the ultimate DJ champion. Bring your best set and compete against the top DJs in Africa.',
  '2024-12-22',
  'Music Arena, Lagos Island',
  'Entertainment',
  35000,
  true,
  'dj-battle-championship',
  '/assets/flyers/dj-battle-championship.png'
),
(
  'African Cuisine Cook-Off',
  'Celebrate traditional flavors and culinary innovation! ₦4,000,000 in prizes for the master chefs who can blend tradition with creativity. Restaurant deals and cookbook opportunities await winners.',
  '2024-12-18',
  'Culinary Center, Ikeja',
  'Food',
  40000,
  true,
  'african-cuisine-cookoff',
  '/assets/flyers/african-cuisine-cookoff.png'
),
(
  'Art & Photography Contest',
  'Capture and create African stories through your lens and brush! ₦3,200,000 in combined prizes across multiple categories. Gallery exhibitions and features await the winners.',
  '2024-12-16',
  'Art Gallery, Victoria Island',
  'Cultural',
  25000,
  true,
  'art-photography-contest',
  '/assets/flyers/art-photography-contest.png'
),
(
  'Business Plan Competition',
  'Turn your business idea into reality! Present your business plan to investors and win ₦6,000,000 in total funding plus mentorship programs. Open to all entrepreneurs.',
  '2024-12-14',
  'Business Hub, Lekki',
  'Business',
  60000,
  false,
  'business-plan-competition',
  '/assets/flyers/business-plan-competition.png'
),
(
  'Traditional Dance Competition',
  'Celebrate African heritage through dance! ₦2,000,000 in prizes for the best traditional and contemporary African dance performances. Solo and group categories available.',
  '2024-12-19',
  'Cultural Center, Lagos',
  'Cultural',
  30000,
  false,
  'traditional-dance-competition',
  '/assets/flyers/traditional-dance-competition.png'
),
(
  'Young Entrepreneur Showcase',
  'For entrepreneurs under 25! Showcase your startup and win ₦1,500,000 plus mentorship from successful business leaders. The future of African business starts here.',
  '2024-12-17',
  'Youth Hub, Yaba',
  'Business',
  20000,
  false,
  'young-entrepreneur-showcase',
  '/assets/flyers/young-entrepreneur-showcase.png'
);