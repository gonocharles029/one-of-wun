"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const heroImages = [
  "/hero-1.png",
  "/hero-2.png",
  "/hero-3.png",
  "/hero-4.png",
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // Automatically switch images every 5 seconds
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Background Hero Assets - Cinematic Crossfade & Zoom */}
      {heroImages.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 z-0 transition-all duration-[3000ms] ease-in-out ${
            index === currentIndex
              ? "opacity-100 scale-105"
              : "opacity-0 scale-100"
          }`}
        >
          <Image
            src={src}
            alt={`Cinematic Streetwear Hero ${index + 1}`}
            fill
            className="object-cover object-center"
            priority={index === 0} // Instantly load the first image
          />
        </div>
      ))}

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black z-10" />

      {/* Foreground Content */}
      <div className="relative z-20 text-center px-4 space-y-6">
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tighter text-white">
          Monrovia Hub
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto">
          Single-edition streetwear drops. Ordered instantly via WhatsApp.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-block bg-white text-black font-bold text-xs uppercase tracking-widest px-8 py-4 rounded-full hover:bg-neutral-200 transition-colors"
          >
            Explore Drop
          </Link>
        </div>
      </div>
    </section>
  );
}