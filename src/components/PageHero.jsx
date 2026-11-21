import SmartImage from './SmartImage.jsx';
import { images } from '../data/images.js';

export default function PageHero({ title, nepali, image }) {
  return (
    <section className="relative overflow-hidden bg-brown">
      {/* background image: same size/position style as Home hero */}
      <div className="absolute inset-0" aria-hidden="true">
        <SmartImage
          src={image || images.hero.restaurant}
          alt=""
          className="h-full w-full"
          position="70% center"
          eager
        />
      </div>

      {/* dark fade: left dark for text, image visible on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-brown/90 via-brown/45 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-brown/70 via-transparent to-brown/30" />

      {/* top-left gold ornament */}
      <SmartImage
        src={images.pattern}
        alt=""
        fallback="none"
        className="pointer-events-none absolute left-2 top-4 z-[6] h-28 w-44 opacity-80"
        imgClassName="!object-contain !object-left-top"
        data-float
      />

      {/* content */}
      <div className="container-x relative z-10 flex min-h-[300px] items-center pb-20 pt-10 sm:min-h-[360px] lg:min-h-[400px]">
        <div className="max-w-xl">
          <h1 data-hero-title className="font-serif text-4xl font-semibold leading-tight text-cream drop-shadow-lg sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {nepali && (
            <p data-hero-title className="mt-3 font-deva text-2xl font-semibold text-gold drop-shadow sm:text-3xl">
              {nepali}
            </p>
          )}
          <div data-hero-title className="gold-line mt-6 max-w-[240px]"><span /></div>
        </div>
      </div>

      {/* soft torn-paper curve (same as Home hero) */}
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
  );
}