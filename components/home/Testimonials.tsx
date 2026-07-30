// components/home/Testimonials.tsx
export default function Testimonials() {
  return (
    <section className="border-t border-neutral-900 bg-neutral-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Community Feedback
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            What our clients say about their pieces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl border border-neutral-800 bg-black p-6">
            <p className="italic text-neutral-300">
              &quot;The quality of the jacket exceeded expectations. Ordering over WhatsApp was super smooth and fast.&quot;
            </p>
            <span className="mt-4 block text-xs font-semibold uppercase text-neutral-500">— Verified Buyer</span>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-black p-6">
            <p className="italic text-neutral-300">
              &quot;Extremely unique pieces. Getting the pre-filled message made buying so effortless.&quot;
            </p>
            <span className="mt-4 block text-xs font-semibold uppercase text-neutral-500">— Verified Buyer</span>
          </div>
        </div>
      </div>
    </section>
  );
}