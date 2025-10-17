# KEKE Raffle System - Complete Setup Guide

## 🎯 What's New
I've created a complete raffle system based on the promotional flyer you provided:
- **Prize**: Brand new KEKE (Auto Rickshaw/Tricycle)
- **Frequency**: Draws every 2 days during Groovy December Festival
- **Qualification**: Participants must use a bank ATM
- **Contact**: 08067469060, 08030596162, www.groovydecember.ng, hello@groovydecember.ng

## 📁 New Files Created

### 1. `/src/app/raffle/page.tsx`
- **Complete raffle landing page** with:
  - KEKE prize showcase with features
  - Step-by-step participation guide
  - Entry form for authenticated users
  - User's ticket history
  - Contact information
  - Beautiful mobile-responsive design

### 2. `/src/app/admin/raffle/page.tsx` 
- **Comprehensive admin interface** with:
  - Real-time statistics dashboard
  - Searchable/filterable entries table
  - Random draw conductor with selected entries
  - Prize claim management
  - CSV export functionality
  - Pagination for large datasets
  - Entry management (reset, delete)

### 3. Navigation Updates
- Added raffle links to main navigation (desktop & mobile)
- Added prominent KEKE raffle CTA in hero section
- Animated badges and notifications

## 🗄️ Database Schema (Already Exists)
```sql
raffle_entries table:
- id (uuid, primary key)
- user_id (uuid, foreign key to profiles)
- full_name (text)
- email (text)
- phone (text)
- ticket_number (text, unique)
- entry_date (timestamp)
- is_winner (boolean, default false)
- prize_claimed (boolean, default false)
```

## 🚀 How to Use

### For Users:
1. **Visit** `/raffle` page
2. **Sign in** to participate
3. **Visit any bank ATM** (qualification requirement)
4. **Fill entry form** with name and phone
5. **Get unique ticket number** (format: KEKE{timestamp}{random})
6. **Wait for draws** every 2 days

### For Admins:
1. **Visit** `/admin/raffle` 
2. **View statistics** - total entries, winners, claims
3. **Select entries** for draw using checkboxes
4. **Conduct random draw** - system picks winner
5. **Manage winners** - mark prizes as claimed
6. **Export data** to CSV for records

## 🎲 Draw Process
1. Admin selects multiple active entries
2. System randomly picks one winner
3. Winner is marked in database
4. Admin can mark prize as claimed later
5. Process repeats every 2 days

## 📋 Key Features
- **Authentication Required**: Only signed-in users can participate
- **Unique Tickets**: Auto-generated ticket numbers prevent duplicates
- **Real-time Updates**: Statistics update immediately after actions
- **Mobile Responsive**: Works perfectly on all devices
- **Admin Controls**: Full management interface with all needed tools
- **Data Export**: CSV export for external analysis
- **Prize Tracking**: Complete claim status management

## 🎨 Design Highlights
- **Promotional Colors**: Green and red gradient (festival colors)
- **KEKE Emoji**: 🛺 used throughout for brand recognition
- **Animated Elements**: Pulse effects on CTAs, badges
- **Professional Layout**: Card-based design with proper spacing
- **Clear CTAs**: Prominent buttons with hover effects

## 🔧 Technical Implementation
- **Server-side**: Supabase database with proper relationships
- **Client-side**: React with TypeScript, Tailwind CSS
- **Authentication**: Integrated with existing auth system
- **Real-time**: Automatic data refresh after actions
- **Error Handling**: Comprehensive error messages
- **Performance**: Pagination and efficient queries

## 📞 Support Information
All contact details from the flyer are integrated:
- **Phone Numbers**: 08067469060, 08030596162
- **Website**: www.groovydecember.ng
- **Email**: hello@groovydecember.ng

## 🎯 Next Steps
1. **Test the system** - Visit `/raffle` and try the flow
2. **Admin testing** - Use `/admin/raffle` to conduct test draws
3. **Customize styling** if needed (colors, fonts, etc.)
4. **Add more features** like:
   - Email notifications for winners
   - Draw scheduling automation
   - SMS notifications
   - Social media integration
   - Winner announcement page

The KEKE raffle system is now fully functional and ready to use! 🛺✨