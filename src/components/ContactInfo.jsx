import { MapPin, Phone, Mail, Facebook, Instagram, Youtube, MessageCircle, Clock } from 'lucide-react';
import { site } from '../data/site.js';

const MAP_EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d904211.20142497!2d84.74696737689733!3d27.714970349231788!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ebb365128209fb%3A0x3110f6aa2c4eb2fc!2z4KSq4KWH4KSq4KWN4KSf4KS-IOCkl-CkvuCkieCkgSwgUGVwdGEgVmlsbGFnZQ!5e0!3m2!1sen!2snp!4v1795256747729!5m2!1sen!2snp';

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
      <iframe
        title="Bhansa Ghar location"
        src={site.mapEmbedUrl || MAP_EMBED_URL}
        width="600"
        height="450"
        loading="lazy"
        allowFullScreen
        className="h-72 w-full border-0"
        style={{ border: 0 }}
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}