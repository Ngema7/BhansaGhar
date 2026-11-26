import { useCallback, useEffect, useMemo, useState } from 'react';
import { Search, Trash2, ChevronDown, ChevronUp, Phone, MessageCircle, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';
import StatusBadge from '../components/StatusBadge.jsx';

// 'pending' -> 'Pending' (StatusBadge ले ठूलो अक्षर खोज्छ)
const label = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// '19:00:00' -> '7:00 PM'
function fmtTime(t) {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
}

// '2026-11-27' -> 'Fri, 27 Nov 2026'
function fmtDate(d) {
  return new Date(`${d}T00:00`).toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const todayStr = () =>
  new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];

// WhatsApp को लागि नम्बरबाट अंक मात्र (+ र space हटाउने)
const waNumber = (phone) => phone.replace(/\D/g, '');

export default function Reservations() {
  const toast = useToast();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const [openId, setOpenId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: false })
      .order('reservation_time', { ascending: false });
    if (error) {
      setLoadError('Could not load reservations. Please try again.');
    } else {
      setRows(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const today = todayStr();

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchDate =
        dateFilter === 'all' ||
        (dateFilter === 'today' && r.reservation_date === today) ||
        (dateFilter === 'upcoming' && r.reservation_date >= today) ||
        (dateFilter === 'past' && r.reservation_date < today);
      return matchSearch && matchStatus && matchDate;
    });
  }, [rows, search, statusFilter, dateFilter, today]);

  // status बदल्ने: पहिले स्क्रिन, असफल भए फर्काउने
  async function changeStatus(row, status) {
    const previous = row.status;
    setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status } : r)));
    const { error } = await supabase.from('reservations').update({ status }).eq('id', row.id);
    if (error) {
      setRows((list) => list.map((r) => (r.id === row.id ? { ...r, status: previous } : r)));
      toast.show('Could not update the status.', 'error');
      return;
    }
    toast.show(`Marked as ${label(status)}.`);
  }

  async function confirmDelete(id) {
    setBusy(true);
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    setBusy(false);
    setDeleteId(null);
    if (error) {
      toast.show('Could not delete the reservation.', 'error');
      return;
    }
    setRows((list) => list.filter((r) => r.id !== id));
    toast.show('Reservation deleted.');
  }

  const inputClass =
    'rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';

  const pendingCount = rows.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Reservations</h1>
        <div className="my-3 h-px w-20 bg-gold" />
        <p className="text-sm text-brown/70">
          Requests sent from the website. Confirm or cancel them, and contact guests by phone or WhatsApp.
          {!loading && !loadError && ` ${pendingCount} pending.`}
        </p>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brick/60" />
          <input
            className={`${inputClass} w-full pl-10`}
            placeholder="Search by name, phone or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search reservations"
          />
        </div>
        <select
          className={inputClass}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          className={inputClass}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
        >
          <option value="all">All dates</option>
          <option value="today">Today</option>
          <option value="upcoming">Today &amp; upcoming</option>
          <option value="past">Past</option>
        </select>
      </div>

      <div className="rounded-sm border border-gold/40 bg-white/50 shadow-card">
        {loading ? (
          <p className="p-6 text-sm text-brown/70">Loading...</p>
        ) : loadError ? (
          <div className="p-6 text-sm text-brick">
            {loadError}{' '}
            <button onClick={load} className="underline">
              Retry
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="p-6 text-sm text-brown/70">
            {rows.length === 0 ? 'No reservations yet.' : 'No reservations match your filters.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="bg-cream-dark/60 text-brown/80">
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-4 py-3 font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Change status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              {visible.map((r) => (
                <tbody key={r.id} className="border-t border-gold/20">
                  <tr>
                    <td className="px-4 py-3">
                      <p className="font-medium text-brown">{r.name}</p>
                      <p className="text-xs text-brown/60">{r.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-brown/80">
                      {fmtDate(r.reservation_date)}
                      <br />
                      <span className="text-xs">{fmtTime(r.reservation_time)}</span>
                    </td>
                    <td className="px-4 py-3 text-brown/80">{r.guests}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={label(r.status)} />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className={`${inputClass} py-1.5`}
                        value={r.status}
                        onChange={(e) => changeStatus(r, e.target.value)}
                        aria-label={`Change status for ${r.name}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {deleteId === r.id ? (
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => confirmDelete(r.id)}
                            disabled={busy}
                            className="rounded-sm bg-brick px-2.5 py-1 text-cream hover:bg-maroon disabled:opacity-60"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="rounded-sm border border-gold/60 px-2.5 py-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setOpenId(openId === r.id ? null : r.id)}
                            aria-label={`Details for ${r.name}`}
                            aria-expanded={openId === r.id}
                            className="rounded-sm p-2 text-maroon hover:bg-gold/20"
                          >
                            {openId === r.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <button
                            onClick={() => setDeleteId(r.id)}
                            aria-label={`Delete reservation of ${r.name}`}
                            className="rounded-sm p-2 text-brick hover:bg-brick/10"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>

                  {openId === r.id && (
                    <tr className="bg-cream/60">
                      <td colSpan={6} className="px-4 py-4">
                        <div className="grid gap-4 text-sm sm:grid-cols-2">
                          <div className="space-y-1">
                            <p>
                              <span className="text-brown/60">Email: </span>
                              <span className="break-all">{r.email}</span>
                            </p>
                            <p>
                              <span className="text-brown/60">Phone: </span>
                              {r.phone}
                            </p>
                            <p>
                              <span className="text-brown/60">Received: </span>
                              {new Date(r.created_at).toLocaleString('en-GB')}
                            </p>
                          </div>
                          <div>
                            <p className="text-brown/60">Special requests</p>
                            <p className="whitespace-pre-wrap break-words">{r.requests || 'None'}</p>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <a
                            href={`tel:${r.phone}`}
                            className="inline-flex items-center gap-1.5 rounded-sm border border-gold/60 px-3 py-1.5 text-sm hover:bg-gold/20"
                          >
                            <Phone size={15} /> Call
                          </a>
                          <a
                            href={`https://wa.me/${waNumber(r.phone)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-sm border border-gold/60 px-3 py-1.5 text-sm hover:bg-gold/20"
                          >
                            <MessageCircle size={15} /> WhatsApp
                          </a>
                          <a
                            href={`mailto:${r.email}`}
                            className="inline-flex items-center gap-1.5 rounded-sm border border-gold/60 px-3 py-1.5 text-sm hover:bg-gold/20"
                          >
                            <Mail size={15} /> Email
                          </a>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              ))}
            </table>
          </div>
        )}
      </div>

      {!loading && !loadError && (
        <p className="text-xs text-brown/60">
          Showing {visible.length} of {rows.length} reservations.
        </p>
      )}
    </div>
  );
}