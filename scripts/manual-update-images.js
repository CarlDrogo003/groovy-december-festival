/**
 * Manual Database Update for Event Images
 * Direct approach without automatic timestamp updates
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client with bypass RLS for service operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Images you've uploaded
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

async function manualUpdate() {
  console.log('🎨 Manual event images update...');
  
  let updatedCount = 0;

  try {
    // Process each image mapping individually
    for (const [slug, filename] of Object.entries(AVAILABLE_IMAGES)) {
      console.log(`\n🔄 Processing: ${slug} → ${filename}`);
      
      // First, find the event
      const { data: events, error: selectError } = await supabase
        .from('events')
        .select('id, title, slug')
        .eq('slug', slug)
        .limit(1);

      if (selectError) {
        console.error(`❌ Error finding event "${slug}":`, selectError.message);
        continue;
      }

      if (!events || events.length === 0) {
        console.log(`⚠️  No event found with slug: ${slug}`);
        continue;
      }

      const event = events[0];
      const imageUrl = `/events/${filename}`;

      // Update using raw SQL to bypass any schema issues
      const { error: updateError } = await supabase
        .rpc('update_event_image', {
          event_id: event.id,
          new_image_url: imageUrl
        });

      if (updateError) {
        // If RPC doesn't exist, try direct update with minimal fields
        console.log(`📝 Trying direct update for "${event.title}"...`);
        
        const { error: directError } = await supabase
          .from('events')
          .update({ image_url: imageUrl })
          .eq('id', event.id)
          .select('id')
          .maybeSingle();

        if (directError) {
          console.error(`❌ Failed to update "${event.title}":`, directError.message);
          continue;
        }
      }

      console.log(`✅ Updated "${event.title}" with: ${imageUrl}`);
      updatedCount++;
    }

    console.log(`\n🎉 Manual update completed!`);
    console.log(`✅ Successfully updated: ${updatedCount} events`);

  } catch (error) {
    console.error('❌ Script error:', error);
  }
}

// Run the manual update
manualUpdate();