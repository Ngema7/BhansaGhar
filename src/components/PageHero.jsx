import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import SmartImage from './SmartImage.jsx';

export default function PageHero({ title, nepali, image, crumb, position }) {
  return (
    <section className="relative overflow-hidden bg-brown">
      <div className="absolute inset-0" aria-hidden="true">
        <SmartImage src={image} alt="" className="h-full w-full" imgClassName="" position={position} data-parallax eager />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-maroon/70 via-brown/55 to-maroon/80" />
      <div className="container-x relative z-10 flex min-h-[260px] flex-col items-center justify-center pb-16 pt-12 text-center sm:min-h-[320px]">
        <h1 data-hero-title className="text-4xl font-semibold text-cream drop-shadow sm:text-5xl lg:text-6xl">{title}</h1>
        <p data-hero-title className="mt-2 font-deva text-2xl text-gold sm:text-3xl">{nepali}</p>
        <nav aria-label="Breadcrumb" data-hero-title className="mt-4 flex items-center gap-2 text-xs text-cream/85">
          <Link to="/" className="hover:text-gold">Home</Link>
          <ChevronRight size={12} className="text-gold" />
          <span>{crumb || title}</span>
        </nav>
      </div>
      <div className="torn-edge absolute -bottom-px left-0 right-0 bg-cream" aria-hidden="true" />
    </section>
  );
}
