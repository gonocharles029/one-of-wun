"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { buildWhatsAppLink } from "@/lib/config";

export default function ProductOrderPanel({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showForm, setShowForm] = useState(false);

  const canSubmit = name.trim() && phone.trim() && address.trim();

  return (
    <div>
      <p className="text-xs uppercase tracking-widest text-gold">{product.category}</p>
      <h1 className="mt-2 font-display text-3xl italic">{product.name}</h1>
      <p className="mt-3 text-xl">${product.price}</p>
      <p className="mt-6 max-w-md text-sm leading-relaxed text-black/70">{product.description}</p>

      <div className="mt-8">
        <p className="text-xs uppercase tracking-wide text-stone">Size</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes?.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size)}
              aria-pressed={selectedSize === size}
              className={`rounded-full border px-4 py-2 text-sm uppercase transition-colors ${
                selectedSize === size
                  ? "border-gold bg-gold text-white"
                  : "border-black/20 text-black/70 hover:border-gold hover:text-gold"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {!showForm ? (
        <button
          type="button"
          onClick={() => setShowForm(true)}
          disabled={!product.inStock}
          className={`mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-colors sm:w-auto ${
            product.inStock
              ? "bg-[#25D366] text-white hover:bg-black"
              : "pointer-events-none bg-black/20 text-black/50"
          }`}
        >
          {product.inStock ? "Order on WhatsApp" : "Sold Out"}
        </button>
      ) : (
        <form
          className="mt-8 flex max-w-sm flex-col gap-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div>
            <label className="text-xs uppercase tracking-wide text-stone">Your Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/20 px-4 py-3 text-sm outline-none focus:border-gold"
              placeholder="Full name"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-stone">Phone Number</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/20 px-4 py-3 text-sm outline-none focus:border-gold"
              placeholder="e.g. 0770000000"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-stone">Delivery Address</label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 w-full rounded-md border border-black/20 px-4 py-3 text-sm outline-none focus:border-gold"
              placeholder="Neighborhood / landmark"
            />
          </div>

          <a
            href={canSubmit ? buildWhatsAppLink(product.name, selectedSize, name, phone) : undefined}
            target="_blank"
            rel="noopener noreferrer"
            aria-disabled={!canSubmit}
            className={`mt-2 inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm uppercase tracking-widest transition-colors ${
              canSubmit
                ? "bg-[#25D366] text-white hover:bg-black"
                : "pointer-events-none bg-black/20 text-black/50"
            }`}
          >
            Continue on WhatsApp
          </a>
        </form>
      )}

      <p className="mt-4 text-xs text-stone">
        We&apos;ll confirm availability and arrange delivery with you directly on WhatsApp.
      </p>
    </div>
  );
}