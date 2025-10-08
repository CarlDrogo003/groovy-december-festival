require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Simple events matching your original database schema
const simpleEvents = [
  {
    title: "Tech Hub",
    slug: "tech-hub",
    description: "Step into the Tech Hub, the ultimate marketplace for cutting-edge gadgets and groundbreaking innovations. From visionary startups to industry leaders, this is where technology comes alive.",
    venue: "Main Bowl Entrance",
    date: "2025-12-16"
  },
  {
    title: "EA Market Place",
    slug: "ea-market-place",
    description: "Abuja's ultimate fusion of shopping and entertainment, bringing together over 360 brands, shops, and vendors in a vibrant boulevard of fashion, lifestyle, and culture.",
    venue: "SIA 1 Pitch",
    date: "2025-12-20"
  },
  {
    title: "Food Court",
    slug: "food-court",
    description: "The Food Court is a feast of flavors, serving up the very best of Nigerian cuisines in one buzzing marketplace. Every bite is an adventure.",
    venue: "SIA 1 & 2 Pitch",
    date: "2025-12-16"
  },
  {
    title: "Culture Fest",
    slug: "culture-fest",
    description: "A nonstop celebration of Nigeria's rich heritage, where tribes from across the 36 states take the stage for one hour each, 24 hours daily.",
    venue: "National Stadium",
    date: "2025-12-18"
  },
  {
    title: "Miss Groovy December Pageant",
    slug: "miss-groovy-december-pageant",
    description: "The crown jewel of beauty pageants, celebrating African beauty, intelligence, and talent. Watch as contestants compete for the prestigious Miss Groovy December title.",
    venue: "Grand Ballroom",
    date: "2025-12-28"
  },
  {
    title: "EA Investment Forum",
    slug: "ea-investment-forum",
    description: "A premier gathering of visionaries, entrepreneurs, and industry leaders designed to spark opportunities and drive growth.",
    venue: "Transcorp Sheraton",
    date: "2025-12-27"
  }
];

async function populateSimpleEvents() {
  try {
    console.log('🚀 Starting to populate events with basic schema...');
    
    // Clear existing events
    console.log('🧹 Clearing existing events...');
    const { error: deleteError } = await supabase
      .from('events')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (deleteError) {
      console.log('Note: Could not clear existing events:', deleteError.message);
    } else {
      console.log('✅ Existing events cleared');
    }
    
    // Insert new events
    console.log(`📝 Inserting ${simpleEvents.length} events...`);
    const { data, error } = await supabase
      .from('events')
      .insert(simpleEvents)
      .select();
    
    if (error) {
      console.error('❌ Error inserting events:', error);
      return;
    }
    
    console.log(`🎉 Successfully added ${simpleEvents.length} events!`);
    console.log('📋 Events added:');
    simpleEvents.forEach((event, index) => {
      console.log(`   ${index + 1}. ${event.title} - ${event.venue}`);
    });
    
    console.log('\n✨ Database population completed successfully!');
    
  } catch (err) {
    console.error('💥 Script error:', err);
  }
}

populateSimpleEvents();