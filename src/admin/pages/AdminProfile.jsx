import { useState } from 'react';
import { Eye, EyeOff, KeyRound, Mail, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { ADMIN_BASE } from '../config.js';

// बाहिर राखिएको: टाइप गर्दा focus नहराउन
function PasswordField({ id, label, value, onChange, error, show, onToggle, autoComplete }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-brown">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          onChange={onChange}
          className={`w-full rounded-sm border bg-white/60 py-2 pl-3 pr-11 text-sm text-brown focus:border-gold focus:outline-none ${
            error ? 'border-brick' : 'border-gold/50'
          }`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={show ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-brick/60 hover:text-maroon"
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-brick">{error}</p>}
    </div>
  );
}

export default function AdminProfile() {
  const { session, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const email = session?.user?.email || '';

  function validate() {
    const e = {};
    if (!current) e.current = 'Enter your current password.';
    if (!next) e.next = 'Enter a new password.';
    else if (next.length < 12) e.next = 'Use at least 12 characters.';
    else if (next.length > 72) e.next = 'Maximum 72 characters.';
    else if (next === current) e.next = 'New password must be different.';
    if (confirm !== next) e.confirm = 'Passwords do not match.';
    return e;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    setSaving(true);

    // १) हालको password सही छ कि जाँच्ने
    const check = await supabase.auth.signInWithPassword({ email, password: current });
    if (check.error) {
      setSaving(false);
      setErrors({ current: 'Current password is incorrect.' });
      return;
    }

    // २) नयाँ password राख्ने
    const { error } = await supabase.auth.updateUser({ password: next });
    setSaving(false);

    if (error) {
      setErrors({ next: 'Could not change the password. Try a stronger one.' });
      return;
    }
    setCurrent('');
    setNext('');
    setConfirm('');
    toast.show('Password changed.');
  }

  async function handleLogout() {
    await signOut();
    navigate(ADMIN_BASE, { replace: true });
  }

  const card = 'space-y-4 rounded-sm border border-gold/40 bg-white/50 p-5 shadow-card';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl text-maroon">Admin Profile</h1>
        <div className="my-3 h-px w-20 bg-gold" />
      </div>

      <section className={card}>
        <h2 className="flex items-center gap-2 font-serif text-lg text-maroon"><Mail size={18} className="text-gold" /> Account</h2>
        <p className="text-sm text-brown"><span className="text-brown/60">Email: </span>{email}</p>
        <p className="text-xs text-brown/60">Only this account can manage the website.</p>
      </section>

      <form onSubmit={handleSubmit} noValidate className={`${card} max-w-lg`}>
        <h2 className="flex items-center gap-2 font-serif text-lg text-maroon"><KeyRound size={18} className="text-gold" /> Change password</h2>
        <PasswordField id="p-current" label="Current password" value={current} onChange={(e) => setCurrent(e.target.value)} error={errors.current} show={show} onToggle={() => setShow((s) => !s)} autoComplete="current-password" />
        <PasswordField id="p-next" label="New password (12+ characters)" value={next} onChange={(e) => setNext(e.target.value)} error={errors.next} show={show} onToggle={() => setShow((s) => !s)} autoComplete="new-password" />
        <PasswordField id="p-confirm" label="Confirm new password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} show={show} onToggle={() => setShow((s) => !s)} autoComplete="new-password" />
        <button type="submit" disabled={saving} className="btn-maroon disabled:opacity-60">
          {saving ? 'Saving...' : 'Change password'}
        </button>
      </form>

      <section className={card}>
        <button onClick={handleLogout} className="btn-outline !text-brown">
          <LogOut size={16} /> Log out
        </button>
      </section>
    </div>
  );
}