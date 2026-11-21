
const p = (name) => `/images/${name}.png`;

export const images = {
  logo: p('logo'),
  hero: { restaurant: '/images/Hero.png', food: '/images/hero-food.png' },
  story: { interior: '/images/Hero.png', temple: p('heritage-temple') },
  menu: {
    thali: p('menu-thali'),
    momo: p('menu-momo'),
    sekuwa: p('menu-sekuwa'),
    selRoti: p('menu-sel-roti'),
    thukpa: p('menu-thukpa'),
    chowmein: p('menu-chowmein'),
    soup: p('menu-soup'),
    tea: p('menu-tea'),
  },
  newari: p('menu-newari'),
  reservation: p('reservation-table'),
  contact: p('contact-mountains'),
  mountain: p('mountain-decoration'),
  pattern: p('nepali-pattern'),
  gallery: Array.from({ length: 12 }, (_, i) =>
    p(`gallery-${String(i + 1).padStart(2, '0')}`)
  ),
};

export default images;