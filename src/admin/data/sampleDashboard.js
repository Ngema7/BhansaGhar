// ⚠️ यी सबै नक्कली (sample) data हुन्। असली होइनन्।
// Backend बनेपछि (Step 5) यो file हटाएर database बाट data ल्याउँछौं।

export const SAMPLE_STATS = {
  menuItems: 24,
  categories: 5,
  reservations: 32,
  pending: 6,
};

// चार्टको लागि: दिन संख्या अनुसार नक्कली visitors र reservations बनाउँछ
export function makeSampleSeries(days) {
  const series = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (days - 1 - i));
    series.push({
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visitors: Math.round(70 + 30 * Math.sin(i / 2.3) + (i % 5) * 4),
      reservations: Math.round(6 + 3 * Math.sin(i / 1.7 + 1)),
    });
  }
  return series;
}

export const SAMPLE_RESERVATIONS = [
  { id: 1, name: 'Sample Guest A', when: 'Sample date • 7:00 PM', guests: 4, status: 'Confirmed' },
  { id: 2, name: 'Sample Guest B', when: 'Sample date • 1:00 PM', guests: 2, status: 'Pending' },
  { id: 3, name: 'Sample Guest C', when: 'Sample date • 8:00 PM', guests: 6, status: 'Confirmed' },
  { id: 4, name: 'Sample Guest D', when: 'Sample date • 6:30 PM', guests: 3, status: 'Cancelled' },
];

export const SAMPLE_POPULAR_DISHES = [
  { name: 'Nepali Thali', count: 48 },
  { name: 'Momo (Buff)', count: 41 },
  { name: 'Sekuwa', count: 29 },
  { name: 'Thukpa', count: 17 },
];