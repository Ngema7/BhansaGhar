import { useCallback, useEffect, useState } from 'react';
import { Printer, RefreshCw, X, ChefHat, Check, Ban, Lock } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';
import { useSite } from '../../context/SiteContext.jsx';

const STATUS_LABEL = { new: 'New', preparing: 'Preparing', served: 'Served', cancelled: 'Cancelled' };
const STATUS_STYLE = {
  new: 'bg-gold/30 text-brown',
  preparing: 'bg-brick/15 text-brick',
  served: 'bg-green-100 text-green-800',
  cancelled: 'bg-brown/10 text-brown/60',
};

const time = (iso) => new Date(iso).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
const sessionTotal = (s) =>
  s.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.order_items.reduce((a, i) => a + i.unit_price * i.quantity, 0), 0);

export default function Orders() {
  const toast = useToast();
  const site = useSite();
  const [sessions, setSessions] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [closeId, setCloseId] = useState(null);
  const [billSession, setBillSession] = useState(null);

  const select =
    'id, opened_at, closed_at, restaurant_tables(name), orders(id, status, note, created_at, order_items(id, name, unit_price, quantity))';

  const load = useCallback(async () => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const [openRes, doneRes] = await Promise.all([
      supabase.from('table_sessions').select(select).is('closed_at', null).order('opened_at'),
      supabase
        .from('table_sessions')
        .select(select)
        .not('closed_at', 'is', null)
        .gte('closed_at', startOfDay.toISOString())
        .order('closed_at', { ascending: false }),
    ]);
    if (openRes.error || doneRes.error) {
      setLoadError('Could not load orders. Please try again.');
    } else {
      setLoadError('');
      const sortOrders = (list) =>
        list.map((s) => ({ ...s, orders: [...s.orders].sort((a, b) => a.created_at.localeCompare(b.created_at)) }));
      setSessions(sortOrders(openRes.data));
      setHistory(sortOrders(doneRes.data));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(load, 15000);
    return () => clearInterval(timer);
  }, [load]);

  async function setStatus(order, status) {
    const { error } = await supabase.from('orders').update({ status }).eq('id', order.id);
    if (error) return toast.show('Could not update the order.', 'error');
    load();
  }

  async function closeTable(s) {
    setBusy(true);
    const { error } = await supabase.from('table_sessions').update({ closed_at: new Date().toISOString() }).eq('id', s.id);
    setBusy(false);
    setCloseId(null);
    if (error) return toast.show('Could not close the table.', 'error');
    toast.show(`${s.restaurant_tables?.name} closed.`);
    load();
  }

  const newCount = sessions.reduce((n, s) => n + s.orders.filter((o) => o.status === 'new').length, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <div>
          <h1 className="font-serif text-3xl text-maroon">Orders</h1>
          <div className="my-3 h-px w-20 bg-gold" />
          <p className="text-sm text-brown/70">
            Updates automatically every 15 seconds.{newCount > 0 && ` ${newCount} new order${newCount > 1 ? 's' : ''}.`}
          </p>
        </div>
        <button onClick={load} className="btn-outline !text-brown"><RefreshCw size={16} /> Refresh</button>
      </div>

      {loading ? (
        <p className="text-sm text-brown/70">Loading...</p>
      ) : loadError ? (
        <div className="text-sm text-brick">{loadError} <button onClick={load} className="underline">Retry</button></div>
      ) : (
        <>
          {sessions.length === 0 ? (
            <p className="rounded-sm border border-gold/40 bg-white/50 p-6 text-sm text-brown/70 print:hidden">
              No open tables. Open a table from the Tables page when guests sit down.
            </p>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2 print:hidden">
              {sessions.map((s) => (
                <section key={s.id} className="rounded-sm border border-gold/50 bg-white/50 p-4 shadow-card">
                  <div className="flex items-center justify-between">
                    <h2 className="font-serif text-xl text-maroon">{s.restaurant_tables?.name}</h2>
                    <p className="font-serif text-lg text-brick">Rs. {sessionTotal(s)}</p>
                  </div>

                  {s.orders.length === 0 ? (
                    <p className="mt-3 text-sm text-brown/60">No orders yet.</p>
                  ) : (
                    <ul className="mt-3 space-y-3">
                      {s.orders.map((o, idx) => (
                        <li key={o.id} className={`rounded-sm border p-3 ${o.status === 'new' ? 'border-gold bg-gold/10' : 'border-gold/30'}`}>
                          <div className="mb-1 flex items-center justify-between text-sm">
                            <span className="font-medium text-brown">Order {idx + 1} · {time(o.created_at)}</span>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                          </div>
                          <ul className="text-sm text-brown">
                            {o.order_items.map((i) => (
                              <li key={i.id} className="flex justify-between"><span>{i.quantity} × {i.name}</span><span>Rs. {i.quantity * i.unit_price}</span></li>
                            ))}
                          </ul>
                          {o.note && <p className="mt-1 text-xs italic text-brown/70">Note: {o.note}</p>}
                          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
                            {o.status === 'new' && (
                              <button onClick={() => setStatus(o, 'preparing')} className="inline-flex items-center gap-1 rounded-sm bg-maroon px-2.5 py-1 text-cream"><ChefHat size={13} /> Start preparing</button>
                            )}
                            {(o.status === 'new' || o.status === 'preparing') && (
                              <button onClick={() => setStatus(o, 'served')} className="inline-flex items-center gap-1 rounded-sm bg-green-700 px-2.5 py-1 text-cream"><Check size={13} /> Served</button>
                            )}
                            {o.status !== 'cancelled' && o.status !== 'served' && (
                              <button onClick={() => setStatus(o, 'cancelled')} className="inline-flex items-center gap-1 rounded-sm border border-brick px-2.5 py-1 text-brick"><Ban size={13} /> Cancel</button>
                            )}
                            {(o.status === 'cancelled' || o.status === 'served') && (
                              <button onClick={() => setStatus(o, 'new')} className="rounded-sm border border-gold/60 px-2.5 py-1">Reopen</button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-gold/30 pt-3">
                    <button onClick={() => setBillSession(s)} className="btn-outline !px-3 !py-1.5 text-xs !text-brown"><Printer size={14} /> Bill</button>
                    {closeId === s.id ? (
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-brick">Paid? Close this table?</span>
                        <button onClick={() => closeTable(s)} disabled={busy} className="rounded-sm bg-brick px-2.5 py-1 text-cream">Yes, close</button>
                        <button onClick={() => setCloseId(null)} className="rounded-sm border border-gold/60 px-2.5 py-1">No</button>
                      </div>
                    ) : (
                      <button onClick={() => setCloseId(s.id)} className="btn-maroon !px-3 !py-1.5 text-xs"><Lock size={14} /> Close table (paid)</button>
                    )}
                  </div>
                </section>
              ))}
            </div>
          )}

          <section className="print:hidden">
            <h2 className="mb-2 font-serif text-xl text-maroon">Closed today</h2>
            {history.length === 0 ? (
              <p className="text-sm text-brown/60">Nothing yet.</p>
            ) : (
              <>
                <ul className="divide-y divide-gold/20 rounded-sm border border-gold/40 bg-white/50 text-sm">
                  {history.map((s) => (
                    <li key={s.id} className="flex items-center justify-between p-3">
                      <span>{s.restaurant_tables?.name} · closed {time(s.closed_at)}</span>
                      <span className="flex items-center gap-3">
                        Rs. {sessionTotal(s)}
                        <button onClick={() => setBillSession(s)} className="text-maroon underline">Bill</button>
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-right text-sm font-medium text-brown">
                  Today's total: Rs. {history.reduce((n, s) => n + sessionTotal(s), 0)}
                </p>
              </>
            )}
          </section>
        </>
      )}

      {billSession && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brown/60 p-4 print:static print:bg-white print:p-0"
          onMouseDown={(e) => e.target === e.currentTarget && setBillSession(null)}>
          <div className="my-6 w-full max-w-sm rounded-sm bg-white p-6 text-brown shadow-lift print:my-0 print:shadow-none">
            <div className="text-center">
              <h2 className="font-serif text-2xl text-maroon">{site.name}</h2>
              {site.address && <p className="text-xs">{site.address}</p>}
              {site.phone && <p className="text-xs">{site.phone}</p>}
            </div>
            <div className="my-3 border-y border-dashed border-brown/40 py-2 text-xs">
              <p>{billSession.restaurant_tables?.name}</p>
              <p>{new Date(billSession.opened_at).toLocaleString('en-GB')}</p>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs text-brown/60"><th>Item</th><th className="text-center">Qty</th><th className="text-right">Amount</th></tr></thead>
              <tbody>
                {billSession.orders.filter((o) => o.status !== 'cancelled').flatMap((o) => o.order_items).map((i) => (
                  <tr key={i.id}><td>{i.name}</td><td className="text-center">{i.quantity}</td><td className="text-right">{i.quantity * i.unit_price}</td></tr>
                ))}
              </tbody>
            </table>
            <div className="mt-3 flex justify-between border-t border-dashed border-brown/40 pt-2 font-serif text-lg">
              <span>Total</span><span>Rs. {sessionTotal(billSession)}</span>
            </div>
            <p className="mt-3 text-center text-xs text-brown/60">Thank you for dining with us. Not a tax invoice.</p>
            <div className="mt-4 flex justify-center gap-2 print:hidden">
              <button onClick={() => window.print()} className="btn-maroon !px-4 !py-2"><Printer size={16} /> Print</button>
              <button onClick={() => setBillSession(null)} className="btn-outline !px-4 !py-2 !text-brown"><X size={16} /> Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}