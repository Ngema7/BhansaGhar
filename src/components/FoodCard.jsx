import { Link } from 'react-router-dom';
import SmartImage from './SmartImage.jsx';
import { hoverLift } from '../hooks/useGsapAnimation.js';

/** variant="signature" links to the menu; variant="menu" shows price. */
export default function FoodCard({ name, desc, image, price, to, variant = 'menu' }) {
  const body = (
    <>
      <SmartImage src={image} alt={name} className="aspect-[4/3] w-full" imgClassName="transition-transform duration-700 group-hover:scale-105" />
      <div className="px-3 pb-4 pt-3 text-center">
        <h3 className="font-serif text-base font-semibold text-maroon">{name}</h3>
        {desc && <p className="mt-1 text-xs leading-relaxed text-brown/70">{desc}</p>}
        {price != null && <p className="mt-2 text-sm font-medium text-brick">Rs. {price}</p>}
      </div>
    </>
  );
  const cls = 'group block overflow-hidden rounded-sm border border-gold/60 bg-cream shadow-card transition-shadow hover:shadow-lift';
  const hover = { onMouseEnter: (e) => hoverLift(e, true), onMouseLeave: (e) => hoverLift(e, false) };
  return variant === 'signature' && to
    ? <Link to={to} className={cls} {...hover}>{body}</Link>
    : <article className={cls} {...hover}>{body}</article>;
}
