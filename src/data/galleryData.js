import { images } from './images.js';

export const galleryCategories = ['All', 'Restaurant Interior', 'Nepali Food', 'Traditional Dining', 'Special Experiences', 'Drinks', 'Cultural Atmosphere'];

// Mixed aspect ratios give the masonry grid its rhythm.
const raw = [
  ['Restaurant Interior', 'Carved wooden dining hall', 'aspect-[4/5]'],
  ['Nepali Food', 'Thali served on brass', 'aspect-square'],
  ['Traditional Dining', 'Floor-seated dining corner', 'aspect-[3/4]'],
  ['Cultural Atmosphere', 'Lantern-lit courtyard', 'aspect-[4/3]'],
  ['Nepali Food', 'Handfolded momos', 'aspect-[3/4]'],
  ['Special Experiences', 'Celebration table', 'aspect-square'],
  ['Drinks', 'Copper mug of masala tea', 'aspect-[4/5]'],
  ['Restaurant Interior', 'Warm evening glow', 'aspect-[4/3]'],
  ['Nepali Food', 'Smoky sekuwa platter', 'aspect-square'],
  ['Cultural Atmosphere', 'Traditional brass and copperware', 'aspect-[3/4]'],
  ['Traditional Dining', 'Newari feast spread', 'aspect-[4/3]'],
  ['Special Experiences', 'Private family dinner', 'aspect-[4/5]'],
];

export const galleryItems = raw.map(([category, title, ratio], i) => ({
  id: `g${i + 1}`, category, title, ratio, src: images.gallery[i],
}));
