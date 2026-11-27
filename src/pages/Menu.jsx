import { useMemo, useRef, useState } from "react";
import PageHero from "../components/PageHero.jsx";
import FoodCard from "../components/FoodCard.jsx";
import { images } from "../data/images.js";
import { useMenu } from "../hooks/useMenu.js";
import {
  gsap,
  useGSAP,
  prefersReducedMotion,
} from "../animations/gsapConfig.js";
import { QrCode } from "lucide-react";

export default function Menu() {
  const { items: menuItems, categories: menuCategories } = useMenu();
  const [category, setCategory] = useState("All");
  const grid = useRef(null);
  const items = useMemo(
    () =>
      category === "All"
        ? menuItems
        : menuItems.filter((m) => m.category === category),
    [category, menuItems],
  );

  useGSAP(
    () => {
      if (prefersReducedMotion() || !grid.current) return;
      gsap.fromTo(
        grid.current.children,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          clearProps: "transform,opacity",
        },
      );
    },
    { dependencies: [category], scope: grid },
  );

  return (
    <>
      <PageHero
        title="Our Menu"
        nepali="हाम्रो मेनु"
        image={images.menu.thali}
      />
      <section className="paper py-14 sm:py-16">
        <div className="container-x">
          <div className="mx-auto mb-6 flex max-w-2xl items-center gap-3 rounded-sm border border-gold/70 bg-gold/15 px-4 py-3 text-sm text-brown">
            <QrCode size={22} className="shrink-0 text-maroon" />
            <p>
              <span className="font-medium text-maroon">Dining with us?</span>{" "}
              Scan the QR code on your table to order directly from your seat.
            </p>
          </div>
          <div
            role="group"
            aria-label="Menu categories"
            className="flex flex-wrap justify-center gap-2"
          >
            {menuCategories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                aria-pressed={category === c}
                className={`rounded-full border px-4 py-1.5 text-xs transition-colors sm:text-sm ${category === c ? "border-maroon bg-maroon text-cream" : "border-gold/70 bg-cream text-brown hover:bg-gold/20"}`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="gold-line mt-6">
            <span />
          </div>
          <div
            ref={grid}
            aria-live="polite"
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6"
          >
            {items.map((m) => (
              <FoodCard
                key={m.id}
                name={m.name}
                desc={m.desc}
                image={m.image}
                price={m.price}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
