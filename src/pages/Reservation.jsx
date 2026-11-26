import { MessageCircle, PhoneCall, Clock } from 'lucide-react';
import PageHero from '../components/PageHero.jsx';
import ReservationForm from '../components/ReservationForm.jsx';
import SmartImage from '../components/SmartImage.jsx';
import { images } from '../data/images.js';
import { useSite } from '../context/SiteContext.jsx';

export default function Reservation() {
    const site = useSite();
  return (
    <>
      <PageHero title="Reservation" nepali="बुकिङ गर्नुहोस्" image={images.reservationHero} />
      <section className="paper py-14 sm:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <div data-reveal>
              <h2 className="text-3xl font-semibold text-maroon sm:text-4xl">Reserve Your Table</h2>
              <p className="mb-6 mt-2 text-sm text-brown/80">Book a table for an unforgettable dining experience at Bhansa Ghar.</p>
            </div>
            <div data-reveal><ReservationForm /></div>
            <div data-stagger className="mt-10 grid gap-4 sm:grid-cols-2">
              <a href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-sm border border-gold/60 bg-cream p-4 shadow-card transition-shadow hover:shadow-lift">
                <MessageCircle className="text-[#2f8f4e]" /><span className="text-sm"><b className="block font-medium">Chat on WhatsApp</b>{site.phone}</span></a>
              <a href={`tel:${site.phone}`} className="flex items-center gap-3 rounded-sm border border-gold/60 bg-cream p-4 shadow-card transition-shadow hover:shadow-lift">
                <PhoneCall className="text-brick" /><span className="text-sm"><b className="block font-medium">Call Us</b>{site.phone}</span></a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-brown/70"><Clock size={14} className="text-gold" />{site.hours} · For large groups, please call us in advance.</p>
          </div>
          <div data-img-reveal className="lg:sticky lg:top-28 lg:self-start">
            <SmartImage src={images.reservation} alt="A warmly lit dining table at Bhansa Ghar" className="aspect-[4/5] w-full rounded-sm border border-gold/60 shadow-lift" />
          </div>
        </div>
      </section>
    </>
  );
}