import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[var(--tarius-graphite)] text-[var(--tarius-white)] border-t border-white/10 pt-20 pb-12">
      <div className="container-tarius">
        
        {}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 pb-16 border-b border-white/10">
          <div className="md:col-span-6">
            <a href="#" className="font-display text-3xl tracking-[0.2em] font-semibold block mb-4 text-[var(--tarius-white)] hover:text-[var(--tarius-champagne)] transition-colors">
              TARIUS
            </a>
            <p className="text-xs uppercase tracking-widest text-stone-400 max-w-sm leading-relaxed mb-8">
              Pure botanical extracts and micro-batch reserves cultivated for the uncompromising sanctuary.
            </p>
            <div className="flex items-center gap-3 text-[10px] tracking-widest uppercase text-[var(--tarius-champagne)]">
              <span className="w-2 h-2 rounded-full bg-[var(--tarius-champagne)] animate-pulse"></span>
              <span>Global Private Registry Active</span>
            </div>
          </div>

          <div className="md:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8 text-stone-300 text-xs tracking-[0.15em] uppercase font-semibold">
            <div>
              <span className="text-[var(--tarius-champagne)] block mb-4 text-[10px]">Collection</span>
              <ul className="space-y-3 font-light text-stone-400">
                <li><a href="#story" className="hover:text-[var(--tarius-champagne)] transition-colors">Genesis</a></li>
                <li><a href="#provenance" className="hover:text-[var(--tarius-champagne)] transition-colors">Provenance</a></li>
                <li><a href="#faq" className="hover:text-[var(--tarius-champagne)] transition-colors">Inquiries</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[var(--tarius-champagne)] block mb-4 text-[10px]">Concierge</span>
              <ul className="space-y-3 font-light text-stone-400">
                <li><a href="#concierge" className="hover:text-[var(--tarius-champagne)] transition-colors">Private Allocation</a></li>
                <li><a href="#concierge" className="hover:text-[var(--tarius-champagne)] transition-colors">Advisory Desk</a></li>
                <li><a href="#concierge" className="hover:text-[var(--tarius-champagne)] transition-colors">Secure Dispatch</a></li>
              </ul>
            </div>
            <div>
              <span className="text-[var(--tarius-champagne)] block mb-4 text-[10px]">Legal</span>
              <ul className="space-y-3 font-light text-stone-400">
                <li><a href="#" className="hover:text-[var(--tarius-champagne)] transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-[var(--tarius-champagne)] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[var(--tarius-champagne)] transition-colors">Assay Reports</a></li>
              </ul>
            </div>
          </div>
        </div>

        {}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[10px] tracking-widest uppercase text-stone-500 pt-8 gap-4">
          <p>&copy; 2026 TARIUS Botanical Reserves. All Rights Reserved.</p>
          <p className="text-[var(--tarius-champagne)]/70">Designed for the Uncompromising.</p>
        </div>

      </div>
    </footer>
  );
}