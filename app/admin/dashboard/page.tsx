"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
  size: string;
  isSold: boolean;
}

interface DatabaseProduct {
  id: string | number;
  name?: string;
  title?: string;
  price?: number | string;
  category?: string;
  image_url?: string;
  image?: string;
  description?: string;
  size?: string;
  is_sold?: boolean;
  sold?: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Outerwear",
    size: "M",
    image: "/hero-1.png",
    description: "",
  });

  // Reusable fetch function for manual refreshes & updates
  const loadProducts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("id", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        setMessage({ type: "error", text: "Failed to load products from database." });
      } else if (data) {
        const formatted = data.map((item: DatabaseProduct) => ({
          id: item.id.toString(),
          name: item.name || item.title || "Single Edition Piece",
          price: Number(item.price) || 0,
          category: item.category || "Drop",
          image: item.image_url || item.image || "/hero-1.png",
          description: item.description || "",
          size: item.size || "Standard",
          isSold: item.is_sold ?? item.sold ?? false,
        }));
        setProducts(formatted);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial Fetch Effect (ESLint Compliant)
  useEffect(() => {
    let isMounted = true;

    async function initFetch() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false });

        if (!isMounted) return;

        if (error) {
          setMessage({ type: "error", text: "Failed to load products from database." });
        } else if (data) {
          const formatted = data.map((item: DatabaseProduct) => ({
            id: item.id.toString(),
            name: item.name || item.title || "Single Edition Piece",
            price: Number(item.price) || 0,
            category: item.category || "Drop",
            image: item.image_url || item.image || "/hero-1.png",
            description: item.description || "",
            size: item.size || "Standard",
            isSold: item.is_sold ?? item.sold ?? false,
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error("Unexpected error during init:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initFetch();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle Form Submission (Add New Product)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setMessage({ type: "error", text: "Please enter product name and price." });
      return;
    }

    try {
      setSubmitting(true);
      setMessage(null);

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category: formData.category,
        size: formData.size,
        image_url: formData.image,
        description: formData.description || "Exclusive curated piece from Monrovia hub.",
        is_sold: false,
      };

      const { error } = await supabase.from("products").insert([payload]);

      if (error) {
        throw error;
      }

      setMessage({ type: "success", text: "New drop successfully added to storefront!" });
      setFormData({
        name: "",
        price: "",
        category: "Outerwear",
        size: "M",
        image: "/hero-1.png",
        description: "",
      });
      loadProducts();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to add new drop.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Sold Out Status
  const toggleSoldStatus = async (id: string, currentStatus: boolean) => {
    try {
      // Optimistic state update
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isSold: !currentStatus } : p))
      );

      const { error } = await supabase
        .from("products")
        .update({ is_sold: !currentStatus })
        .eq("id", id);

      if (error) {
        // Revert on error
        loadProducts();
        setMessage({ type: "error", text: "Failed to update item status." });
      } else {
        setMessage({
          type: "success",
          text: `Item updated to ${!currentStatus ? "SOLD OUT" : "AVAILABLE"}.`,
        });
      }
    } catch (err) {
      console.error("Error toggling status:", err);
      loadProducts();
    }
  };

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item permanently?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) {
        setMessage({ type: "error", text: "Failed to delete item." });
      } else {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        setMessage({ type: "success", text: "Item deleted from catalog." });
      }
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-extrabold tracking-widest uppercase text-neutral-300 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> ADMIN CONTROL CENTER
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider">
              Inventory & Drops
            </h1>
          </div>
          <Link
            href="/products"
            target="_blank"
            className="self-start sm:self-auto px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-bold uppercase tracking-wider rounded-full transition-all active:scale-95"
          >
            View Live Store →
          </Link>
        </div>

        {/* Feedback Alert */}
        {message && (
          <div
            className={`p-4 rounded-2xl border text-xs font-bold tracking-wide transition-all ${
              message.type === "success"
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                : "bg-red-950/60 border-red-500/40 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* GRID LAYOUT: ADD PRODUCT FORM + LIVE INVENTORY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* COLUMN 1: ADD NEW PRODUCT FORM (5 cols) */}
          <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl h-fit">
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider text-white">
                Post New Drop
              </h2>
              <p className="text-xs text-neutral-400">
                Add single-edition pieces straight to the public catalog.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Item Title / Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Vintage Leather Biker Jacket"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Price (USD) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g. 150"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Size
                  </label>
                  <select
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="S">Small (S)</option>
                    <option value="M">Medium (M)</option>
                    <option value="L">Large (L)</option>
                    <option value="XL">Extra Large (XL)</option>
                    <option value="OS">One Size / Standard</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Tops">Tops & Tees</option>
                    <option value="Pants">Pants & Bottoms</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Image Path or URL
                  </label>
                  <select
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors"
                  >
                    <option value="/hero-1.png">Preset Image 1</option>
                    <option value="/hero-2.png">Preset Image 2</option>
                    <option value="/hero-3.png">Preset Image 3</option>
                    <option value="/hero-4.png">Preset Image 4</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Item Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Details regarding condition, fabric, origin..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-white/40 transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-lg disabled:opacity-50"
              >
                {submitting ? "Publishing Drop..." : "+ Publish New Item"}
              </button>
            </form>
          </div>

          {/* COLUMN 2: INVENTORY LIST & ONE-CLICK SOLD TOGGLES (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-wider text-white">
                Live Inventory ({products.length})
              </h2>
              <button
                onClick={loadProducts}
                className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider"
              >
                ↻ Refresh
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-neutral-950 border border-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-neutral-950 border border-white/10 rounded-3xl p-8 text-center text-xs text-neutral-500 uppercase tracking-widest">
                No inventory items found. Add your first drop using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-neutral-950 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 hover:border-white/20 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="60px"
                          className={`object-cover ${product.isSold ? "grayscale opacity-50" : ""}`}
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-neutral-500">
                            #{product.id} • {product.category}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-400">
                            ({product.size})
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs font-extrabold text-white">
                          ${product.price}
                        </p>
                      </div>
                    </div>

                    {/* Actions: Toggle Sold & Delete */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => toggleSoldStatus(product.id, product.isSold)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 border ${
                          product.isSold
                            ? "bg-red-600/20 text-red-400 border-red-500/40 hover:bg-red-600/30"
                            : "bg-emerald-600/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-600/30"
                        }`}
                      >
                        {product.isSold ? "SOLD OUT" : "AVAILABLE"}
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 hover:bg-red-950 border border-white/10 text-neutral-400 hover:text-red-400 transition-colors text-xs"
                        title="Delete Product"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}