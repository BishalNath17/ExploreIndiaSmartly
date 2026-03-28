import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const kbDir = path.join(__dirname, 'src', 'data', 'knowledgeBase');
const destFile = path.join(__dirname, 'src', 'data', 'json', 'destinations.json');

const toSlug = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
};

const runMigration = () => {
  console.log('--- STARTING KNOWLEDGE BASE UNIFICATION MIGRATION ---');

  let destData = [];
  try {
    destData = JSON.parse(fs.readFileSync(destFile, 'utf8'));
  } catch (err) {
    console.error("Failed to read destinations.json:", err);
    return;
  }
  
  const existingNames = new Set(destData.map(d => toSlug(d.name)));
  const files = fs.readdirSync(kbDir).filter(f => f.endsWith('.json'));

  let newlyExtracted = [];
  let kbFilesModified = 0;

  for (const file of files) {
    const filePath = path.join(kbDir, file);
    const kbObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (kbObj.topDestinations && Array.isArray(kbObj.topDestinations) && kbObj.topDestinations.length > 0) {
      console.log(`Extracting from ${file}... found ${kbObj.topDestinations.length} existing items.`);
      
      kbObj.topDestinations.forEach(item => {
        const slug = toSlug(item.name || item.title || item.placeName);
        
        if (!existingNames.has(slug)) {
          newlyExtracted.push({
            id: slug,
            name: item.name || item.title || item.placeName || '',
            state: kbObj.id,
            description: item.description || item.overview || item.shortDescription || '',
            
            district: '',
            city: item.location || item.district || '',
            exactPlace: '',
            address: '',
            
            whyFamous: item.whyFamous || '',
            mapEmbedUrl: item.mapEmbedUrl || '',
            
            image: item.image || `/images/destinations/${slug}.jpg`,
            rating: item.rating || 4.5,
            tags: item.tags || ["tourism", "travel", "india"],
            category: item.category || ''
          });
          existingNames.add(slug);
        }
      });

      delete kbObj.topDestinations;
      fs.writeFileSync(filePath, JSON.stringify(kbObj, null, 2));
      kbFilesModified++;
    }
  }

  if (newlyExtracted.length > 0) {
    const mergedOutput = [...destData, ...newlyExtracted];
    fs.writeFileSync(destFile, JSON.stringify(mergedOutput, null, 2));
    console.log(`\nSUCCESS: Safely unified ${newlyExtracted.length} destinations out of the hardcoded knowledge paths and injected them into the unified Admin Panel dataset.`);
    console.log(`Cleaned ${kbFilesModified} KB files safely.`);
  } else {
    console.log('\nNo new destinations needed migration.');
  }

  console.log('--- MIGRATION COMPLETE ---');
};

runMigration();
