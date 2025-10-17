# Converting HTML Flyers to Images

## Method 1: Using Browser Screenshot
1. Open each HTML flyer file in a browser
2. Set browser window to 600x800 pixels
3. Take a screenshot and save as PNG/JPG
4. Save files as:
   - tech-startup-pitch.png
   - fashion-design-showcase.png
   - dj-battle-championship.png
   - african-cuisine-cookoff.png
   - art-photography-contest.png

## Method 2: Using Puppeteer (Automated)
```javascript
const puppeteer = require('puppeteer');
const path = require('path');

async function convertHTMLToImage() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const flyers = [
    'tech-startup-pitch.html',
    'fashion-design-showcase.html',
    'dj-battle-championship.html',
    'african-cuisine-cookoff.html',
    'art-photography-contest.html'
  ];
  
  for (const flyer of flyers) {
    const filePath = path.join(__dirname, flyer);
    await page.goto(`file://${filePath}`);
    await page.setViewport({ width: 600, height: 800 });
    
    const imageName = flyer.replace('.html', '.png');
    await page.screenshot({
      path: imageName,
      width: 600,
      height: 800
    });
  }
  
  await browser.close();
}

convertHTMLToImage();
```

## Method 3: Using Online Tools
1. Go to htmlcsstoimage.com or similar service
2. Copy HTML content from each flyer file
3. Set dimensions to 600x800
4. Generate and download images

## Usage in Events Page
Once converted, place the PNG files in the public/assets/ directory and update the EventsClientPage.tsx to use these images instead of placeholder graphics.