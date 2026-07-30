"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleWhatsAppRedirect = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "23123188675669"; // Replace with your Monrovia WhatsApp phone number (no + or spaces)
    const textMessage = `Hello ONE.OF.WUN,\n\nName: ${formData.name}\nPhone: ${formData.phone}\nTopic: ${formData.subject}\n\nMessage: ${formData.message}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(textMessage)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-20 px-4 sm:px-8 selection:bg-white selection:text-black">
      <div className="max-w-6xl mx-auto space-y-20">
        
        {/* 1. HERO EDITORIAL STATEMENT */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.25em] uppercase text-neutral-300">
              Direct Communication
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            GET IN TOUCH. <br />
            <span className="text-neutral-500">TALK TO US DIRECT.</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-400 font-medium leading-relaxed">
            Have a question about sizing, active drops, private sourcing, or your Monrovia delivery status? Connect directly with our dispatch team.
          </p>
        </section>

        {/* 2. DIRECT CONTACT PILLARS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Channel 1: WhatsApp Direct */}
          <a
            href="https://wa.me/23123188675669"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl text-emerald-400 group-hover:scale-110 transition-transform">
              💬
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-emerald-400">
                Instant Response
              </p>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                WhatsApp Hotline
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Fastest way to order, request photos of pieces, or coordinate local Monrovia dispatch times.
            </p>
            <span className="inline-block text-xs font-bold text-white uppercase tracking-wider underline group-hover:text-emerald-400 transition-colors">
              Chat on WhatsApp →
            </span>
          </a>

          {/* Channel 2: Instagram Direct */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group block"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl text-white group-hover:scale-110 transition-transform">
              📸
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
                Archive & Lookbook
              </p>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Instagram DM
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Follow us for drop teasers, secret releases, behind-the-scenes archive sourcing, and story sales.
            </p>
            <span className="inline-block text-xs font-bold text-white uppercase tracking-wider underline group-hover:text-neutral-300 transition-colors">
              Follow @ONE.OF.WUN →
            </span>
          </a>

          {/* Channel 3: Monrovia Hub */}
          <div className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-white/30 transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center text-xl text-white group-hover:scale-110 transition-transform">
              📍
            </div>
            <div>
              <p className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">
                Location
              </p>
              <h3 className="text-lg font-black uppercase text-white tracking-wide">
                Weltona Junction, Monrovia
              </h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Operating locally across Monrovia, Sinkor, Congo Town, and environs. Same-day & 24hr delivery available.
            </p>
            <span className="inline-block text-xs font-bold text-neutral-500 uppercase tracking-wider">
             Delivery Before  Paying.
            </span>
          </div>

        </section>

        {/* 3. INTERACTIVE DIRECT INQUIRY FORM */}
        <section className="bg-neutral-950 border border-white/10 rounded-3xl p-6 sm:p-12 space-y-8 shadow-2xl">
          <div className="max-w-2xl space-y-2">
            <p className="text-[10px] font-black tracking-[0.25em] text-neutral-500 uppercase">
              Send Message
            </p>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              Direct WhatsApp Inquiry
            </h2>
            <p className="text-xs text-neutral-400">
              Fill out the details below to generate a pre-formatted message sent directly to our team.
            </p>
          </div>

          <form onSubmit={handleWhatsAppRedirect} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                  Phone / WhatsApp Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +231 880 000 000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-colors"
                />
              </div>

            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Inquiry Topic
              </label>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white focus:outline-none focus:border-white/40 transition-colors"
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Product Availability / Size Check">Product Availability / Size Check</option>
                <option value="Delivery Schedule Status">Delivery Schedule Status</option>
                <option value="Private Piece Sourcing Request">Private Piece Sourcing Request</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Ask about a specific item, request more detailed photos, or coordinate delivery..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-neutral-900 border border-white/10 rounded-2xl px-4 py-3.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-white/40 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-2"
            >
              <span>Send Message Via WhatsApp</span>
              <span>→</span>
            </button>
          </form>
        </section>

        {/* 4. LOGISTICS & SUPPORT HIGHLIGHTS */}
        <section className="bg-neutral-950 border border-white/10 rounded-3xl p-8 sm:p-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-2xl sm:text-4xl font-black text-white">MON-SAT</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Support Working Hours</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-4xl font-black text-white">SAME-DAY</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Monrovia Dispatch</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-4xl font-black text-white">CASH</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Accepted On Delivery</p>
            </div>
            <div className="space-y-1">
              <p className="text-2xl sm:text-4xl font-black text-white">100% REAL</p>
              <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Authenticity Guarantee</p>
            </div>
          </div>
        </section>

        {/* 5. BOTTOM CALL TO ACTION */}
        <section className="text-center space-y-6 pt-10 border-t border-white/10">
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-white tracking-tight">
            Explore The Current Drop
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md mx-auto">
            Single-edition items move fast. Browse our catalog before today&apos;s drop is sold out.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/products"
              className="px-8 py-3.5 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-2xl"
            >
              Shop The Catalog
            </Link>
            <Link
              href="/about"
              className="px-8 py-3.5 bg-neutral-900 border border-white/20 text-white font-extrabold text-xs uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all active:scale-95"
            >
              Read Our Ethos
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}