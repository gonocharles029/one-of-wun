import Link from "next/link";

export default function Footer() {
  const whatsappNumber = "+231773794634"; // Replace with your active dispatch number
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    "Hello DEE COOLEST, I saw your work on the website and I want you to build one for me."
  )}`;

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-16">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand & Manifesto */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-black tracking-widest uppercase">ONE.OF.WUN</h3>
            <p className="max-w-sm text-xs leading-relaxed text-neutral-400">
             We deal in shirts only for now! We take our time to select the finest dokafleh, shine them up proper, and bring them to you for a fair price.
            </p>
            <p className="text-xs text-neutral-500">
              We are loacted: Weltona Junction, Duport Road, Monrovia, Liberia.
            </p>
          </div>
          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-300">Navigation</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <Link href="/" className="transition-colors hover:text-white">Home Collection</Link>
              </li>
              <li>
                <Link href="/products" className="transition-colors hover:text-white">All Products</Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-white">The Manifesto</Link>
              </li>
              <li>
                <Link href="/admin" className="transition-colors hover:text-white">Admin Portal</Link>
              </li>
            </ul>
          </div>

          {/* Concierge & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold tracking-widest uppercase text-neutral-300">BUILT BY COOLEST</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Need a website like this built for your business? Tap below to chat with the developer directly on WhatsApp
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-white px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-black transition-all hover:bg-neutral-200 active:scale-95"
            >
              Contace Dev on whatsapp
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex flex-col items-center justify-between border-t border-white/10 pt-8 text-[10px] text-neutral-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} ONE.OF.WUN. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Monrovia, Liberia — Pay Upon Delivery Concierge</p>
        </div>
      </div>
    </footer>
  );
}