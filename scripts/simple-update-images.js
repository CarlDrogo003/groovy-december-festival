/**
 * Simple Event Images Update Script
 * Updates only the events that have matching images in the public/events folder
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map only the images you've actually uploaded
const AVAILABLE_IMAGES = {
  'art-craft-village': 'art-craft-village.jpg',
  'chess-competition': 'chess.jpg',
  'culture-fest': 'culture-fest.jpg',
  'ea-market-place': 'ea-market-place.jpg',
  'eating-competition': 'eating-competition.jpg',
  'hiking-competition': 'hiking.jpg',
  'miss-groovy-december': 'miss-groovy-december.jpg',
  'snooker-competition': 'snooker.jpg',
  'suya-festival': 'suya-festival.jpg',
  'traditional-boxing-competition': 'traditional-boxing.jpg',
  'traditional-wrestling': 'traditional-wrestling.jpg'
};

async function updateEventImages() {
  console.log('🎨 Starting focused event images update...');
  
  let updatedCount = 0;
  let skippedCount = 0;

  try {
    // Get all events
    const { data: events, error } = await supabase
      .from('events')
      .select('id, title, slug, image_url');

    if (error) {
      console.error('❌ Error fetching events:', error);
      return;
    }

    console.log(`📋 Found ${events.length} events total`);
    console.log(`🖼️  Have ${Object.keys(AVAILABLE_IMAGES).length} images to assign\n`);

    for (const event of events) {
      // Check if we have an image for this event
      const imageFilename = AVAILABLE_IMAGES[event.slug];
      
      if (!imageFilename) {
        // Skip silently - no image available
        continue;
      }

      // Skip if already has an image
      if (event.image_url) {
        console.log(`⏭️  Skipping "${event.title}" - already has image`);
        skippedCount++;
        continue;
      }

      // Update event with image URL
      const imageUrl = `/events/${imageFilename}`;
      
      console.log(`🔄 Updating "${event.title}" with ${imageFilename}...`);
      
      const { error: updateError } = await supabase
        .from('events')
        .update({ image_url: imageUrl })
        .eq('id', event.id)
        .select('id');

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

    if (updatedCount > 0) {
      console.log('\n🔍 Updated Events:');
      Object.entries(AVAILABLE_IMAGES).forEach(([slug, filename]) => {
        console.log(`   • ${slug} → ${filename}`);
      });
    }

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the update
updateEventImages();