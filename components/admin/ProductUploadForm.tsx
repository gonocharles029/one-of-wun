"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "XXL", "One Size"];

export default function ProductUploadForm() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const toggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter((s) => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!title.trim() || !price || !imageFile || selectedSizes.length === 0) {
      setMessage({
        type: "error",
        text: "Please complete all fields: Clothes Name, Price, Image, and at least one Size.",
      });
      return;
    }

    setIsUploading(true);

    try {
      // 1. Upload raw image file to Supabase Storage Bucket
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, imageFile);

      if (uploadError) throw uploadError;

      // 2. Retrieve public URL for the uploaded asset
      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      const imageUrl = urlData.publicUrl;

      // 3. Write row to 'products' table (populates both 'title' and 'name' for complete schema compatibility)
      const { error: dbError } = await supabase.from("products").insert([
        {
          title: title.trim(),
          name: title.trim(),
          price: parseFloat(price),
          sizes: selectedSizes,
          image_url: imageUrl,
        },
      ]);

      if (dbError) throw dbError;

      setMessage({ type: "success", text: "Product published successfully to store!" });

      // Reset form state
      setTitle("");
      setPrice("");
      setSelectedSizes([]);
      setImageFile(null);
      setImagePreview(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload product.";
      setMessage({ type: "error", text: errorMessage });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-neutral-900/60 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent" />

      <h2 className="text-lg font-black tracking-widest text-white uppercase mb-6">
        Add New Product
      </h2>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold mb-6 border transition-all ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold tracking-wider text-neutral-400 uppercase mb-2">
            Product Image
          </label>
          {imagePreview ? (
            <div className="relative rounded-xl overflow-hidden border border-white/10 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
                className="absolute top-3 right-3 bg-black/70 hover:bg-black text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/20 transition-all active:scale-95"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 border border-dashed border-white/20 rounded-xl cursor-pointer bg-white/5 hover:bg-white/[0.08] transition-all group">
              <span className="text-xs text-neutral-400 font-medium group-hover:text-white transition-colors">
                Click to select product image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold tracking-wider text-neutral-400 uppercase mb-2">
              Clothes Name
            </label>
            <input
              type="text"
              placeholder="e.g. ONE.OF.WUN Oversized Hoodie"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold tracking-wider text-neutral-400 uppercase mb-2">
              Price ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="120.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-white/30 transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold tracking-wider text-neutral-400 uppercase mb-2">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_SIZES.map((size) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all active:scale-95 border ${
                    isSelected
                      ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                      : "bg-black/40 text-neutral-400 border-white/10 hover:border-white/30 hover:text-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={isUploading}
          className="w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-4 rounded-xl hover:bg-neutral-200 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        >
          {isUploading ? "Publishing Piece..." : "Publish Product"}
        </button>
      </form>
    </div>
  );
}