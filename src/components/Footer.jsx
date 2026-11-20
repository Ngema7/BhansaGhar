import { Link } from 'react-router-dom';
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react';
import Logo from './Logo.jsx';
import SmartImage from './SmartImage.jsx';
import { images } from '../data/images.js';
import { navLinks, site } from '../data/site.js';
import { useLang } from '../context/LangContext.jsx';

const socials = [
  { Icon: Facebook, href: site.social.facebook, label: 'Facebook' },
  { Icon: Instagram, href: site.social.instagram, label: 'Instagram' },
  { Icon: Youtube, href: site.social.youtube, label: 'YouTube' },
];

export default function Footer() {
  const { lang } = useLang();
  return (
    <footer className="relative overflow-hidden bg-maroon text-cream">
      <SmartImage src={images.mountain} alt="" fallback="none" className="pointer-events-none absolute bottom-0 right-0 h-40 w-full max-w-xl opacity-60" imgClassName="!object-contain !object-right-bottom" />
      <div className="container-x relative z-10 grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo size="lg" />
          <p className="mt-4 font-deva text-gold">स्वादमा नेपालीपन, आतिथ्यमा आफ्नोपन!</p>
          <p className="mt-2 text-sm text-cream/80">{lang === 'NP' ? 'नेपाल चाख्नुहोस्। घरजस्तै महसुस गर्नुहोस्।' : 'A Taste of Nepal, A Feeling of Home.'}</p>
          <div className="mt-5 flex gap-3">
            {socials.map(({ Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                className="rounded-full border border-gold/60 p-2 text-gold transition-colors hover:bg-gold hover:text-maroon"><Icon size={16} /></a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-serif text-lg text-gold">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {navLinks.map((l) => <li key={l.to}><Link to={l.to} className="text-cream/85 hover:text-gold">{l.en}</Link></li>)}
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg text-gold">Contact</h3>
          <ul className="mt-3 space-y-3 text-sm text-cream/85">
            <li className="flex gap-2"><MapPin size={16} className="mt-0.5 shrink-0 text-gold" />{site.address}</li>
            <li className="flex gap-2"><Phone size={16} className="mt-0.5 shrink-0 text-gold" /><a href={`tel:${site.phone}`} className="hover:text-gold">{site.phone}</a></li>
            <li className="flex gap-2"><Mail size={16} className="mt-0.5 shrink-0 text-gold" /><a href={`mailto:${site.email}`} className="hover:text-gold">{site.email}</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-serif text-lg text-gold">Opening Hours</h3>
          <p className="mt-3 flex gap-2 text-sm text-cream/85"><Clock size={16} className="mt-0.5 shrink-0 text-gold" />{site.hours}</p>
        </div>
      </div>
      <div className="relative z-10 border-t border-gold/25 py-4 text-center text-xs text-cream/70">
        © {new Date().getFullYear()} Bhansa Ghar. All Rights Reserved.
      </div>
    </footer>
  );
}
