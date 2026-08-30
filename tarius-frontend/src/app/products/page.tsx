import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  description: string;
  notes: string;
  image: string;
}

const products: Product[] = [
  {
    id: "spirulina",
    name: "Ceremonial Spirulina Reserve",
    subtitle: "Micro-batch volcanic spring harvest",
    price: "$68",
    description: "Cultivated in mineral-dense spring waters and low-temperature cryo-milled below 35°C, preserving up to 98% of active live enzymes and phytonutrients.",
    notes: "300g / 60 Servings — Biophotonic Violet Glass",
    image: "/images/spirulina.jpg" // Place your image inside public/images/
  },
  {
    id: "moringa",
    name: "Wild Botanical Moringa",
    subtitle: "Pure shade-dried leaf extract",
    price: "$54",
    description: "Sourced from high-altitude ancestral trees, meticulously shade-dried to lock in maximum chlorophyll, amino acids, and cellular antioxidants.",
    notes: "250g / 50 Servings — Biophotonic Violet Glass",
    image: "/images/moringa.jpg" // Place your image inside public/images/
  }
];

export const metadata = {
  title: "Collection",
  description: "Explore our micro-batch botanical reserves of pure spirulina and moringa powders.",
};

export default function ProductsPage() {
  return (
    <div className="pt-[76px]">
      <section className="section-tarius-sm bg-[var(--tarius-ivory-deep)] border-b border-tarius">
        <div className="container-tarius text-center">
          <span className="text-eyebrow text-[var(--tarius-olive)] mb-4 block">Private Allocation</span>
          <h1 className="text-display text-4xl sm:text-6xl text-[var(--tarius-graphite)]">
            The <span className="italic">Collection.</span>
          </h1>
          <p className="text-muted text-sm sm:text-base font-light mt-4 max-w-xl mx-auto">
            Limited seasonal reserves cultivated for uncompromising daily wellness and cellular optimization.
          </p>
        </div>
      </section>

      <section id="products" className="section-tarius bg-[var(--tarius-ivory)]">
        <div className="container-tarius">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {products.map((product) => (
              <div key={product.id} className="border border-tarius bg-white/40 flex flex-col justify-between group hover:border-[var(--tarius-olive)] transition-colors duration-500 overflow-hidden">
                {/* Product Image Container */}
                <div className="relative aspect-[4/3] w-full bg-[var(--tarius-ivory-deep)] overflow-hidden border-b border-tarius">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[var(--tarius-graphite)]/5 pointer-events-none" />
                </div>

                <div className="p-8 sm:p-12 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-eyebrow text-[var(--tarius-olive)]">{product.subtitle}</span>
                      <span className="font-display text-2xl font-semibold text-[var(--tarius-graphite)]">{product.price}</span>
                    </div>
                    
                    <h2 className="font-display text-3xl sm:text-4xl text-[var(--tarius-graphite)] mb-4 group-hover:text-[var(--tarius-olive)] transition-colors">
                      {product.name}
                    </h2>
                    
                    <p className="text-muted text-sm sm:text-base font-light leading-relaxed mb-8">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-tarius flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <span className="text-[10px] tracking-widest uppercase text-stone-500">{product.notes}</span>
                    <Link href="/#contact" className="btn-tarius w-full sm:w-auto">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}