import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, Clock } from 'lucide-react';
import { site } from '../data/site.js';

export function GetInTouch() {
  const items = [
    { Icon: MapPin, text: site.address, href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`, ext: true },
    { Icon: Phone, text: site.phone, href: `tel:${site.phone}` },
    { Icon: MessageCircle, text: 'Chat on WhatsApp', href: `https://wa.me/${site.whatsapp}`, ext: true },
    { Icon: Mail, text: site.email, href: `mailto:${site.email}` },
  ];
  const socials = [[Facebook, site.social.facebook, 'Facebook'], [Instagram, site.social.instagram, 'Instagram'], [Youtube, site.social.youtube, 'YouTube']];
  return (
    <div data-reveal>
      <h2 className="text-2xl font-semibold text-maroon">Get in Touch</h2>
      <p className="mt-1 text-sm text-brown/75">We'd love to hear from you.</p>
      <ul className="mt-5 space-y-4 text-sm">
        {items.map(({ Icon, text, href, ext }) => (
          <li key={text}><a href={href} {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})} className="flex items-start gap-3 hover:text-brick">
            <Icon size={18} className="mt-0.5 shrink-0 text-gold" />{text}</a></li>
        ))}
      </ul>
      <div className="mt-5 flex gap-3">
        {socials.map(([Icon, href, label]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            className="rounded-full bg-maroon p-2.5 text-gold transition-colors hover:bg-brick"><Icon size={16} /></a>
        ))}
      </div>
    </div>
  );
}

export function OpeningHours() {
  return (
    <div data-reveal>
      <h2 className="text-2xl font-semibold text-maroon">Opening Hours</h2>
      <p className="mt-5 flex items-center gap-3 text-sm"><Clock size={20} className="text-gold" />{site.hours}</p>
      <p className="mt-3 text-sm text-brown/70">For groups of 8 or more, please call us in advance.</p>
    </div>
  );
}

export function MapBlock() {
  return (
    <div data-reveal className="overflow-hidden rounded-sm border border-gold/60 shadow-card">
      {site.mapEmbedUrl ? (
        <iframe title="Bhansa Ghar location" src={site.mapEmbedUrl} loading="lazy" className="h-72 w-full border-0" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="flex h-72 flex-col items-center justify-center gap-2 bg-cream-dark p-4 text-center">
          <MapPin className="text-brick" size={32} />
          <p className="font-serif text-lg text-maroon">Bhansa Ghar</p>
          <p className="text-xs text-brown/70">{site.address}</p>
          <a className="btn-maroon mt-2 !py-2 text-xs" target="_blank" rel="noopener noreferrer"
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}>Open in Google Maps</a>
          <p className="mt-1 text-[10px] text-brown/50">Set site.mapEmbedUrl in src/data/site.js to embed a live map.</p>
        </div>
      )}
    </div>
  );
}
