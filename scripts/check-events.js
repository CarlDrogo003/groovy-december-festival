const { createClient } = require('@supabase/supabase-js');

// You'll need to add your Supabase credentials here
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkEvents() {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('slug, title, category')
      .order('category');

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    console.log('All events by category:');
    console.log('========================');
    
    // Group events by category
    const eventsByCategory = events.reduce((acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    }, {});

    Object.keys(eventsByCategory).sort().forEach(category => {
      console.log(`\n${category}:`);
      eventsByCategory[category].forEach(event => {
        console.log(`  - ${event.title} (${event.slug})`);
      });
    });

    // Specifically check for events that should be in States Events
    console.log('\n\nEvents that might belong to States Events:');
    console.log('==========================================');
    const potentialStatesEvents = events.filter(event => 
      event.title.toLowerCase().includes('traditional') ||
      event.title.toLowerCase().includes('boxing') ||
      event.title.toLowerCase().includes('wrestling') ||
      event.category === 'Traditional'
    );
    
    potentialStatesEvents.forEach(event => {
      console.log(`- ${event.title} (${event.slug}) - Current category: ${event.category}`);
    });

  } catch (err) {
    console.error('Error:', err);
  }
}

checkEvents();