import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // यो user admins सूचीमा छ कि छैन जाँच्ने
  const checkAdmin = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle();

    return !error && !!data;
  }, []);

  useEffect(() => {
    let active = true;

    async function init() {
      const { data } = await supabase.auth.getSession();
      const current = data.session;
      const admin = current ? await checkAdmin(current.user.id) : false;
      if (!active) return;
      setSession(current);
      setIsAdmin(admin);
      setLoading(false);
    }
    init();

    // login / logout हुँदा आफैं चल्छ
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      // यहाँ सिधै await नगरी setTimeout प्रयोग गर्नु Supabase ले सिफारिस गरेको सुरक्षित तरिका हो
      setTimeout(async () => {
        const admin = newSession ? await checkAdmin(newSession.user.id) : false;
        if (!active) return;
        setSession(newSession);
        setIsAdmin(admin);
      }, 0);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [checkAdmin]);

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Incorrect email or password.' };

    // Login सफल भए पनि admin होइन भने तुरुन्त बाहिर निकाल्ने
    const admin = await checkAdmin(data.user.id);
    if (!admin) {
      await supabase.auth.signOut();
      return { error: 'This account does not have admin access.' };
    }
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider value={{ session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}