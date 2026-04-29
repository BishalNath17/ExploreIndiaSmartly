require('dotenv').config();
const mongoose = require('mongoose');
const Destination = require('../models/Destination');

// 👉 CHANGE THIS: Set state name and destinations array before running
const state = "Delhi";

const destinations = [
{
name: "India Gate",
district: "Central Delhi",
city: "New Delhi",
image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
googleMapEmbed: "https://www.google.com/maps?q=India+Gate&output=embed",
description: "India Gate is a historic war memorial located in the heart of Delhi, surrounded by lush gardens and a popular spot for evening walks.",
famousFor: "War memorial and night lighting",
rating: 4.8
},
{
name: "Red Fort",
district: "Central Delhi",
city: "Delhi",
image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09c",
googleMapEmbed: "https://www.google.com/maps?q=Red+Fort+Delhi&output=embed",
description: "Red Fort is a UNESCO World Heritage site built by Mughal emperor Shah Jahan, known for its massive red sandstone walls.",
famousFor: "Independence Day celebrations and Mughal architecture",
rating: 4.7
},
{
name: "Qutub Minar",
district: "South Delhi",
city: "Mehrauli",
image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
googleMapEmbed: "https://www.google.com/maps?q=Qutub+Minar&output=embed",
description: "Qutub Minar is the tallest brick minaret in the world and a UNESCO site showcasing Indo-Islamic architecture.",
famousFor: "Tallest minaret and historical complex",
rating: 4.7
},
{
name: "Lotus Temple",
district: "South Delhi",
city: "Kalkaji",
image: "https://images.unsplash.com/photo-1609948543911-7b0e2d7d5c4b",
googleMapEmbed: "https://www.google.com/maps?q=Lotus+Temple&output=embed",
description: "Lotus Temple is a Bahá'í House of Worship known for its unique lotus-shaped structure and peaceful atmosphere.",
famousFor: "Architecture and meditation space",
rating: 4.6
},
{
name: "Akshardham Temple",
district: "East Delhi",
city: "Delhi",
image: "https://images.unsplash.com/photo-1609948543911-7b0e2d7d5c4b",
googleMapEmbed: "https://www.google.com/maps?q=Akshardham+Temple&output=embed",
description: "Akshardham Temple is a grand cultural complex showcasing Indian traditions, spirituality, and architecture.",
famousFor: "Temple complex and exhibitions",
rating: 4.8
},
{
name: "Humayun’s Tomb",
district: "South Delhi",
city: "Nizamuddin",
image: "https://images.unsplash.com/photo-1599661046827-dacff0c0f09c",
googleMapEmbed: "https://www.google.com/maps?q=Humayun+Tomb&output=embed",
description: "Humayun’s Tomb is a UNESCO World Heritage site and a fine example of Mughal garden tomb architecture.",
famousFor: "Mughal architecture and gardens",
rating: 4.7
},
{
name: "Jama Masjid",
district: "Central Delhi",
city: "Old Delhi",
image: "https://images.unsplash.com/photo-1609948543911-7b0e2d7d5c4b",
googleMapEmbed: "https://www.google.com/maps?q=Jama+Masjid+Delhi&output=embed",
description: "Jama Masjid is one of the largest mosques in India, built by Shah Jahan, offering stunning city views.",
famousFor: "Historic mosque and Old Delhi views",
rating: 4.6
},
{
name: "Chandni Chowk",
district: "Central Delhi",
city: "Old Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Chandni+Chowk&output=embed",
description: "Chandni Chowk is a bustling market known for street food, shopping, and historic lanes.",
famousFor: "Street food and shopping",
rating: 4.5
},
{
name: "Connaught Place",
district: "Central Delhi",
city: "New Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Connaught+Place&output=embed",
description: "Connaught Place is a commercial hub with colonial architecture, restaurants, and shopping outlets.",
famousFor: "Shopping and nightlife",
rating: 4.5
},
{
name: "Rashtrapati Bhavan",
district: "Central Delhi",
city: "New Delhi",
image: "https://images.unsplash.com/photo-1587474260584-136574528ed5",
googleMapEmbed: "https://www.google.com/maps?q=Rashtrapati+Bhavan&output=embed",
description: "Rashtrapati Bhavan is the official residence of the President of India with grand architecture and gardens.",
famousFor: "Presidential residence and Mughal gardens",
rating: 4.7
},
{
name: "Raj Ghat",
district: "Central Delhi",
city: "Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Raj+Ghat&output=embed",
description: "Raj Ghat is a memorial dedicated to Mahatma Gandhi, located on the banks of the Yamuna River.",
famousFor: "Gandhi memorial",
rating: 4.6
},
{
name: "Lodhi Garden",
district: "South Delhi",
city: "Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Lodhi+Garden&output=embed",
description: "Lodhi Garden is a peaceful park with historic tombs, greenery, and walking trails.",
famousFor: "Morning walks and heritage",
rating: 4.6
},
{
name: "Hauz Khas Village",
district: "South Delhi",
city: "Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Hauz+Khas+Village&output=embed",
description: "Hauz Khas Village is known for cafes, nightlife, and a historic fort complex.",
famousFor: "Nightlife and cafes",
rating: 4.5
},
{
name: "Dilli Haat",
district: "South Delhi",
city: "INA",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=Dilli+Haat&output=embed",
description: "Dilli Haat is an open-air market offering handicrafts, food, and cultural performances.",
famousFor: "Handicrafts and food stalls",
rating: 4.5
},
{
name: "National Museum",
district: "Central Delhi",
city: "New Delhi",
image: "https://images.unsplash.com/photo-1597045566677-8cf032ed6634",
googleMapEmbed: "https://www.google.com/maps?q=National+Museum+Delhi&output=embed",
description: "National Museum houses a vast collection of artifacts showcasing India's history and culture.",
famousFor: "Historical artifacts and exhibitions",
rating: 4.6
}
];

// Generate unique id from state + name
const slugify = (text) =>
  text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ DB Connected');

    let inserted = 0;
    let skipped = 0;

    for (const item of destinations) {
      const generatedId = `${slugify(state)}-${slugify(item.name)}`;

      const exists = await Destination.findOne({
        $or: [
          { name: item.name, state: state },
          { id: generatedId }
        ]
      });

      if (exists) {
        console.log(`⏭️  Skipped (exists): ${item.name}`);
        skipped++;
        continue;
      }

      await Destination.create({
        name: item.name,
        district: item.district,
        city: item.city,
        image: item.image,
        mapEmbedUrl: item.googleMapEmbed,
        description: item.description,
        whyFamous: item.famousFor,
        rating: item.rating,
        state: state,
        id: generatedId,
        status: 'published',
        source: 'script'
      });

      console.log(`✅ Inserted: ${item.name}`);
      inserted++;
    }

    const stateCount = await Destination.countDocuments({ state: state });
    const totalCount = await Destination.countDocuments();

    console.log('\n📊 --- SUMMARY ---');
    console.log(`   Inserted: ${inserted}`);
    console.log(`   Skipped:  ${skipped}`);
    console.log(`   ${state} destinations now: ${stateCount}`);
    console.log(`   Total destinations in DB: ${totalCount}`);
    console.log('🎯 Done!');

    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    process.exit(1);
  }
};

run();
