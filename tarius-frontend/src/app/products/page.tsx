// Filename: src/app/products/page.tsx

import Link from "next/link";
import { supabase } from "@/lib/api";

// THIS IS THE MAGIC LINE: It tells Vercel to never cache this page
export const dynamic = 'force-dynamic';

export const metadata = {
  title: "The Collection | TARIUS",
  description: "Explore our micro-batch botanical reserves.",
};

export default async function ProductsPage() {
  const { data: products, error } = await supabase
    .from('Product')
    .select('*')
    .eq('isPublished', true)
    .order('createdAt', { ascending: true });

  const activeProducts = products || [];

  return (
    <div className="bg-[var(--tarius-ivory)] relative">
      <section className="h-[60vh] min-h-[500px] flex flex-col items-center justify-center text-center px-4 relative z-0">
        <div className="absolute inset-0 bg-[var(--tarius-ivory-deep)] z-0"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--tarius-olive)]/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
        
        <div className="relative z-10">
          <span className="text-eyebrow text-[var(--tarius-olive)] mb-6 block">Private Allocation</span>
          <h1 className="text-display text-5xl sm:text-7xl text-[var(--tarius-graphite)] mb-6">
            The <span className="italic">Collection.</span>
          </h1>
          <p className="text-muted text-sm sm:text-base font-light max-w-md mx-auto leading-relaxed">
            Scroll to explore our limited seasonal reserves, cultivated for uncompromising daily wellness and cellular optimization.
          </p>
        </div>
      </section>

      <section className="relative z-10 pb-32">
        <div className="container-tarius max-w-6xl mx-auto">
          {activeProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="sticky pt-8 sm:pt-12"
              style={{ top: (100 + (index * 20)) + "px", zIndex: 10 + index }}
            >
              <div className="bg-white border border-[var(--tarius-border)] shadow-2xl flex flex-col md:flex-row overflow-hidden group min-h-[550px]">
                
                <div className="md:w-1/2 relative bg-[var(--tarius-ivory-deep)] flex items-center justify-center min-h-[300px] md:min-h-full overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                    />
                  ) : (
                    <div 
                      className="absolute inset-0 opacity-10 group-hover:scale-110 transition-transform duration-[1.5s] ease-out" 
                      style={{ backgroundColor: product.accentColor || 'var(--tarius-champagne)' }}
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r md:from-transparent md:to-black/10"></div>
                  
                  <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white z-10">
                    <span className="text-[10px] tracking-widest uppercase opacity-80 backdrop-blur-md bg-black/20 px-3 py-1 border border-white/20">
                      {product.category || 'Reserve Formulation'}
                    </span>
                  </div>
                </div>

                <div className="md:w-1/2 p-8 sm:p-14 flex flex-col justify-between bg-white relative">
                  <div className="absolute top-0 right-0 w-full h-2" style={{ backgroundColor: product.accentColor || 'var(--tarius-olive)' }}></div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-4">
                      <span className="text-eyebrow text-[var(--tarius-olive)] block">
                        {product.subtitle}
                      </span>
                      {product.price && (
                        <span className="font-display text-3xl text-[var(--tarius-graphite)]">
                          {product.price}
                        </span>
                      )}
                    </div>
                    
                    <h2 className="font-display text-4xl sm:text-5xl text-[var(--tarius-graphite)] mb-8 leading-none group-hover:text-[var(--tarius-olive)] transition-colors duration-500">
                      {product.name}
                    </h2>
                    
                    <p className="text-muted text-sm font-light leading-relaxed mb-6">
                      {product.description}
                    </p>

                    {product.notes && (
                      <div className="bg-[var(--tarius-ivory)] p-4 border-l-2 border-[var(--tarius-olive)] mb-8">
                        <p className="text-xs text-[var(--tarius-graphite)] italic">
                          "{product.notes}"
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-8 border-t border-[var(--tarius-border)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div className="flex items-center gap-3">
                      <span className={"w-2 h-2 rounded-full " + (product.inventory && product.inventory > 0 ? 'bg-emerald-500' : 'bg-stone-300')}></span>
                      <span className="text-[10px] tracking-widest uppercase text-stone-500">
                        {product.inventory && product.inventory > 0 ? 'Allocation Available' : 'Waitlist Active'}
                      </span>
                    </div>
                    
                    <Link href={"/#contact?product=" + product.slug} className="btn-tarius w-full sm:w-auto text-center hover:bg-[var(--tarius-olive)] hover:border-[var(--tarius-olive)] hover:text-white">
                      Request Allocation
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          ))}

          {activeProducts.length === 0 && !error && (
            <div className="py-32 text-center border border-[var(--tarius-border)] bg-white/40 mt-12">
              <p className="text-[var(--tarius-graphite-soft)] font-light">The collection is currently sealed. Please contact the concierge.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}