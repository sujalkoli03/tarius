'use client';
import React, { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

export default function Faq(props: { id?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      q: "What makes TARIUS Spirulina and Moringa superior to standard powders?",
      a: "TARIUS is cultivated in micro-batch reserves using pure volcanic spring waters and dried using proprietary low-temperature methods. This retains up to 98% of active live enzymes and phytonutrients that commercial processing destroys."
    },
    {
      q: "How should I incorporate TARIUS powders into my daily regimen?",
      a: "We recommend one teaspoon (approx. 3g) blended into cold spring water, ceremonial matcha, or a raw botanical smoothie each morning on an empty stomach for maximum cellular absorption."
    },
    {
      q: "How do you verify purity and test for heavy metals?",
      a: "Every single harvest lot undergoes rigorous third-party ICP-MS testing in ISO-accredited laboratories. Certificates of analysis are available to private allocation members upon request."
    },
    {
      q: "What is a Private Allocation membership?",
      a: "Due to our strict adherence to micro-batch yields and seasonal harvests, our reserves are limited. Private Allocation guarantees a recurring seasonal quota reserved exclusively for you."
    }
  ];

  const toggleFaq = (idx: number) => {
    setActiveIndex(activeIndex === idx ? null : idx);
  };

  return (
    <section id={props.id} className="section-tarius bg-[var(--tarius-ivory)]">
      <div className="container-tarius max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-eyebrow text-[var(--tarius-olive)] mb-4 block">Inquiries</span>
          <h2 className="text-display text-4xl sm:text-5xl">Curated <span className="italic">Knowledge.</span></h2>
        </div>

        <div className="border-t border-tarius">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`border-b border-tarius py-6 ${activeIndex === idx ? 'bg-[var(--tarius-ivory-deep)]/20 px-4' : ''}`}>
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center text-left focus:outline-none group cursor-pointer"
              >
                <span className="font-display text-xl sm:text-2xl text-[var(--tarius-graphite)] group-hover:text-[var(--tarius-olive)] transition-colors pr-4">
                  {faq.q}
                </span>
                <span className={`text-2xl font-light text-[var(--tarius-graphite)] shrink-0 transition-transform duration-400 ${activeIndex === idx ? 'rotate-45 text-[var(--tarius-olive)]' : ''}`}>
                  +
                </span>
              </button>
              <div 
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{ maxHeight: activeIndex === idx ? '250px' : '0px', opacity: activeIndex === idx ? 1 : 0 }}
              >
                <p className="text-muted text-sm sm:text-base font-light mt-4 leading-relaxed max-w-3xl">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}