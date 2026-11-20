import { useState } from 'react';
import { ImageIcon } from 'lucide-react';

/**
 * PNG image with a graceful placeholder when the file is missing.
 * Size/ratio come from the wrapper `className` (e.g. "aspect-[4/3]" or "h-full").
 * fallback="none" renders nothing if the image fails (for decorations).
 */
export default function SmartImage({
  src, alt = '', className = '', imgClassName = '', tone = 'dark',
  eager = false, fallback = 'box', position = 'center', ...rest
}) {
  const [failed, setFailed] = useState(false);
  if (failed && fallback === 'none') return null;
  const name = src?.split('/').pop();
  const bg = tone === 'dark'
    ? 'bg-gradient-to-br from-brown via-maroon-dark to-maroon text-gold/70'
    : 'bg-gradient-to-br from-cream-dark to-cream text-brick/60';

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {failed ? (
        <div role="img" aria-label={alt} className={`absolute inset-0 flex flex-col items-center justify-center gap-1 ${bg}`}>
          <ImageIcon size={22} strokeWidth={1.4} />
          <span className="px-2 text-center text-[10px] tracking-wide opacity-80">{name}</span>
        </div>
      ) : (
        <img
          src={src} alt={alt} decoding="async"
          loading={eager ? 'eager' : 'lazy'}
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover ${imgClassName}`}
          style={{ objectPosition: position }}
          {...rest}
        />
      )}
    </div>
  );
}
