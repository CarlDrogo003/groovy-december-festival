# Fix for States Events Category

## Problem
The "States Events" category appears empty because the events `traditional-boxing-competition` and `traditional-wrestling` don't exist in the database yet.

## Solution
Add the missing traditional events to your Supabase database.

### Steps:

1. **Open Supabase Dashboard**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor" in the left sidebar

2. **Run the SQL Script**
   - Copy the contents of `database/traditional-events.sql`
   - Paste it into the SQL Editor
   - Click "Run" to execute the script

3. **Verify the Events**
   - Go to "Table Editor" > "events" table
   - You should see the new events:
     - Traditional Boxing Competition (slug: traditional-boxing-competition)
     - Traditional Wrestling Championship (slug: traditional-wrestling)
   - Both should have category "Traditional"

### Alternative: Quick Fix
If you prefer to test without adding to database, you can temporarily modify the code to map existing events to "States Events":

In `src/app/events/EventsClientPage.tsx`, find the line:
```jsx
const updatedCategory = event.category === 'Traditional' ? 'States Events' : event.category;
```

And replace it with:
```jsx
const updatedCategory = event.category === 'Traditional' ? 'States Events' : 
  (event.category === 'Cultural' && (event.slug === 'traditional-dance-competition')) ? 'States Events' : 
  event.category;
```

This will temporarily move the "Traditional Dance Competition" to "States Events" for testing.

### Current Image Mapping
The following events have images ready:
- traditional-boxing-competition → `/events/traditional-boxing.jpg`
- traditional-wrestling → `/events/traditional-wrestling.jpg`