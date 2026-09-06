'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  order: number;
}

export default function Faq(props: { id?: string }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);

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

        <div className="border-t border-[var(--tarius-border)]">
          {faqs.map((faq, idx) => (
            <div key={faq.id} className={`border-b border-[var(--tarius-border)] py-6 ${activeIndex === idx ? 'bg-[var(--tarius-ivory-deep)]/20 px-4' : ''}`}>
              <button 
                onClick={() => toggleFaq(idx)}
                className="w-full flex justify-between items-center text-left focus:outline-none group cursor-pointer"
              >
                <span className="font-display text-xl sm:text-2xl text-[var(--tarius-graphite)] group-hover:text-[var(--tarius-olive)] transition-colors pr-4">
                  {faq.question}
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
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}