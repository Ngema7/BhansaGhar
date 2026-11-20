export default function SectionHeading({ title, subtitle, nepali, light = false, align = 'center', className = '' }) {
  return (
    <div data-reveal className={`${align === 'center' ? 'text-center' : ''} ${className}`}>
      <h2 className={`text-3xl font-semibold sm:text-4xl ${light ? 'text-cream' : 'text-maroon'}`}>{title}</h2>
      {nepali && <p className={`mt-1 font-deva text-lg ${light ? 'text-gold' : 'text-brick'}`}>{nepali}</p>}
      {subtitle && <p className={`mt-2 text-sm ${light ? 'text-cream/80' : 'text-brown/75'}`}>{subtitle}</p>}
      {align === 'center' && <div className="gold-line mt-4"><span /></div>}
    </div>
  );
}
