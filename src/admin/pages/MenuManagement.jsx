import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Trash2, Pencil, Check, X, Star, Plus } from "lucide-react";
import { supabase } from "../../lib/supabaseClient.js";
import { useToast } from "../components/Toast.jsx";
import DishForm from "../components/DishForm.jsx";

export default function MenuManagement() {
  const toast = useToast();
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // मूल्य बदल्दै गरेको dish
  const [priceId, setPriceId] = useState(null);
  const [priceValue, setPriceValue] = useState("");
  const [priceError, setPriceError] = useState("");

  const [deleteId, setDeleteId] = useState(null);
  const [busy, setBusy] = useState(false);
  // form: null = बन्द, 'new' = नयाँ थप्ने, dish object = बदल्ने
  const [formDish, setFormDish] = useState(null);

  const load = useCallback(async () => {
    setLoadError("");
    // categories(name) = जोडिएको category को नाम पनि ल्याउने (join)
    const [dishRes, catRes] = await Promise.all([
      supabase
        .from("menu_items")
        .select(
          "id, name, name_ne, description, description_ne, price, image_url, is_available, is_featured, sort_order, category_id, categories(name)",
        )
        .order("sort_order", { ascending: true }),
      supabase
        .from("categories")
        .select("id, name")
        .order("sort_order", { ascending: true }),
    ]);
    if (dishRes.error || catRes.error) {
      setLoadError("Could not load the menu. Please try again.");
    } else {
      setDishes(dishRes.data);
      setCategories(catRes.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // खोज्ने + filter (data नबदलिएसम्म फेरि नगन्ने)
  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return dishes.filter((d) => {
      const matchSearch = !q || d.name.toLowerCase().includes(q);
      const matchCat =
        categoryFilter === "all" || d.category_id === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [dishes, search, categoryFilter]);

  // Toggle (available / featured): पहिले स्क्रिन बदल्ने, असफल भए फर्काउने
  async function toggle(dish, field) {
    const newValue = !dish[field];
    setDishes((list) =>
      list.map((d) => (d.id === dish.id ? { ...d, [field]: newValue } : d)),
    );

    const { error } = await supabase
      .from("menu_items")
      .update({ [field]: newValue })
      .eq("id", dish.id);
    if (error) {
      setDishes((list) =>
        list.map((d) =>
          d.id === dish.id ? { ...d, [field]: dish[field] } : d,
        ),
      );
      toast.show("Could not save the change.", "error");
    }
  }

  function startPrice(dish) {
    setPriceId(dish.id);
    setPriceValue(String(dish.price));
    setPriceError("");
    setDeleteId(null);
  }

  async function savePrice() {
    const text = priceValue.trim();
    if (!/^\d+$/.test(text)) {
      setPriceError("Enter a whole number, e.g. 350.");
      return;
    }
    const price = Number(text);
    if (price > 100000) {
      setPriceError("Price is too high.");
      return;
    }

    setBusy(true);
    const { error } = await supabase
      .from("menu_items")
      .update({ price })
      .eq("id", priceId);
    setBusy(false);

    if (error) {
      setPriceError("Could not save the price.");
      return;
    }
    setDishes((list) =>
      list.map((d) => (d.id === priceId ? { ...d, price } : d)),
    );
    setPriceId(null);
    toast.show("Price updated.");
  }

  // form सेभ भएपछि चल्ने
  function handleSaved(message) {
    setFormDish(null);
    toast.show(message);
    load();
  }

  const nextSortOrder = dishes.length
    ? Math.max(...dishes.map((d) => d.sort_order)) + 1
    : 1;

  async function confirmDelete(id) {
    setBusy(true);
    const { error } = await supabase.from("menu_items").delete().eq("id", id);
    setBusy(false);
    setDeleteId(null);

    if (error) {
      toast.show("Could not delete the dish.", "error");
      return;
    }
    setDishes((list) => list.filter((d) => d.id !== id));
    toast.show("Dish deleted.");
  }

  const inputClass =
    "rounded-sm border border-gold/50 bg-white/60 px-3 py-2 text-sm text-brown placeholder:text-brown/40 focus:border-gold focus:outline-none";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl text-maroon">Menu Management</h1>
          <div className="my-3 h-px w-20 bg-gold" />
          <p className="text-sm text-brown/70">
            Add dishes, change prices, availability and featured dishes.
          </p>
        </div>
        <button
          onClick={() => setFormDish("new")}
          disabled={categories.length === 0}
          className="btn-maroon disabled:opacity-60"
        >
          <Plus size={16} /> Add Dish
        </button>
      </div>

      {/* खोज्ने र filter */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-brick/60"
          />
          <input
            className={`${inputClass} w-full pl-10`}
            placeholder="Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search dishes"
          />
        </div>
        <select
          className={inputClass}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-sm border border-gold/40 bg-white/50 shadow-card">
        {loading ? (
          <p className="p-6 text-sm text-brown/70">Loading...</p>
        ) : loadError ? (
          <div className="p-6 text-sm text-brick">
            {loadError}{" "}
            <button onClick={load} className="underline">
              Retry
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="p-6 text-sm text-brown/70">
            No dishes match your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="bg-cream-dark/60 text-brown/80">
                  <th className="px-4 py-3 font-medium">Dish</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price (Rs.)</th>
                  <th className="px-4 py-3 text-center font-medium">
                    Available
                  </th>
                  <th className="px-4 py-3 text-center font-medium">
                    Featured
                  </th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((d) => (
                  <tr key={d.id} className="border-t border-gold/20">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {d.image_url ? (
                          <img
                            src={d.image_url}
                            alt=""
                            className="h-12 w-12 rounded-sm object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-sm bg-cream-dark" />
                        )}
                        <span
                          className={`font-medium ${d.is_available ? "text-brown" : "text-brown/50"}`}
                        >
                          {d.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-brown/80">
                      {d.categories?.name}
                    </td>

                    <td className="px-4 py-3">
                      {priceId === d.id ? (
                        <div>
                          <div className="flex items-center gap-1">
                            <input
                              className={`${inputClass} w-24`}
                              value={priceValue}
                              onChange={(e) => setPriceValue(e.target.value)}
                              inputMode="numeric"
                              aria-label="New price"
                              autoFocus
                            />
                            <button
                              onClick={savePrice}
                              disabled={busy}
                              aria-label="Save price"
                              className="rounded-sm p-1.5 text-green-700 hover:bg-green-100 disabled:opacity-50"
                            >
                              <Check size={18} />
                            </button>
                            <button
                              onClick={() => setPriceId(null)}
                              aria-label="Cancel"
                              className="rounded-sm p-1.5 text-brick hover:bg-brick/10"
                            >
                              <X size={18} />
                            </button>
                          </div>
                          {priceError && (
                            <p className="mt-1 text-xs text-brick">
                              {priceError}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => startPrice(d)}
                          className="group flex items-center gap-2 text-brown hover:text-maroon"
                          aria-label={`Edit price of ${d.name}`}
                        >
                          {d.price}
                          <Pencil
                            size={14}
                            className="text-brown/40 group-hover:text-maroon"
                          />
                        </button>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <Switch
                        checked={d.is_available}
                        onChange={() => toggle(d, "is_available")}
                        label={`${d.name} available`}
                      />
                    </td>

                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggle(d, "is_featured")}
                        aria-pressed={d.is_featured}
                        aria-label={`${d.name} featured`}
                        className="rounded-sm p-1.5 hover:bg-gold/20"
                      >
                        <Star
                          size={20}
                          className={
                            d.is_featured
                              ? "fill-gold text-gold"
                              : "text-brown/30"
                          }
                        />
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right">
                      {deleteId !== d.id && (
                        <button
                          onClick={() => setFormDish(d)}
                          aria-label={`Edit ${d.name}`}
                          className="rounded-sm p-2 text-maroon hover:bg-gold/20"
                        >
                          <Pencil size={18} />
                        </button>
                      )}
                      {deleteId === d.id ? (
                        <div className="flex items-center justify-end gap-2 text-xs">
                          <button
                            onClick={() => confirmDelete(d.id)}
                            disabled={busy}
                            className="rounded-sm bg-brick px-2.5 py-1 text-cream hover:bg-maroon disabled:opacity-60"
                          >
                            Yes, delete
                          </button>
                          <button
                            onClick={() => setDeleteId(null)}
                            className="rounded-sm border border-gold/60 px-2.5 py-1"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setDeleteId(d.id);
                            setPriceId(null);
                          }}
                          aria-label={`Delete ${d.name}`}
                          className="rounded-sm p-2 text-brick hover:bg-brick/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && !loadError && (
        <p className="text-xs text-brown/60">
          Showing {visible.length} of {dishes.length} dishes. Prices shown are
          sample prices until you set your real ones.
        </p>
      )}

      {formDish && (
        <DishForm
          dish={formDish === "new" ? null : formDish}
          categories={categories}
          nextSortOrder={nextSortOrder}
          onClose={() => setFormDish(null)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

// सानो on/off स्विच
function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-maroon" : "bg-brown/30"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-cream shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}