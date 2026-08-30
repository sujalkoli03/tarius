import Link from "next/link";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-[var(--tarius-ivory)]"
    >
      <div className="container-tarius grid min-h-[calc(100svh-76px)] items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
        {/* Content */}
        <div className="relative z-10 max-w-3xl">
          <p className="text-eyebrow text-[var(--tarius-olive)]">
            Premium botanical nutrition
          </p>

          <h1 className="text-display mt-6 text-[clamp(4rem,10vw,9rem)] leading-[0.82] text-[var(--tarius-graphite)]">
            Pure.
            <br />
            Powerful.
            <br />
            <span className="text-[var(--tarius-olive)]">
              Natural.
            </span>
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-[var(--tarius-graphite-soft)] sm:text-base sm:leading-8">
            Premium spirulina and moringa powders, carefully sourced
            and crafted for those who believe everyday wellness should
            begin with nature.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#products"
              className="btn-tarius w-full sm:w-auto"
            >
              Discover TARIUS
            </Link>

            <Link
              href="#story"
              className="btn-tarius btn-tarius-outline w-full sm:w-auto"
            >
              Our Story
            </Link>
          </div>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="image-tarius relative aspect-[4/5] min-h-[420px] w-full bg-[var(--tarius-ivory-deep)] sm:min-h-[520px] lg:min-h-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="font-display text-7xl font-medium text-[var(--tarius-olive)]/30 sm:text-8xl">
                  T
                </span>

                <p className="text-eyebrow mt-3 text-[var(--tarius-graphite-soft)]/60">
                  TARIUS
                </p>

                <p className="mt-2 font-display text-xl italic text-[var(--tarius-graphite-soft)]/60">
                  Nature, refined.
                </p>
              </div>
            </div>
          </div>

          {/* Decorative detail */}
          <div className="pointer-events-none absolute -bottom-5 -left-5 hidden h-24 w-24 border-l border-b border-[var(--tarius-champagne)] lg:block" />

          <div className="pointer-events-none absolute -right-5 -top-5 hidden h-24 w-24 border-r border-t border-[var(--tarius-champagne)] lg:block" />
        </div>
      </div>

      {/* Bottom scroll indicator */}
      <div className="container-tarius hidden pb-8 lg:block">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-[var(--tarius-graphite)]/30" />

          <span className="text-eyebrow text-[var(--tarius-graphite-soft)]/60">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}