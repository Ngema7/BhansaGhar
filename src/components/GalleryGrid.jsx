import { useEffect, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import { gsap, prefersReducedMotion } from '../animations/gsapConfig.js';

export default function GalleryGrid({ items }) {
  const [open, setOpen] = useState(null); // index in items

  const close = useCallback(() => setOpen(null), []);
  const next = useCallback(() => setOpen((i) => (i === null ? i : (i + 1) % items.length)), [items.length]);
  const prev = useCallback(() => setOpen((i) => (i === null ? i : (i - 1 + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
  }, [open, close, next, prev]);

  useEffect(() => {
    if (open !== null && !prefersReducedMotion()) {
      gsap.fromTo('[data-lightbox]', { opacity: 0 }, { opacity: 1, duration: 0.3 });
    }
  }, [open === null]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = open !== null ? items[open] : null;

  return (
    <>
      <ul data-gallery-grid className="columns-2 gap-3 sm:gap-4 lg:columns-4">
        {items.map((item, i) => (
          <li key={item.id} className="mb-3 break-inside-avoid sm:mb-4">
            <button type="button" onClick={() => setOpen(i)} aria-label={`Open ${item.title}`}
              className="group relative block w-full overflow-hidden rounded-sm border border-gold/50 shadow-card">
              <SmartImage src={item.src} alt={item.title} className={`${item.ratio} w-full`} imgClassName="transition-transform duration-700 group-hover:scale-110" />
              <span className="absolute inset-0 flex items-end bg-gradient-to-t from-maroon/80 via-transparent to-transparent p-3 text-left opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                <span className="font-serif text-sm text-cream">{item.title}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {current && createPortal(
        <div data-lightbox role="dialog" aria-modal="true" aria-label={current.title}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-brown/95 p-4" onClick={close}>
          <button type="button" onClick={close} aria-label="Close" className="absolute right-4 top-4 rounded-full border border-gold/60 p-2 text-gold hover:bg-gold/10"><X size={22} /></button>
          <button type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous image" className="absolute left-3 rounded-full border border-gold/60 p-2 text-gold hover:bg-gold/10 sm:left-8"><ChevronLeft size={24} /></button>
          <figure className="w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <SmartImage src={current.src} alt={current.title} className="aspect-[4/3] max-h-[75vh] w-full border border-gold/60" imgClassName="!object-contain" />
            <figcaption className="mt-3 text-center font-serif text-cream">
              {current.title} <span className="text-sm text-gold">· {current.category}</span>
              <span className="mt-1 block text-xs text-cream/60">{open + 1} / {items.length}</span>
            </figcaption>
          </figure>
          <button type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next image" className="absolute right-3 rounded-full border border-gold/60 p-2 text-gold hover:bg-gold/10 sm:right-8"><ChevronRight size={24} /></button>
        </div>,
        document.body
      )}
    </>
  );
}
