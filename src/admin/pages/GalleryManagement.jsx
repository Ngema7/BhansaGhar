import { useCallback, useEffect, useMemo, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Check, X, ArrowUp, ArrowDown, Tags } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';
import GalleryForm from '../components/GalleryForm.jsx';

// Supabase Storage को फोटो हो भने bucket भित्रको path निकाल्ने (नत्र null)
function storagePath(url) {
  const marker = '/storage/v1/object/public/gallery-images/';
  const i = url.indexOf(marker);
  return i === -1 ? null : decodeURIComponent(url.slice(i + marker.length));
}

export default function GalleryManagement() {
  const toast = useToast();
  const [images, setImages] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [busy, setBusy] = useState(false);

  const [filter, setFilter] = useState('all');
  const [formImage, setFormImage] = useState(null); // null | 'new' | image
  const [deleteId, setDeleteId] = useState(null);

  // category व्यवस्थापन
  const [showCats, setShowCats] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [catError, setCatError] = useState('');
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState('');
  const [deleteCatId, setDeleteCatId] = useState(null);

  const load = useCallback(async () => {
    setLoadError('');
    const [imgRes, catRes] = await Promise.all([
      supabase
        .from('gallery_images')
        .select('id, title, description, image_url, category_id, ratio, is_visible, sort_order, gallery_categories(name)')
        .order('sort_order', { ascending: true }),
      supabase.from('gallery_categories').select('id, name, sort_order').order('sort_order', { ascending: true }),
    ]);
    if (imgRes.error || catRes.error) {
      setLoadError('Could not load the gallery. Please try again.');
    } else {
      setImages(imgRes.data);
      setCats(catRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(
    () => images.filter((g) => filter === 'all' || g.category_id === filter),
    [images, filter]
  );

  const nextSortOrder = images.length ? Math.max(...images.map((g) => g.sort_order)) + 1 : 1;

  function handleSaved(message) {
    setFormImage(null);
    toast.show(message);
    load();
  }

  async function toggleVisible(img) {
    const value = !img.is_visible;
    setImages((l) => l.map((g) => (g.id === img.id ? { ...g, is_visible: value } : g)));
    const { error } = await supabase.from('gallery_images').update({ is_visible: value }).eq('id', img.id);
    if (error) {
      setImages((l) => l.map((g) => (g.id === img.id ? { ...g, is_visible: img.is_visible } : g)));
      toast.show('Could not save the change.', 'error');
    }
  }

  async function confirmDelete(img) {
    setBusy(true);
    const { error } = await supabase.from('gallery_images').delete().eq('id', img.id);
    if (error) {
      setBusy(false);
      setDeleteId(null);
      toast.show('Could not delete the photo.', 'error');
      return;
    }
    // Supabase Storage को फोटो भए फाइल पनि मेट्ने (असफल भए पनि ठीक)
    const path = storagePath(img.image_url);
    if (path) await supabase.storage.from('gallery-images').remove([path]);
    setBusy(false);
    setDeleteId(null);
    setImages((l) => l.filter((g) => g.id !== img.id));
    toast.show('Photo deleted.');
  }

  // ---- category ----
  async function addCat(e) {
    e.preventDefault();
    const name = newCat.trim();
    if (!name) return setCatError('Name is required.');
    if (name.length > 40) return setCatError('Maximum 40 characters.');
    setBusy(true);
    const order = cats.length ? Math.max(...cats.map((c) => c.sort_order)) + 1 : 1;
    const { error } = await supabase.from('gallery_categories').insert({ name, sort_order: order });
    setBusy(false);
    if (error) return setCatError(error.code === '23505' ? 'This category already exists.' : 'Could not add category.');
    setNewCat('');
    setCatError('');
    toast.show('Category added.');
    load();
  }

  async function saveCat() {
    const name = editCatName.trim();
    if (!name || name.length > 40) return setCatError('Name must be 1–40 characters.');
    setBusy(true);
    const { error } = await supabase.from('gallery_categories').update({ name }).eq('id', editCatId);
    setBusy(false);
    if (error) return setCatError(error.code === '23505' ? 'This name already exists.' : 'Could not save.');
    setEditCatId(null);
    setCatError('');
    toast.show('Category updated.');
    load();
  }

  async function removeCat(id) {
    setBusy(true);
    const { error } = await supabase.from('gallery_categories').delete().eq('id', id);
    setBusy(false);
    setDeleteCatId(null);
    if (error) {
      toast.show(
        error.code === '23503' ? 'This category still has photos. Move or delete them first.' : 'Could not delete.',
        'error'
      );
      return;
    }
    toast.show('Category deleted.');
    load();
  }

  async function moveCat(index, dir) {
    const a = cats[index];
    const b = cats[index + dir];
    if (!b) return;
    setBusy(true);
    const [r1, r2] = await Promise.all([
      supabase.from('gallery_categories').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('gallery_categories').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);
    setBusy(false);
    if (r1.error || r2.error) toast.show('Could not change order.', 'error');
    load();
  }

  const inputClass =
    'rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-maroon">Gallery Management</h1>
          <div className="my-3 h-px w-20 bg-gold" />
          <p className="text-sm text-brown/70">Upload photos, edit details, and choose what shows on the website.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowCats((s) => !s)} className="btn-outline !text-brown">
            <Tags size={16} /> Categories
          </button>
          <button onClick={() => setFormImage('new')} disabled={cats.length === 0} className="btn-maroon disabled:opacity-60">
            <Plus size={16} /> Upload Photos
          </button>
        </div>
      </div>

      {showCats && (
        <section className="space-y-3 rounded-sm border border-gold/40 bg-white/50 p-4 shadow-card">
          <h2 className="font-serif text-lg text-maroon">Gallery categories</h2>
          <form onSubmit={addCat} className="flex gap-2">
            <input
              className={`${inputClass} flex-1`}
              placeholder="New category name"
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              maxLength={40}
              aria-label="New category name"
            />
            <button type="submit" disabled={busy} className="btn-maroon !px-4 !py-2 disabled:opacity-60">
              <Plus size={16} /> Add
            </button>
          </form>
          {catError && <p className="text-xs text-brick">{catError}</p>}
          <ul className="divide-y divide-gold/20">
            {cats.map((c, i) => (
              <li key={c.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                {editCatId === c.id ? (
                  <div className="flex flex-1 items-center gap-1">
                    <input className={`${inputClass} flex-1`} value={editCatName} onChange={(e) => setEditCatName(e.target.value)} maxLength={40} aria-label="Category name" />
                    <button onClick={saveCat} disabled={busy} aria-label="Save" className="rounded-sm p-1.5 text-green-700 hover:bg-green-100"><Check size={18} /></button>
                    <button onClick={() => setEditCatId(null)} aria-label="Cancel" className="rounded-sm p-1.5 text-brick hover:bg-brick/10"><X size={18} /></button>
                  </div>
                ) : (
                  <>
                    <span className="text-sm text-brown">{c.name}</span>
                    {deleteCatId === c.id ? (
                      <div className="flex items-center gap-2 text-xs">
                        <button onClick={() => removeCat(c.id)} disabled={busy} className="rounded-sm bg-brick px-2.5 py-1 text-cream hover:bg-maroon">Yes, delete</button>
                        <button onClick={() => setDeleteCatId(null)} className="rounded-sm border border-gold/60 px-2.5 py-1">No</button>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <button onClick={() => moveCat(i, -1)} disabled={busy || i === 0} aria-label="Move up" className="rounded-sm p-1.5 text-maroon hover:bg-gold/20 disabled:opacity-30"><ArrowUp size={16} /></button>
                        <button onClick={() => moveCat(i, 1)} disabled={busy || i === cats.length - 1} aria-label="Move down" className="rounded-sm p-1.5 text-maroon hover:bg-gold/20 disabled:opacity-30"><ArrowDown size={16} /></button>
                        <button onClick={() => { setEditCatId(c.id); setEditCatName(c.name); setCatError(''); }} aria-label="Rename" className="rounded-sm p-1.5 text-maroon hover:bg-gold/20"><Pencil size={16} /></button>
                        <button onClick={() => setDeleteCatId(c.id)} aria-label="Delete category" className="rounded-sm p-1.5 text-brick hover:bg-brick/10"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <select className={inputClass} value={filter} onChange={(e) => setFilter(e.target.value)} aria-label="Filter by category">
        <option value="all">All categories</option>
        {cats.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      {loading ? (
        <p className="text-sm text-brown/70">Loading...</p>
      ) : loadError ? (
        <div className="text-sm text-brick">
          {loadError} <button onClick={load} className="underline">Retry</button>
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-sm border border-gold/40 bg-white/50 p-6 text-sm text-brown/70">No photos here yet.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {visible.map((g) => (
            <li key={g.id} className="overflow-hidden rounded-sm border border-gold/40 bg-white/50 shadow-card">
              <div className="relative">
                <img
                  src={g.image_url}
                  alt={g.title}
                  loading="lazy"
                  className={`aspect-[4/3] w-full object-cover ${g.is_visible ? '' : 'opacity-40 grayscale'}`}
                />
                {!g.is_visible && (
                  <span className="absolute left-2 top-2 rounded-full bg-brown/80 px-2 py-0.5 text-xs text-cream">Hidden</span>
                )}
              </div>
              <div className="p-3">
                <p className="truncate text-sm font-medium text-brown">{g.title}</p>
                <p className="truncate text-xs text-brown/60">{g.gallery_categories?.name}</p>

                {deleteId === g.id ? (
                  <div className="mt-2 flex items-center gap-2 text-xs">
                    <button onClick={() => confirmDelete(g)} disabled={busy} className="rounded-sm bg-brick px-2.5 py-1 text-cream hover:bg-maroon disabled:opacity-60">Yes, delete</button>
                    <button onClick={() => setDeleteId(null)} className="rounded-sm border border-gold/60 px-2.5 py-1">No</button>
                  </div>
                ) : (
                  <div className="mt-2 flex items-center justify-between">
                    <button
                      onClick={() => toggleVisible(g)}
                      aria-label={g.is_visible ? `Hide ${g.title}` : `Show ${g.title}`}
                      className="rounded-sm p-1.5 text-maroon hover:bg-gold/20"
                    >
                      {g.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <div className="flex">
                      <button onClick={() => setFormImage(g)} aria-label={`Edit ${g.title}`} className="rounded-sm p-1.5 text-maroon hover:bg-gold/20"><Pencil size={18} /></button>
                      <button onClick={() => setDeleteId(g.id)} aria-label={`Delete ${g.title}`} className="rounded-sm p-1.5 text-brick hover:bg-brick/10"><Trash2 size={18} /></button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {formImage && (
        <GalleryForm
          image={formImage === 'new' ? null : formImage}
          categories={cats}
          nextSortOrder={nextSortOrder}
          onClose={() => setFormImage(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}