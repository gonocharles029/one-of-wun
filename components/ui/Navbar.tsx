"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "PRODUCTS", href: "/products" },
    { name: "ABOUT", href: "/about" },
    { name: "CONTACT", href: "/contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${
        scrolled
          ? "bg-black/85 backdrop-blur-xl border-b border-white/10 py-2.5"
          : "bg-gradient-to-b from-black/90 via-black/50 to-transparent py-3"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 space-y-2.5">
        {/* Top Tier: Logo & CTAs */}
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="text-base sm:text-lg font-black tracking-widest text-white uppercase hover:opacity-80 transition-opacity duration-200 active:scale-95 transform"
          >
            ONE.OF.WUN
          </Link>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href="/admin"
              className="px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-neutral-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/15 rounded-full backdrop-blur-md transition-all active:scale-95"
            >
              ADMIN
            </Link>

            <Link
              href="/products"
              className="px-3 py-1 text-[10px] font-extrabold tracking-wider uppercase bg-white text-black rounded-full hover:bg-neutral-200 transition-all active:scale-95 shadow-sm"
            >
              SHOP
            </Link>
          </div>
        </div>

        {/* Sub-Tier: Direct Links on Frosted Glass Bar */}
        <nav className="flex items-center justify-between bg-neutral-900/60 border border-white/10 backdrop-blur-md rounded-2xl px-2 py-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex-1 text-center text-[10px] sm:text-xs font-bold tracking-wider py-1.5 px-2 rounded-xl transition-all duration-200 whitespace-nowrap active:scale-95 ${
                  isActive
                    ? "bg-white/15 text-white shadow-[0_0_12px_rgba(255,255,255,0.15)] border border-white/20"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}