import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient.js';

// null = अझै आएको छैन / असफल (पुरानो default देखाउने)
export function useHomeContent() {
  const [content, setContent] = useState(null);
  const [featured, setFeatured] = useState(null);

  useEffect(() => {
    let active = true;

    supabase
      .from('homepage_content')
      .select('*')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (active && !error && data) setContent(data);
      });

    supabase
      .from('menu_items')
      .select('id, name, description, image_url, sort_order')
      .eq('is_featured', true)
      .eq('is_available', true)
      .order('sort_order', { ascending: true })
      .limit(4)
      .then(({ data, error }) => {
        if (active && !error && data && data.length > 0) {
          setFeatured(
            data.map((d) => ({
              name: d.name,
              desc: d.description || '',
              image: d.image_url,
              to: '/menu',
            }))
          );
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return { content, featured };
}