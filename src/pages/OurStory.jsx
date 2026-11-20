import { ArrowRight, Wheat, Leaf, HeartHandshake, ChefHat, Users, Landmark, Flame } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import SmartImage from '../components/SmartImage.jsx';
import SectionHeading from '../components/SectionHeading.jsx';
import Button from '../components/Button.jsx';
import { images } from '../data/images.js';

const philosophy = [
  { Icon: Wheat, title: 'Authentic Recipes', np: 'सम्पूर्ण स्वाद' },
  { Icon: Leaf, title: 'Fresh Ingredients', np: 'ताजा सामग्री' },
  { Icon: HeartHandshake, title: 'Warm Hospitality', np: 'आत्मीय आतिथ्य' },
];
const values = [
  { Icon: Landmark, title: 'Nepali Culinary Heritage', text: 'From Newari feasts to mountain thukpa, every dish carries the memory of a region.' },
  { Icon: Flame, title: 'Traditional Cooking Techniques', text: 'Charcoal grilling, slow simmering and hand-ground spices, done the old way.' },
  { Icon: Leaf, title: 'Local Ingredients', text: 'Timur, jimbu, fresh greens and grains sourced from Nepali growers where we can.' },
  { Icon: Users, title: 'Family and Hospitality', text: 'Guests are treated as family, because in Nepal, the guest is a god.' },
  { Icon: ChefHat, title: 'Cultural Identity', text: 'Our space, music and service celebrate the craft and character of Nepal.' },
];

export default function OurStory() {
  return (
    <>
      <PageHero title="Our Story" nepali="हाम्रो कथा" image={images.story.interior} />
      <section className="paper py-16 sm:py-20">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <div data-reveal>
            <p className="text-sm text-brick">Our Heritage</p>
            <h2 className="mt-2 text-3xl font-semibold leading-tight text-maroon sm:text-4xl">More Than Food,<br />It's Our Heritage.</h2>
            <div className="mt-4 h-px w-16 bg-gold" />
            <p className="mt-5 max-w-lg leading-relaxed text-brown/85">
              At Bhansa Ghar, we bring together the rich culinary traditions of Nepal with warm hospitality. Our journey is rooted in Nepali culture, flavors and the joy of sharing good food.
            </p>
            <Button to="/menu" className="mt-6">Discover Our Journey <ArrowRight size={16} /></Button>
          </div>
          <div data-img-reveal className="relative mx-auto w-full max-w-lg">
            <div className="rotate-2 ornate-border bg-cream p-3 shadow-lift">
              <SmartImage src={images.story.temple} alt="Traditional Nepali pagoda temple" className="aspect-[4/5] w-full" tone="dark" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream-dark/60 py-16">
        <div className="container-x">
          <SectionHeading title="Our Philosophy" nepali="हाम्रो दर्शन" />
          <div data-stagger className="mt-10 grid gap-8 sm:grid-cols-3">
            {philosophy.map(({ Icon, title, np }) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold text-gold"><Icon size={28} strokeWidth={1.4} /></span>
                <h3 className="mt-4 text-lg font-semibold text-maroon">{title}</h3>
                <p className="font-deva text-sm text-brick">{np}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="paper py-16 sm:py-20">
        <div className="container-x">
          <SectionHeading title="Our Values" subtitle="What guides every plate we serve." />
          <div className="mt-12 space-y-6">
            {values.map(({ Icon, title, text }, i) => (
              <div key={title} data-reveal className={`flex items-start gap-5 border-b border-gold/40 pb-6 sm:w-4/5 ${i % 2 ? 'sm:ml-auto' : ''}`}>
                <span className="flex h-12 w-12 shrink-0 items-center justify-center bg-maroon text-gold"><Icon size={22} strokeWidth={1.4} /></span>
                <div><h3 className="text-xl font-semibold text-maroon">{title}</h3><p className="mt-1 text-sm leading-relaxed text-brown/80">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-maroon py-20 text-center">
        <SmartImage src={images.mountain} alt="" fallback="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-36 opacity-40" imgClassName="!object-contain !object-bottom" data-float />
        <div className="container-x relative" data-reveal>
          <h2 className="text-3xl font-semibold text-cream sm:text-5xl">Come Experience Our Heritage.</h2>
          <Button to="/menu" className="mt-7">Explore Our Menu <ArrowRight size={16} /></Button>
        </div>
      </section>
    </>
  );
}
