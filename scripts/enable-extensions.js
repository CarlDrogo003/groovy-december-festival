require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') });
const fs = require('fs').promises;
const path = require('path');
const fetch = require('node-fetch');

async function main() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL.match(/https:\/\/([^.]+)/)[1];
    
    // Enable extensions through the admin API
    for (const ext of ['pgcrypto', 'uuid-ossp']) {
      console.log(`Enabling ${ext}...`);
      
      const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/extensions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          name: ext,
          schema: 'extensions',
          version: 'latest'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error(`Warning: Failed to enable ${ext} via admin API:`, error);
        console.log(`Attempting direct SQL for ${ext}...`);
        
        // Fallback to direct SQL if admin API fails
        const sqlResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
            'Prefer': 'params=single-object'
          },
          body: JSON.stringify({
            query: `CREATE EXTENSION IF NOT EXISTS "${ext}";`
          })
        });

        if (!sqlResponse.ok) {
          const sqlError = await sqlResponse.text();
          console.error(`Failed to enable ${ext} via SQL:`, sqlError);
        } else {
          console.log(`Successfully enabled ${ext} via SQL`);
        }
      } else {
        console.log(`Successfully enabled ${ext} via admin API`);
      }
    }

    // Verify extensions are enabled by checking metadata tables
    const checkResponse = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'params=single-object'
      },
      body: JSON.stringify({
        query: `SELECT extname, extversion FROM pg_extension WHERE extname IN ('pgcrypto', 'uuid-ossp');`
      })
    });

    if (!checkResponse.ok) {
      throw new Error(`Failed to verify extensions: ${await checkResponse.text()}`);
    }

    const { result } = await checkResponse.json();
    console.log('\nEnabled extensions:', result?.rows || []);
    
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

main();