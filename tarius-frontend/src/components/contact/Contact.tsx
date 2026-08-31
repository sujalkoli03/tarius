'use client';

import React, { useState } from 'react';

export default function Contact(props: { id?: string }) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    preferredContact: 'email',
    tier: 'reserve',
    deliveryInstructions: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        preferredContact: 'email',
        tier: 'reserve',
        deliveryInstructions: ''
      });
    }, 5000);
  };

  return (
    <section id={props.id} className="section-tarius bg-[var(--tarius-graphite)] text-[var(--tarius-white)] relative overflow-hidden py-24 sm:py-32">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[var(--tarius-champagne)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-tarius relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column: Editorial Info */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <span className="text-eyebrow text-[var(--tarius-champagne)] mb-4 block tracking-[0.25em] text-xs">The Concierge</span>
            <h2 className="text-display text-4xl sm:text-5xl text-[var(--tarius-white)] mb-6 font-light leading-tight">
              Request Private <span className="italic text-[var(--tarius-champagne)]">Allocation.</span>
            </h2>
            <p className="text-stone-300 text-sm font-light leading-relaxed mb-10">
              Due to limited micro-batch yields and our commitment to uncompromised purity, allocations are granted exclusively through private advisory review. Inquire below to secure your seasonal reserve or schedule a consultation with our botanic advisors.
            </p>
            <div className="space-y-4 text-xs tracking-[0.2em] uppercase text-[var(--tarius-champagne)] font-medium border-t border-[var(--tarius-champagne)]/20 pt-8">
              <p className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[var(--tarius-champagne)]"></span>
                Direct Concierge: concierge@tarius.com
              </p>
              <p className="flex items-center gap-3">
                <span className="w-1 h-1 rounded-full bg-[var(--tarius-champagne)]"></span>
                Advisory Hotline: +1 (800) 482-7487
              </p>
            </div>
          </div>

          {/* Right Column: Free-Floating Template-Aligned Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div className="py-24 animate-fadeIn">
                <div className="w-12 h-12 rounded-full border border-[var(--tarius-champagne)] flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-[var(--tarius-champagne)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <span className="font-display text-3xl text-[var(--tarius-champagne)] block mb-3 font-light">Application Received</span>
                <p className="text-stone-300 text-sm font-light leading-relaxed">
                  Our private concierge is reviewing your dossier. A secure communication channel has been established for your reference.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-10">
                
                {/* Full Name & Title (Floating Label) */}
                <div className="relative group">
                  <input 
                    type="text" 
                    id="fullName" 
                    name="name"
                    required 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent" 
                    placeholder="Full Name & Title"
                  />
                  <label 
                    htmlFor="fullName" 
                    className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none"
                  >
                    Full Name & Title
                  </label>
                </div>

                {/* Secure Email */}
                <div className="relative group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent" 
                    placeholder="Secure Email"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none"
                  >
                    Secure Email
                  </label>
                </div>

                {/* Select Group 1: Preferred Method of Contact */}
                <div className="relative">
                  <label className="block text-stone-400 font-sans text-[10px] uppercase tracking-widest mb-2">Preferred Method of Contact</label>
                  <select 
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[var(--tarius-graphite)] text-stone-400">[Select Method...]</option>
                    <option value="phone" className="bg-[var(--tarius-graphite)]">Private Phone Consultation</option>
                    <option value="email" className="bg-[var(--tarius-graphite)]">Encrypted Email</option>
                    <option value="inperson" className="bg-[var(--tarius-graphite)]">In-Person Advisory</option>
                  </select>
                  <div className="absolute right-0 top-8 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Select Group 2: Nature of Inquiry / Allocation Tier */}
                <div className="relative">
                  <label className="block text-stone-400 font-sans text-[10px] uppercase tracking-widest mb-2">Nature of Inquiry</label>
                  <select 
                    name="tier"
                    value={formData.tier}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[var(--tarius-graphite)] text-stone-400">[Select Inquiry Type...]</option>
                    <option value="reserve" className="bg-[var(--tarius-graphite)]">Private Reserve Allocation</option>
                    <option value="blend" className="bg-[var(--tarius-graphite)]">Custom Bespoke Request</option>
                    <option value="advisory" className="bg-[var(--tarius-graphite)]">Private Wellness Advisory</option>
                  </select>
                  <div className="absolute right-0 top-8 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Textarea */}
                <div className="relative group mt-4">
                  <textarea 
                    id="message" 
                    name="deliveryInstructions" 
                    rows={4} 
                    required 
                    value={formData.deliveryInstructions}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent resize-none" 
                    placeholder="Custom Message / Delivery Preferences"
                  ></textarea>
                  <label 
                    htmlFor="message" 
                    className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-6 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none"
                  >
                    Custom Message / Delivery Preferences
                  </label>
                </div>

                {/* Submit CTA */}
                <button 
                  type="submit" 
                  className="w-full border border-[var(--tarius-champagne)] text-[var(--tarius-champagne)] py-4 mt-6 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[var(--tarius-champagne)] hover:text-[var(--tarius-graphite)] transition-all duration-300 cursor-pointer shadow-lg"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}