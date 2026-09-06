import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/api";

export const metadata = {
  title: "Collection",
  description: "Explore our micro-batch botanical reserves of pure spirulina and moringa powders.",
};

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from('Product')
    .select('*')
    .eq('isPublished', true)
    .order('createdAt', { ascending: true });

  const activeProducts = products || [];

  return (
    <div className="pt-[76px]">
      <section className="section-tarius-sm bg-[var(--tarius-ivory-deep)] border-b border-[var(--tarius-border)]">
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
            {activeProducts.map((product) => (
              <div key={product.id} className="border border-[var(--tarius-border)] bg-white/40 flex flex-col justify-between group hover:border-[var(--tarius-olive)] transition-colors duration-500 overflow-hidden">
                <div className="relative aspect-[4/3] w-full bg-[var(--tarius-ivory-deep)] overflow-hidden border-b border-[var(--tarius-border)] flex items-center justify-center">
                  {product.image ? (
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div 
                      className="w-full h-full opacity-20 group-hover:scale-105 transition-transform duration-700" 
                      style={{ backgroundColor: product.accentColor || 'var(--tarius-champagne)' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-[var(--tarius-graphite)]/5 pointer-events-none" />
                </div>

                <div className="p-8 sm:p-12 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <span className="text-eyebrow text-[var(--tarius-olive)]">{product.subtitle}</span>
                      <span className="font-display text-2xl font-semibold text-[var(--tarius-graphite)]">{product.price || 'Price on Request'}</span>
                    </div>
                    
                    <h2 className="font-display text-3xl sm:text-4xl text-[var(--tarius-graphite)] mb-4 group-hover:text-[var(--tarius-olive)] transition-colors">
                      {product.name}
                    </h2>
                    
                    <p className="text-muted text-sm sm:text-base font-light leading-relaxed mb-8">
                      {product.description}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[var(--tarius-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <span className="text-[10px] tracking-widest uppercase text-stone-500">{product.notes || 'Biophotonic Violet Glass'}</span>
                    <Link href="/#contact" className="btn-tarius w-full sm:w-auto">
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            {activeProducts.length === 0 && !error && (
              <div className="col-span-1 lg:col-span-2 py-24 text-center">
                <p className="text-stone-500">The collection is currently closed. Please check back later or contact the concierge.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}