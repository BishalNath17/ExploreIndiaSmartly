# Managing Images in Explore India Smartly

To ensure maximum performance, stability, and compatibility across deployment platforms (Vercel, GitHub Pages, etc.), this project no longer dynamically fetches images from external third-party sources (like Unsplash) via URL in the data files. 

Instead, the project uses a robust **Local-First Component Architecture**.

## Image Directory Structure
All images are now required to be stored locally in the `public/images/` directory.

```
/frontend/public/images/
├── states/          <-- 1 image per state (e.g. goa.jpg)
├── destinations/    <-- 1 image per destination (e.g. vagator-beach.jpg)
├── heroes/          <-- Full-width banners (e.g. main-hero.jpg)
└── fallback.jpg     <-- The global fallback image
```

## How to Add New Data & Images

When you want to add a new State or Destination to the platform, follow these two steps:

### Step 1: Add the Image
Download a high-quality, royalty-free image (from Unsplash, Pexels, etc.). Compress it using an optimizer if possible.
- **For States:** Save it as `/public/images/states/[id].jpg` (e.g., `goa.jpg`)
- **For Destinations / Hidden Gems:** Save it as `/public/images/destinations/[id].jpg` (e.g., `vagator.jpg`)

*Note: The platform components automatically crop and size the images properly using `object-fit: cover` to maintain aspect ratios.*

### Step 2: Add the Data Entry
Open the relevant data file (`src/data/statesData.js`, `src/data/destinationsData.js`, or `src/data/hiddenGemsData.js`).
Create your entry using the exact same ID used as the image filename.

```javascript
{
  id: "vagator", // Important: This must precisely match your image filename (vagator.jpg)
  state: "goa",
  name: "Vagator Beach",
  description: "A beautiful laid-back beach.",
  image: "/images/destinations/vagator.jpg", // Define the exact local path here
  // ... other properties
}
```

## Global Fallback System
If an image fails to load or is deleted, the React components automatically handle it gracefully.
- Every `<img>` tag in `StateCard`, `DestinationCard`, and `HiddenGemCard` uses an `onError` synthetic event handler.
- If the requested image throws a 404, the image `src` elegantly falls back to `/images/fallback.jpg`.
- This ensures the UI never breaks with ugly "broken image" browser icons.
