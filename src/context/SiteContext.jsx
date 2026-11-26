import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { site as fallback } from '../data/site.js';

const SiteContext = createContext(fallback);

// database को स्तम्भ -> पुरानो site.js को ढाँचा
function fromRow(r) {
  return {
    name: r.name,
    tagline: r.tagline,
    address: r.address,
    phone: r.phone,
    whatsapp: r.whatsapp,
    email: r.email,
    hours: r.hours,
    mapEmbedUrl: r.map_embed_url,
    menuPdfUrl: fallback.menuPdfUrl,
    social: { facebook: r.facebook, instagram: r.instagram, youtube: r.youtube },
  };
}

export function SiteProvider({ children }) {
  const [site, setSite] = useState(fallback);

  useEffect(() => {
    let active = true;
    supabase
      .from('site_settings')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active && !error && data) setSite(fromRow(data));
      });
    return () => {
      active = false;
    };
  }, []);

  return <SiteContext.Provider value={site}>{children}</SiteContext.Provider>;
}

export function useSite() {
  return useContext(SiteContext);
}