"use client";

import { Product } from "@/types/product";
import ProductCard from "./ProductCard";

interface ProductGridProps {
  products?: Product[];
  title?: string;
}

export default function ProductGrid({
  products = [],
  title = "Collection",
}: ProductGridProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h2 className="text-xl font-bold tracking-widest text-white uppercase mb-8">
        {title}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}