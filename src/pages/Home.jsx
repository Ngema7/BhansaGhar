import { ArrowRight, Wheat, Leaf, HeartHandshake } from 'lucide-react';
import Button from '../components/Button.jsx';
import SmartImage from '../components/SmartImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import FoodCard from '../components/FoodCard.jsx';
import { images } from '../data/images.js';
import { galleryItems } from '../data/galleryData.js';
import { useLang } from '../context/LangContext.jsx';

const signature = [
  { name: 'Nepali Thali', desc: 'Traditional Meal', image: images.menu.thali, to: '/menu' },
  { name: 'Momo', desc: 'Handcrafted with Love', image: images.menu.momo, to: '/menu' },
  { name: 'Sekuwa', desc: 'Authentic Smoky Flavor', image: images.menu.sekuwa, to: '/menu' },
  { name: 'Newari Food', desc: 'Taste of Tradition', image: images.newari, to: '/menu' },
];
const features = [
  { Icon: Wheat, title: 'Authentic Recipes', text: 'Traditional Taste' },
  { Icon: Leaf, title: 'Fresh Ingredients', text: 'Local & Healthy' },
  { Icon: HeartHandshake, title: 'Warm Hospitality', text: 'With Heart' },
];

export default function Home() {
  const { lang } = useLang();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-brown">
        <div className="absolute inset-0" aria-hidden="true">
          <SmartImage src={images.hero.restaurant} alt="" className="h-full w-full" data-parallax eager />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-brown/90 via-maroon/60 to-brown/30" />
        <div className="container-x relative z-10 grid min-h-[560px] items-center gap-8 pb-24 pt-12 lg:grid-cols-2 lg:min-h-[640px]">
          <div>
            <h1 data-hero-title className="font-deva text-4xl font-semibold leading-tight text-cream sm:text-5xl lg:text-6xl">
              स्वादमा नेपालीपन,<br />आतिथ्यमा आफ्नोपन!
            </h1>
            <p data-hero-title className="mt-5 font-serif text-2xl leading-snug text-gold sm:text-3xl">
              A Taste of Nepal,<br />A Feeling of Home.
            </p>
            <p data-hero-title className="mt-4 max-w-md text-sm text-cream/90 sm:text-base">
              Experience authentic Nepali cuisine with traditional recipes and warm hospitality.
            </p>
            <div data-hero-title className="mt-7 flex flex-wrap gap-3">
              <Button to="/menu">{lang === 'NP' ? 'मेनु हेर्नुहोस्' : 'Explore Our Menu'} <ArrowRight size={16} /></Button>
              <Button to="/our-story" variant="outline">Our Story</Button>
            </div>
          </div>
          <div data-img-reveal className="hidden lg:block">
            <SmartImage src={images.hero.food} alt="Traditional Nepali food platter" className="aspect-[4/3] w-full rounded-sm border border-gold/60 shadow-lift" eager />
          </div>
        </div>
        <div className="torn-edge absolute -bottom-px left-0 right-0 bg-cream" aria-hidden="true" />
      </section>

      {/* Signature dishes */}
      <section className="paper py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading title="Our Signature Dishes" subtitle="Taste the authentic flavors of Nepal." />
          <div data-stagger className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
            {signature.map((d) => <FoodCard key={d.name} variant="signature" {...d} />)}
          </div>
          <div className="mt-10 text-center"><Button to="/menu" variant="maroon">View Full Menu <ArrowRight size={16} /></Button></div>
        </div>
      </section>

      {/* Brand intro */}
      <section className="relative overflow-hidden bg-cream-dark/60 py-16 sm:py-24">
        <SmartImage src={images.pattern} alt="" fallback="none" className="pointer-events-none absolute inset-0 opacity-10" />
        <div className="container-x relative grid items-center gap-10 lg:grid-cols-12">
          <div data-img-reveal className="relative lg:col-span-6">
            <SmartImage src={images.story.interior} alt="Inside the Bhansa Ghar dining hall" className="aspect-[5/4] w-full rounded-sm shadow-lift" />
            <div className="absolute -bottom-4 -right-4 -z-10 hidden h-full w-full border border-gold sm:block" aria-hidden="true" />
          </div>
          <div data-reveal className="lg:col-span-5 lg:col-start-8">
            <h2 className="text-3xl font-semibold text-maroon sm:text-4xl">A home for Nepali flavor</h2>
            <p className="mt-1 font-deva text-lg text-brick">आफ्नै घरजस्तो स्वाद</p>
            <p className="mt-4 leading-relaxed text-brown/85">
              Bhansa Ghar means the kitchen house, the heart of a Nepali home. We cook recipes passed down through families, using local ingredients and the slow techniques they deserve, and serve them the way Nepal always has: with generosity.
            </p>
            <Button to="/our-story" className="mt-6">Explore Our Story <ArrowRight size={16} /></Button>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="paper py-16">
        <div className="container-x">
          <SectionHeading title="Why Choose Us" />
          <div data-stagger className="mt-10 grid gap-8 sm:grid-cols-3">
            {features.map(({ Icon, title, text }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold"><Icon size={28} strokeWidth={1.4} /></span>
                <h3 className="mt-4 text-xl font-semibold text-maroon">{title}</h3>
                <p className="mt-1 text-sm text-brown/75">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery preview */}
      <section className="bg-cream-dark/60 py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading title="The Bhansa Ghar Experience" subtitle="Interiors, plates and moments from our table." />
          <div data-stagger className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {galleryItems.slice(0, 8).map((g, i) => (
              <SmartImage key={g.id} src={g.src} alt={g.title} className={`rounded-sm border border-gold/50 ${i === 0 || i === 5 ? 'aspect-square sm:row-span-2 sm:aspect-auto' : 'aspect-square'}`} />
            ))}
          </div>
          <div className="mt-10 text-center"><Button to="/gallery" variant="maroon">Explore Gallery <ArrowRight size={16} /></Button></div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-maroon py-20 text-center">
        <SmartImage src={images.mountain} alt="" fallback="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-40" imgClassName="!object-contain !object-bottom" data-float />
        <div className="container-x relative" data-reveal>
          <h2 className="text-3xl font-semibold text-cream sm:text-5xl">Experience the Taste of Nepal.</h2>
          <p className="mt-3 text-cream/85">Join us for an unforgettable dining experience.</p>
          <Button to="/reservation" className="mt-7">Reserve Your Table</Button>
        </div>
      </section>
    </>
  );
}
