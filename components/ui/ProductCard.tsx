"use client";

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const imageSrc = product.image || product.images?.[0] || "/hero-1.png";
  const defaultSizes = product.sizes || ["S", "M", "L", "XL"];

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative block rounded-3xl bg-neutral-900/40 border border-white/10 backdrop-blur-md overflow-hidden transition-all duration-300 ease-out hover:border-white/25 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:-translate-y-1 active:scale-[0.97] cursor-pointer"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-950">
        <Image
          src={imageSrc}
          alt={product.name || product.title || "Product"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-black text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            New Drop
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-neutral-400 uppercase">
            {product.category}
          </p>
          <h3 className="text-sm font-bold text-white uppercase truncate tracking-wide mt-0.5">
            {product.name || product.title}
          </h3>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-white/5">
          <p className="text-xs font-extrabold text-neutral-100">
            ${product.price}
          </p>
          
          {/* Size Pills */}
          <div className="flex items-center gap-1">
            {defaultSizes.map((size) => (
              <span
                key={size}
                className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-white/5 text-neutral-300 border border-white/5"
              >
                {size}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}