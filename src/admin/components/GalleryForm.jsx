import { useEffect, useRef, useState } from 'react';
import { X, ImagePlus } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';

const MAX_BYTES = 3 * 1024 * 1024; // 3 MB
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp'];
export const RATIOS = [
  { value: 'aspect-[4/5]', label: 'Portrait (4:5)' },
  { value: 'aspect-square', label: 'Square' },
  { value: 'aspect-[3/4]', label: 'Tall (3:4)' },
  { value: 'aspect-[4/3]', label: 'Landscape (4:3)' },
];

// props: image (edit गर्दा), categories, nextSortOrder, onClose, onSaved
export default function GalleryForm({ image, categories, nextSortOrder, onClose, onSaved }) {
  const isEdit = !!image;

  const [title, setTitle] = useState(image?.title || '');
  const [description, setDescription] = useState(image?.description || '');
  const [categoryId, setCategoryId] = useState(image?.category_id || categories[0]?.id || '');
  const [ratio, setRatio] = useState(image?.ratio || 'aspect-square');
  const [isVisible, setIsVisible] = useState(image?.is_visible ?? true);

  const [files, setFiles] = useState([]); // [{file, preview}]
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const fileInput = useRef(null);
  const previewsRef = useRef([]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape' && !saving) onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, saving]);

  // बन्द हुँदा अस्थायी preview ठेगाना सफा गर्ने
  useEffect(() => {
    previewsRef.current = files;
  }, [files]);
  useEffect(() => {
    return () => previewsRef.current.forEach((f) => URL.revokeObjectURL(f.preview));
  }, []);

  function handleFiles(e) {
    const picked = Array.from(e.target.files || []);
    e.target.value = '';
    if (picked.length === 0) return;

    const list = isEdit ? picked.slice(0, 1) : picked.slice(0, 10);
    for (const f of list) {
      if (!ALLOWED.includes(f.type)) {
        setErrors((x) => ({ ...x, files: `"${f.name}": only JPG, PNG or WebP allowed.` }));
        return;
      }
      if (f.size > MAX_BYTES) {
        setErrors((x) => ({ ...x, files: `"${f.name}" is larger than 3 MB.` }));
        return;
      }
    }
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setErrors((x) => ({ ...x, files: '' }));
    setFiles(list.map((file) => ({ file, preview: URL.createObjectURL(file) })));
  }

  function validate() {
    const e = {};
    if (isEdit || files.length === 1) {
      if (!title.trim()) e.title = 'Title is required.';
    }
    if (title.length > 80) e.title = 'Title must be 80 characters or fewer.';
    if (description.length > 300) e.description = 'Description must be 300 characters or fewer.';
    if (!categoryId) e.category = 'Choose a category.';
    if (!isEdit && files.length === 0) e.files = 'Choose at least one photo.';
    return e;
  }

  async function uploadOne(file) {
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from('gallery-images')
      .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
    if (error) return null;
    return supabase.storage.from('gallery-images').getPublicUrl(path).data.publicUrl;
  }

  // फोटोको नामबाट सफा title बनाउने (जस्तै "my-photo_01.jpg" -> "my photo 01")
  const titleFromName = (name) =>
    name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ').trim().slice(0, 80) || 'Photo';

  async function handleSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setSaving(true);

    if (isEdit) {
      let imageUrl = image.image_url;
      if (files[0]) {
        const url = await uploadOne(files[0].file);
        if (!url) {
          setSaving(false);
          setErrors({ form: 'Could not upload the image. Please try again.' });
          return;
        }
        imageUrl = url;
      }
      const { error } = await supabase
        .from('gallery_images')
        .update({
          title: title.trim(),
          description: description.trim() || null,
          category_id: categoryId,
          ratio,
          is_visible: isVisible,
          image_url: imageUrl,
        })
        .eq('id', image.id);
      setSaving(false);
      if (error) {
        setErrors({ form: 'Could not save changes. Please try again.' });
        return;
      }
      onSaved('Photo updated.');
      return;
    }

    // नयाँ: एक-एक गरी upload, असफल भएको गन्ने
    let ok = 0;
    for (let i = 0; i < files.length; i++) {
      const { file } = files[i];
      const url = await uploadOne(file);
      if (!url) continue;
      const { error } = await supabase.from('gallery_images').insert({
        title: files.length === 1 ? title.trim() : title.trim() || titleFromName(file.name),
        description: description.trim() || null,
        image_url: url,
        category_id: categoryId,
        ratio,
        is_visible: isVisible,
        sort_order: nextSortOrder + i,
      });
      if (!error) ok += 1;
    }
    setSaving(false);

    if (ok === 0) {
      setErrors({ form: 'Could not upload the photos. Please try again.' });
      return;
    }
    const failed = files.length - ok;
    onSaved(failed ? `${ok} photo(s) added, ${failed} failed.` : `${ok} photo(s) added.`);
  }

  const inputClass =
    'w-full rounded-sm border bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none';
  const border = (k) => (errors[k] ? 'border-brick' : 'border-gold/50');
  const showPreview = files.length > 0 ? files : image ? [{ preview: image.image_url }] : [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-brown/60 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" className="my-6 w-full max-w-xl rounded-sm bg-cream shadow-lift">
        <div className="flex items-center justify-between border-b border-gold/40 px-5 py-4">
          <h2 className="font-serif text-xl text-maroon">{isEdit ? 'Edit Photo' : 'Upload Photos'}</h2>
          <button onClick={onClose} disabled={saving} aria-label="Close" className="text-brown/60 hover:text-brown">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 p-5">
          {errors.form && (
            <div className="rounded-sm border border-brick/40 bg-brick/10 p-3 text-sm text-brick">{errors.form}</div>
          )}

          <div>
            <p className="mb-1.5 text-sm font-medium text-brown">{isEdit ? 'Photo' : 'Photos (up to 10)'}</p>
            <div className="flex flex-wrap items-center gap-3">
              {showPreview.length === 0 ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-sm border border-dashed border-gold/60 text-brown/40">
                  <ImagePlus size={26} />
                </div>
              ) : (
                showPreview.map((f, i) => (
                  <img key={i} src={f.preview} alt="" className="h-20 w-20 rounded-sm border border-gold/50 object-cover" />
                ))
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple={!isEdit}
              onChange={handleFiles}
              className="hidden"
            />
            <button type="button" onClick={() => fileInput.current?.click()} className="btn-outline mt-3 !px-4 !py-2 !text-brown">
              {isEdit ? 'Replace photo' : 'Choose photos'}
            </button>
            <p className="mt-1 text-xs text-brown/60">JPG, PNG or WebP, up to 3 MB each.</p>
            {errors.files && <p className="mt-1 text-xs text-brick">{errors.files}</p>}
          </div>

          <div>
            <label htmlFor="g-title" className="mb-1 block text-sm font-medium text-brown">
              Title{!isEdit && files.length > 1 ? ' (optional: each photo uses its file name)' : ' *'}
            </label>
            <input id="g-title" className={`${inputClass} ${border('title')}`} value={title} onChange={(e) => setTitle(e.target.value)} maxLength={80} />
            {errors.title && <p className="mt-1 text-xs text-brick">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="g-desc" className="mb-1 block text-sm font-medium text-brown">Description (optional)</label>
            <textarea id="g-desc" rows={2} className={`${inputClass} ${border('description')}`} value={description} onChange={(e) => setDescription(e.target.value)} maxLength={300} />
            {errors.description && <p className="mt-1 text-xs text-brick">{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="g-cat" className="mb-1 block text-sm font-medium text-brown">Category *</label>
              <select id="g-cat" className={`${inputClass} ${border('category')}`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-brick">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="g-ratio" className="mb-1 block text-sm font-medium text-brown">Shape on website</label>
              <select id="g-ratio" className={`${inputClass} border-gold/50`} value={ratio} onChange={(e) => setRatio(e.target.value)}>
                {RATIOS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-brown">
            <input type="checkbox" checked={isVisible} onChange={(e) => setIsVisible(e.target.checked)} className="h-4 w-4 accent-maroon" />
            Show on website
          </label>

          <div className="flex justify-end gap-2 border-t border-gold/30 pt-4">
            <button type="button" onClick={onClose} disabled={saving} className="btn-outline !px-5 !py-2 !text-brown">Cancel</button>
            <button type="submit" disabled={saving} className="btn-maroon !px-5 !py-2 disabled:opacity-60">
              {saving ? 'Saving...' : isEdit ? 'Save changes' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}