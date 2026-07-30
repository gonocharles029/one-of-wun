"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

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

export default function AdminDashboard() {
  // Supabase Auth State
  const [session, setSession] = useState<unknown>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Data State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
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

  // Check Supabase Active Auth Session on Mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle Supabase Sign In with Email & Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setAuthError(error.message);
      } else {
        setSession(data.session);
        setPassword("");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(msg);
    } finally {
      setLoggingIn(false);
    }
  };

  // Handle Supabase Sign Out
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };

  // Reusable fetch function for manual refreshes
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

  // Initial Fetch Effect (Triggered only when authenticated session exists)
  useEffect(() => {
    if (!session) return;

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
  }, [session]);

  // Direct Image File Upload to Supabase Storage Bucket
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      setMessage(null);

      const fileExt = file.name.split(".").pop();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      if (publicUrlData?.publicUrl) {
        setFormData((prev) => ({ ...prev, image: publicUrlData.publicUrl }));
        setMessage({ type: "success", text: "Image uploaded successfully!" });
      } else {
        throw new Error("Could not retrieve image public URL.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Image upload failed.";
      console.error("Upload error:", err);
      setMessage({ type: "error", text: `Upload Error: ${errorMsg}` });
    } finally {
      setUploadingImage(false);
    }
  };

  // Form Submission (Add Product)
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
        image: formData.image,
        description: formData.description || "Exclusive curated piece from Monrovia hub.",
        is_sold: false,
        sold: false,
      };

      const { error } = await supabase.from("products").insert([payload]);

      if (error) throw error;

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

  // Toggle Sold Status
  const toggleSoldStatus = async (id: string, currentStatus: boolean) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isSold: !currentStatus } : p))
      );

      let { error } = await supabase
        .from("products")
        .update({ is_sold: !currentStatus })
        .eq("id", id);

      if (error) {
        const fallback = await supabase
          .from("products")
          .update({ sold: !currentStatus })
          .eq("id", id);
        
        error = fallback.error;
      }

      if (error) {
        loadProducts();
        setMessage({ type: "error", text: `Failed to update status: ${error.message}` });
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

  // Loading indicator during initial session resolution
  if (authLoading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </main>
    );
  }

  // 🔒 RESTRICTED ADMIN LOCK SCREEN
  if (!session) {
    return (
      <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8 selection:bg-white selection:text-black flex items-center justify-center">
        <div className="w-full max-w-md bg-neutral-950 border border-white/10 p-8 sm:p-10 rounded-3xl space-y-8 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/20 blur-sm rounded-full" />

          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-300">
                Restricted Creator Access
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
              ADMIN VAULT
            </h1>

            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              This area is strictly reserved for ONE.OF.WUN curators and administrators. Please sign in with your credentials.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Admin Email Address
              </label>
              <input
                type="email"
                placeholder="admin@oneofwun.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-3 text-xs font-medium text-white focus:outline-none focus:border-white/50 transition-colors"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-white/15 rounded-xl px-4 py-3 text-xs font-medium text-white focus:outline-none focus:border-white/50 transition-colors"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/60 border border-red-500/40 rounded-xl text-center text-xs font-bold text-red-300">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl disabled:opacity-50 mt-2"
            >
              {loggingIn ? "Authenticating..." : "Authenticate Access →"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-white/10">
            <Link
              href="/products"
              className="text-xs text-neutral-500 hover:text-white transition-colors uppercase tracking-wider font-extrabold"
            >
              ← Return to Public Storefront
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 🔓 AUTHENTICATED EDITORIAL ADMIN DASHBOARD
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-10">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-300">
                Verified Creator Vault
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              Inventory & Drops
            </h1>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <Link
              href="/products"
              target="_blank"
              className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-extrabold uppercase tracking-wider rounded-full transition-all active:scale-95"
            >
              Live Store ↗
            </Link>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-950/60 hover:bg-red-900/60 border border-red-500/30 text-xs font-extrabold uppercase tracking-wider text-red-300 rounded-full transition-all active:scale-95"
            >
              Lock Vault 🔒
            </button>
          </div>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl h-fit">
            <div>
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Post New Drop
              </h2>
              <p className="text-xs text-neutral-400 font-medium mt-1">
                Upload image & publish single-edition pieces directly to the public catalog.
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

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Product Image (Upload Photo)
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/15 flex items-center justify-center">
                    {formData.image ? (
                      <Image
                        src={formData.image}
                        alt="Preview"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-neutral-500">No Image</span>
                    )}
                  </div>

                  <label className="flex-1 cursor-pointer bg-neutral-900 hover:bg-neutral-800 border border-white/15 rounded-xl p-3 text-center transition-colors">
                    <span className="text-xs font-bold text-white uppercase tracking-wider block">
                      {uploadingImage ? "Uploading Photo..." : "📷 Pick / Upload Photo"}
                    </span>
                    <span className="text-[9px] text-neutral-400 block mt-0.5">
                      JPG, PNG, WEBP from device
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

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
                disabled={submitting || uploadingImage}
                className="w-full py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl disabled:opacity-50"
              >
                {submitting ? "Publishing Drop..." : "+ Publish New Item"}
              </button>
            </form>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black uppercase tracking-wider text-white">
                Live Inventory ({products.length})
              </h2>
              <button
                onClick={loadProducts}
                className="text-xs font-bold text-neutral-400 hover:text-white uppercase tracking-wider transition-colors"
              >
                ↻ Refresh Catalog
              </button>
            </div>

            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-20 bg-neutral-950 border border-white/5 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-neutral-950 border border-white/10 rounded-3xl p-8 text-center text-xs text-neutral-500 uppercase tracking-widest font-bold">
                No inventory items found. Add your first drop using the form.
              </div>
            ) : (
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-neutral-950 border border-white/10 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-4 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="relative w-14 h-14 bg-neutral-900 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          unoptimized
                          sizes="60px"
                          className={`object-cover transition-transform group-hover:scale-105 ${product.isSold ? "grayscale opacity-50" : ""}`}
                        />
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">
                            #{product.id} • {product.category}
                          </span>
                          <span className="text-[9px] font-bold text-neutral-400">
                            ({product.size})
                          </span>
                        </div>
                        <h3 className="text-xs font-bold text-white truncate">
                          {product.name}
                        </h3>
                        <p className="text-xs font-black text-white">
                          ${product.price}
                        </p>
                      </div>
                    </div>

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