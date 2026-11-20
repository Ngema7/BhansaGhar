import { images } from './images.js';

export const menuCategories = ['All', 'Nepali Thali', 'Momos', 'Sekuwa', 'Traditional', 'Drinks'];

export const menuItems = [
  { id: 'thali', name: 'Nepali Thali', price: 350, category: 'Nepali Thali', image: images.menu.thali, desc: 'Rice, dal, seasonal tarkari, achar and gundruk.' },
  { id: 'veg-thali', name: 'Vegetarian Thali', price: 320, category: 'Nepali Thali', image: images.menu.thali, desc: 'A full meal of dal bhat with fresh vegetable curries.' },
  { id: 'momo', name: 'Momo (Buff)', price: 250, category: 'Momos', image: images.menu.momo, desc: 'Steamed dumplings with spiced buffalo filling.' },
  { id: 'chicken-momo', name: 'Chicken Momo', price: 250, category: 'Momos', image: images.menu.momo, desc: 'Juicy chicken dumplings with tomato achar.' },
  { id: 'veg-momo', name: 'Veg Momo', price: 220, category: 'Momos', image: images.menu.momo, desc: 'Cabbage, carrot and paneer, handfolded.' },
  { id: 'sekuwa', name: 'Sekuwa', price: 400, category: 'Sekuwa', image: images.menu.sekuwa, desc: 'Smoky grilled meat marinated in Himalayan spices.' },
  { id: 'chicken-sekuwa', name: 'Chicken Sekuwa', price: 400, category: 'Sekuwa', image: images.menu.sekuwa, desc: 'Charcoal-grilled chicken with timur and ginger.' },
  { id: 'sel-roti', name: 'Sel Roti', price: 150, category: 'Traditional', image: images.menu.selRoti, desc: 'Crisp, ring-shaped sweet rice bread.' },
  { id: 'thukpa', name: 'Thukpa', price: 250, category: 'Traditional', image: images.menu.thukpa, desc: 'Warming noodle soup from the high Himalayas.' },
  { id: 'chowmein', name: 'Chowmein', price: 220, category: 'Traditional', image: images.menu.chowmein, desc: 'Stir-fried noodles with vegetables and spice.' },
  { id: 'gundruk', name: 'Gundruk Soup', price: 180, category: 'Traditional', image: images.menu.soup, desc: 'Tangy fermented leafy-green soup.' },
  { id: 'newari-set', name: 'Newari Khaja Set', price: 450, category: 'Traditional', image: images.newari, desc: 'Beaten rice with choila, bara and spiced sides.' },
  { id: 'tea', name: 'Masala Tea', price: 100, category: 'Drinks', image: images.menu.tea, desc: 'Milk tea brewed with cardamom, ginger and clove.' },
  { id: 'lassi', name: 'Sweet Lassi', price: 140, category: 'Drinks', image: images.menu.tea, desc: 'Chilled yogurt drink with a touch of cardamom.' },
];
