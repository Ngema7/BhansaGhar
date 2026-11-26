import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UtensilsCrossed,
  Tags,
  CalendarDays,
  Clock,
  Plus,
  Images,
  Settings,
   FileText,
  ArrowRight,
  Info,
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import VisitorsChart from '../components/VisitorsChart.jsx';
import { ADMIN_BASE } from '../config.js';
import { makeSampleSeries } from '../data/sampleDashboard.js';

const QUICK_ACTIONS = [
  { label: 'Add New Dish', to: `${ADMIN_BASE}/menu`, icon: Plus },
  { label: 'Upload Gallery', to: `${ADMIN_BASE}/gallery`, icon: Images },
  { label: 'View Reservations', to: `${ADMIN_BASE}/reservations`, icon: CalendarDays },
  { label: 'Edit Homepage', to: `${ADMIN_BASE}/homepage`, icon: FileText },
];

const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

function fmtDate(d) {
  return new Date(`${d}T00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const todayStr = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

export default function Dashboard() {
  const [days, setDays] = useState(30);
  const series = useMemo(() => makeSampleSeries(days), [days]);

  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    const today = todayStr();

    // count: 'exact', head: true = पङ्क्ति नल्याई गन्ती मात्र ल्याउने (छिटो)
    const count = (table, filter) => {
      let q = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) q = filter(q);
      return q;
    };

    const [menu, cats, total, pending, todayRes, recentRes] = await Promise.all([
      count('menu_items'),
      count('categories'),
      count('reservations'),
      count('reservations', (q) => q.eq('status', 'pending')),
      count('reservations', (q) => q.eq('reservation_date', today).neq('status', 'cancelled')),
      supabase
        .from('reservations')
        .select('id, name, reservation_date, reservation_time, guests, status')
        .order('created_at', { ascending: false })
        .limit(5),
    ]);

    if ([menu, cats, total, pending, todayRes, recentRes].some((r) => r.error)) {
      setError('Could not load some dashboard data.');
      return;
    }

    setStats({
      menuItems: menu.count,
      categories: cats.count,
      reservations: total.count,
      pending: pending.count,
      today: todayRes.count,
    });
    setRecent(recentRes.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const val = (n) => (stats ? n : '…');

  return (
    <div className="space-y-6">
      {error && (
        <div className="flex items-center justify-between rounded-sm border border-brick/40 bg-brick/10 p-3 text-sm text-brick">
          <span>{error}</span>
          <button onClick={load} className="underline">
            Retry
          </button>
        </div>
      )}

      <section className="relative overflow-hidden rounded-sm bg-gradient-to-r from-maroon via-brick to-gold/80 p-6 shadow-card sm:p-10">
        <h1 className="font-serif text-3xl text-cream sm:text-4xl">Welcome Back, Admin!</h1>
        <p className="mt-2 text-cream/90">Manage your restaurant with ease.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={UtensilsCrossed} label="Total Menu Items" value={val(stats?.menuItems)} />
        <StatCard icon={Tags} label="Total Categories" value={val(stats?.categories)} tone="gold" />
        <StatCard icon={CalendarDays} label="Total Reservations" value={val(stats?.reservations)} />
        <StatCard icon={Clock} label="Pending Reservations" value={val(stats?.pending)} tone="gold" />
      </section>

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
          <div className="mb-3 flex items-start gap-2 rounded-sm border border-gold/60 bg-gold/20 p-2 text-xs text-brown">
            <Info size={15} className="mt-0.5 shrink-0 text-maroon" />
            <span>
              <strong>Sample data:</strong> this chart is a placeholder. Real visitor tracking will be added later.
            </span>
          </div>
          <VisitorsChart data={series} />
        </div>

        <div className="overflow-hidden rounded-sm border border-gold/40 bg-white/50 shadow-card">
          <h2 className="bg-maroon px-5 py-3 font-serif text-xl text-gold">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3 p-4">
            {QUICK_ACTIONS.map(({ label: text, to, icon: Icon }) => (
              <Link
                key={text}
                to={to}
                className="flex flex-col items-center gap-2 rounded-sm border border-gold/40 bg-cream p-4 text-center text-sm text-brown transition-colors hover:border-gold hover:bg-gold/20"
              >
                <Icon size={24} className="text-maroon" />
                {text}
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

          {!stats ? (
            <p className="text-sm text-brown/70">Loading...</p>
          ) : recent.length === 0 ? (
            <p className="text-sm text-brown/70">No reservations yet.</p>
          ) : (
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
                  {recent.map((r) => (
                    <tr key={r.id} className="border-b border-gold/20 last:border-0">
                      <td className="px-3 py-2.5 text-brown">{r.name}</td>
                      <td className="px-3 py-2.5 text-brown/80">
                        {fmtDate(r.reservation_date)} • {fmtTime(r.reservation_time)}
                      </td>
                      <td className="px-3 py-2.5 text-brown/80">{r.guests}</td>
                      <td className="px-3 py-2.5">
                        <StatusBadge status={label(r.status)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card">
          <h2 className="mb-4 font-serif text-xl text-maroon">Today</h2>
          <p className="font-serif text-5xl font-semibold text-maroon">{val(stats?.today)}</p>
          <p className="mt-1 text-sm text-brown/70">
            reservation{stats?.today === 1 ? '' : 's'} for today (excluding cancelled)
          </p>
          <Link
            to={`${ADMIN_BASE}/reservations`}
            className="mt-4 inline-flex items-center gap-1 text-sm text-maroon hover:text-brick"
          >
            Manage reservations <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}