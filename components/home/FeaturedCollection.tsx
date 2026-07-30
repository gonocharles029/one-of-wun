"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductGrid from "@/components/ui/ProductGrid";
import { Product } from "@/types/product";

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
  is_sold_out?: boolean;
}

export default function FeaturedCollection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        // Limit query to 8 items specifically for the homepage preview
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("id", { ascending: false })
          .limit(8);

        if (error) {
          console.error("Error fetching featured collection:", error);
        } else if (data) {
          const formatted: Product[] = data.map((item: DatabaseProduct) => ({
            id: item.id.toString(),
            name: item.name || item.title || "Single Edition Piece",
            price: Number(item.price) || 0,
            category: item.category || "Featured Drop",
            image: item.image_url || item.image || "/hero-1.png",
            description: item.description || "Exclusive curated piece.",
            size: item.size || "Standard",
            is_sold_out: item.is_sold_out || false,
          }));
          setProducts(formatted);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <p className="text-[10px] sm:text-xs font-extrabold tracking-[0.3em] uppercase text-neutral-400">
            Curated Selection
          </p>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight uppercase">
            Featured Drops
          </h2>
          <div className="w-12 h-1 bg-white mx-auto rounded-full mt-4" />
        </div>

        {/* Product Grid (Displays max 8 items) */}
        {loading ? (
          <div className="text-center py-12 text-neutral-500 text-xs tracking-widest uppercase">
            Loading drops...
          </div>
        ) : (
          <ProductGrid products={products} />
        )}

        {/* View All Button */}
        <div className="text-center pt-8">
          <Link
            href="/products"
            className="inline-block bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}