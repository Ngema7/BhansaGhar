import { useCallback, useEffect, useState } from 'react';
import { Save, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';
import { ADMIN_BASE } from '../config.js';

const SECTIONS = [
  { key: 'show_signature', label: 'Signature Dishes', hint: 'Shows your ⭐ Featured dishes from Menu Management.' },
  { key: 'show_intro', label: 'Brand intro', hint: '"A home for Nepali flavor" with the interior photo.' },
  { key: 'show_features', label: 'Why Choose Us', hint: 'The three feature icons.' },
  { key: 'show_gallery', label: 'Gallery preview', hint: 'First 8 visible photos from Gallery Management.' },
  { key: 'show_cta', label: 'Final call-to-action', hint: '"Experience the Taste of Nepal" banner.' },
];

const TEXT_KEYS = ['hero_title_ne', 'hero_title_en', 'hero_subtitle'];

function validate(v) {
  const e = {};
  if (v.hero_title_ne.length > 120) e.hero_title_ne = 'Maximum 120 characters.';
  if (v.hero_title_en.length > 120) e.hero_title_en = 'Maximum 120 characters.';
  if (v.hero_subtitle.length > 200) e.hero_subtitle = 'Maximum 200 characters.';
  return e;
}

// बाहिर राखिएको: टाइप गर्दा focus नहराउन
function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={`h-${id}`} className="mb-1 block text-sm font-medium text-brown">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-brown/60">{hint}</p>}
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}
    </div>
  );
}

export default function HomepageContent() {
  const toast = useToast();
  const [values, setValues] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase.from('homepage_content').select('*').eq('id', 1).maybeSingle();
    if (error || !data) {
      setLoadError('Could not load homepage content. Please try again.');
      return;
    }
    setValues(data);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setText = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };
  const setFlag = (k) => (e) => setValues((v) => ({ ...v, [k]: e.target.checked }));

  async function handleSubmit(ev) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const payload = {};
    for (const k of TEXT_KEYS) payload[k] = values[k].trim();
    for (const s of SECTIONS) payload[s.key] = !!values[s.key];
    const { error } = await supabase.from('homepage_content').update(payload).eq('id', 1);
    setSaving(false);

    if (error) {
      toast.show('Could not save changes.', 'error');
      return;
    }
    toast.show('Homepage saved. Refresh the website to see it.');
  }

  const inputClass = (k) =>
    `w-full rounded-sm border bg-white/60 px-3 py-2 text-sm text-brown focus:border-gold focus:outline-none ${
      errors[k] ? 'border-brick' : 'border-gold/50'
    }`;
  const card = 'space-y-4 rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Homepage Content</h1>
        <div className="my-3 h-px w-20 bg-gold" />
        <p className="text-sm text-brown/70">Edit the main heading and choose which sections appear on the home page.</p>
      </div>

      {loadError ? (
        <div className="text-sm text-brick">{loadError} <button onClick={load} className="underline">Retry</button></div>
      ) : !values ? (
        <p className="text-sm text-brown/70">Loading...</p>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Hero text</h2>
            <p className="text-xs text-brown/60">Press Enter to start a new line. Plain text only.</p>
            <Field id="hero_title_ne" label="Nepali heading" error={errors.hero_title_ne}>
              <textarea id="h-hero_title_ne" rows={2} maxLength={120} className={`${inputClass('hero_title_ne')} font-deva`} value={values.hero_title_ne} onChange={setText('hero_title_ne')} />
            </Field>
            <Field id="hero_title_en" label="English heading" error={errors.hero_title_en}>
              <textarea id="h-hero_title_en" rows={2} maxLength={120} className={inputClass('hero_title_en')} value={values.hero_title_en} onChange={setText('hero_title_en')} />
            </Field>
            <Field id="hero_subtitle" label="Subtitle" error={errors.hero_subtitle}>
              <textarea id="h-hero_subtitle" rows={2} maxLength={200} className={inputClass('hero_subtitle')} value={values.hero_subtitle} onChange={setText('hero_subtitle')} />
            </Field>
          </section>

          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Sections</h2>
            <p className="text-xs text-brown/60">Untick a section to hide it from the home page.</p>
            <ul className="divide-y divide-gold/20">
              {SECTIONS.map((s) => (
                <li key={s.key} className="py-3">
                  <label className="flex items-start gap-3 text-sm text-brown">
                    <input type="checkbox" checked={!!values[s.key]} onChange={setFlag(s.key)} className="mt-0.5 h-4 w-4 accent-maroon" />
                    <span>
                      <span className="font-medium">{s.label}</span>
                      <span className="block text-xs text-brown/60">{s.hint}</span>
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </section>

          <section className={card}>
            <h2 className="flex items-center gap-2 font-serif text-lg text-maroon"><Star size={18} className="text-gold" /> Featured dishes</h2>
            <p className="text-sm text-brown/70">
              Signature Dishes uses the ⭐ stars in <Link to={`${ADMIN_BASE}/menu`} className="text-maroon underline">Menu Management</Link>. The first 4 available featured dishes are shown.
            </p>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-maroon disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}