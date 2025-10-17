/**
 * Event Images Bulk Update Script
 * 
 * Instructions:
 * 1. Place your images in public/events/ folder
 * 2. Update the IMAGE_MAPPINGS object below with your actual image filenames
 * 3. Run: npm run update-event-images
 * 
 * Image naming convention:
 * - Use descriptive names like 'music-concert.jpg', 'food-festival.jpg'
 * - Supported formats: .jpg, .jpeg, .png, .webp
 * - Recommended size: 1200x800px (3:2 aspect ratio)
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map event titles/slugs to image filenames
// UPDATE THIS MAPPING WITH YOUR ACTUAL IMAGE FILENAMES
const IMAGE_MAPPINGS = {
  // Main Festival Areas
  'tech-hub': 'tech-hub.jpg',
  'ea-market-place': 'ea-market-place.jpg',
  'food-court-1-2': 'food-court.jpg',
  'culture-fest': 'culture-fest.jpg',
  'art-craft-village': 'art-craft-village.jpg',
  'kiddies-park': 'kiddies-park.jpg',
  'miss-groovy-december': 'miss-groovy-december.jpg',
  'vvip-court': 'vvip-court.jpg',
  
  // Automotive Competitions
  'drag-race-competition': 'drag-race.jpg',
  'groovy-go-karting-competition': 'go-karting.jpg',
  'groovy-drift-wars-competition': 'drift-wars.jpg',
  'auto-cross-competition': 'auto-cross.jpg',
  'motorbike-600cc-competition': 'motorbike-600cc.jpg',
  'rally-cross-competition': 'rally-cross.jpg',
  
  // Sports & Games
  'football-competitions': 'football.jpg',
  'local-games-arena': 'local-games.jpg',
  'hiking-competition': 'hiking.jpg',
  'fishing-competition': 'fishing.jpg',
  'chess-competition': 'chess.jpg',
  'scrabble-competition': 'scrabble.jpg',
  'snooker-competition': 'snooker.jpg',
  'eating-competition': 'eating-competition.jpg',
  
  // Food Festivals
  'tea-festival': 'tea-festival.jpg',
  'ice-cream-festival': 'ice-cream-festival.jpg',
  'suya-festival': 'suya-festival.jpg',
  
  // Camping & Experiences
  'camping-experience-1': 'camping-experience.jpg',
  'camping-experience-2-kaspaland': 'camping-kaspaland.jpg',
  
  // Special Events
  'first-ladys-day': 'first-lady-day.jpg',
  'fct-ministers-day': 'fct-minister-day.jpg',
  'raffle-draws': 'raffle-draws.jpg',
  'hackathon': 'hackathon.jpg',
  'ea-investment-forum': 'investment-forum.jpg',
  
  // Traditional Events
  'traditional-boxing-competition': 'traditional-boxing.jpg',
  'traditional-wrestling': 'traditional-wrestling.jpg',
  'traditional-dance-competition': 'traditional-dance.jpg',
  
  // Alternative naming (you can use either slug or title)
  'Tech Hub': 'tech-hub.jpg',
  'EA Market Place': 'ea-market-place.jpg',
  'Food Court 1 & 2': 'food-court.jpg',
  'Culture Fest': 'culture-fest.jpg',
};

async function updateEventImages() {
  try {
    console.log('🎨 Starting event images update...');
    
    // Fetch all events
    const { data: events, error: fetchError } = await supabase
      .from('events')
      .select('id, title, slug, image_url');
    
    if (fetchError) {
      throw new Error(`Failed to fetch events: ${fetchError.message}`);
    }
    
    console.log(`📋 Found ${events.length} events to process`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const event of events) {
      // Skip if already has an image
      if (event.image_url) {
        console.log(`⏭️  Skipping "${event.title}" - already has image`);
        skippedCount++;
        continue;
      }
      
      // Find matching image using slug or title
      const imageFilename = IMAGE_MAPPINGS[event.slug] || IMAGE_MAPPINGS[event.title];
      
      if (!imageFilename) {
        console.log(`❌ No image mapping found for "${event.title}" (slug: ${event.slug})`);
        skippedCount++;
        continue;
      }
      
      // Update event with image URL
      const imageUrl = `/events/${imageFilename}`;
      const { error: updateError } = await supabase
        .from('events')
        .update({ image_url: imageUrl })
        .eq('id', event.id);
      
      if (updateError) {
        console.error(`❌ Failed to update "${event.title}": ${updateError.message}`);
        continue;
      }
      
      console.log(`✅ Updated "${event.title}" with image: ${imageUrl}`);
      updatedCount++;
    }
    
    console.log('\n🎉 Event images update completed!');
    console.log(`✅ Updated: ${updatedCount} events`);
    console.log(`⏭️  Skipped: ${skippedCount} events`);
    
    if (skippedCount > 0) {
      console.log('\n💡 To update more events:');
      console.log('1. Add more mappings to IMAGE_MAPPINGS object');
      console.log('2. Place corresponding images in public/events/ folder');
      console.log('3. Run this script again');
    }
    
  } catch (error) {
    console.error('❌ Error updating event images:', error.message);
  }
}

// Helper function to list current events (for reference)
async function listCurrentEvents() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, slug, image_url')
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    console.log('\n📋 Current Events List:');
    console.log('='.repeat(50));
    
    events.forEach((event, index) => {
      const hasImage = event.image_url ? '🖼️' : '❌';
      console.log(`${index + 1}. ${hasImage} "${event.title}" (slug: ${event.slug})`);
      if (event.image_url) {
        console.log(`   Image: ${event.image_url}`);
      }
    });
    
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('Error listing events:', error.message);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'list') {
  listCurrentEvents();
} else if (command === 'update') {
  updateEventImages();
} else {
  console.log('🎨 Event Images Management Script');
  console.log('');
  console.log('Commands:');
  console.log('  node scripts/update-event-images.js list   - List all current events');
  console.log('  node scripts/update-event-images.js update - Update events with images');
  console.log('');
  console.log('Setup:');
  console.log('1. Place images in public/events/ folder');
  console.log('2. Update IMAGE_MAPPINGS in this script');
  console.log('3. Run update command');
}