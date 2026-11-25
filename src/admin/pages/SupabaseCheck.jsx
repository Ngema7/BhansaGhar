import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient.js';

export default function SupabaseCheck() {
  const [result, setResult] = useState('Checking...');

  useEffect(() => {
    // Supabase सँग कुरा गर्न सकिन्छ कि छैन जाँच्ने
    supabase.auth.getSession().then(({ error }) => {
      setResult(error ? `❌ Error: ${error.message}` : '✅ Connected to Supabase');
    });
  }, []);

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl text-maroon">Supabase Connection Test</h1>
      <p className="mt-3 text-brown">{result}</p>
    </div>
  );
}