import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// .env मा केही छुटेको छ भने स्पष्ट सन्देश देखाउने
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase settings missing. Check VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your .env file, then restart npm run dev.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);