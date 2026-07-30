// components/home/WhyChooseUs.tsx
export default function WhyChooseUs() {
  return (
    <section id="about" className="border-t border-neutral-900 bg-black py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white md:text-4xl">
            Why One.Of.Wun
          </h2>
          <p className="mt-2 text-sm text-neutral-400">
            Excellence in every piece, curated for those who stand out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">Handpicked Quality</h3>
            <p className="text-sm font-light text-neutral-400">
              Every item is individually selected and inspected to ensure premium quality.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">Exclusive Finds</h3>
            <p className="text-sm font-light text-neutral-400">
              Limited runs and unique vintage drops so you never match the crowd.
            </p>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center">
            <h3 className="mb-2 text-lg font-semibold text-white">Direct WhatsApp Orders</h3>
            <p className="text-sm font-light text-neutral-400">
              No complicated checkout processes—order directly with us in seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}