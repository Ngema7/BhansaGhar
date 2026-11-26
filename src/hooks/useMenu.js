import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';
import { menuItems as fallbackItems, menuCategories as fallbackCategories } from '../data/menuData.js';

// Public Menu को लागि data ल्याउने।
// database असफल भए पुरानो menuData.js देखाउँछ।
export function useMenu() {
  const [state, setState] = useState({
    items: fallbackItems,
    categories: fallbackCategories,
    source: 'fallback',
  });

  useEffect(() => {
    let active = true;

    async function load() {
      const [dishRes, catRes] = await Promise.all([
        supabase
          .from('menu_items')
          .select('id, name, description, price, image_url, sort_order, categories(name)')
          .eq('is_available', true)
          .order('sort_order', { ascending: true }),
        supabase.from('categories').select('name').order('sort_order', { ascending: true }),
      ]);

      if (!active) return;
      if (dishRes.error || catRes.error || !dishRes.data) return; // fallback नै रहन्छ

      const items = dishRes.data.map((d) => ({
        id: d.id,
        name: d.name,
        desc: d.description || '',
        price: d.price,
        category: d.categories?.name || '',
        image: d.image_url,
      }));

      setState({
        items,
        categories: ['All', ...catRes.data.map((c) => c.name)],
        source: 'database',
      });
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  return state;
}