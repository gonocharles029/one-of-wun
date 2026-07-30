"use client";

import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* HERO EDITORIAL STATEMENT */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-300">
              Our Ethos & Philosophy
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            CURATED. EXCLUSIVE. <br />
            <span className="text-neutral-500">ONE OF ONE.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed">
            ONE.OF.WUN was created for those who reject fast fashion uniform aesthetics. We source, authenticate, and curate single-edition luxury thrift and archive streetwear—delivered directly to your doorstep in Monrovia.
          </p>
        </section>

        {/* HERO LOOKBOOK IMAGE */}
        <section className="relative w-full h-[350px] sm:h-[500px] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <Image
            src="/hero-3.png"
            alt="ONE.OF.WUN Editorial Brand Image"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-neutral-400">
                Monrovia Hub
              </p>
              <p className="text-lg font-black uppercase text-white">
                Archival & Thrift Curation
              </p>
            </div>
            <span className="text-[11px] font-mono text-neutral-400 border border-white/20 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
              EST. 2026
            </span>
          </div>
        </section>

        {/* THREE CORE BRAND PILLARS */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <p className="text-[10px] font-black tracking-[0.25em] text-neutral-500 uppercase">
              The Standard
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              Why Choose ONE.OF.WUN
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Pillar 1 */}
            <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform">
                01
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Single Edition (1-of-1)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Every garment in our catalog is entirely unique. Once an item is purchased, it is marked as Sold Out and never restocked. What you wear is strictly yours.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform">
                02
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Inspect On Delivery
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Just pick the shirts you want on the site and place your order. We’ll bring them straight to your doorstep anywhere in Monrovia. Check your clothes yourself when we bring them, make sure you are satisfied with the quality, and pay right on delivery. Simple as that!.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl font-bold text-white group-hover:scale-110 transition-transform">
                03
              </div>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Sustainable Fashion
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                We deal in shirts only for now! We take our time to select the finest dokafleh, shine them up proper, and bring them to you for a fair price.
              </p>
            </div>

          </div>
        </section>

        {/* METRICS & STATS BAR */}
        <section className="bg-neutral-950 border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white">100%</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Single Editions</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white">24HR</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Monrovia Dispatch</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white">0$</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Upfront Risk</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl sm:text-5xl font-black text-white">1-ON-1</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">WhatsApp Support</p>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="text-center space-y-6 pt-10 border-t border-white/10">
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Ready to Find Your Next Piece?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Explore our latest drop before items are marked as sold out.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl"
            >
              Shop The Catalog
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3.5 bg-neutral-900 border border-white/20 text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              Contact Us
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}