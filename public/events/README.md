# Event Images Directory

This directory contains images for all festival events.

## Image Guidelines

### File Naming
- Use descriptive, lowercase names with hyphens
- Examples: `music-concert.jpg`, `food-festival.jpg`, `tech-expo.jpg`

### Image Specifications
- **Format**: JPG, PNG, or WebP
- **Dimensions**: 1200x800px (3:2 aspect ratio) recommended
- **File Size**: Under 500KB for optimal loading
- **Quality**: High quality but optimized for web

### Current Images
Place your event images here with the following naming convention:

```
events/
├── music-concert.jpg
├── food-festival.jpg  
├── tech-expo.jpg
├── cultural-night.jpg
├── business-summit.jpg
├── art-exhibition.jpg
├── dance-competition.jpg
├── comedy-show.jpg
├── fashion-show.jpg
├── health-wellness.jpg
├── sports-tournament.jpg
└── movie-screening.jpg
```

## Usage

After placing images here:

1. **Via Script** (Recommended for bulk updates):
   ```bash
   npm run list-events          # See current events
   npm run update-event-images  # Update all events with images
   ```

2. **Via Admin Panel**:
   - Go to `/admin/events`
   - Edit each event and upload images

3. **Manual Database Update**:
   - Update `image_url` field in events table
   - Set to `/events/your-image.jpg`

## Image Processing Tips

### Resize Images
Use online tools or software to resize to 1200x800px:
- **Online**: TinyPNG, Squoosh, Canva
- **Software**: Photoshop, GIMP, ImageMagick

### Optimize File Size
- Use JPG for photos (smaller file size)
- Use PNG for graphics with transparency
- Compress images to stay under 500KB