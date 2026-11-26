import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { galleryItems as fallbackItems, galleryCategories as fallbackCategories } from '../data/galleryData.js';

// Public Gallery को लागि data ल्याउने। असफल भए पुरानो galleryData.js देखाउँछ।
export function useGallery() {
  const [state, setState] = useState({
    items: fallbackItems,
    categories: fallbackCategories,
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const [imgRes, catRes] = await Promise.all([
        supabase
          .from('gallery_images')
          .select('id, title, image_url, ratio, sort_order, gallery_categories(name)')
          .eq('is_visible', true)
          .order('sort_order', { ascending: true }),
        supabase.from('gallery_categories').select('name').order('sort_order', { ascending: true }),
      ]);

      if (!active) return;
      if (imgRes.error || catRes.error || !imgRes.data || !catRes.data) return; // fallback नै रहन्छ

      setState({
        items: imgRes.data.map((g) => ({
          id: g.id,
          title: g.title,
          category: g.gallery_categories?.name || '',
          ratio: g.ratio,
          src: g.image_url,
        })),
        categories: ['All', ...catRes.data.map((c) => c.name)],
      });
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}