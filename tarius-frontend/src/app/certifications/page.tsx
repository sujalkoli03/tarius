// Filename: src/app/certifications/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

interface Certification {
  id: string;
  title: string;
  description: string;
  templateType: string;
  pdfUrl: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Lightbox State
  const [activePdf, setActivePdf] = useState<string | null>(null);

  useEffect(() => {
    fetchPublicCertifications();
  }, []);

  const fetchPublicCertifications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Certification')
      .select('*')
      .eq('isPublished', true)
      .order('displayOrder', { ascending: true })
      .order('createdAt', { ascending: false });

    if (!error && data) {
      setCerts(data);
    }
    setLoading(false);
  };

  const openLightbox = (pdfUrl: string | null) => {
    if (pdfUrl) {
      setActivePdf(pdfUrl);
      // Prevent background scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
    }
  };

  const closeLightbox = () => {
    setActivePdf(null);
    // Restore background scrolling
    document.body.style.overflow = 'auto';
  };

  // Grouping the documents by their Admin-assigned aesthetic templates
  const spotlights = certs.filter(c => c.templateType === 'spotlight');
  const grids = certs.filter(c => c.templateType === 'grid');
  const ledgers = certs.filter(c => c.templateType === 'ledger');

  return (
    <div className="bg-[var(--tarius-ivory)] min-h-screen relative">
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 flex flex-col items-center justify-center text-center px-4 relative z-0 border-b border-[var(--tarius-border)] bg-white">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--tarius-champagne)]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="text-eyebrow text-[var(--tarius-olive)] mb-6 block">Absolute Transparency</span>
          <h1 className="text-display text-5xl sm:text-7xl text-[var(--tarius-graphite)] mb-6">
            Certifications <span className="italic">& Labs.</span>
          </h1>
          <p className="text-muted text-sm sm:text-base font-light leading-relaxed text-stone-500">
            We believe uncompromising quality requires irrefutable proof. Explore our official regulatory filings, botanical certifications, and third-party laboratory analysis reports below.
          </p>
        </div>
      </section>

      {loading ? (
        <div className="py-32 flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin mb-4"></div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Retrieving Dossiers...</p>
        </div>
      ) : (
        <div className="pb-32">
          
          {/* TEMPLATE A: The Spotlights (Hero-style blocks for major certs) */}
          {spotlights.length > 0 && (
            <section className="w-full">
              {spotlights.map((cert, index) => (
                <div key={cert.id} className={"w-full py-24 px-4 sm:px-8 border-b border-[var(--tarius-border)] " + (index % 2 === 0 ? "bg-[var(--tarius-ivory)]" : "bg-white")}>
                  <div className={"max-w-6xl mx-auto flex flex-col gap-12 items-center " + (index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse")}>
                    
                    <div className="w-full md:w-1/2 flex justify-center">
                      <div 
                        onClick={() => openLightbox(cert.pdfUrl)}
                        className="relative w-full max-w-md bg-white p-4 border border-[var(--tarius-border)] shadow-2xl cursor-pointer group transform transition-transform duration-500 hover:scale-[1.02]"
                      >
                        <div className="w-full h-[500px] bg-[var(--tarius-ivory-deep)] overflow-hidden relative">
                          {cert.thumbnailUrl ? (
                            <img src={cert.thumbnailUrl} alt={cert.title} className="w-full h-full object-cover opacity-90 mix-blend-multiply group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300">PDF</div>
                          )}
                          <div className="absolute inset-0 bg-[var(--tarius-olive)]/0 group-hover:bg-[var(--tarius-olive)]/10 transition-colors duration-300 flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-[var(--tarius-graphite)] text-white text-[10px] uppercase tracking-widest px-6 py-3 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                              View Original PDF
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-1/2 flex flex-col gap-6 text-center md:text-left px-4">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-olive)]">Official Filing</span>
                      <h2 className="font-display text-4xl lg:text-5xl text-[var(--tarius-graphite)] leading-tight">
                        {cert.title}
                      </h2>
                      <p className="text-sm font-light leading-relaxed text-stone-600 mb-4">
                        {cert.description}
                      </p>
                      <button 
                        onClick={() => openLightbox(cert.pdfUrl)}
                        className="btn-tarius w-max mx-auto md:mx-0 hover:bg-[var(--tarius-olive)] hover:border-[var(--tarius-olive)] hover:text-white"
                      >
                        Inspect Dossier
                      </button>
                    </div>

                  </div>
                </div>
              ))}
            </section>
          )}

          {/* TEMPLATE B: Dossier Grid (Card-style for product labs) */}
          {grids.length > 0 && (
            <section className="max-w-7xl mx-auto px-4 sm:px-8 py-24">
              <div className="text-center mb-16">
                <h3 className="font-display text-3xl text-[var(--tarius-graphite)] mb-4">Laboratory Analysis</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Product-Specific Documentation</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {grids.map((cert) => (
                  <div key={cert.id} className="bg-white border border-[var(--tarius-border)] shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col group">
                    <div className="h-[300px] bg-[var(--tarius-ivory-deep)] relative border-b border-[var(--tarius-border)] overflow-hidden cursor-pointer" onClick={() => openLightbox(cert.pdfUrl)}>
                      {cert.thumbnailUrl ? (
                        <img src={cert.thumbnailUrl} alt={cert.title} className="w-full h-full object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">PDF</div>
                      )}
                      <div className="absolute inset-0 bg-[var(--tarius-olive)]/0 group-hover:bg-[var(--tarius-olive)]/5 transition-colors"></div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h4 className="font-display text-2xl text-[var(--tarius-graphite)] mb-3 group-hover:text-[var(--tarius-olive)] transition-colors">
                        {cert.title}
                      </h4>
                      <p className="text-xs font-light leading-relaxed text-stone-500 mb-8 flex-1">
                        {cert.description}
                      </p>
                      <button 
                        onClick={() => openLightbox(cert.pdfUrl)}
                        className="text-[10px] uppercase tracking-widest text-[var(--tarius-graphite)] border-b border-[var(--tarius-border)] pb-1 w-max group-hover:border-[var(--tarius-olive)] group-hover:text-[var(--tarius-olive)] transition-all"
                      >
                        View Full Document
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TEMPLATE C: Ledger (Minimalist List for minor filings) */}
          {ledgers.length > 0 && (
            <section className="max-w-4xl mx-auto px-4 sm:px-8 py-24 border-t border-[var(--tarius-border)]">
              <div className="text-center mb-12">
                <h3 className="font-display text-2xl text-[var(--tarius-graphite)] mb-3">Supplementary Ledger</h3>
                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Historical & Supporting Filings</p>
              </div>

              <div className="flex flex-col border-t border-[var(--tarius-border)]">
                {ledgers.map((cert) => (
                  <div key={cert.id} className="w-full bg-white border-b border-[var(--tarius-border)] p-6 flex flex-col sm:flex-row sm:items-center gap-6 hover:bg-[var(--tarius-ivory-deep)] transition-colors group cursor-pointer" onClick={() => openLightbox(cert.pdfUrl)}>
                    <div className="w-16 h-16 shrink-0 bg-white border border-[var(--tarius-border)] flex items-center justify-center overflow-hidden">
                      {cert.thumbnailUrl ? (
                        <img src={cert.thumbnailUrl} alt="thumb" className="w-full h-full object-cover opacity-50 mix-blend-multiply group-hover:opacity-80 transition-opacity" />
                      ) : (
                        <span className="text-[10px] text-stone-300 font-medium">PDF</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-[var(--tarius-graphite)] group-hover:text-[var(--tarius-olive)] transition-colors">{cert.title}</h4>
                      <p className="text-xs text-stone-500 mt-1">{cert.description}</p>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full border border-[var(--tarius-border)] flex items-center justify-center text-stone-400 group-hover:border-[var(--tarius-olive)] group-hover:text-[var(--tarius-olive)] transition-colors bg-white">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {certs.length === 0 && !loading && (
             <div className="max-w-2xl mx-auto py-24 text-center border border-[var(--tarius-border)] bg-white">
               <p className="text-sm font-light text-stone-500">The document registry is currently undergoing updates. Please contact the concierge for direct requests.</p>
             </div>
          )}

        </div>
      )}

      {/* IMMERSIVE PDF LIGHTBOX VIEWER */}
      {activePdf && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-black/95 animate-in fade-in duration-300 backdrop-blur-sm">
          
          {/* Lightbox Header toolbar */}
          <div className="w-full flex items-center justify-between p-6 border-b border-white/10 bg-black">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-champagne)] mb-1">Tarius Secure Viewer</span>
              <span className="text-xs text-stone-400 font-light">End-to-End Encrypted Document</span>
            </div>
            <div className="flex items-center gap-6">
              <a 
                href={activePdf} 
                download
                target="_blank"
                rel="noreferrer"
                className="text-[10px] uppercase tracking-widest text-[var(--tarius-champagne)] hover:text-white transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                Download PDF
              </a>
              <button 
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          
          {/* PDF iFrame container */}
          <div className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-8 h-full">
            <div className="w-full h-full bg-white rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
              <iframe 
                src={activePdf + "#toolbar=0&navpanes=0&scrollbar=0"} 
                className="w-full h-full border-none"
                title="Secure Document Viewer"
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}