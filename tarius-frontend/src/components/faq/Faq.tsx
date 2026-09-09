'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
  category: string | null;
}

export default function Faq(props: { id?: string }) {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    async function fetchFaqs() {
      const { data, error } = await supabase
        .from('FaqItem')
        .select('*')
        .eq('isPublished', true)
        .order('order', { ascending: true });

      if (!error && data) {
        setFaqs(data);
      }
    }
    fetchFaqs();
  }, []);

  const handleSelect = (idx: number) => {
    if (idx === activeIndex) return;
    setIsFading(true);
    setTimeout(() => {
      setActiveIndex(idx);
      setIsFading(false);
    }, 300);
  };

  if (faqs.length === 0) return null;

  return (
    <section id={props.id} className="section-tarius bg-[var(--tarius-graphite)] text-[var(--tarius-white)] relative py-24 sm:py-32">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--tarius-champagne)]/5 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container-tarius relative z-10">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-16 sm:mb-24 gap-8 border-b border-white/10 pb-12">
          <div>
            <span className="text-eyebrow text-[var(--tarius-champagne)] mb-4 block">Knowledge Base</span>
            <h2 className="text-display text-4xl sm:text-6xl text-[var(--tarius-white)]">
              Curated <span className="italic text-[var(--tarius-champagne)]">Inquiries.</span>
            </h2>
          </div>
          <p className="text-sm font-light text-stone-400 max-w-sm leading-relaxed">
            Transparency is the foundation of our sanctuary. Explore the exact sourcing, processing, and biochemical profiles of our reserves.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative">
          <div className="lg:col-span-5 flex flex-col gap-6 relative z-20">
            {faqs.map((faq, idx) => (
              <button
                key={faq.id}
                onClick={() => handleSelect(idx)}
                className={`text-left group flex items-start gap-6 pb-6 border-b transition-all duration-500 ${
                  activeIndex === idx
                    ? 'border-[var(--tarius-champagne)] opacity-100'
                    : 'border-white/10 opacity-40 hover:opacity-100 hover:border-white/30'
                }`}
              >
                <span className={`font-display text-xl transition-colors duration-500 ${activeIndex === idx ? 'text-[var(--tarius-champagne)]' : 'text-stone-500'}`}>
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="font-display text-xl sm:text-2xl text-[var(--tarius-white)] leading-snug">
                  {faq.question}
                </span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-32 h-fit">
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-8 sm:p-14 min-h-[400px] flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--tarius-champagne)]/10 blur-[50px] rounded-full"></div>
              
              <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {faqs[activeIndex].category && (
                  <span className="inline-block px-3 py-1 bg-[var(--tarius-champagne)]/10 text-[var(--tarius-champagne)] text-[10px] uppercase tracking-widest border border-[var(--tarius-champagne)]/20 mb-6">
                    {faqs[activeIndex].category}
                  </span>
                )}
                
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--tarius-white)] mb-8 leading-tight">
                  {faqs[activeIndex].question}
                </h3>
                
                <div className="w-12 h-px bg-[var(--tarius-champagne)]/50 mb-8"></div>
                
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                  {faqs[activeIndex].answer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}