import { useCallback, useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient.js';
import { useToast } from '../components/Toast.jsx';

const EMPTY = {
  name: '', tagline: '', address: '', phone: '', whatsapp: '', email: '', hours: '',
  map_embed_url: '', facebook: '', instagram: '', youtube: '',
};

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Restaurant name is required.';
  else if (v.name.trim().length > 60) e.name = 'Maximum 60 characters.';
  if (v.tagline.length > 120) e.tagline = 'Maximum 120 characters.';
  if (v.address.length > 200) e.address = 'Maximum 200 characters.';
  if (v.phone.length > 25) e.phone = 'Maximum 25 characters.';
  if (v.whatsapp && !/^[0-9]{10,15}$/.test(v.whatsapp.trim()))
    e.whatsapp = 'Digits only with country code, 10–15 digits (e.g. 9779812345678).';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email.';
  if (v.email.length > 120) e.email = 'Maximum 120 characters.';
  if (v.hours.length > 120) e.hours = 'Maximum 120 characters.';
  if (v.map_embed_url && !/^https:\/\/www\.google\.com\/maps\/embed/.test(v.map_embed_url.trim()))
    e.map_embed_url = 'Must start with https://www.google.com/maps/embed (use the src link from Google Maps → Share → Embed a map).';
  if (v.map_embed_url.length > 2000) e.map_embed_url = 'Link is too long.';
  for (const k of ['facebook', 'instagram', 'youtube']) {
    if (v[k] && !/^https:\/\//i.test(v[k].trim())) e[k] = 'Must start with https://';
  }
  return e;
}

// ✅ बाहिर राखिएको: अब टाइप गर्दा focus हराउँदैन
function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={`s-${id}`} className="mb-1 block text-sm font-medium text-brown">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-brown/60">{hint}</p>}
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}
    </div>
  );
}

export default function WebsiteSettings() {
  const toast = useToast();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoadError('');
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', 1).maybeSingle();
    if (error || !data) {
      setLoadError('Could not load settings. Please try again.');
    } else {
      const next = {};
      for (const k of Object.keys(EMPTY)) next[k] = data[k] ?? '';
      setValues(next);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  async function handleSubmit(ev) {
    ev.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);
    const payload = {};
    for (const k of Object.keys(EMPTY)) payload[k] = values[k].trim();
    const { error } = await supabase.from('site_settings').update(payload).eq('id', 1);
    setSaving(false);

    if (error) {
      toast.show('Could not save settings.', 'error');
      return;
    }
    toast.show('Settings saved. The website will show them on next refresh.');
  }

  const inputClass = (k) =>
    `w-full rounded-sm border bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none ${
      errors[k] ? 'border-brick' : 'border-gold/50'
    }`;

  const text = (id, props = {}) => (
    <input id={`s-${id}`} className={inputClass(id)} value={values[id]} onChange={set(id)} {...props} />
  );

  const card = 'space-y-4 rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Website Settings</h1>
        <div className="my-3 h-px w-20 bg-gold" />
        <p className="text-sm text-brown/70">
          These details appear on the Contact page, Footer and Reservation page.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-brown/70">Loading...</p>
      ) : loadError ? (
        <div className="text-sm text-brick">
          {loadError} <button onClick={load} className="underline">Retry</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Restaurant</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Restaurant name *" error={errors.name}>{text('name', { maxLength: 60 })}</Field>
              <Field id="tagline" label="Tagline" error={errors.tagline}>{text('tagline', { maxLength: 120 })}</Field>
            </div>
          </section>

          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Contact</h2>
            <Field id="address" label="Address" error={errors.address}>{text('address', { maxLength: 200 })}</Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="phone" label="Phone number" error={errors.phone}>{text('phone', { maxLength: 25, inputMode: 'tel' })}</Field>
              <Field id="whatsapp" label="WhatsApp number" error={errors.whatsapp} hint="Digits only, with country code. Example: 9779812345678">
                {text('whatsapp', { maxLength: 15, inputMode: 'numeric' })}
              </Field>
            </div>
            <Field id="email" label="Email address" error={errors.email}>{text('email', { maxLength: 120, type: 'email' })}</Field>
          </section>

          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Opening hours</h2>
            <Field id="hours" label="Hours text" error={errors.hours} hint="Example: Daily: 11:00 AM – 10:00 PM">
              {text('hours', { maxLength: 120 })}
            </Field>
          </section>

          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Google Maps</h2>
            <Field
              id="map_embed_url"
              label="Map embed link"
              error={errors.map_embed_url}
              hint="Google Maps → Share → Embed a map → copy only the src=&quot;...&quot; link. Leave empty to use the default map."
            >
              <textarea
                id="s-map_embed_url"
                rows={3}
                className={inputClass('map_embed_url')}
                value={values.map_embed_url}
                onChange={set('map_embed_url')}
                maxLength={2000}
              />
            </Field>
          </section>

          <section className={card}>
            <h2 className="font-serif text-lg text-maroon">Social media</h2>
            <p className="text-xs text-brown/60">Leave a field empty to hide that icon on the website.</p>
            <Field id="facebook" label="Facebook" error={errors.facebook}>{text('facebook', { placeholder: 'https://facebook.com/...' })}</Field>
            <Field id="instagram" label="Instagram" error={errors.instagram}>{text('instagram', { placeholder: 'https://instagram.com/...' })}</Field>
            <Field id="youtube" label="YouTube" error={errors.youtube}>{text('youtube', { placeholder: 'https://youtube.com/...' })}</Field>
          </section>

          <div className="flex justify-end">
            <button type="submit" disabled={saving} className="btn-maroon disabled:opacity-60">
              <Save size={16} /> {saving ? 'Saving...' : 'Save settings'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}