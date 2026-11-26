import { useEffect, useRef, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];

// props:
//   dish = बदल्ने dish (नदिए = नयाँ थप्ने)
//   categories = category सूची
//   nextSortOrder = नयाँ dish को क्रम नम्बर
//   onClose = बन्द गर्ने, onSaved = सेभ भएपछि चल्ने
export default function DishForm({ dish, categories, nextSortOrder, onClose, onSaved }) {
  const isEdit = !!dish;

  const [name, setName] = useState(dish?.name || '');
  const [nameNe, setNameNe] = useState(dish?.name_ne || '');
  const [description, setDescription] = useState(dish?.description || '');
  const [descriptionNe, setDescriptionNe] = useState(dish?.description_ne || '');
  const [price, setPrice] = useState(dish ? String(dish.price) : '');
  const [categoryId, setCategoryId] = useState(dish?.category_id || categories[0]?.id || '');
  const [isAvailable, setIsAvailable] = useState(dish?.is_available ?? true);
  const [isFeatured, setIsFeatured] = useState(dish?.is_featured ?? false);

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(dish?.image_url || '');
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInput = useRef(null);

  // Esc थिच्दा बन्द
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && !saving) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  // preview को लागि बनाएको अस्थायी ठेगाना सफा गर्ने
  useEffect(() => {
    return () => {
      if (preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleFile(e) {
    const picked = e.target.files?.[0];
    if (!picked) return;

    if (!ALLOWED.includes(picked.type)) {
      setErrors((x) => ({ ...x, image: 'Only JPG, PNG or WebP images are allowed.' }));
      return;
    }
    if (picked.size > MAX_BYTES) {
      setErrors((x) => ({ ...x, image: 'Image must be 2 MB or smaller.' }));
      return;
    }
    setErrors((x) => ({ ...x, image: '' }));
    setFile(picked);
    setPreview(URL.createObjectURL(picked));
  }

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Name is required.';
    else if (name.trim().length > 80) e.name = 'Name must be 80 characters or fewer.';

    if (description.length > 300) e.description = 'Description must be 300 characters or fewer.';
    if (descriptionNe.length > 300) e.descriptionNe = 'Description must be 300 characters or fewer.';

    if (!/^\d+$/.test(price.trim())) e.price = 'Enter a whole number, e.g. 350.';
    else if (Number(price) > 100000) e.price = 'Price is too high.';

    if (!categoryId) e.category = 'Choose a category.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);
    let imageUrl = dish?.image_url || null;

    // १) नयाँ फोटो छानेको छ भने पहिले Storage मा पठाउने
    if (file) {
      const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
      const path = `${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from('menu-images')
        .upload(path, file, { contentType: file.type, cacheControl: '31536000' });

      if (upErr) {
        setSaving(false);
        setErrors({ form: 'Could not upload the image. Please try again.' });
        return;
      }
      imageUrl = supabase.storage.from('menu-images').getPublicUrl(path).data.publicUrl;
    }

    // २) dish को विवरण database मा राख्ने
    const row = {
      name: name.trim(),
      name_ne: nameNe.trim() || null,
      description: description.trim() || null,
      description_ne: descriptionNe.trim() || null,
      price: Number(price),
      category_id: categoryId,
      image_url: imageUrl,
      is_available: isAvailable,
      is_featured: isFeatured,
    };

    let error;
    if (isEdit) {
      ({ error } = await supabase.from('menu_items').update(row).eq('id', dish.id));
    } else {
      // slug = unique पहिचान नाम। नाम बाट बनाउने + अनियमित अंश
      const base = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'dish';
      row.slug = `${base}-${crypto.randomUUID().slice(0, 6)}`;
      row.sort_order = nextSortOrder;
      ({ error } = await supabase.from('menu_items').insert(row));
    }

    setSaving(false);
    if (error) {
      setErrors({ form: 'Could not save the dish. Please try again.' });
      return;
    }
    onSaved(isEdit ? 'Dish updated.' : 'Dish added.');
  }

  const inputClass =
    'w-full rounded-sm border bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';
  const border = (key) => (errors[key] ? 'border-brick' : 'border-gold/50');

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brown/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isEdit ? 'Edit dish' : 'Add dish'}
        className="my-6 w-full max-w-2xl rounded-sm bg-cream shadow-lift"
      >
        <div className="flex items-center justify-between border-b border-gold/40 px-5 py-4">
          <h2 className="font-serif text-xl text-maroon">{isEdit ? 'Edit Dish' : 'Add New Dish'}</h2>
          <button onClick={onClose} disabled={saving} aria-label="Close" className="text-brown/60 hover:text-brown">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          {errors.form && (
            <div className="rounded-sm border border-brick/40 bg-brick/10 p-3 text-sm text-brick">{errors.form}</div>
          )}

          {/* फोटो */}
          <div>
            <p className="mb-1.5 text-sm font-medium text-brown">Photo</p>
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="Dish preview" className="h-24 w-24 rounded-sm border border-gold/50 object-cover" />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-sm border border-dashed border-gold/60 text-brown/40">
                  <ImagePlus size={28} />
                </div>
              )}
              <div>
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFile}
                  className="hidden"
                />
                <button type="button" onClick={() => fileInput.current?.click()} className="btn-outline !px-4 !py-2 !text-brown">
                  {preview ? 'Change photo' : 'Choose photo'}
                </button>
                <p className="mt-1 text-xs text-brown/60">JPG, PNG or WebP, up to 2 MB.</p>
              </div>
            </div>
            {errors.image && <p className="mt-1 text-xs text-brick">{errors.image}</p>}
          </div>

          {/* नाम */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="d-name" className="mb-1 block text-sm font-medium text-brown">
                Name (English) *
              </label>
              <input id="d-name" className={`${inputClass} ${border('name')}`} value={name} onChange={(e) => setName(e.target.value)} maxLength={80} />
              {errors.name && <p className="mt-1 text-xs text-brick">{errors.name}</p>}
            </div>
            <div>
              <label htmlFor="d-name-ne" className="mb-1 block text-sm font-medium text-brown">
                नाम (Nepali)
              </label>
              <input id="d-name-ne" className={`${inputClass} border-gold/50 font-deva`} value={nameNe} onChange={(e) => setNameNe(e.target.value)} maxLength={80} />
            </div>
          </div>

          {/* विवरण */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="d-desc" className="mb-1 block text-sm font-medium text-brown">
                Description (English)
              </label>
              <textarea id="d-desc" rows={3} className={`${inputClass} ${border('description')}`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
              {errors.description && <p className="mt-1 text-xs text-brick">{errors.description}</p>}
            </div>
            <div>
              <label htmlFor="d-desc-ne" className="mb-1 block text-sm font-medium text-brown">
                विवरण (Nepali)
              </label>
              <textarea id="d-desc-ne" rows={3} className={`${inputClass} ${border('descriptionNe')} font-deva`} value={descriptionNe} onChange={(e) => setDescriptionNe(e.target.value)} maxLength={300} />
              {errors.descriptionNe && <p className="mt-1 text-xs text-brick">{errors.descriptionNe}</p>}
            </div>
          </div>

          {/* मूल्य र category */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="d-price" className="mb-1 block text-sm font-medium text-brown">
                Price (Rs.) *
              </label>
              <input id="d-price" inputMode="numeric" className={`${inputClass} ${border('price')}`} value={price} onChange={(e) => setPrice(e.target.value)} />
              {errors.price && <p className="mt-1 text-xs text-brick">{errors.price}</p>}
            </div>
            <div>
              <label htmlFor="d-cat" className="mb-1 block text-sm font-medium text-brown">
                Category *
              </label>
              <select id="d-cat" className={`${inputClass} ${border('category')}`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-brick">{errors.category}</p>}
            </div>
          </div>

          {/* टिक बाकस */}
          <div className="flex flex-wrap gap-6 text-sm text-brown">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="h-4 w-4 accent-maroon" />
              Available
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-maroon" />
              Featured
            </label>
          </div>

          <div className="flex justify-end gap-2 border-t border-gold/30 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="btn-outline !px-5 !py-2 !text-brown">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-maroon !px-5 !py-2 disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Add dish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}