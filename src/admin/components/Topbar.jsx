import { Menu, ExternalLink } from 'lucide-react';

// props: onMenuClick = ☰ थिच्दा चल्ने function
export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-gold/30 bg-maroon px-4 text-cream sm:px-6">
      {/* ☰ बटन: ठूलो screen मा लुकेको */}
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-sm p-2 text-cream hover:bg-brick/40 lg:hidden"
      >
        <Menu size={22} />
      </button>

      {/* ठूलो screen मा बायाँ खाली ठाउँ */}
      <div className="hidden lg:block" />

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Public website नयाँ tab मा खोल्छ */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-sm text-cream/90 hover:text-gold"
        >
          <ExternalLink size={16} />
          <span className="hidden sm:inline">View Website</span>
        </a>

        <div className="flex items-center gap-2 text-sm">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="hidden sm:inline">Online</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold font-serif text-base font-semibold text-maroon">
            A
          </div>
          <span className="hidden text-sm sm:inline">Admin</span>
        </div>
      </div>
    </header>
  );
}