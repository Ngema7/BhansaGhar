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
        {/* background: restaurant building + mountains */}
        <div className="absolute inset-0" aria-hidden="true">
          <SmartImage src={images.hero.restaurant} alt="" className="h-full w-full" position="70% center" eager />
        </div>

        {/* dark fade: left dark for text, building visible on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-brown/90 via-brown/45 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brown/70 via-transparent to-brown/30" />

        {/* thali plate: smaller, bottom right, soft edges, cut by the curve */}
        <div
          className="pointer-events-none absolute -bottom-10 right-0 z-[5] hidden aspect-[4/3] w-[40%] max-w-[600px] md:block lg:right-[2%]"
          aria-hidden="true"
        >
          <SmartImage
            src={images.hero.food}
            alt="Traditional Nepali thali"
            className="h-full w-full"
            imgClassName="!object-contain !object-center drop-shadow-[0_20px_30px_rgba(0,0,0,0.55)]"
            style={{
              WebkitMaskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, #000 66%, transparent 100%)',
              maskImage: 'radial-gradient(ellipse 48% 48% at 50% 50%, #000 66%, transparent 100%)',
            }}
            eager
          />
        </div>

        {/* top-left gold ornament */}
        <SmartImage
          src={images.pattern}
          alt=""
          fallback="none"
          className="pointer-events-none absolute left-2 top-4 z-[6] h-28 w-44 opacity-80"
          imgClassName="!object-contain !object-left-top"
          data-float
        />
        {/* bottom-left gold ornament */}
        <SmartImage
          src={images.pattern}
          alt=""
          fallback="none"
          className="pointer-events-none absolute bottom-10 left-0 z-[6] h-20 w-52 -scale-y-100 opacity-70"
          imgClassName="!object-contain !object-left-top"
        />

        {/* content */}
        <div className="container-x relative z-10 flex min-h-[520px] items-center pb-24 pt-10 lg:min-h-[580px]">
          <div className="max-w-xl">
            <h1 data-hero-title className="font-deva text-4xl font-semibold leading-[1.25] text-cream drop-shadow-lg sm:text-5xl lg:text-6xl">
              स्वादमा नेपालीपन,<br />आतिथ्यमा आफ्नोपन!
            </h1>
            <p data-hero-title className="mt-4 font-serif text-2xl font-semibold leading-snug text-gold drop-shadow sm:text-3xl lg:text-4xl">
              A Taste of Nepal,<br />A Feeling of Home.
            </p>
            <p data-hero-title className="mt-4 max-w-md text-sm leading-relaxed text-cream/95 sm:text-base">
              Experience authentic Nepali cuisine<br className="hidden sm:block" /> with traditional recipes and warm hospitality.
            </p>
            <div data-hero-title className="mt-6 flex flex-wrap gap-3">
              <Button to="/menu">{lang === 'NP' ? 'मेनु हेर्नुहोस्' : 'Explore Our Menu'} <ArrowRight size={16} /></Button>
              <Button to="/our-story" variant="outline" className="bg-brown/40">Our Story</Button>
            </div>
            <div data-hero-title className="gold-line mt-7 max-w-[240px]"><span /></div>
          </div>
        </div>

        {/* soft torn-paper curve (rises on the right like the reference) */}
        <svg
          className="pointer-events-none absolute -bottom-px left-0 z-[7] block h-[80px] w-full sm:h-[110px]"
          viewBox="0 0 1440 110"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,62 C60,52 120,70 200,60 C280,50 340,66 430,58 C520,50 600,34 700,42 C800,50 880,64 980,58 C1080,52 1150,38 1240,46 C1320,53 1380,44 1440,40 L1440,110 L0,110 Z"
            className="fill-cream"
          />
          <path
            d="M0,62 C60,52 120,70 200,60 C280,50 340,66 430,58 C520,50 600,34 700,42 C800,50 880,64 980,58 C1080,52 1150,38 1240,46 C1320,53 1380,44 1440,40"
            fill="none"
            className="stroke-gold"
            strokeOpacity="0.55"
            strokeWidth="1.5"
          />
          <path
            d="M0,66 C60,56 120,74 200,64 C280,54 340,70 430,62 C520,54 600,38 700,46 C800,54 880,68 980,62 C1080,56 1150,42 1240,50 C1320,57 1380,48 1440,44"
            fill="none"
            className="stroke-brown"
            strokeOpacity="0.25"
            strokeWidth="2"
          />
        </svg>
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