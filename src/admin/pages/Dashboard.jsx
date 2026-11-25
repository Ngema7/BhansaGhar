import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Tags,
  CalendarDays,
  Clock,
  Plus,
  Images,
  Settings,
  MessageSquare,
  ArrowRight,
  Info,
} from 'lucide-react';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import VisitorsChart from '../components/VisitorsChart.jsx';
import { ADMIN_BASE } from '../config.js';
import {
  SAMPLE_STATS,
  SAMPLE_RESERVATIONS,
  SAMPLE_POPULAR_DISHES,
  makeSampleSeries,
} from '../data/sampleDashboard.js';

// Quick Actions का बटनहरू
const QUICK_ACTIONS = [
  { label: 'Add New Dish', to: `${ADMIN_BASE}/menu`, icon: Plus },
  { label: 'Upload Gallery', to: `${ADMIN_BASE}/gallery`, icon: Images },
  { label: 'View Reservations', to: `${ADMIN_BASE}/reservations`, icon: CalendarDays },
  { label: 'View Messages', to: `${ADMIN_BASE}/messages`, icon: MessageSquare },
];

export default function Dashboard() {
  // कति दिनको चार्ट हेर्ने (७ वा ३०)
  const [days, setDays] = useState(30);
  const series = useMemo(() => makeSampleSeries(days), [days]);

  const topCount = SAMPLE_POPULAR_DISHES[0].count; // सबैभन्दा लोकप्रियको नम्बर (bar को लागि)

  return (
    <div className="space-y-6">
      {/* Sample data चेतावनी */}
      <div className="flex items-start gap-2 rounded-sm border border-gold/60 bg-gold/20 p-3 text-sm text-brown">
        <Info size={18} className="mt-0.5 shrink-0 text-maroon" />
        <span>
          <strong>Sample data:</strong> The numbers on this page are placeholders. Real data will
          appear after the backend is connected.
        </span>
      </div>

      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-sm bg-gradient-to-r from-maroon via-brick to-gold/80 p-6 shadow-card sm:p-10">
        <h1 className="font-serif text-3xl text-cream sm:text-4xl">Welcome Back, Admin!</h1>
        <p className="mt-2 text-cream/90">Manage your restaurant with ease.</p>
      </section>

      {/* ४ वटा stat card */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UtensilsCrossed} label="Total Menu Items" value={SAMPLE_STATS.menuItems} />
        <StatCard icon={Tags} label="Total Categories" value={SAMPLE_STATS.categories} tone="gold" />
        <StatCard icon={CalendarDays} label="Total Reservations" value={SAMPLE_STATS.reservations} />
        <StatCard icon={Clock} label="Pending Reservations" value={SAMPLE_STATS.pending} tone="gold" />
      </section>

      {/* Chart + Quick actions */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-maroon">Website Analytics</h2>
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="rounded-sm border border-gold/60 bg-cream px-3 py-1.5 text-sm text-brown focus:border-gold focus:outline-none"
            >
              <option value={7}>Last 7 Days</option>
              <option value={30}>Last 30 Days</option>
            </select>
          </div>
          <VisitorsChart data={series} />
        </div>

        <div className="overflow-hidden rounded-sm border border-gold/40 bg-white/50 shadow-card">
          <h2 className="bg-maroon px-5 py-3 font-serif text-xl text-gold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 p-4">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex flex-col items-center gap-2 rounded-sm border border-gold/40 bg-cream p-4 text-center text-sm text-brown transition-colors hover:border-gold hover:bg-gold/20"
              >
                <Icon size={24} className="text-maroon" />
                {label}
              </Link>
            ))}
            <Link
              to={`${ADMIN_BASE}/settings`}
              className="col-span-2 flex items-center justify-center gap-2 rounded-sm border border-gold/40 bg-cream p-3 text-sm text-brown transition-colors hover:border-gold hover:bg-gold/20"
            >
              <Settings size={20} className="text-maroon" />
              Website Settings
            </Link>
          </div>
        </div>
      </section>

      {/* Recent reservations + Popular dishes */}
      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-serif text-xl text-maroon">Recent Reservations</h2>
            <Link
              to={`${ADMIN_BASE}/reservations`}
              className="flex items-center gap-1 text-sm text-maroon hover:text-brick"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {/* overflow-x-auto = सानो फोनमा तालिका अगाडि-पछाडि सार्न मिल्ने */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="bg-cream-dark/60 text-brown/80">
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Date &amp; Time</th>
                  <th className="px-3 py-2 font-medium">Guests</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {SAMPLE_RESERVATIONS.map((r) => (
                  <tr key={r.id} className="border-b border-gold/20 last:border-0">
                    <td className="px-3 py-2.5 text-brown">{r.name}</td>
                    <td className="px-3 py-2.5 text-brown/80">{r.when}</td>
                    <td className="px-3 py-2.5 text-brown/80">{r.guests}</td>
                    <td className="px-3 py-2.5">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card">
          <h2 className="mb-4 font-serif text-xl text-maroon">Popular Dishes</h2>
          <ul className="space-y-4">
            {SAMPLE_POPULAR_DISHES.map((dish) => (
              <li key={dish.name}>
                <div className="mb-1 flex justify-between text-sm text-brown">
                  <span>{dish.name}</span>
                  <span className="text-brown/70">{dish.count}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-cream-dark">
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{ width: `${(dish.count / topCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}