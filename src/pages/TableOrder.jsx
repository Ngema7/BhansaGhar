import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, X, Receipt, CheckCircle2, AlertCircle, RefreshCw, Globe, Star, Phone, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabaseClient.js';
import { useMenu } from '../hooks/useMenu.js';
import SmartImage from '../components/SmartImage.jsx';
import { useSite } from '../context/SiteContext.jsx';

const STATUS_LABEL = { new: 'Received', preparing: 'Preparing', served: 'Served', cancelled: 'Cancelled' };
const STATUS_STYLE = {
  new: 'bg-gold/30 text-brown',
  preparing: 'bg-brick/15 text-brick',
  served: 'bg-green-100 text-green-800',
  cancelled: 'bg-brown/10 text-brown/60 line-through',
};

const ERROR_TEXT = {
  table_closed: 'This table is not open yet. Please ask our staff.',
  not_found: 'This QR code is not valid. Please ask our staff.',
  item_unavailable: 'One of the dishes is no longer available. Please review your order.',
  too_many_orders: 'Too many orders for this table. Please call our staff.',
};

export default function TableOrder() {
  const { token } = useParams();
  const { items: allItems, categories, source } = useMenu();
    const site = useSite();

  const [table, setTable] = useState(null); // {name,is_open} | {error}
  const [cart, setCart] = useState({}); // id -> qty
  const [note, setNote] = useState('');
  const [view, setView] = useState('menu'); // menu | cart | bill
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState(null); // {type,text}
  const [bill, setBill] = useState(null);
  const [activeCat, setActiveCat] = useState('All');
  const sending = useRef(false);

  const loadTable = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_table_state', { p_token: token });
    setTable(error || !data ? { error: 'not_found' } : data);
  }, [token]);

  const loadBill = useCallback(async () => {
    const { data, error } = await supabase.rpc('get_my_bill', { p_token: token });
    if (!error && data) setBill(data);
  }, [token]);

  useEffect(() => {
    loadTable();
    loadBill();
  }, [loadTable, loadBill]);

  // Database बाट आएको असली menu मात्र order गर्न मिल्छ (fallback मा uuid हुँदैन)
  const orderable = source === 'database';

  const items = useMemo(
    () => (activeCat === 'All' ? allItems : allItems.filter((m) => m.category === activeCat)),
    [allItems, activeCat]
  );

  const lines = useMemo(
    () =>
      Object.entries(cart)
        .map(([id, qty]) => ({ item: allItems.find((m) => m.id === id), qty }))
        .filter((l) => l.item),
    [cart, allItems]
  );
  const count = lines.reduce((s, l) => s + l.qty, 0);
  const total = lines.reduce((s, l) => s + l.qty * l.item.price, 0);

  function change(id, delta) {
    setCart((c) => {
      const next = (c[id] || 0) + delta;
      const copy = { ...c };
      if (next <= 0) delete copy[id];
      else copy[id] = Math.min(next, 20);
      return copy;
    });
  }

  async function placeOrder() {
    if (sending.current || count === 0) return;
    sending.current = true;
    setPlacing(true);
    setMessage(null);

    const { error } = await supabase.rpc('place_order', {
      p_token: token,
      p_items: lines.map((l) => ({ id: l.item.id, qty: l.qty })),
      p_note: note.trim() || null,
    });

    setPlacing(false);
    sending.current = false;

    if (error) {
      const key = Object.keys(ERROR_TEXT).find((k) => (error.message || '').includes(k));
      setMessage({ type: 'error', text: ERROR_TEXT[key] || 'Could not place the order. Please try again or ask our staff.' });
      if (key === 'table_closed') loadTable();
      return;
    }
    setCart({});
    setNote('');
    setMessage({ type: 'success', text: 'Order sent to the kitchen. Thank you!' });
    await loadBill();
    setView('bill');
  }

  const header = (
    <header className="sticky top-0 z-30 bg-maroon shadow-[0_2px_0_0_rgba(221,164,76,.45)]">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <div>
          <p className="font-serif text-xl tracking-wide text-gold">BHANSA GHAR</p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-cream/70">Authentic Nepali Cuisine</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-cream/90 hover:text-gold">
            <Globe size={14} /> <span className="hidden min-[380px]:inline">Website</span>
          </a>
          {table && !table.error && (
            <div className="text-right">
              <p className="font-serif text-lg leading-tight text-cream">{table.name}</p>
              <p className={`text-[11px] ${table.is_open ? 'text-green-300' : 'text-cream/60'}`}>
                {table.is_open ? '● Open' : '○ Not open'}
              </p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
  

  if (!table) {
    return (
      <div className="min-h-screen bg-cream">
        {header}
        <p className="p-8 text-center text-brown/70">Loading...</p>
      </div>
    );
  }

  if (table.error) {
    return (
      <div className="min-h-screen bg-cream">
        {header}
        <div className="mx-auto max-w-md p-8 text-center">
          <AlertCircle className="mx-auto text-brick" size={40} />
          <p className="mt-3 font-serif text-xl text-maroon">Invalid QR code</p>
          <p className="mt-1 text-sm text-brown/70">Please ask our staff for help.</p>
        </div>
      </div>
    );
  }

  const canOrder = table.is_open && orderable;

  return (
    <div className="min-h-screen bg-cream pb-28">
      {header}

      {!table.is_open && (
        <div className="mx-auto mt-4 max-w-3xl px-4">
          <div className="flex items-start gap-3 rounded-sm border border-gold bg-gold/20 p-4 text-sm text-brown">
            <AlertCircle size={20} className="mt-0.5 shrink-0 text-maroon" />
            <div>
              <p className="font-medium">Your table is not open for ordering yet.</p>
              <p>Please let our staff know and they will open it. You can browse the menu meanwhile.</p>
              <button onClick={loadTable} className="mt-2 inline-flex items-center gap-1 text-maroon underline">
                <RefreshCw size={14} /> Check again
              </button>
            </div>
          </div>
        </div>
      )}

      {!orderable && table.is_open && (
        <p className="mx-auto mt-4 max-w-3xl px-4 text-sm text-brick">The menu could not be loaded. Please refresh the page.</p>
      )}

      {message && (
        <div className="mx-auto mt-4 max-w-3xl px-4">
          <div
            role="status"
            className={`flex items-start gap-2 rounded-sm border p-3 text-sm ${
              message.type === 'error' ? 'border-brick/40 bg-brick/10 text-brick' : 'border-green-300 bg-green-50 text-green-800'
            }`}
          >
            {message.type === 'error' ? <AlertCircle size={18} className="mt-0.5 shrink-0" /> : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
            <span className="flex-1">{message.text}</span>
            <button onClick={() => setMessage(null)} aria-label="Dismiss"><X size={16} /></button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="sticky top-[60px] z-20 border-b border-gold/30 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-2 overflow-x-auto px-4 py-2">
          {[['menu', 'Menu'], ['bill', 'My bill']].map(([k, label]) => (
            <button
              key={k}
              onClick={() => { setView(k); if (k === 'bill') loadBill(); }}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm ${view === k ? 'bg-maroon text-cream' : 'text-maroon hover:bg-gold/20'}`}
            >
              {k === 'bill' && <Receipt size={14} className="mr-1 inline" />}
              {label}
            </button>
          ))}
        </div>
        {view === 'menu' && (
          <div className="mx-auto flex max-w-3xl gap-2 overflow-x-auto px-4 pb-2" role="group" aria-label="Categories">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                aria-pressed={activeCat === c}
                className={`shrink-0 rounded-full border px-3.5 py-1 text-xs ${
                  activeCat === c ? 'border-maroon bg-maroon text-cream' : 'border-gold/70 bg-cream text-brown'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
      </div>

      <main className="mx-auto max-w-3xl px-4 pt-4">
        {view === 'menu' && (
                    <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {items.map((m) => {
              const qty = cart[m.id] || 0;
              return (
                <li key={m.id} className="flex flex-col overflow-hidden rounded-sm border border-gold/60 bg-cream shadow-card">
                  <SmartImage src={m.image} alt={m.name} className="aspect-square w-full" />
                  <div className="flex flex-1 flex-col justify-between p-2.5">
                    <div>
                      <h3 className="font-serif text-sm font-semibold leading-snug text-maroon">{m.name}</h3>
                      {m.desc && <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-brown/70">{m.desc}</p>}
                    </div>
                    <div className="mt-2">
                      <p className="text-sm font-medium text-brick">Rs. {m.price}</p>
                      {canOrder && (
                        <div className="mt-1.5">
                          {qty === 0 ? (
                            <button onClick={() => change(m.id, 1)} className="w-full rounded-sm bg-maroon py-1.5 text-sm text-cream hover:bg-brick">
                              Add
                            </button>
                          ) : (
                            <div className="flex items-center justify-between rounded-sm border border-maroon">
                              <button onClick={() => change(m.id, -1)} aria-label={`Remove one ${m.name}`} className="p-1.5 text-maroon"><Minus size={16} /></button>
                              <span className="text-sm font-medium" aria-live="polite">{qty}</span>
                              <button onClick={() => change(m.id, 1)} aria-label={`Add one ${m.name}`} className="p-1.5 text-maroon"><Plus size={16} /></button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {view === 'bill' && (
          <div className="space-y-4">
            {!bill || bill.orders.length === 0 ? (
              <p className="rounded-sm border border-gold/40 bg-white/50 p-6 text-center text-sm text-brown/70">
                You have not ordered anything yet.
              </p>
            ) : (
              <>
                {bill.orders.map((o, idx) => (
                  <section key={o.id} className="rounded-sm border border-gold/50 bg-white/50 p-4 shadow-card">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-serif text-maroon">Order {idx + 1}</p>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[o.status]}`}>{STATUS_LABEL[o.status]}</span>
                    </div>
                    <ul className="divide-y divide-gold/20 text-sm">
                      {o.items.map((i, k) => (
                        <li key={k} className="flex justify-between py-1.5">
                          <span>{i.qty} × {i.name}</span>
                          <span>Rs. {i.qty * i.price}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))}
                <div className="flex items-center justify-between rounded-sm bg-maroon p-4 text-cream">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-xl text-gold">Rs. {bill.total}</span>
                </div>
                <p className="text-center text-xs text-brown/60">Please pay at the counter. This is not a final tax invoice.</p>
              </>
            )}
            <button onClick={loadBill} className="mx-auto flex items-center gap-1 text-sm text-maroon underline">
              <RefreshCw size={14} /> Refresh status
            </button>
          </div>
        )}
      </main>
            <footer className="mx-auto mt-8 max-w-3xl px-4 text-center text-xs text-brown/70">
        {site.googleReviewUrl && (
          <a href={site.googleReviewUrl} target="_blank" rel="noopener noreferrer"
            className="mb-3 inline-flex items-center gap-2 rounded-sm border border-gold bg-gold/20 px-4 py-2 text-sm font-medium text-maroon hover:bg-gold/40">
            <Star size={16} className="fill-gold text-gold" /> Rate us on Google
          </a>
        )}
        <div className="space-y-1">
          {site.address && <p className="flex items-center justify-center gap-1"><MapPin size={12} /> {site.address}</p>}
          {site.phone && <p className="flex items-center justify-center gap-1"><Phone size={12} /> <a href={`tel:${site.phone}`}>{site.phone}</a></p>}
          {site.hours && <p>{site.hours}</p>}
        </div>
        <p className="mt-3">© {new Date().getFullYear()} Bhansa Ghar</p>
      </footer>

      {/* तल अडिने cart पट्टी */}
      {view === 'menu' && count > 0 && canOrder && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gold bg-maroon p-3">
          <button
            onClick={() => setView('cart')}
            className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-sm bg-gold px-4 py-3 font-medium text-maroon"
          >
            <span className="flex items-center gap-2"><ShoppingBag size={18} /> {count} item{count > 1 ? 's' : ''}</span>
            <span>Rs. {total} · View order</span>
          </button>
        </div>
      )}

      {/* Cart sheet */}
      {view === 'cart' && (
        <div className="fixed inset-0 z-40 flex items-end bg-brown/60 sm:items-center sm:justify-center" onMouseDown={(e) => e.target === e.currentTarget && setView('menu')}>
          <div role="dialog" aria-modal="true" aria-label="Your order" className="max-h-[90vh] w-full overflow-y-auto rounded-t-lg bg-cream p-5 sm:max-w-lg sm:rounded-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-maroon">Your order</h2>
              <button onClick={() => setView('menu')} aria-label="Close"><X size={22} /></button>
            </div>
            {lines.length === 0 ? (
              <p className="py-6 text-center text-sm text-brown/70">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gold/20">
                {lines.map(({ item, qty }) => (
                  <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-brown">{item.name}</p>
                      <p className="text-xs text-brown/60">Rs. {item.price} each</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-sm border border-maroon">
                      <button onClick={() => change(item.id, -1)} aria-label={`Remove one ${item.name}`} className="p-1.5 text-maroon"><Minus size={16} /></button>
                      <span className="min-w-[1.25rem] text-center text-sm">{qty}</span>
                      <button onClick={() => change(item.id, 1)} aria-label={`Add one ${item.name}`} className="p-1.5 text-maroon"><Plus size={16} /></button>
                    </div>
                    <p className="w-20 text-right text-sm">Rs. {item.price * qty}</p>
                  </li>
                ))}
              </ul>
            )}
            <label htmlFor="o-note" className="mt-3 block text-sm font-medium text-brown">Note for the kitchen (optional)</label>
            <textarea
              id="o-note" rows={2} maxLength={200} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. less spicy, no onion"
              className="mt-1 w-full rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm focus:border-gold focus:outline-none"
            />
            {message?.type === 'error' && <p className="mt-2 text-sm text-brick">{message.text}</p>}
            <div className="mt-4 flex items-center justify-between border-t border-gold/40 pt-3">
              <span className="font-serif text-lg text-maroon">Total</span>
              <span className="font-serif text-xl text-maroon">Rs. {total}</span>
            </div>
            <button onClick={placeOrder} disabled={placing || lines.length === 0} className="btn-maroon mt-4 w-full disabled:opacity-60">
              {placing ? 'Sending...' : 'Place order'}
            </button>
            <p className="mt-2 text-center text-xs text-brown/60">You will pay at the counter. Prices are confirmed by the restaurant.</p>
          </div>
        </div>
      )}
    </div>
  );
}