import { useCallback, useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Check, X, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';

export default function Categories() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  // थप्ने form
  const [newName, setNewName] = useState('');
  const [newNameNe, setNewNameNe] = useState('');
  const [addError, setAddError] = useState('');

  // बदल्दै गरेको पङ्क्ति
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editNameNe, setEditNameNe] = useState('');
  const [editError, setEditError] = useState('');

  // मेट्न पक्का सोध्ने
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    if (error) {
      setLoadError('Could not load categories. Please try again.');
    } else {
      setItems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  function validateName(name) {
    const value = name.trim();
    if (!value) return 'Name is required.';
    if (value.length > 40) return 'Name must be 40 characters or fewer.';
    return '';
  }

  async function handleAdd(e) {
    e.preventDefault();
    const err = validateName(newName);
    setAddError(err);
    if (err) return;

    setBusy(true);
    const nextOrder = items.length ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    const { error } = await supabase.from('categories').insert({
      name: newName.trim(),
      name_ne: newNameNe.trim() || null,
      sort_order: nextOrder,
    });
    setBusy(false);

    if (error) {
      // 23505 = यही नाम पहिले नै छ
      setAddError(error.code === '23505' ? 'This category already exists.' : 'Could not add category.');
      return;
    }
    setNewName('');
    setNewNameNe('');
    toast.show('Category added.');
    load();
  }

  function startEdit(item) {
    setEditId(item.id);
    setEditName(item.name);
    setEditNameNe(item.name_ne || '');
    setEditError('');
    setDeleteId(null);
  }

  async function saveEdit() {
    const err = validateName(editName);
    setEditError(err);
    if (err) return;

    setBusy(true);
    const { error } = await supabase
      .from('categories')
      .update({ name: editName.trim(), name_ne: editNameNe.trim() || null })
      .eq('id', editId);
    setBusy(false);

    if (error) {
      setEditError(error.code === '23505' ? 'This name already exists.' : 'Could not save changes.');
      return;
    }
    setEditId(null);
    toast.show('Category updated.');
    load();
  }

  async function confirmDelete(id) {
    setBusy(true);
    const { error } = await supabase.from('categories').delete().eq('id', id);
    setBusy(false);
    setDeleteId(null);

    if (error) {
      // 23503 = यो category प्रयोग भइरहेको छ (अर्को step मा dish जोडिएपछि)
      toast.show(
        error.code === '23503'
          ? 'This category still has dishes. Move or delete them first.'
          : 'Could not delete category.',
        'error'
      );
      return;
    }
    toast.show('Category deleted.');
    load();
  }

  // क्रम साट्ने: दुई छिमेकीको sort_order आपसमा साट्छ
  async function move(index, direction) {
    const other = items[index + direction];
    const current = items[index];
    if (!other) return;

    setBusy(true);
    const [a, b] = await Promise.all([
      supabase.from('categories').update({ sort_order: other.sort_order }).eq('id', current.id),
      supabase.from('categories').update({ sort_order: current.sort_order }).eq('id', other.id),
    ]);
    setBusy(false);

    if (a.error || b.error) {
      toast.show('Could not change order.', 'error');
    }
    load();
  }

  const inputClass =
    'w-full rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Categories</h1>
        <div className="my-3 h-px w-20 bg-gold" />
        <p className="text-sm text-brown/70">
          Categories group your dishes on the public Menu page. Use the arrows to change their order.
        </p>
      </div>

      {/* थप्ने form */}
      <form
        onSubmit={handleAdd}
        noValidate
        className="rounded-sm border border-gold/40 bg-white/50 p-4 shadow-card"
      >
        <h2 className="mb-3 font-serif text-lg text-maroon">Add category</h2>
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <div>
            <input
              className={inputClass}
              placeholder="Name (English)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              maxLength={40}
              aria-label="Category name in English"
            />
          </div>
          <input
            className={inputClass}
            placeholder="नाम (Nepali, optional)"
            value={newNameNe}
            onChange={(e) => setNewNameNe(e.target.value)}
            maxLength={40}
            aria-label="Category name in Nepali"
          />
          <button type="submit" disabled={busy} className="btn-maroon disabled:opacity-60">
            <Plus size={16} /> Add
          </button>
        </div>
        {addError && <p className="mt-2 text-xs text-brick">{addError}</p>}
      </form>

      {/* सूची */}
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
        ) : items.length === 0 ? (
          <p className="p-6 text-sm text-brown/70">No categories yet. Add your first one above.</p>
        ) : (
          <ul className="divide-y divide-gold/20">
            {items.map((item, index) => (
              <li key={item.id} className="p-4">
                {editId === item.id ? (
                  <div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <input
                        className={inputClass}
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        maxLength={40}
                        aria-label="Edit name in English"
                      />
                      <input
                        className={inputClass}
                        value={editNameNe}
                        onChange={(e) => setEditNameNe(e.target.value)}
                        maxLength={40}
                        placeholder="नाम (Nepali)"
                        aria-label="Edit name in Nepali"
                      />
                    </div>
                    {editError && <p className="mt-2 text-xs text-brick">{editError}</p>}
                    <div className="mt-3 flex gap-2">
                      <button onClick={saveEdit} disabled={busy} className="btn-maroon !px-4 !py-2 disabled:opacity-60">
                        <Check size={16} /> Save
                      </button>
                      <button onClick={() => setEditId(null)} className="btn-outline !px-4 !py-2 !text-brown">
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-brown">{item.name}</p>
                      {item.name_ne && <p className="font-deva text-sm text-brown/70">{item.name_ne}</p>}
                    </div>

                    {deleteId === item.id ? (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-brick">Delete this category?</span>
                        <button
                          onClick={() => confirmDelete(item.id)}
                          disabled={busy}
                          className="rounded-sm bg-brick px-3 py-1 text-cream hover:bg-maroon disabled:opacity-60"
                        >
                          Yes, delete
                        </button>
                        <button onClick={() => setDeleteId(null)} className="rounded-sm border border-gold/60 px-3 py-1">
                          No
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => move(index, -1)}
                          disabled={busy || index === 0}
                          aria-label="Move up"
                          className="rounded-sm p-2 text-maroon hover:bg-gold/20 disabled:opacity-30"
                        >
                          <ArrowUp size={18} />
                        </button>
                        <button
                          onClick={() => move(index, 1)}
                          disabled={busy || index === items.length - 1}
                          aria-label="Move down"
                          className="rounded-sm p-2 text-maroon hover:bg-gold/20 disabled:opacity-30"
                        >
                          <ArrowDown size={18} />
                        </button>
                        <button
                          onClick={() => startEdit(item)}
                          aria-label="Edit"
                          className="rounded-sm p-2 text-maroon hover:bg-gold/20"
                        >
                          <Pencil size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteId(item.id);
                            setEditId(null);
                          }}
                          aria-label="Delete"
                          className="rounded-sm p-2 text-brick hover:bg-brick/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}