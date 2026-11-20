import { gsap, ScrollTrigger, useGSAP } from '../animations/gsapConfig.js';

/**
 * Declarative scroll animations. Mark elements with:
 *  data-reveal      fade + rise
 *  data-stagger     children animate in sequence
 *  data-img-reveal  clip-path wipe
 *  data-parallax    image drifts while scrolling (put on the <img>; parent is the trigger)
 *  data-float       slow ambient movement for decorations
 */
export function usePageAnimations(scopeRef) {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const trig = (el, start = 'top 88%') => ({ trigger: el, start, once: true });

      gsap.utils.toArray('[data-reveal]').forEach((el) =>
        gsap.from(el, { y: 36, opacity: 0, duration: 0.9, scrollTrigger: trig(el) }));

      gsap.utils.toArray('[data-stagger]').forEach((c) =>
        gsap.from(c.children, { y: 40, opacity: 0, duration: 0.8, stagger: 0.12, scrollTrigger: trig(c, 'top 85%') }));

      gsap.utils.toArray('[data-img-reveal]').forEach((el) =>
        gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: 'power3.inOut', scrollTrigger: trig(el, 'top 85%') }));

      gsap.utils.toArray('[data-parallax]').forEach((el) =>
        gsap.fromTo(el, { yPercent: -8, scale: 1.18 },
          { yPercent: 8, scale: 1.18, ease: 'none',
            scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

      gsap.utils.toArray('[data-float]').forEach((el, i) =>
        gsap.to(el, { y: i % 2 ? -10 : 10, duration: 4 + i, ease: 'sine.inOut', yoyo: true, repeat: -1 }));
    });
    const t = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => { clearTimeout(t); mm.revert(); };
  }, { scope: scopeRef });
}

export function hoverLift(e, on) {
  gsap.to(e.currentTarget, { y: on ? -4 : 0, scale: on ? 1.02 : 1, duration: 0.3, overwrite: 'auto' });
}
