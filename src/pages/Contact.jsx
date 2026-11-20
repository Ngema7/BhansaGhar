import PageHero from '../components/PageHero.jsx';
import { GetInTouch, OpeningHours, MapBlock } from '../components/ContactInfo.jsx';
import { images } from '../data/images.js';

export default function Contact() {
  return (
    <>
      <PageHero title="Contact Us" nepali="सम्पर्क गर्नुहोस्" image={images.contact} />
      <section className="paper py-14 sm:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <GetInTouch />
          <OpeningHours />
          <div className="md:col-span-2 lg:col-span-1"><MapBlock /></div>
        </div>
      </section>
    </>
  );
}
