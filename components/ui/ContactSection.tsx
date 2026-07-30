"use client";

export default function ContactSection() {
  return (
    <section className="py-20 px-6 max-w-4xl mx-auto text-center">
      <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase">
        Get in Touch
      </h1>
      <p className="mt-4 text-sm text-neutral-400 max-w-md mx-auto">
        Have questions about size, fit, or exclusive thrift drops? Reach out directly via WhatsApp.
      </p>

      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black transition-transform duration-200 hover:scale-105 active:scale-95"
      >
        Chat on WhatsApp
      </a>

      <div className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-neutral-400">
        <span>📌 Monrovia, Liberia</span>
        <span>•</span>
        <span>⚡ Fast Delivery Available</span>
      </div>
    </section>
  );
}