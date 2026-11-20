import { useRef } from 'react';
import { gsap, useGSAP, prefersReducedMotion } from '../animations/gsapConfig.js';
import { usePageAnimations } from '../hooks/useGsapAnimation.js';

/** Wraps each route: entrance fade + scoped scroll animations (re-mounted per route via key). */
export default function PageTransition({ children }) {
  const ref = useRef(null);
  usePageAnimations(ref);

  useGSAP(() => {
    if (prefersReducedMotion()) return;
    gsap.fromTo(ref.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.55, clearProps: 'all' });
    gsap.from('[data-hero-title]', { y: 30, opacity: 0, duration: 0.9, stagger: 0.12, delay: 0.15 });
  }, { scope: ref });

  return <main ref={ref} id="main" className="flex-1">{children}</main>;
}
