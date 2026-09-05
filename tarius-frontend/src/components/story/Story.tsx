import Link from "next/link";
import Image from "next/image";

export default function Story({ id }: { id: string }) {
  return (
    <section
      id={id}
      className="section-tarius overflow-hidden bg-[var(--tarius-ivory-deep)]"
    >
      <div className="container-tarius">
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <div className="image-tarius relative aspect-[4/5] overflow-hidden bg-[var(--tarius-olive)]/15">
              <Image
                src="/Moringa Powder HD2.jpg"
                alt="Moringa Powder and Leaves"
                fill
                className="object-cover"
              />

              {/* Decorative botanical lines */}
              <div className="absolute left-6 top-6 z-10 h-16 w-16 border-l border-t border-[var(--tarius-champagne)]" />

              <div className="absolute bottom-6 right-6 z-10 h-16 w-16 border-b border-r border-[var(--tarius-champagne)]" />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <p className="text-eyebrow text-[var(--tarius-olive)]">
              The TARIUS philosophy
            </p>

            <h2 className="text-display mt-5 max-w-2xl text-5xl leading-[0.95] sm:text-6xl lg:text-7xl">
              Wellness begins with what nature already knows.
            </h2>

            <div className="mt-8 max-w-xl space-y-5 text-sm leading-7 text-[var(--tarius-graphite-soft)] sm:text-base sm:leading-8">
              <p>
                TARIUS was created around a simple idea: powerful wellness
                does not need to be complicated.
              </p>

              <p>
                We bring together carefully selected botanical ingredients
                and a refined approach to everyday nutrition, creating
                products that fit naturally into modern life.
              </p>

              <p>
                From vibrant spirulina to nutrient-rich moringa, every
                TARIUS product begins with nature and stays true to it.
              </p>
            </div>

            <div className="mt-9">
              <Link
                href="#quality"
                className="btn-tarius btn-tarius-outline"
              >
                Discover Our Approach
              </Link>
            </div>

            {/* Philosophy details */}
            <div className="mt-12 grid grid-cols-2 border-t border-[var(--tarius-border)] pt-6 sm:grid-cols-3">
              <div>
                <p className="text-display text-3xl">01</p>
                <p className="text-eyebrow mt-2 text-[var(--tarius-graphite-soft)]">
                  Pure
                </p>
              </div>

              <div>
                <p className="text-display text-3xl">02</p>
                <p className="text-eyebrow mt-2 text-[var(--tarius-graphite-soft)]">
                  Intentional
                </p>
              </div>

              <div className="mt-6 sm:mt-0">
                <p className="text-display text-3xl">03</p>
                <p className="text-eyebrow mt-2 text-[var(--tarius-graphite-soft)]">
                  Natural
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}