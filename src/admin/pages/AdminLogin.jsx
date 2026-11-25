import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { ADMIN_BASE } from '../config.js';


export default function AdminLogin() {
    const { signIn, session, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // पहिले नै login भएको admin लाई सिधै dashboard मा पठाउने
  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      navigate(`${ADMIN_BASE}/dashboard`, { replace: true });
    }
  }, [authLoading, session, isAdmin, navigate]);
  // useState = React को "याद राख्ने बट्टा"।
  // हरेक बट्टामा [मान, मान बदल्ने function] हुन्छ।
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validation: form पठाउनु अघि जाँच्ने
  function validate() {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    return newErrors;
  }

   async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      setErrors({ form: error });
      return;
    }
    navigate(`${ADMIN_BASE}/dashboard`, { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-maroon px-5 py-10">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-serif text-4xl tracking-wide text-gold">
            BHANSA GHAR
          </h1>
          <p className="mt-1 text-[11px] uppercase tracking-[0.3em] text-cream/70">
            Authentic Nepali Cuisine
          </p>
        </div>

        {/* Card */}
        <div className="ornate-border rounded-sm bg-cream p-8 shadow-lift">
          <h2 className="font-serif text-2xl text-maroon">Welcome Back</h2>
          <p className="mt-1 text-sm text-brown/70">
            Sign in to manage your restaurant.
          </p>
          <div className="my-5 h-px w-full bg-gold/60" />

          {/* noValidate = browser को आफ्नै सन्देश बन्द, हाम्रै देखाउने */}
          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {/* Form-level error */}
            {errors.form && (
              <div className="flex items-start gap-2 rounded-sm border border-brick/40 bg-brick/10 p-3 text-sm text-brick">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brown">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brick/60" />
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className={`w-full rounded-sm border bg-white/60 py-2.5 pl-10 pr-3 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none ${
                    errors.email ? 'border-brick' : 'border-gold/50'
                  }`}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-brick">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brown">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-brick/60" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full rounded-sm border bg-white/60 py-2.5 pl-10 pr-11 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none ${
                    errors.password ? 'border-brick' : 'border-gold/50'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brick/60 hover:text-maroon"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-brick">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-maroon w-full disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} Bhansa Ghar. Private admin area.
        </p>
      </div>
    </div>
  );
}