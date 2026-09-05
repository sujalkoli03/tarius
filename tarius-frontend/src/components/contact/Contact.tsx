'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function Contact(props: { id?: string }) {
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [selectedInquiry, setSelectedInquiry] = useState<string>('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    message: '',
    
    // Gifting
    giftingProducts: { spirulina: false, moringa: false },
    spirulinaQty: '1',
    moringaQty: '1',
    deliveryDate: '',
    deliveryTime: '',
    deliveryLocation: '',

    // Collaboration / Press
    socialHandle: '',
    collaborationReason: '',
    collabProducts: '',
    eventDate: '',
    eventTime: '',

    // Careers
    position: '',
    expectedSalary: '',
    qualifications: '',
    tentativeJoiningDate: '',

    // Quality Complaint
    invoiceFile: null as File | null,
    productPhoto: null as File | null,
    batchPhoto: null as File | null,

    // General Feedback
    feedbackProducts: [] as string[],
    purchasePlatform: '',
    purchaseDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (productKey: 'spirulina' | 'moringa') => {
    setFormData(prev => ({
      ...prev,
      giftingProducts: {
        ...prev.giftingProducts,
        [productKey]: !prev.giftingProducts[productKey]
      }
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'invoiceFile' | 'productPhoto' | 'batchPhoto') => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, [field]: e.target.files![0] }));
    }
  };

  const handleFeedbackProductToggle = (prod: string) => {
    setFormData(prev => {
      const exists = prev.feedbackProducts.includes(prod);
      return {
        ...prev,
        feedbackProducts: exists 
          ? prev.feedbackProducts.filter(p => p !== prod)
          : [...prev.feedbackProducts, prod]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedInquiry('');
      setFormData({
        name: '', email: '', phone: '', preferredContact: 'email', message: '',
        giftingProducts: { spirulina: false, moringa: false },
        spirulinaQty: '1', moringaQty: '1', deliveryDate: '', deliveryTime: '', deliveryLocation: '',
        socialHandle: '', collaborationReason: '', collabProducts: '', eventDate: '', eventTime: '',
        position: '', expectedSalary: '', qualifications: '', tentativeJoiningDate: '',
        invoiceFile: null, productPhoto: null, batchPhoto: null,
        feedbackProducts: [], purchasePlatform: '', purchaseDate: ''
      });
    }, 5000);
  };

  return (
    <section id={props.id} className="section-tarius bg-[var(--tarius-graphite)] text-[var(--tarius-white)] relative overflow-hidden py-24 sm:py-32">
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-[var(--tarius-champagne)]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-tarius relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          
          {/* Left Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-12">
            <span className="text-eyebrow text-[var(--tarius-champagne)] mb-4 block tracking-[0.25em] text-xs">The Concierge</span>
            <h2 className="text-display text-4xl sm:text-5xl text-[var(--tarius-white)] mb-6 font-light leading-tight">
              Request Private <span className="italic text-[var(--tarius-champagne)]">Allocation.</span>
            </h2>
            <p className="text-stone-300 text-sm font-light leading-relaxed mb-10">
              Select your inquiry nature below to load the appropriate dossier fields. Our private advisory desk reviews all applications strictly within 24 hours.
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

          {/* Right Column: Dynamic Form */}
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
                  Your dossier has been securely routed. Our team will review your requirements and revert back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                
                {/* Main Nature of Inquiry Dropdown */}
                <div className="relative">
                  <label className="block text-[var(--tarius-champagne)] font-sans text-[10px] uppercase tracking-widest mb-2">Nature of Inquiry</label>
                  <select 
                    name="tier"
                    value={selectedInquiry}
                    onChange={(e) => setSelectedInquiry(e.target.value)}
                    required
                    className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[var(--tarius-graphite)] text-stone-400">[Select Inquiry Type...]</option>
                    <option value="product" className="bg-[var(--tarius-graphite)]">1. Product Inquiry (Ingredients, Sourcing, Dosage)</option>
                    <option value="buy" className="bg-[var(--tarius-graphite)]">2. Where to Buy (Stockist / Platform Stock)</option>
                    <option value="bulk" className="bg-[var(--tarius-graphite)]">3. Bulk / Wholesale Inquiry</option>
                    <option value="retail" className="bg-[var(--tarius-graphite)]">4. Retail / Stockist Partnership</option>
                    <option value="quality" className="bg-[var(--tarius-graphite)]">5. Quality Complaint (Defect, Seal, Batch Issue)</option>
                    <option value="cert" className="bg-[var(--tarius-graphite)]">6. Certification / Documentation Request (COA, FSSAI)</option>
                    <option value="gifting" className="bg-[var(--tarius-graphite)]">7. Corporate / Custom Gifting</option>
                    <option value="collab" className="bg-[var(--tarius-graphite)]">8. Collaboration / Influencer Partnership</option>
                    <option value="press" className="bg-[var(--tarius-graphite)]">9. Press & Media Inquiry</option>
                    <option value="careers" className="bg-[var(--tarius-graphite)]">10. Careers</option>
                    <option value="feedback" className="bg-[var(--tarius-graphite)]">11. General Feedback</option>
                    <option value="other" className="bg-[var(--tarius-graphite)]">12. Other</option>
                  </select>
                  <div className="absolute right-0 top-8 pointer-events-none text-stone-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>

                {/* Conditional Dynamic Fields */}
                {selectedInquiry && (
                  <div className="space-y-6 pt-4 border-t border-[var(--tarius-champagne)]/10 animate-fadeIn">
                    
                    {/* Standard Contact Fields for active selections */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="relative group">
                        <input 
                          type="text" 
                          name="name"
                          required 
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent" 
                          placeholder="Full Name"
                        />
                        <label className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none">Full Name</label>
                      </div>

                      <div className="relative group">
                        <input 
                          type="email" 
                          name="email"
                          required 
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent" 
                          placeholder="Email Address"
                        />
                        <label className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none">Email Address</label>
                      </div>
                    </div>

                    {/* 7. Corporate / Custom Gifting Fields */}
                    {selectedInquiry === 'gifting' && (
                      <div className="space-y-6 bg-white/[0.02] p-6 border border-[var(--tarius-champagne)]/20">
                        <p className="text-xs uppercase tracking-widest text-[var(--tarius-champagne)]">Select Products & Quantities</p>
                        
                        <div className="flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 text-sm font-light text-stone-300 cursor-pointer">
                            <input type="checkbox" checked={formData.giftingProducts.spirulina} onChange={() => handleCheckboxChange('spirulina')} className="accent-[var(--tarius-champagne)]" />
                            Spirulina Reserve ($68)
                          </label>
                          {formData.giftingProducts.spirulina && (
                            <input type="number" name="spirulinaQty" min="1" value={formData.spirulinaQty} onChange={handleChange} className="w-20 bg-transparent border-b border-[var(--tarius-champagne)]/30 px-2 py-1 text-sm text-[var(--tarius-white)]" placeholder="Qty" />
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          <label className="flex items-center gap-3 text-sm font-light text-stone-300 cursor-pointer">
                            <input type="checkbox" checked={formData.giftingProducts.moringa} onChange={() => handleCheckboxChange('moringa')} className="accent-[var(--tarius-champagne)]" />
                            Wild Botanical Moringa ($54)
                          </label>
                          {formData.giftingProducts.moringa && (
                            <input type="number" name="moringaQty" min="1" value={formData.moringaQty} onChange={handleChange} className="w-20 bg-transparent border-b border-[var(--tarius-champagne)]/30 px-2 py-1 text-sm text-[var(--tarius-white)]" placeholder="Qty" />
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Delivery Date</label>
                            <input type="date" name="deliveryDate" value={formData.deliveryDate} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Delivery Time</label>
                            <input type="time" name="deliveryTime" value={formData.deliveryTime} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Location / Venue</label>
                            <input type="text" name="deliveryLocation" value={formData.deliveryLocation} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" placeholder="City / Address" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 8 & 9. Collaboration & Press Fields */}
                    {(selectedInquiry === 'collab' || selectedInquiry === 'press') && (
                      <div className="space-y-6 bg-white/[0.02] p-6 border border-[var(--tarius-champagne)]/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Social Handle / Page Link</label>
                            <input type="text" name="socialHandle" value={formData.socialHandle} onChange={handleChange} placeholder="@instagram / portfolio URL" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Products to Showcase</label>
                            <input type="text" name="collabProducts" value={formData.collabProducts} onChange={handleChange} placeholder="Spirulina / Moringa" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Tentative Date</label>
                            <input type="date" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Tentative Time</label>
                            <input type="time" name="eventTime" value={formData.eventTime} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Reason for Partnership / Feature</label>
                          <textarea name="collaborationReason" rows={3} value={formData.collaborationReason} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)] resize-none" placeholder="Describe your audience or media outlet..."></textarea>
                        </div>
                      </div>
                    )}

                    {/* 10. Careers Fields */}
                    {selectedInquiry === 'careers' && (
                      <div className="space-y-6 bg-white/[0.02] p-6 border border-[var(--tarius-champagne)]/20">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Position Applying For</label>
                            <input type="text" name="position" value={formData.position} onChange={handleChange} placeholder="Role title" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Expected Salary (PA Range)</label>
                            <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} placeholder="e.g. $80,000 - $100,000" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Qualifications / Experience</label>
                            <input type="text" name="qualifications" value={formData.qualifications} onChange={handleChange} placeholder="Degrees / Certifications" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Tentative Joining Date</label>
                            <input type="date" name="tentativeJoiningDate" value={formData.tentativeJoiningDate} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 5. Quality Complaint Fields */}
                    {selectedInquiry === 'quality' && (
                      <div className="space-y-6 bg-white/[0.02] p-6 border border-[var(--tarius-champagne)]/20">
                        <p className="text-xs uppercase tracking-widest text-[var(--tarius-champagne)]">Verification Assets Required</p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-300">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Order Invoice</label>
                            <input type="file" accept="image/*,.pdf" onChange={(e) => handleFileChange(e, 'invoiceFile')} className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-[var(--tarius-champagne)] file:text-[var(--tarius-graphite)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Product Photo</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'productPhoto')} className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-[var(--tarius-champagne)] file:text-[var(--tarius-graphite)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Batch Number Photo</label>
                            <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, 'batchPhoto')} className="w-full text-xs text-stone-400 file:mr-2 file:py-1 file:px-2 file:border-0 file:text-[10px] file:bg-[var(--tarius-champagne)] file:text-[var(--tarius-graphite)]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 11. General Feedback Fields */}
                    {selectedInquiry === 'feedback' && (
                      <div className="space-y-6 bg-white/[0.02] p-6 border border-[var(--tarius-champagne)]/20">
                        <p className="text-xs uppercase tracking-widest text-[var(--tarius-champagne)]">Product(s) Reviewed (Mandatory)</p>
                        <div className="flex gap-6">
                          <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                            <input type="checkbox" checked={formData.feedbackProducts.includes('Spirulina')} onChange={() => handleFeedbackProductToggle('Spirulina')} className="accent-[var(--tarius-champagne)]" />
                            Spirulina Reserve
                          </label>
                          <label className="flex items-center gap-2 text-sm text-stone-300 cursor-pointer">
                            <input type="checkbox" checked={formData.feedbackProducts.includes('Moringa')} onChange={() => handleFeedbackProductToggle('Moringa')} className="accent-[var(--tarius-champagne)]" />
                            Wild Moringa
                          </label>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Purchased From</label>
                            <input type="text" name="purchasePlatform" value={formData.purchasePlatform} onChange={handleChange} placeholder="Amazon / Blinkit / Direct" className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                          <div>
                            <label className="block text-[10px] uppercase tracking-widest text-stone-400 mb-1">Purchase Date</label>
                            <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-2 text-sm text-[var(--tarius-white)]" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* General Message Textarea */}
                    <div className="relative group mt-4">
                      <textarea 
                        name="message" 
                        rows={4} 
                        required 
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full bg-transparent border-b border-[var(--tarius-champagne)]/30 py-3 text-[var(--tarius-white)] font-sans text-sm focus:outline-none focus:border-[var(--tarius-champagne)] transition-colors peer placeholder-transparent resize-none" 
                        placeholder="Detailed Inquiry Description..."
                      ></textarea>
                      <label className="absolute left-0 top-3 text-stone-400 font-sans text-xs uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[var(--tarius-champagne)] peer-valid:-top-6 peer-valid:text-[10px] peer-valid:text-stone-400 pointer-events-none">Detailed Inquiry Description</label>
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit" 
                      className="w-full border border-[var(--tarius-champagne)] text-[var(--tarius-champagne)] py-4 mt-6 font-sans text-xs tracking-[0.15em] uppercase hover:bg-[var(--tarius-champagne)] hover:text-[var(--tarius-graphite)] transition-all duration-300 cursor-pointer shadow-lg"
                    >
                      Submit Application
                    </button>

                  </div>
                )}

              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}