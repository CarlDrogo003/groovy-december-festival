# 🎨 Event Images Setup Guide

## Overview
This guide will help you add professional images to all your Groovy December Festival events. The images are already integrated into your website - you just need to add the actual image files.

## 📁 Step 1: Prepare Your Images

### Required Images List
Based on your current events, you need images for these categories:

#### 🏢 **Main Festival Areas** (8 images needed)
```
tech-hub.jpg              - Tech Hub showcase
ea-market-place.jpg       - EA Market Place
food-court.jpg            - Food Court 1 & 2
culture-fest.jpg          - Culture Fest
art-craft-village.jpg     - Art & Craft Village
kiddies-park.jpg          - Kiddies Park
miss-groovy-december.jpg  - Miss Groovy December pageant
vvip-court.jpg            - VVIP Court
```

#### 🏎️ **Automotive Competitions** (6 images needed)
```
drag-race.jpg             - Drag Race Competition
go-karting.jpg            - Groovy Go Karting Competition
drift-wars.jpg            - Groovy Drift Wars Competition
auto-cross.jpg            - Auto Cross Competition
motorbike-600cc.jpg       - Motorbike 600cc Competition
rally-cross.jpg           - Rally Cross Competition
```

#### ⚽ **Sports & Games** (8 images needed)
```
football.jpg              - Football Competitions
local-games.jpg           - Local Games Arena
hiking.jpg                - Hiking Competition
fishing.jpg               - Fishing Competition
chess.jpg                 - Chess Competition
scrabble.jpg              - Scrabble Competition
snooker.jpg               - Snooker Competition
eating-competition.jpg    - Eating Competition
```

#### 🍽️ **Food Festivals** (3 images needed)
```
tea-festival.jpg          - Tea Festival
ice-cream-festival.jpg    - Ice Cream Festival
suya-festival.jpg         - Suya Festival
```

#### 🏕️ **Camping & Experiences** (2 images needed)
```
camping-experience.jpg    - Camping Experience 1
camping-kaspaland.jpg     - Camping Experience 2 - Kaspaland
```

#### 🎯 **Special Events** (5 images needed)
```
first-lady-day.jpg        - First Lady's Day
fct-minister-day.jpg      - FCT Minister's Day
raffle-draws.jpg          - Raffle Draws
hackathon.jpg             - Hackathon
investment-forum.jpg      - EA Investment Forum
```

#### 🥊 **Traditional Events** (3 images needed)
```
traditional-boxing.jpg    - Traditional Boxing Competition
traditional-wrestling.jpg - Traditional Wrestling
traditional-dance.jpg     - Traditional Dance Competition
```

### Image Specifications
- **Format**: JPG or PNG
- **Dimensions**: 1200x800px (3:2 aspect ratio)
- **File Size**: Under 500KB each
- **Quality**: High quality but web-optimized

## 📂 Step 2: Place Images in Correct Folder

1. **Navigate to**: `public/events/` folder in your project
2. **Copy all your prepared images** into this folder
3. **Ensure file names match exactly** what's listed above

## 🚀 Step 3: Apply Images to Events

### Option A: Bulk Update (Recommended)
```bash
# Check current events (verify everything looks correct)
npm run list-events

# Update all events with images
npm run update-event-images update
```

### Option B: Admin Panel Method
1. Go to `http://localhost:3000/admin/events`
2. Edit each event individually
3. Upload images using the built-in uploader

### Option C: Manual Database Update
1. Go to your Supabase dashboard
2. Edit the `events` table
3. Set `image_url` field to `/events/your-image.jpg`

## 🔍 Step 4: Verify Images Are Working

1. **Visit events page**: `http://localhost:3000/events`
2. **Check each event** has its image displayed
3. **Images should appear** in both grid and list views

## 🎨 Image Sourcing Tips

### Where to Get Images
1. **Stock Photos**: Unsplash, Pexels, Pixabay (free)
2. **AI Generated**: Midjourney, DALL-E, Stable Diffusion
3. **Custom Photography**: Hire local photographer
4. **Event Photos**: Use photos from previous similar events

### Image Ideas by Category

#### Tech Hub
- Modern technology workspace, laptops, coding, innovation

#### Market Place
- Vibrant marketplace, vendors, African textiles, local crafts

#### Food Courts
- Colorful Nigerian food, outdoor dining, food vendors

#### Culture Fest
- Traditional Nigerian dancers, colorful costumes, drums

#### Automotive Events
- Race cars, go-karts, motorcycles in action

#### Sports
- Athletes competing, sports equipment, cheering crowds

#### Traditional Events
- Traditional Nigerian wrestling, boxing, cultural ceremonies

## 🛠️ Image Editing Tools

### Free Options
- **GIMP** (desktop)
- **Canva** (online)
- **Photopea** (online Photoshop alternative)

### Online Compression
- **TinyPNG** - Compress images without quality loss
- **Squoosh** - Google's image optimization tool

### Resize Commands (if you have ImageMagick)
```bash
# Resize to 1200x800px
magick input.jpg -resize 1200x800^ -gravity center -extent 1200x800 output.jpg

# Batch resize all images
magick *.jpg -resize 1200x800^ -gravity center -extent 1200x800 resized_%d.jpg
```

## 📝 Quick Setup Checklist

- [ ] Gather 35 images for all events
- [ ] Resize images to 1200x800px
- [ ] Compress images to under 500KB
- [ ] Name images according to the list above
- [ ] Place images in `public/events/` folder
- [ ] Run `npm run update-event-images update`
- [ ] Verify images appear on `/events` page
- [ ] Check individual event pages for proper display

## 🚨 Troubleshooting

### Images Not Showing
1. Check file names match exactly (case-sensitive)
2. Ensure images are in `public/events/` folder
3. Verify image file formats (JPG/PNG only)
4. Clear browser cache and refresh

### Script Not Working
1. Check `.env.local` file has correct Supabase credentials
2. Ensure you have internet connection for database updates
3. Run `npm run list-events` first to verify connection

### Large File Sizes
1. Use image compression tools (TinyPNG, Squoosh)
2. Convert PNG to JPG if no transparency needed
3. Reduce image dimensions if over 1200x800px

## 🎉 Final Result
Once complete, your events page will showcase beautiful, professional images for all 35 festival events, making the website much more engaging and visually appealing!