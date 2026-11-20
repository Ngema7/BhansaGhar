import { Link } from 'react-router-dom';
import { hoverLift } from '../hooks/useGsapAnimation.js';

const variants = { gold: 'btn-gold', outline: 'btn-outline', maroon: 'btn-maroon' };

/** Use `to` for routes, `href` for external links, or onClick/type for actions. */
export default function Button({ to, href, variant = 'gold', className = '', children, ...rest }) {
  const cls = `${variants[variant]} ${className}`;
  const hover = { onMouseEnter: (e) => hoverLift(e, true), onMouseLeave: (e) => hoverLift(e, false) };
  if (to) return <Link to={to} className={cls} {...hover} {...rest}>{children}</Link>;
  if (href) return <a href={href} className={cls} {...hover} {...rest}>{children}</a>;
  return <button className={cls} {...hover} {...rest}>{children}</button>;
}
