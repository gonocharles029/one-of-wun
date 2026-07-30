"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

interface Product {
  id: string;
  name: string;
  priceFormatted: string;
  category: string;
  image: string;
  size?: string;
  isSold?: boolean;
}

interface DatabaseProduct {
  id: string | number;
  name?: string;
  title?: string;
  price?: number | string;
  category?: string;
  image_url?: string;
  image?: string;
  size?: string;
  is_sold?: boolean;
  sold?: boolean;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// All hero background images available in public/
const HERO_IMAGES = [
  "/hero-bg.png",
  "/hero-1.png",
  "/hero-2.png",
  "/hero-3.png",
  "/hero-4.png",
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Automatically cycle through hero slides every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(4);

        if (!error && data) {
          const formatted = data.map((item: DatabaseProduct) => ({
            id: item.id.toString(),
            name: item.name || item.title || "Single Edition Piece",
            priceFormatted: `$${Number(item.price) || 0}`,
            category: item.category || "Drop",
            image: item.image_url || item.image || "/hero-1.png",
            size: item.size || "Standard",
            isSold: item.is_sold ?? item.sold ?? false,
          }));
          setFeaturedProducts(formatted);
        }
      } catch (err) {
        console.error("Error fetching featured products:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* HERO SECTION WITH DYNAMIC ZOOM & FADE SLIDESHOW */}
      <section className="relative w-full h-[90vh] sm:h-screen flex items-center justify-center overflow-hidden">
        
        {/* Stacked Slideshow Images */}
        <div className="absolute inset-0 z-0">
          {HERO_IMAGES.map((src, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={src}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                  isActive ? "opacity-60 scale-110" : "opacity-0 scale-100 pointer-events-none"
                }`}
                style={{ transitionProperty: "opacity, transform" }}
              >
                <Image
                  src={src}
                  alt={`ONE.OF.WUN Lookbook Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              </div>
            );
          })}

          {/* Dual Dark Gradient Overlay for High Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/70 z-10" />
        </div>

        {/* Hero Central Content */}
        <div className="relative z-20 max-w-4xl mx-auto text-center px-4 pt-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl shadow-2xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] uppercase text-neutral-200">
              Exclusive Drop Live
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight text-white leading-none drop-shadow-2xl">
            ONE.OF.WUN
          </h1>

          <p className="text-xs sm:text-base text-neutral-300 max-w-lg mx-auto font-medium tracking-wide drop-shadow">
            Curated luxury thrift & single-edition streetwear. Personal inspection upon door-to-door delivery.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl"
            >
              Explore All Clothes
            </Link>
            <Link
              href="/about"
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900/80 border border-white/20 backdrop-blur-xl text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Minimalist Slide Indicators */}
        <div className="absolute bottom-6 z-20 flex items-center gap-2">
          {HERO_IMAGES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx === currentSlide
                  ? "w-8 bg-white"
                  : "w-2 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </section>

      {/* FEATURED DROPS SECTION */}
      <section className="max-w-7xl mx-auto px-4 py-16 space-y-8">
        <div className="flex items-end justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] text-neutral-400 uppercase">
              Curated Selection
            </p>
            <h2 className="text-xl sm:text-3xl font-black uppercase tracking-wider text-white">
              Latest Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="text-xs font-bold text-neutral-400 hover:text-white transition-colors uppercase tracking-wider"
          >
            View All →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-neutral-900/60 rounded-2xl animate-pulse border border-white/5"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <Link
                key={product.id}
                href="/products"
                className="group relative bg-neutral-950 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 hover:border-white/35 active:scale-[0.98]"
              >
                <div className="relative aspect-square w-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Price Tag */}
                  <div className="absolute top-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/15 px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white">
                    {product.priceFormatted}
                  </div>

                  {/* Sold Out Overlay */}
                  {product.isSold && (
                    <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center">
                      <span className="px-3 py-1 bg-red-600/90 text-white font-black text-[10px] tracking-widest uppercase rounded-full shadow-lg">
                        SOLD OUT
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                    {product.category}
                  </p>
                  <h3 className="text-xs font-bold text-white line-clamp-1">
                    {product.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}