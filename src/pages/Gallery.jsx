import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import GalleryGrid from '../components/GalleryGrid.jsx';
import Button from '../components/Button.jsx';
import { images } from '../data/images.js';
import { useGallery } from '../hooks/useGallery.js';

const PAGE = 8;

export default function Gallery() {
    const { items: galleryItems, categories: galleryCategories } = useGallery();
  const [category, setCategory] = useState('All');
  const [visible, setVisible] = useState(PAGE);
  const filtered = useMemo(() => (category === 'All' ? galleryItems : galleryItems.filter((g) => g.category === category)), [category, galleryItems]);
  const shown = filtered.slice(0, visible);

  return (
    <>
      <PageHero title="Our Gallery" nepali="हाम्रो झलक" image={images.story.interior} />
      <section className="paper py-14 sm:py-16">
        <div className="container-x">
          <div role="group" aria-label="Gallery categories" className="flex flex-wrap justify-center gap-2">
            {galleryCategories.map((c) => (
              <button key={c} type="button" onClick={() => { setCategory(c); setVisible(PAGE); }} aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors sm:text-sm ${category === c ? 'border-maroon bg-maroon text-cream' : 'border-gold/70 bg-cream hover:bg-gold/20'}`}>{c}</button>
            ))}
          </div>
          <div className="mt-8">
            {shown.length ? <GalleryGrid items={shown} key={category} /> : <p className="py-10 text-center text-brown/70">No photos in this category yet.</p>}
          </div>
          {visible < filtered.length && (
            <div className="mt-10 text-center"><Button variant="maroon" type="button" onClick={() => setVisible((v) => v + PAGE)}><Plus size={16} /> View More Photos</Button></div>
          )}
        </div>
      </section>
    </>
  );
}
