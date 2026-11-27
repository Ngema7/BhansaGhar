import { useCallback, useEffect, useState } from 'react';
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
} from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import StatCard from '../components/StatCard.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import ActivityChart from '../components/ActivityChart.jsx';
import { ADMIN_BASE } from '../config.js';

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

// local मितिलाई 'YYYY-MM-DD' बनाउने
const dateKey = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const todayStr = () => dateKey(new Date());

// एउटा sitting को जम्मा रकम (cancelled बाहेक)
const sessionAmount = (s) =>
  s.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((a, o) => a + o.order_items.reduce((b, i) => b + i.unit_price * i.quantity, 0), 0);

const sumSessions = (list) => list.reduce((t, s) => t + sessionAmount(s), 0);

const SESSION_SELECT = 'id, closed_at, orders(status, order_items(unit_price, quantity))';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [error, setError] = useState('');

  // graph
  const [days, setDays] = useState(30);
  const [metric, setMetric] = useState('sales'); // sales | reservations
  const [chartData, setChartData] = useState(null); // { sales: [...], reservations: [...] }
  const [chartError, setChartError] = useState('');

  const load = useCallback(async () => {
    setError('');
    const today = todayStr();
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const count = (table, filter) => {
      let q = supabase.from(table).select('*', { count: 'exact', head: true });
      if (filter) q = filter(q);
      return q;
    };

    const [menu, cats, total, pending, todayRes, recentRes, paidRes, openRes] = await Promise.all([
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
      supabase
        .from('table_sessions')
        .select(SESSION_SELECT)
        .not('closed_at', 'is', null)
        .gte('closed_at', startOfDay.toISOString()),
      supabase.from('table_sessions').select(SESSION_SELECT).is('closed_at', null),
    ]);

    if ([menu, cats, total, pending, todayRes, recentRes, paidRes, openRes].some((r) => r.error)) {
      setError('Could not load some dashboard data.');
      return;
    }

    setStats({
      menuItems: menu.count,
      categories: cats.count,
      reservations: total.count,
      pending: pending.count,
      today: todayRes.count,
      sales: sumSessions(paidRes.data),
      paidTables: paidRes.data.length,
      openTotal: sumSessions(openRes.data),
      openTables: openRes.data.length,
    });
    setRecent(recentRes.data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // graph को data: days बदलिँदा फेरि ल्याउने
  useEffect(() => {
    let active = true;
    setChartData(null);
    setChartError('');

    const dayList = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      dayList.push(d);
    }
    const startKey = dateKey(dayList[0]);
    const endKey = dateKey(dayList[dayList.length - 1]);

    Promise.all([
      supabase
        .from('reservations')
        .select('reservation_date, status')
        .gte('reservation_date', startKey)
        .lte('reservation_date', endKey)
        .neq('status', 'cancelled'),
      supabase
        .from('table_sessions')
        .select(SESSION_SELECT)
        .not('closed_at', 'is', null)
        .gte('closed_at', dayList[0].toISOString()),
    ]).then(([resRes, sesRes]) => {
      if (!active) return;
      if (resRes.error || sesRes.error) {
        setChartError('Could not load the chart.');
        return;
      }
      const resByDay = {};
      resRes.data.forEach((r) => {
        resByDay[r.reservation_date] = (resByDay[r.reservation_date] || 0) + 1;
      });
      const salesByDay = {};
      sesRes.data.forEach((s) => {
        const k = dateKey(new Date(s.closed_at));
        salesByDay[k] = (salesByDay[k] || 0) + sessionAmount(s);
      });

      const lab = (d) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      setChartData({
        sales: dayList.map((d) => ({ label: lab(d), value: salesByDay[dateKey(d)] || 0 })),
        reservations: dayList.map((d) => ({ label: lab(d), value: resByDay[dateKey(d)] || 0 })),
      });
    });

    return () => {
      active = false;
    };
  }, [days]);

  const val = (n) => (stats ? n : '…');
  const chartTotal = chartData ? chartData[metric].reduce((a, d) => a + d.value, 0) : 0;

  const selectClass =
    'rounded-sm border border-gold/60 bg-cream px-3 py-1.5 text-sm text-brown focus:border-gold focus:outline-none';

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
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-serif text-xl text-maroon">Activity</h2>
            <div className="flex gap-2">
              <select
                value={metric}
                onChange={(e) => setMetric(e.target.value)}
                className={selectClass}
                aria-label="Chart type"
              >
                <option value="sales">Sales (Rs.)</option>
                <option value="reservations">Reservations</option>
              </select>
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className={selectClass}
                aria-label="Period"
              >
                <option value={7}>Last 7 Days</option>
                <option value={30}>Last 30 Days</option>
              </select>
            </div>
          </div>

          {chartError ? (
            <p className="text-sm text-brick">{chartError}</p>
          ) : !chartData ? (
            <p className="py-10 text-center text-sm text-brown/70">Loading...</p>
          ) : (
            <>
              <p className="mb-2 text-xs text-brown/70">
                {metric === 'sales'
                  ? `Total paid sales: Rs. ${chartTotal}`
                  : `Total reservations (excluding cancelled): ${chartTotal}`}
              </p>
              <ActivityChart
                data={chartData[metric]}
                color={metric === 'sales' ? '#4A1719' : '#DDA44C'}
                prefix={metric === 'sales' ? 'Rs. ' : ''}
              />
              <p className="mt-2 text-xs text-brown/60">
                {metric === 'sales'
                  ? 'Sales count tables closed as paid, by the day they were closed.'
                  : 'Reservations are counted by the reservation date.'}
              </p>
            </>
          )}
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
          <h2 className="mb-3 font-serif text-xl text-maroon">Today</h2>
          <p className="text-xs text-brown/60">Sales (paid tables)</p>
          <p className="font-serif text-4xl font-semibold text-maroon">
            {stats ? `Rs. ${stats.sales}` : '…'}
          </p>
          <p className="text-xs text-brown/60">{stats ? `${stats.paidTables} table(s) closed` : ''}</p>

          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-gold/30 pt-3 text-sm">
            <div>
              <p className="text-xs text-brown/60">Open tables</p>
              <p className="font-medium text-brown">
                {stats ? `${stats.openTables} · Rs. ${stats.openTotal}` : '…'}
              </p>
            </div>
            <div>
              <p className="text-xs text-brown/60">Reservations</p>
              <p className="font-medium text-brown">{val(stats?.today)}</p>
            </div>
          </div>

          <Link
            to={`${ADMIN_BASE}/orders`}
            className="mt-4 inline-flex items-center gap-1 text-sm text-maroon hover:text-brick"
          >
            View orders <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}