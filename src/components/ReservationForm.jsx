import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import Button from './Button.jsx';
import { gsap, useGSAP, prefersReducedMotion } from '../animations/gsapConfig.js';
import { useRef } from 'react';

const todayStr = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split('T')[0];
const times = ['11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00'];
const fmtTime = (t) => { const [h, m] = t.split(':').map(Number); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`; };
const empty = { name: '', email: '', phone: '', date: '', time: '', guests: '2', requests: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Enter your full name.';
  else if (v.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!v.email.trim()) e.email = 'Enter your email address.';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Enter a valid email, e.g. name@example.com.';
  const digits = v.phone.replace(/\D/g, '');
  if (!v.phone.trim()) e.phone = 'Enter your phone number.';
  else if (!/^\+?[0-9\s-]+$/.test(v.phone.trim()) || digits.length < 7 || digits.length > 15) e.phone = 'Enter a valid phone number (7–15 digits).';
  if (!v.date) e.date = 'Choose a date.';
  else if (v.date < todayStr()) e.date = 'Date cannot be in the past.';
  if (!v.time) e.time = 'Choose a time.';
  else if (v.date === todayStr()) {
    const now = new Date();
    const [h, m] = v.time.split(':').map(Number);
    if (h * 60 + m <= now.getHours() * 60 + now.getMinutes()) e.time = 'That time has already passed today.';
  }
  if (!v.guests) e.guests = 'Choose the number of guests.';
  return e;
}

export default function ReservationForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const box = useRef(null);

  useGSAP(() => {
    if (submitted && !prefersReducedMotion()) {
      gsap.from('[data-confirm]', { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 });
    }
  }, { dependencies: [submitted], scope: box });

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length === 0) setSubmitted({ ...values });
    else document.getElementById(`res-${Object.keys(found)[0]}`)?.focus();
  };

  const field = 'w-full rounded-sm border border-gold/60 bg-cream/70 px-3 py-2.5 text-sm text-brown placeholder:text-brown/40 focus:border-brick';
  const Err = ({ id }) => errors[id] ? <p id={`err-${id}`} role="alert" className="mt-1 text-xs text-brick">{errors[id]}</p> : null;
  const aria = (id) => ({ id: `res-${id}`, 'aria-invalid': !!errors[id], 'aria-describedby': errors[id] ? `err-${id}` : undefined });

  if (submitted) {
    const rows = [['Name', submitted.name], ['Email', submitted.email], ['Phone', submitted.phone], ['Date', new Date(`${submitted.date}T00:00`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })], ['Time', fmtTime(submitted.time)], ['Guests', submitted.guests], ...(submitted.requests.trim() ? [['Requests', submitted.requests]] : [])];
    return (
      <div ref={box} className="ornate-border bg-cream p-6 sm:p-8" role="status">
        <CheckCircle2 data-confirm className="text-gold" size={40} />
        <h3 data-confirm className="mt-3 text-2xl font-semibold text-maroon">Thank you, {submitted.name.split(' ')[0]}.</h3>
        <p data-confirm className="mt-1 text-sm text-brown/80">Your reservation request is ready. We look forward to serving you.</p>
        <dl data-confirm className="mt-5 divide-y divide-gold/30 border-y border-gold/40 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex gap-4 py-2"><dt className="w-24 shrink-0 text-brown/60">{k}</dt><dd className="font-medium break-words">{v}</dd></div>
          ))}
        </dl>
        <p data-confirm className="mt-4 text-xs text-brown/60">Demo notice: this frontend does not send or store reservations yet. Backend integration comes later.</p>
        <Button data-confirm variant="maroon" className="mt-5" type="button" onClick={() => { setSubmitted(null); setValues(empty); }}>Make another reservation</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4" aria-label="Reservation form">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2"><label htmlFor="res-name" className="mb-1 block text-xs font-medium text-maroon">Full Name</label>
          <input type="text" autoComplete="name" className={field} placeholder="Your full name" value={values.name} onChange={set('name')} {...aria('name')} /><Err id="name" /></div>
        <div><label htmlFor="res-email" className="mb-1 block text-xs font-medium text-maroon">Email Address</label>
          <input type="email" autoComplete="email" className={field} placeholder="you@example.com" value={values.email} onChange={set('email')} {...aria('email')} /><Err id="email" /></div>
        <div><label htmlFor="res-phone" className="mb-1 block text-xs font-medium text-maroon">Phone Number</label>
          <input type="tel" autoComplete="tel" className={field} placeholder="+977 98XXXXXXXX" value={values.phone} onChange={set('phone')} {...aria('phone')} /><Err id="phone" /></div>
        <div><label htmlFor="res-date" className="mb-1 block text-xs font-medium text-maroon">Date</label>
          <input type="date" min={todayStr()} className={field} value={values.date} onChange={set('date')} {...aria('date')} /><Err id="date" /></div>
        <div><label htmlFor="res-time" className="mb-1 block text-xs font-medium text-maroon">Time</label>
          <select className={field} value={values.time} onChange={set('time')} {...aria('time')}>
            <option value="">Select a time</option>
            {times.map((t) => <option key={t} value={t}>{fmtTime(t)}</option>)}
          </select><Err id="time" /></div>
        <div className="sm:col-span-2"><label htmlFor="res-guests" className="mb-1 block text-xs font-medium text-maroon">Number of Guests</label>
          <select className={field} value={values.guests} onChange={set('guests')} {...aria('guests')}>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
          </select><Err id="guests" /></div>
        <div className="sm:col-span-2"><label htmlFor="res-requests" className="mb-1 block text-xs font-medium text-maroon">Special Requests <span className="text-brown/50">(optional)</span></label>
          <textarea rows={3} className={field} placeholder="Allergies, celebrations, seating preferences…" value={values.requests} onChange={set('requests')} id="res-requests" /></div>
      </div>
      <Button type="submit" className="w-full sm:w-auto">Confirm Reservation</Button>
    </form>
  );
}
