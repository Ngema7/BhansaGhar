import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Landmark } from 'lucide-react';
import { images } from '../data/images.js';

export default function Logo({ size = 'md' }) {
  const [failed, setFailed] = useState(false);
  const box = size === 'lg' ? 'h-14 w-14' : 'h-10 w-10';
  return (
    <Link to="/" aria-label="Bhansa Ghar home" className="flex items-center gap-3">
      {failed ? (
        <span className={`${box} flex items-center justify-center rounded-sm border border-gold/70 text-gold`}>
          <Landmark size={size === 'lg' ? 28 : 22} strokeWidth={1.3} />
        </span>
      ) : (
        <img src={images.logo} alt="" className={`${box} object-contain`} onError={() => setFailed(true)} />
      )}
      <span className="leading-none">
        <span className="block font-serif text-lg font-semibold tracking-wider text-gold sm:text-xl">BHANSA GHAR</span>
        <span className="mt-1 block text-[8px] tracking-[0.25em] text-gold/80 sm:text-[9px]">AUTHENTIC NEPALI CUISINE</span>
      </span>
    </Link>
  );
}
