require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Helper function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim('-');
}

// Events data from your CSV - curated selection
const events = [
  {
    title: "Tech Hub",
    slug: "tech-hub",
    description: "Step into the Tech Hub, the ultimate marketplace for cutting-edge gadgets and groundbreaking innovations. From visionary startups to industry leaders, this is where technology comes alive - offering you the chance to explore, experience, and own the latest tools shaping the future.",
    venue: "Main Bowl Entrance",
    date: "2025-12-16"
  },
  {
    title: "EA Market Place",
    slug: "ea-market-place",
    description: "The EA Market Place is Abuja's ultimate fusion of shopping and entertainment, bringing together over 360 brands, shops, and vendors in a vibrant boulevard of fashion, lifestyle, and culture. At its core, the dazzling EA Runway showcases African pride and modern elegance.",
    venue: "SIA 1 Pitch",
    date: "2025-12-16"
  },
  {
    title: "Food Court",
    slug: "food-court",
    description: "The Food Court is a feast of flavors, serving up the very best of Nigerian cuisines in one buzzing marketplace. Every bite is an adventure. It's not just about eating—it's about indulging, discovering, and celebrating the tastes that bring people together.",
    venue: "SIA 1 & 2 Pitch",
    date: "2025-12-16"
  },
  {
    title: "Culture Fest",
    slug: "culture-fest",
    description: "The Culture Fest at the National Stadium is a nonstop celebration of Nigeria's rich heritage, where tribes from across the 36 states take the stage for one hour each, 24 hours daily. Audiences will be immersed in the beauty of masquerade displays, traditional music, vibrant costumes, folklore, and powerful native oratory.",
    venue: "National Stadium",
    date: "2025-12-16"
  },
  {
    title: "Art & Craft Village",
    slug: "art-craft-village", 
    description: "Discover the Art & Craft Village, a vibrant showcase of creativity where tradition meets innovation. From handwoven fabrics and intricate beadwork to sculptures, paintings, and timeless pottery, this village celebrates the artistic soul of Africa.",
    venue: "SIA 1 Pitch",
    date: "2025-12-16"
  },
  {
    title: "Gaming Hub",
    slug: "gaming-hub",
    description: "The Gaming Hub is the epicenter of digital entertainment, where cutting-edge technology meets competitive spirit. From console tournaments to virtual reality adventures, gamers of all levels can immerse themselves in the ultimate gaming experience.",
    venue: "Tech Center",
    date: "2025-12-17"
  },
  {
    title: "Fashion Show",
    slug: "fashion-show",
    description: "Experience the pinnacle of African fashion at our spectacular runway show. Featuring renowned designers and emerging talents, witness stunning collections that blend traditional African aesthetics with contemporary global trends.",
    venue: "Grand Ballroom",
    date: "2025-12-20"
  },
  {
    title: "Business Summit",
    slug: "business-summit",
    description: "Join industry leaders, entrepreneurs, and innovators at the Business Summit. Network with key players, attend insightful panels, and discover groundbreaking opportunities that are shaping the future of African business.",
    venue: "Conference Center",
    date: "2025-12-22"
  },
  {
    title: "Miss Groovy December Pageant",
    slug: "miss-groovy-december-pageant",
    description: "Witness the crowning of Miss Groovy December in a spectacular celebration of African beauty, intelligence, and talent. Our contestants will compete in various rounds showcasing their grace, intellect, and cultural pride.",
    venue: "Main Arena",
    date: "2025-12-28"
  },
  {
    title: "EA Investment Forum",
    slug: "ea-investment-forum",
    description: "The Groovy December Investment Forum is a premier gathering of visionaries, entrepreneurs, and industry leaders designed to spark opportunities and drive growth. With insightful panels, networking sessions, and groundbreaking ideas on display, the forum connects investors with innovators across key sectors.",
    venue: "Transcorp Sheraton",
    date: "2025-12-27"
  },
  {
    title: "Football Tournament",
    slug: "football-tournament",
    description: "Get ready for high-energy football matches featuring local teams and special celebrity appearances. Feel the excitement and community spirit as teams compete for the prestigious Groovy December Cup.",
    venue: "Sports Complex",
    date: "2025-12-19"
  },
  {
    title: "Comedy Night",
    slug: "comedy-night",
    description: "Laugh until your sides hurt with some of Nigeria's funniest comedians and surprise international guests. An evening of pure entertainment, joy, and unforgettable moments that will leave you smiling for days.",
    venue: "Entertainment Pavilion",
    date: "2025-12-24"
  }
];

async function populateEvents() {
  try {
    console.log('🚀 Starting to populate events...');
    
    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('events')
      .select('count', { count: 'exact', head: true });
    
    if (testError) {
      console.error('❌ Connection failed:', testError.message);
      return;
    }
    
    console.log('✅ Connected to database successfully');
    
    // Clear existing events
    console.log('🧹 Clearing existing events...');
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError && deleteError.code !== 'PGRST116') {
      console.log('⚠️  Note:', deleteError.message);
    }
    
    // Insert new events
    console.log(`📝 Inserting ${events.length} events...`);
    const { data, error } = await supabase
      .from('events')
      .insert(events)
      .select();
    
    if (error) {
      console.error('❌ Error inserting events:', error);
      return;
    }
    
    console.log(`🎉 Successfully populated ${events.length} events!`);
    console.log('\n📋 Events added:');
    events.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} - ${event.venue} (${event.date})`);
    });
    
    console.log('\n✨ Your events page is now ready!');
    console.log('🌐 Visit /events to see the beautiful new design');
    
  } catch (err) {
    console.error('💥 Script error:', err);
  }
}

// Run the script
populateEvents();