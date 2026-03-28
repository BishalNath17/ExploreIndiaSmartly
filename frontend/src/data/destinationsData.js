import destinationsJson from './json/destinations.json';

// We extract unique image URLs to keep backward compatibility 
// with anything that might use destinationImages directly
export const destinationImages = destinationsJson.reduce((acc, dest) => {
  acc[dest.id] = dest.image;
  return acc;
}, {});

export const destinationsData = destinationsJson;
