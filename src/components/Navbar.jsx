import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import Logo from './Logo.jsx';
import Button from './Button.jsx';
import { navLinks } from '../data/site.js';
import { useLang } from '../context/LangContext.jsx';
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from '../animations/gsapConfig.js';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLang();
  const { pathname } = useLocation();
  const root = useRef(null);
  const panel = useRef(null);
  const first = useRef(true);

  // entrance + scroll-compaction
  useGSAP(() => {
    if (!prefersReducedMotion()) {
      gsap.from('[data-nav-item]', { y: -16, opacity: 0, stagger: 0.07, duration: 0.7, delay: 0.1 });
    }
    ScrollTrigger.create({
      start: 60,
      onUpdate: (self) => root.current?.classList.toggle('nav-compact', self.scroll() > 60),
    });
  }, { scope: root });

  // mobile panel open/close
  useGSAP(() => {
    const dur = prefersReducedMotion() ? 0 : 0.4;
    if (first.current) { first.current = false; gsap.set(panel.current, { height: 0, autoAlpha: 0 }); return; }
    gsap.to(panel.current, { height: open ? 'auto' : 0, autoAlpha: open ? 1 : 0, duration: dur, ease: 'power2.out' });
  }, { dependencies: [open], scope: root });

  useEffect(() => { setOpen(false); }, [pathname]);

  const label = (l) => (lang === 'NP' ? l.np : l.en);
  const linkCls = ({ isActive }) =>
    `relative py-1 text-[13px] transition-colors ${isActive ? 'text-gold' : 'text-cream/90 hover:text-gold'} ` +
    `after:absolute after:-bottom-1 after:left-0 after:h-px after:bg-gold after:transition-all ` +
    (isActive ? 'after:w-full' : 'after:w-0 hover:after:w-full');

  return (
    <header ref={root} className="sticky top-0 z-50 bg-maroon shadow-[0_2px_0_0_rgba(221,164,76,.35)] transition-[padding] duration-300 [&.nav-compact]:shadow-lift">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:bg-gold focus:px-3 focus:py-1 focus:text-maroon">Skip to content</a>
      <div className="container-x flex items-center justify-between py-3 transition-all duration-300 [.nav-compact_&]:py-2">
        <div data-nav-item><Logo /></div>

        <nav aria-label="Primary" className="hidden items-center gap-6 lg:flex xl:gap-8">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkCls} data-nav-item>{label(l)}</NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <div data-nav-item className="flex items-center gap-1.5 text-xs text-cream/90" role="group" aria-label="Language">
            <Globe size={14} className="text-gold" />
            {['NP', 'EN'].map((c, i) => (
              <span key={c} className="flex items-center gap-1.5">
                {i > 0 && <span className="text-gold/50">|</span>}
                <button type="button" onClick={() => setLang(c)} aria-pressed={lang === c}
                  className={lang === c ? 'font-semibold text-gold' : 'hover:text-gold'}>{c}</button>
              </span>
            ))}
          </div>
          <span data-nav-item><Button to="/reservation" className="!px-4 !py-2 text-xs">{lang === 'NP' ? 'टेबल बुक गर्नुहोस्' : 'Reserve a Table'}</Button></span>
        </div>

        <button type="button" className="p-2 text-gold lg:hidden" onClick={() => setOpen((o) => !o)}
          aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      <div ref={panel} id="mobile-menu" className="overflow-hidden border-t border-gold/30 bg-maroon-dark lg:hidden" style={{ height: 0, visibility: 'hidden' }}>
        <nav aria-label="Mobile" className="container-x flex flex-col py-4">
          {navLinks.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} tabIndex={open ? 0 : -1}
              className={({ isActive }) => `border-b border-gold/15 py-3 text-base ${isActive ? 'font-medium text-gold' : 'text-cream'}`}>
              {label(l)}
            </NavLink>
          ))}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-cream">
              <Globe size={16} className="text-gold" />
              {['NP', 'EN'].map((c) => (
                <button key={c} type="button" tabIndex={open ? 0 : -1} onClick={() => setLang(c)} aria-pressed={lang === c}
                  className={`rounded-sm border px-2 py-0.5 ${lang === c ? 'border-gold text-gold' : 'border-transparent'}`}>{c}</button>
              ))}
            </div>
            <Button to="/reservation" tabIndex={open ? 0 : -1} className="!py-2">Reserve a Table</Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
