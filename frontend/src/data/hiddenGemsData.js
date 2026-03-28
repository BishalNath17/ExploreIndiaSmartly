import hiddenGemsJson from './json/hiddenGems.json';

export const hiddenGemImages = hiddenGemsJson.reduce((acc, gem) => {
  acc[gem.id] = gem.image;
  return acc;
}, {});

export const hiddenGemsData = hiddenGemsJson;
