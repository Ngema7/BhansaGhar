import { useCallback, useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Pencil, Trash2, Check, X, QrCode, Printer, Power, EyeOff, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';

export default function Tables() {
  const toast = useToast();
  const [tables, setTables] = useState([]);
  const [openMap, setOpenMap] = useState({}); // table_id -> खुला sitting
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  const [newName, setNewName] = useState('');
  const [addError, setAddError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editError, setEditError] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [qrTable, setQrTable] = useState(null);

  const load = useCallback(async () => {
    setLoadError('');
    const [tRes, sRes] = await Promise.all([
      supabase.from('restaurant_tables').select('*').order('sort_order', { ascending: true }),
      supabase.from('table_sessions').select('id, table_id, opened_at').is('closed_at', null),
    ]);
    if (tRes.error || sRes.error) {
      setLoadError('Could not load tables. Please try again.');
    } else {
      setTables(tRes.data);
      const map = {};
      sRes.data.forEach((s) => (map[s.table_id] = s));
      setOpenMap(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function openTable(t) {
    setBusy(true);
    const { error } = await supabase.from('table_sessions').insert({ table_id: t.id });
    setBusy(false);
    if (error) {
      toast.show('Could not open the table.', 'error');
      return;
    }
    toast.show(`${t.name} is open. Guests can now order.`);
    load();
  }

  async function addTable(e) {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return setAddError('Name is required.');
    if (name.length > 30) return setAddError('Maximum 30 characters.');
    setBusy(true);
    const order = tables.length ? Math.max(...tables.map((t) => t.sort_order)) + 1 : 1;
    const { error } = await supabase.from('restaurant_tables').insert({ name, sort_order: order });
    setBusy(false);
    if (error) return setAddError(error.code === '23505' ? 'This name already exists.' : 'Could not add table.');
    setNewName('');
    setAddError('');
    toast.show('Table added.');
    load();
  }

  async function saveName() {
    const name = editName.trim();
    if (!name || name.length > 30) return setEditError('Name must be 1–30 characters.');
    setBusy(true);
    const { error } = await supabase.from('restaurant_tables').update({ name }).eq('id', editId);
    setBusy(false);
    if (error) return setEditError(error.code === '23505' ? 'This name already exists.' : 'Could not save.');
    setEditId(null);
    setEditError('');
    toast.show('Table renamed.');
    load();
  }

  async function toggleActive(t) {
    if (openMap[t.id] && t.is_active) {
      toast.show('Close the open table first (from Orders).', 'error');
      return;
    }
    const { error } = await supabase.from('restaurant_tables').update({ is_active: !t.is_active }).eq('id', t.id);
    if (error) return toast.show('Could not update the table.', 'error');
    load();
  }

  async function confirmDelete(t) {
    setBusy(true);
    const { error } = await supabase.from('restaurant_tables').delete().eq('id', t.id);
    setBusy(false);
    setDeleteId(null);
    if (error) {
      toast.show(
        error.code === '23503'
          ? 'This table has order history, so it cannot be deleted. Use the hide button instead.'
          : 'Could not delete the table.',
        'error'
      );
      return;
    }
    toast.show('Table deleted.');
    load();
  }

  const qrUrl = (t) => `${window.location.origin}/t/${t.token}`;
  const inputClass =
    'rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Tables</h1>
        <div className="my-3 h-px w-20 bg-gold" />
        <p className="text-sm text-brown/70">
          Open a table when guests sit down. Guests can order only while their table is open. Each table has one permanent QR code.
        </p>
      </div>

      <form onSubmit={addTable} className="flex flex-col gap-2 sm:flex-row">
        <input
          className={`${inputClass} flex-1`}
          placeholder="New table name, e.g. Table 4"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          maxLength={30}
          aria-label="New table name"
        />
        <button type="submit" disabled={busy} className="btn-maroon disabled:opacity-60">
          <Plus size={16} /> Add table
        </button>
      </form>
      {addError && <p className="-mt-3 text-xs text-brick">{addError}</p>}

      {loading ? (
        <p className="text-sm text-brown/70">Loading...</p>
      ) : loadError ? (
        <div className="text-sm text-brick">
          {loadError} <button onClick={load} className="underline">Retry</button>
        </div>
      ) : tables.length === 0 ? (
        <p className="rounded-sm border border-gold/40 bg-white/50 p-6 text-sm text-brown/70">No tables yet.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {tables.map((t) => {
            const isOpen = !!openMap[t.id];
            return (
              <li key={t.id} className={`rounded-sm border bg-white/50 p-4 shadow-card ${t.is_active ? 'border-gold/40' : 'border-brown/20 opacity-60'}`}>
                {editId === t.id ? (
                  <div>
                    <div className="flex items-center gap-1">
                      <input className={`${inputClass} flex-1`} value={editName} onChange={(e) => setEditName(e.target.value)} maxLength={30} aria-label="Table name" />
                      <button onClick={saveName} disabled={busy} aria-label="Save" className="rounded-sm p-1.5 text-green-700 hover:bg-green-100"><Check size={18} /></button>
                      <button onClick={() => setEditId(null)} aria-label="Cancel" className="rounded-sm p-1.5 text-brick hover:bg-brick/10"><X size={18} /></button>
                    </div>
                    {editError && <p className="mt-1 text-xs text-brick">{editError}</p>}
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="font-serif text-xl text-maroon">{t.name}</h2>
                      <p className="mt-1 text-xs">
                        {!t.is_active ? (
                          <span className="text-brown/60">Hidden</span>
                        ) : isOpen ? (
                          <span className="rounded-full bg-green-100 px-2.5 py-0.5 font-medium text-green-800">Open</span>
                        ) : (
                          <span className="rounded-full bg-brown/10 px-2.5 py-0.5 text-brown/70">Closed</span>
                        )}
                      </p>
                    </div>
                  </div>
                )}

                {deleteId === t.id ? (
                  <div className="mt-4 flex items-center gap-2 text-xs">
                    <span className="text-brick">Delete this table?</span>
                    <button onClick={() => confirmDelete(t)} disabled={busy} className="rounded-sm bg-brick px-2.5 py-1 text-cream hover:bg-maroon">Yes</button>
                    <button onClick={() => setDeleteId(null)} className="rounded-sm border border-gold/60 px-2.5 py-1">No</button>
                  </div>
                ) : (
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {t.is_active && !isOpen && (
                      <button onClick={() => openTable(t)} disabled={busy} className="btn-maroon !px-3 !py-1.5 text-xs disabled:opacity-60">
                        <Power size={14} /> Open table
                      </button>
                    )}
                    <button onClick={() => setQrTable(t)} className="btn-outline !px-3 !py-1.5 text-xs !text-brown">
                      <QrCode size={14} /> QR
                    </button>
                    <button onClick={() => { setEditId(t.id); setEditName(t.name); setEditError(''); }} aria-label={`Rename ${t.name}`} className="rounded-sm p-1.5 text-maroon hover:bg-gold/20"><Pencil size={16} /></button>
                    <button onClick={() => toggleActive(t)} aria-label={t.is_active ? `Hide ${t.name}` : `Show ${t.name}`} className="rounded-sm p-1.5 text-maroon hover:bg-gold/20">
                      {t.is_active ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button onClick={() => setDeleteId(t.id)} aria-label={`Delete ${t.name}`} className="rounded-sm p-1.5 text-brick hover:bg-brick/10"><Trash2 size={16} /></button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {qrTable && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brown/60 p-4 print:bg-white"
          onMouseDown={(e) => e.target === e.currentTarget && setQrTable(null)}
        >
          <div role="dialog" aria-modal="true" className="w-full max-w-sm rounded-sm bg-cream p-6 text-center shadow-lift print:shadow-none">
            <h2 className="font-serif text-2xl text-maroon">BHANSA GHAR</h2>
            <p className="mt-1 font-serif text-xl text-brown">{qrTable.name}</p>
            <div className="mx-auto my-4 inline-block bg-white p-3">
              <QRCodeSVG value={qrUrl(qrTable)} size={220} level="M" />
            </div>
            <p className="text-sm text-brown">Scan to view the menu and order</p>
            <p className="mt-1 break-all text-[10px] text-brown/40 print:hidden">{qrUrl(qrTable)}</p>
            {window.location.hostname === 'localhost' && (
              <p className="mt-2 rounded-sm bg-gold/30 p-2 text-xs text-brown print:hidden">
                Warning: you are on localhost. Open this page on your live website before printing.
              </p>
            )}
            <div className="mt-4 flex justify-center gap-2 print:hidden">
              <button onClick={() => window.print()} className="btn-maroon !px-4 !py-2"><Printer size={16} /> Print</button>
              <button onClick={() => setQrTable(null)} className="btn-outline !px-4 !py-2 !text-brown">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}