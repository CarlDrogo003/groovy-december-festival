const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: './.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
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

const events = [
  {
    title: "Tech Hub",
    description: "Step into the Tech Hub, the ultimate marketplace for cutting-edge gadgets and groundbreaking innovations. From visionary startups to industry leaders, this is where technology comes alive - offering you the chance to explore, experience, and own the latest tools shaping the future.",
    location: "Main Bowl Entrance",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Technology"
  },
  {
    title: "EA Market Place",
    description: "The EA Market Place is Abuja's ultimate fusion of shopping and entertainment, bringing together over 360 brands, shops, and vendors in a vibrant boulevard of fashion, lifestyle, and culture.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31", 
    registration_fee: 960000,
    category: "Marketplace"
  },
  {
    title: "Food Court 1 & 2",
    description: "The Food Court is a feast of flavors, serving up the very best of Nigerian cuisines in one buzzing marketplace. Every bite is an adventure.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Marketplace"
  },
  {
    title: "Culture Fest",
    description: "The Culture Fest at the National Stadium is a nonstop celebration of Nigeria's rich heritage, where tribes from across the 36 states take the stage for one hour each, 24 hours daily.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Cultural"
  },
  {
    title: "Art & Craft Village",
    description: "Discover the Art & Craft Village, a vibrant showcase of creativity where tradition meets innovation. From handwoven fabrics and intricate beadwork to sculptures, paintings, and timeless carvings.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Cultural"
  },
  {
    title: "Kiddies Park",
    description: "Step into the Kiddies Park, a wonderland of fun, laughter, and imagination designed just for children. From thrilling rides and colorful games to creative play zones.",
    location: "Main Bowl Front Car Park",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 10000000,
    category: "Family"
  },
  {
    title: "Miss Groovy December",
    description: "The Miss Groovy December is the crown jewel of elegance, confidence, and cultural pride. More than just beauty, it's a celebration of intellect, talent, and purpose.",
    location: "Main Bowl Front Car Park",
    start_date: "2025-12-22",
    end_date: "2025-12-22",
    registration_fee: 250000,
    category: "Pageant"
  },
  {
    title: "VVIP Court",
    description: "The VVIP Court is the ultimate haven of luxury, exclusivity, and prestige. Designed for Abuja's elite, it offers an unrivaled experience with premium hospitality.",
    location: "Training Pitch 2",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 1500000,
    category: "VIP"
  },
  {
    title: "Drag Race Competition",
    description: "Feel the adrenaline at the Motorsport Show, where speed, power, and precision take center stage. High-octane drag racing competition.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-17",
    end_date: "2025-12-17",
    registration_fee: 100000,
    category: "Automotive"
  },
  {
    title: "Groovy Go Karting Competition",
    description: "Exciting go-karting competition featuring speed and precision racing on professional tracks.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-19",
    end_date: "2025-12-19",
    registration_fee: null,
    category: "Automotive"
  },
  {
    title: "Groovy Drift Wars Competition",
    description: "Professional drift competition showcasing skill, style, and precision in motorsport excellence.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-21",
    end_date: "2025-12-21",
    registration_fee: 500000,
    category: "Automotive"
  },
  {
    title: "Auto Cross Competition",
    description: "Navigate through challenging courses in this exciting auto cross racing competition.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-23",
    end_date: "2025-12-23",
    registration_fee: 20000,
    category: "Automotive"
  },
  {
    title: "Motorbike 600cc Competition",
    description: "High-speed motorcycle racing competition featuring 600cc bikes and professional riders.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-24",
    end_date: "2025-12-24",
    registration_fee: 100000,
    category: "Automotive"
  },
  {
    title: "Rally Cross Competition",
    description: "Off-road rally competition combining speed, skill, and endurance across challenging terrain.",
    location: "Stadium/Eagle Square",
    start_date: "2025-12-25",
    end_date: "2025-12-25",
    registration_fee: null,
    category: "Automotive"
  },
  {
    title: "Football Competitions",
    description: "The Football Competitions bring unmatched excitement as teams battle it out in a clash of skill, speed, and strategy.",
    location: "Main Bowl",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: null,
    category: "Sports"
  },
  {
    title: "Tea Festival",
    description: "The Tea Festival is a serene yet vibrant celebration of flavor, culture, and connection. From rich local brews to exotic blends from around the world.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Festival"
  },
  {
    title: "Ice Cream Festival",
    description: "The Ice Cream Festival is a sweet escape into a world of flavor, fun, and indulgence. From classic scoops to exotic creations.",
    location: "Main Bowl Front Car Park",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 960000,
    category: "Festival"
  },
  {
    title: "Local Games Arena",
    description: "The Local Games Arena is a lively celebration of heritage, skill, and community spirit. From ayo and suwe to tug-of-war, and other timeless classics.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: null,
    category: "Cultural"
  },
  {
    title: "Hiking Competition",
    description: "Get ready for the Hiking Competition, an adrenaline-charged adventure that pushes strength, stamina, and spirit to the limit.",
    location: "Twin Mountains/Karshi",
    start_date: "2025-12-16",
    end_date: "2025-12-16",
    registration_fee: 5000,
    category: "Adventure"
  },
  {
    title: "Fishing Competition",
    description: "The EA Fishing Competition is a thrilling blend of sport, skill, and serenity set against Abuja's scenic waters.",
    location: "Kaspaland",
    start_date: "2025-12-18",
    end_date: "2025-12-18",
    registration_fee: null,
    category: "Adventure"
  },
  {
    title: "Chess Competition",
    description: "Strategic battle of minds featuring chess masters competing for ultimate intellectual supremacy.",
    location: "Stadium",
    start_date: "2025-12-29",
    end_date: "2025-12-29",
    registration_fee: 20000,
    category: "Sports"
  },
  {
    title: "Scrabble Competition",
    description: "The Scrabble Competition is a battle of words, wit, and strategy where every tile counts.",
    location: "Velodrome",
    start_date: "2025-12-29",
    end_date: "2025-12-29",
    registration_fee: 500000,
    category: "Sports"
  },
  {
    title: "Snooker Competition",
    description: "The Snooker Competition is a showcase of precision, focus, and finesse where every shot matters.",
    location: "Velodrome",
    start_date: "2025-12-29",
    end_date: "2025-12-29",
    registration_fee: 1000000,
    category: "Sports"
  },
  {
    title: "Eating Competition",
    description: "Fast-paced eating competition testing speed, capacity, and competitive spirit.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-19",
    end_date: "2025-12-19",
    registration_fee: 10000,
    category: "Entertainment"
  },
  {
    title: "Camping Experience 1",
    description: "The Camping Experience is an escape into nature's embrace, where adventure meets serenity under the open sky.",
    location: "Hockey Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 30000,
    category: "Adventure"
  },
  {
    title: "Camping Experience 2 - Kaspaland",
    description: "The Camping Experience at Kaspaland is a magical adventure set in one of Abuja's most enchanting outdoor escapes.",
    location: "Kaspaland",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 30000,
    category: "Adventure"
  },
  {
    title: "First Lady's Day",
    description: "The First Lady's Day is a grand celebration of grace, leadership, and impact, honoring the remarkable roles of Nigeria's First Ladies.",
    location: "SIA1 Pitch",
    start_date: "2025-12-15",
    end_date: "2025-12-16",
    registration_fee: null,
    category: "Official"
  },
  {
    title: "FCT Minister's Day",
    description: "The FCT Minister's Day is a prestigious celebration of vision, leadership, and progress, dedicated to honoring the Federal Capital Territory's leadership.",
    location: "SIA1 Pitch",
    start_date: "2025-12-23",
    end_date: "2025-12-23",
    registration_fee: null,
    category: "Official"
  },
  {
    title: "Suya Festival",
    description: "The Suya Festival is a sizzling celebration of Nigeria's most beloved street delicacy, where fire, spice, and flavor take center stage.",
    location: "Stadium/Karshi",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 350000,
    category: "Festival"
  },
  {
    title: "Traditional Boxing Competition",
    description: "Enter the electrifying world of traditional boxing where warriors become legends and every punch echoes with the spirit of the ancestors.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-28",
    end_date: "2025-12-31",
    registration_fee: 20000000,
    category: "Cultural"
  },
  {
    title: "Traditional Wrestling",
    description: "Experience the timeless spirit of traditional wrestling, where strength, pride, and heritage come alive in the sand.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: null,
    category: "Cultural"
  },
  {
    title: "Traditional Dance Competition",
    description: "Spectacular showcase of Nigeria's cultural diversity, where each state takes the stage to express its heritage through rhythm, costume, and movement.",
    location: "SIA 1 Pitch",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: null,
    category: "Cultural"
  },
  {
    title: "Raffle Draws",
    description: "The Abuja Groovy December Raffle Draw is set to light up the festival with unbeatable excitement and life-changing rewards! 12 brand-new tricycles up for grabs.",
    location: "Stadium",
    start_date: "2025-12-16",
    end_date: "2025-12-31",
    registration_fee: 10000,
    category: "Entertainment"
  },
  {
    title: "Hackathon",
    description: "The Groovy December Hackathon is a high-energy tech showdown where brilliant minds race against time to build innovative apps to promote tourism in Nigeria.",
    location: "Stadium",
    start_date: "2025-12-23",
    end_date: "2025-12-23",
    registration_fee: null,
    category: "Technology"
  },
  {
    title: "EA Investment Forum",
    description: "The Groovy December Investment Forum is a premier gathering of visionaries, entrepreneurs, and industry leaders designed to spark opportunities and drive growth.",
    location: "Transcorp Sheraton",
    start_date: "2025-12-27",
    end_date: "2025-12-27",
    registration_fee: null,
    category: "Business"
  }
];

async function populateEvents() {
  try {
    console.log('Starting to populate events...');
    
    // Clear existing events (optional)
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); 
    
    if (deleteError) {
      console.log('Note: Could not clear existing events:', deleteError.message);
    } else {
      console.log('Cleared existing events');
    }

    // Insert new events with generated slugs
    const eventsWithSlugs = events.map(event => ({
      title: event.title,
      description: event.description,
      venue: event.location,
      date: event.start_date,
      slug: event.title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim('-'),
      category: event.category,
      price: event.registration_fee
    }));

    const { data, error } = await supabase
      .from('events')
      .insert(eventsWithSlugs)
      .select();

    if (error) {
      console.error('Error inserting events:', error);
      return;
    }

    console.log(`Successfully inserted ${data.length} events!`);
    console.log('Sample events:');
    data.slice(0, 5).forEach(event => {
      console.log(`- ${event.title} (${event.category}) - ${event.date} - ${event.venue}`);
    });

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the population script
populateEvents();