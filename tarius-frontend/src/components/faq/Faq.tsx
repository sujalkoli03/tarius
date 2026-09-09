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
    <section id={props.id} className="section-tarius bg-[var(--tarius-ivory)] text-[var(--tarius-graphite)] relative py-24 sm:py-32">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[var(--tarius-champagne)]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container-tarius relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24 pb-12 border-b border-[var(--tarius-border)]">
          <span className="text-eyebrow text-[var(--tarius-olive)] mb-4 block">Knowledge Base</span>
          <h2 className="text-display text-4xl sm:text-6xl text-[var(--tarius-graphite)] mb-6">
            Curated <span className="italic text-[var(--tarius-olive)]">Inquiries.</span>
          </h2>
          <p className="text-sm font-light text-[var(--tarius-graphite-soft)] leading-relaxed mx-auto">
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
                    ? 'border-[var(--tarius-olive)] opacity-100'
                    : 'border-[var(--tarius-border)] opacity-40 hover:opacity-100 hover:border-[var(--tarius-graphite)]/30'
                }`}
              >
                <span className={`font-display text-xl transition-colors duration-500 ${activeIndex === idx ? 'text-[var(--tarius-olive)]' : 'text-stone-400'}`}>
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
                <span className="font-display text-xl sm:text-2xl text-[var(--tarius-graphite)] leading-snug">
                  {faq.question}
                </span>
              </button>
            ))}
          </div>

          <div className="lg:col-span-7 lg:sticky lg:top-32 h-fit">
            <div className="bg-[var(--tarius-ivory-deep)]/40 border border-[var(--tarius-border)] backdrop-blur-sm p-8 sm:p-14 min-h-[400px] flex flex-col justify-center relative overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--tarius-champagne)]/20 blur-[50px] rounded-full"></div>
              
              <div className={`transition-opacity duration-300 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
                {faqs[activeIndex].category && (
                  <span className="inline-block px-3 py-1 bg-[var(--tarius-olive)]/10 text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest border border-[var(--tarius-olive)]/20 mb-6">
                    {faqs[activeIndex].category}
                  </span>
                )}
                
                <h3 className="font-display text-3xl sm:text-4xl text-[var(--tarius-graphite)] mb-8 leading-tight">
                  {faqs[activeIndex].question}
                </h3>
                
                <div className="w-12 h-px bg-[var(--tarius-olive)]/40 mb-8"></div>
                
                <p className="text-[var(--tarius-graphite-soft)] text-sm sm:text-base font-light leading-relaxed max-w-2xl">
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