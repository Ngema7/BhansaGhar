import { ArrowRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';
import Button from './Button.jsx';
import { images } from '../data/images.js';

export default function PageHero({ lang = 'EN' }) {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brown">
        <div className="absolute inset-0" aria-hidden="true">
          <SmartImage src={images.hero.restaurant} alt="" className="h-full w-full" position="70% center" eager />
        </div>
        {/* left-to-right dark fade so text stays readable, building stays visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brown/90 via-brown/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/60 via-transparent to-brown/30" />

        {/* corner ornaments (uses nepali-pattern.png, hidden if missing) */}
        <SmartImage src={images.pattern} alt="" fallback="none" className="pointer-events-none absolute left-0 top-4 h-24 w-40 opacity-70" imgClassName="!object-contain !object-left-top" data-float />

        <div className="container-x relative z-10 flex min-h-[560px] items-center pb-24 pt-12 lg:min-h-[640px]">
          <div className="max-w-xl">
            <h1 data-hero-title className="font-deva text-4xl font-semibold leading-[1.25] text-cream drop-shadow-lg sm:text-5xl lg:text-6xl">
              स्वादमा नेपालीपन,<br />आतिथ्यमा आफ्नोपन!
            </h1>
            <p data-hero-title className="mt-5 font-serif text-2xl font-semibold leading-snug text-gold drop-shadow sm:text-3xl">
              A Taste of Nepal,<br />A Feeling of Home.
            </p>
            <p data-hero-title className="mt-4 max-w-md text-sm leading-relaxed text-cream/95 sm:text-base">
              Experience authentic Nepali cuisine<br className="hidden sm:block" /> with traditional recipes and warm hospitality.
            </p>
            <div data-hero-title className="mt-7 flex flex-wrap gap-3">
              <Button to="/menu">{lang === 'NP' ? 'मेनु हेर्नुहोस्' : 'Explore Our Menu'} <ArrowRight size={16} /></Button>
              <Button to="/our-story" variant="outline" className="bg-brown/40">Our Story</Button>
            </div>
            <div data-hero-title className="gold-line mt-8 max-w-[240px]"><span /></div>
          </div>
        </div>
        <div className="torn-edge absolute -bottom-px left-0 right-0 bg-cream" aria-hidden="true" />
      </section>
    </>
  );
}