import { menuItems } from './data/menuData.js';
import { site } from './data/site.js';

/** Opens the real PDF if site.menuPdfUrl is set; otherwise downloads a text placeholder. */
export function downloadMenu() {
  if (site.menuPdfUrl) { window.open(site.menuPdfUrl, '_blank', 'noopener'); return; }
  const lines = ['BHANSA GHAR — MENU', '', ...menuItems.map((m) => `${m.name.padEnd(22)} Rs. ${m.price}   ${m.desc}`)];
  const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }));
  const a = Object.assign(document.createElement('a'), { href: url, download: 'bhansa-ghar-menu.txt' });
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
}
