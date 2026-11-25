import { NavLink, useNavigate } from 'react-router-dom';
import { LogOut, X } from 'lucide-react';
import { NAV_ITEMS } from '../navItems.js';
import { ADMIN_BASE } from '../config.js';

import { useAuth } from '../context/AuthContext.jsx';

// props: open = फोनमा sidebar खुला छ कि छैन, onClose = बन्द गर्ने function
export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
    const { signOut } = useAuth();

  async function handleLogout() {
    onClose();
    await signOut();
    navigate(ADMIN_BASE, { replace: true });
  }

  return (
    <>
      {/* फोनमा sidebar खुल्दा पछाडिको कालो पर्दा */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-brown/60 lg:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-maroon text-cream transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="relative border-b border-gold/30 px-5 py-6 text-center">
          <h1 className="font-serif text-2xl tracking-wide text-gold">BHANSA GHAR</h1>
          <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream/70">
            Authentic Nepali Cuisine
          </p>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="absolute right-3 top-3 text-cream/70 hover:text-gold lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu links */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {NAV_ITEMS.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-sm px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? 'bg-gold font-medium text-maroon shadow-card'
                    : 'text-cream/90 hover:bg-brick/40 hover:text-gold'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gold/30 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-sm px-4 py-2.5 text-sm text-cream/90 transition-colors hover:bg-brick/40 hover:text-gold"
          >
            <LogOut size={19} />
            Logout
          </button>
          <p className="mt-3 text-center font-serif text-sm italic text-gold/70">
            Taste Nepal. Feel at Home.
          </p>
        </div>
      </aside>
    </>
  );
}