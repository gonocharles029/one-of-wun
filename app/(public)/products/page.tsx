"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  price: number;
  priceFormatted: string;
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxPrice, setMaxPrice] = useState<number>(500);

  // Selected Product for WhatsApp Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // iOS Swipe-Down Drag States with Explicit Number Typing
  const [dragY, setDragY] = useState<number>(0);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const closeModal = () => {
    setSelectedProduct(null);
    setDragY(0);
    setTouchStartY(null);
  };

  // Touch Handlers for Swipe-Down to Dismiss
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - touchStartY;

    if (deltaY > 0) {
      setDragY(deltaY);
    }
  };

  const handleTouchEnd = () => {
    if (dragY > 100) {
      closeModal();
      return;
    }
    setDragY(0);
    setTouchStartY(null);
  };

  // Fetch products from Supabase
  useEffect(() => {
    let isMounted = true;

    async function fetchProducts() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false });

        if (error) {
          console.error("Error fetching products:", error);
        } else if (data && isMounted) {
          const formatted = data.map((item: DatabaseProduct) => ({
            id: item.id.toString(),
            name: item.name || item.title || "Single Edition Piece",
            price: Number(item.price) || 0,
            priceFormatted: `$${Number(item.price) || 0}`,
            category: item.category || "Outerwear",
            image: item.image_url || item.image || "/hero-1.png",
            description: item.description || "Exclusive single edition piece from Monrovia hub.",
            size: item.size || "M",
            isSold: item.is_sold ?? item.sold ?? false,
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error("Unexpected fetch error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter Logic: Combines Search Query + Category + Price Filter
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      query === "" ||
      product.name.toLowerCase().includes(query) ||
      product.size.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query);

    const matchesCategory =
      selectedCategory === "All" ||
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesPrice = product.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Pre-filled WhatsApp Order URL Generator
  const getWhatsAppLink = (product: Product) => {
    const phoneNumber = "23188675669"; // Replace with your Monrovia sales line
    const text = `Hello ONE.OF.WUN! I want to order this piece:\n\n*Item:* ${product.name}\n*Price:* ${product.priceFormatted}\n*Size:* ${product.size}\n*Item ID:* #${product.id}\n\nPlease confirm availability for delivery in Monrovia.`;
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  const categories = ["All", "Outerwear", "Tops", "Pants", "Footwear", "Accessories"];

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8 selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* PAGE TITLE */}
        <div className="space-y-2 text-center sm:text-left">
          <p className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
            Curated Single Editions
          </p>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
            The Catalog
          </h1>
        </div>

        {/* SEARCH BAR & FILTERS SECTION */}
        <div className="bg-neutral-950 border border-white/10 rounded-3xl p-4 sm:p-6 space-y-4 shadow-2xl backdrop-blur-xl">

          {/* Real-Time Search Bar */}
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-neutral-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <input
              type="text"
              placeholder="Search by item name, size (e.g. M, L, XL), or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-900 border border-white/10 rounded-2xl pl-11 pr-10 py-3.5 text-xs font-medium text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors shadow-inner"
            />

            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-3 flex items-center px-2 text-xs font-bold text-neutral-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            )}
          </div>

          {/* CATEGORIES & PRICE FILTER ROW */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2 border-t border-white/5">

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all whitespace-nowrap active:scale-95 ${
                    selectedCategory === category
                      ? "bg-white text-black shadow-lg"
                      : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-white/5"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Max Price Slider */}
            <div className="flex items-center gap-3 bg-neutral-900 border border-white/5 rounded-full px-4 py-2 shrink-0">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Max Price: <span className="text-white">${maxPrice}</span>
              </span>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-24 accent-white cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* CATALOG GRID */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-neutral-950 rounded-3xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* Empty State Feedback */
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-12 text-center space-y-4">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {`No items match your search "${searchQuery}"`}
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setMaxPrice(500);
              }}
              className="px-6 py-2.5 bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-full hover:bg-neutral-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProduct(product)}
                className="group relative bg-neutral-950 border border-white/10 rounded-3xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-white/35 active:scale-[0.98] shadow-xl flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    className={`object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
                      product.isSold ? "grayscale opacity-60" : ""
                    }`}
                  />

                  {/* Size & Price Badges */}
                  <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-wider">
                    SIZE {product.size}
                  </div>

                  <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] font-extrabold text-white">
                    {product.priceFormatted}
                  </div>

                  {/* Sold Out Overlay */}
                  {product.isSold && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-600/90 text-white font-black text-[10px] tracking-widest uppercase rounded-full shadow-2xl">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-4 space-y-1">
                  <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h3 className="text-xs font-bold text-white line-clamp-1 group-hover:text-neutral-200 transition-colors">
                    {product.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PRODUCT DETAILS MODAL (TAP ANYWHERE ON SCREEN OR SWIPE DOWN TO CLOSE) */}
        {selectedProduct && (
          <div
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md cursor-pointer select-none"
          >
            {/* Modal Box */}
            <div
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: `translateY(${dragY}px)`,
                opacity: Math.max(0.2, 1 - dragY / 300),
                transition: dragY === 0 ? "transform 0.25s ease-out, opacity 0.25s ease-out" : "none",
              }}
              className="relative w-full max-w-lg bg-neutral-950 border border-white/20 rounded-3xl p-6 space-y-6 shadow-2xl overflow-hidden cursor-default touch-pan-y"
            >
              {/* iOS Drag Handle */}
              <div className="w-12 h-1.5 bg-white/25 rounded-full mx-auto -mt-1 cursor-grab active:cursor-grabbing" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-900 border border-white/10 text-white hover:bg-neutral-800 transition-colors"
              >
                ✕
              </button>

              {/* Modal Image */}
              <div className="relative w-full aspect-square bg-neutral-900 rounded-2xl overflow-hidden border border-white/10">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 500px"
                  className={`object-cover object-center ${
                    selectedProduct.isSold ? "grayscale opacity-50" : ""
                  }`}
                />

                {selectedProduct.isSold && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <span className="px-4 py-1.5 bg-red-600 text-white font-black text-xs tracking-widest uppercase rounded-full">
                      SOLD OUT
                    </span>
                  </div>
                )}
              </div>

              {/* Modal Body */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    {selectedProduct.category} • SIZE {selectedProduct.size}
                  </span>
                  <span className="text-lg font-black text-white">
                    {selectedProduct.priceFormatted}
                  </span>
                </div>

                <h2 className="text-xl font-black uppercase text-white">
                  {selectedProduct.name}
                </h2>

                <p className="text-xs text-neutral-400 leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Modal Action Button */}
              {selectedProduct.isSold ? (
                <button
                  disabled
                  className="w-full py-3.5 bg-neutral-800 text-neutral-500 font-extrabold text-xs uppercase tracking-widest rounded-2xl cursor-not-allowed text-center"
                >
                  This Piece Has Been Claimed
                </button>
              ) : (
                <a
                  href={getWhatsAppLink(selectedProduct)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-widest rounded-2xl text-center transition-all shadow-lg active:scale-95"
                >
                  Order via WhatsApp →
                </a>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}