import React from 'react';
import Link from 'next/link';

interface Pillar {
  num: string;
  title: string;
  desc: string;
}

export default function Quality(props: { id?: string }) {
  const pillars: Pillar[] = [
    {
      num: "01",
      title: "Volcanic Aquifer Sourcing",
      desc: "Cultivated in mineral-dense spring waters originating from protected volcanic rock strata, ensuring zero heavy metal contamination."
    },
    {
      num: "02",
      title: "Low-Temperature Cryo-Milling",
      desc: "Processed below 35°C to preserve heat-sensitive enzymes, live chlorophyll compounds, and delicate antioxidants at maximum potency."
    },
    {
      num: "03",
      title: "Biophotonic Violet Glass",
      desc: "Packaged in ultraviolet-blocking glass jars that filter harmful visible light while allowing beneficial solar frequencies to maintain freshness."
    }
  ];

  return (
    <section id={props.id} className="section-tarius bg-[var(--tarius-graphite)] text-[var(--tarius-white)]">
      <div className="container-tarius">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20">
          <div>
            <span className="text-eyebrow text-[var(--tarius-champagne)] mb-4 block">Traceable Lineage</span>
            <h2 className="text-display text-4xl sm:text-5xl text-[var(--tarius-white)]">
              Unrivaled <span className="italic text-[var(--tarius-champagne)]">Provenance.</span>
            </h2>
          </div>
          <p className="text-stone-300 text-sm font-light max-w-md mt-6 md:mt-0 text-left md:text-right">
            Every batch of TARIUS is independently certified, serialized, and tracked from harvest to your personal sanctuary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pillars.map((pillar, idx) => (
            <div key={idx} className="border border-[var(--tarius-champagne)]/30 p-8 sm:p-10 hover:bg-[var(--tarius-white)]/5 transition-colors duration-500 group">
              <span className="font-display text-3xl text-[var(--tarius-champagne)] block mb-6 group-hover:translate-x-1 transition-transform">
                {pillar.num}
              </span>
              <h3 className="font-display text-2xl text-[var(--tarius-white)] mb-4">{pillar.title}</h3>
              <p className="text-stone-300 text-xs sm:text-sm font-light leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <Link
            href="/certifications"
            className="inline-flex items-center justify-center min-h-[3rem] px-8 py-3 bg-transparent border border-[var(--tarius-champagne)] text-[var(--tarius-champagne)] font-semibold text-[0.68rem] tracking-[0.16em] uppercase transition-all duration-300 hover:bg-[var(--tarius-champagne)] hover:text-[var(--tarius-graphite)] shadow-[0_0_15px_rgba(238,226,204,0.1)]"
          >
            View Certifications
          </Link>
        </div>
      </div>
    </section>
  );
}