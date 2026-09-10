// Filename: src/app/admin/certifications/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';
import { createBrowserClient } from '@supabase/ssr';
import { generatePDFThumbnail } from '@/lib/pdfHelper';

interface Certification {
  id: string;
  title: string;
  description: string;
  templateType: string;
  pdfUrl: string | null;
  thumbnailUrl: string | null;
  displayOrder: number;
  isPublished: boolean;
}

export default function AdminCertifications() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Editor State
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Certification>>({});
  
  // File Upload State
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // --- NEW: PAGE SETTINGS STATE ---
  const [isEditingSettings, setIsEditingSettings] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [pageSettings, setPageSettings] = useState<any>({
    heroEyebrow: 'Absolute Transparency',
    heroTitle: 'Certifications & Labs.',
    heroDescription: 'We believe uncompromising quality requires irrefutable proof...',
    titleSize: 'text-7xl',
    spotlightLabel: 'Official Filing',
    gridTitle: 'Laboratory Analysis',
    gridSubtitle: 'Product-Specific Documentation',
    ledgerTitle: 'Supplementary Ledger',
    ledgerSubtitle: 'Historical & Supporting Filings'
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    
    // 1. Fetch the documents
    const { data: certData } = await supabase
      .from('Certification')
      .select('*')
      .order('displayOrder', { ascending: true })
      .order('createdAt', { ascending: false });

    if (certData) setCertifications(certData);

    // 2. Fetch the Global Page Settings
    const { data: settingsData } = await supabase
      .from('SiteSettings')
      .select('*')
      .eq('key', 'certifications_page')
      .single();

    if (settingsData && settingsData.value) {
      setPageSettings(settingsData.value);
    }

    setLoading(false);
  };

  // --- PAGE SETTINGS LOGIC ---
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPageSettings((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    const supabaseAuth = createBrowserClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] as string,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string
    );

    const { error } = await supabaseAuth
      .from('SiteSettings')
      .update({ value: pageSettings, updatedAt: new Date().toISOString() })
      .eq('key', 'certifications_page');

    if (error) {
      alert("Failed to save settings.");
    } else {
      setIsEditingSettings(false);
      fetchAllData();
    }
    setIsSavingSettings(false);
  };


  // --- DOCUMENT LOGIC ---
  const handleAddNew = () => {
    setEditingId(null);
    setIsAdding(true);
    setIsEditingSettings(false);
    setPdfFile(null);
    setThumbnailBlob(null);
    setThumbnailPreview(null);
    
    setFormData({
      id: "cert_" + Math.random().toString(36).substr(2, 9),
      title: '',
      description: '',
      templateType: 'grid',
      pdfUrl: '',
      thumbnailUrl: '',
      displayOrder: certifications.length,
      isPublished: false,
    });
  };

  const handleEdit = (cert: Certification) => {
    setIsAdding(false);
    setIsEditingSettings(false);
    setEditingId(cert.id);
    setPdfFile(null);
    setThumbnailBlob(null);
    setThumbnailPreview(cert.thumbnailUrl);
    setFormData(cert);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTogglePublish = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isPublished: e.target.checked }));
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Strictly PDF files are allowed for certifications.');
      return;
    }

    setIsProcessingPdf(true);
    setPdfFile(file);

    const generatedImageBlob = await generatePDFThumbnail(file);
    
    if (generatedImageBlob) {
      setThumbnailBlob(generatedImageBlob);
      setThumbnailPreview(URL.createObjectURL(generatedImageBlob));
    } else {
      alert("Warning: Could not auto-generate thumbnail. A default icon will be used.");
    }

    setIsProcessingPdf(false);
  };

  const handleSave = async () => {
    if (!formData.title) {
      alert("A title is required.");
      return;
    }

    setIsSaving(true);
    
    const supabaseAuth = createBrowserClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] as string,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string
    );

    let finalPdfUrl = formData.pdfUrl;
    let finalThumbnailUrl = formData.thumbnailUrl;

    if (pdfFile) {
      const pdfName = "doc_" + Date.now() + ".pdf";
      const { error: pdfError } = await supabaseAuth.storage
        .from('documents')
        .upload(pdfName, pdfFile);
        
      if (!pdfError) {
        finalPdfUrl = supabaseAuth.storage.from('documents').getPublicUrl(pdfName).data.publicUrl;
      }
    }

    if (thumbnailBlob) {
      const thumbName = "thumb_" + Date.now() + ".jpg";
      const { error: thumbError } = await supabaseAuth.storage
        .from('documents')
        .upload(thumbName, thumbnailBlob);
        
      if (!thumbError) {
        finalThumbnailUrl = supabaseAuth.storage.from('documents').getPublicUrl(thumbName).data.publicUrl;
      }
    }

    const payload = {
      ...formData,
      pdfUrl: finalPdfUrl,
      thumbnailUrl: finalThumbnailUrl,
    };

    if (isAdding) {
      await supabaseAuth.from('Certification').insert([payload]);
    } else if (editingId) {
      await supabaseAuth.from('Certification').update(payload).eq('id', editingId);
    }

    setIsSaving(false);
    handleCancel();
    fetchAllData();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this certification? This action is permanent.")) return;
    
    const supabaseAuth = createBrowserClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] as string,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string
    );
    await supabaseAuth.from('Certification').delete().eq('id', id);
    handleCancel();
    fetchAllData();
  };

  // --- NEW: GLOBAL SETTINGS RENDERER ---
  const renderPageSettings = () => (
    <div className="bg-white border border-[var(--tarius-border)] shadow-xl overflow-hidden mt-6 animate-in fade-in duration-500 rounded-sm">
      <div className="bg-[var(--tarius-graphite)] px-8 py-5 flex items-center justify-between border-b border-[var(--tarius-border)]">
        <span className="text-xs uppercase tracking-[0.2em] text-[var(--tarius-champagne)]">Global Page Configurator</span>
        <button onClick={() => setIsEditingSettings(false)} className="text-stone-400 hover:text-white transition-colors text-xs uppercase tracking-widest">Close</button>
      </div>
      
      <div className="p-8 md:p-12 bg-stone-50 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column: Hero Section */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">Hero Section</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Hero Eyebrow Text</label>
            <input type="text" name="heroEyebrow" value={pageSettings.heroEyebrow || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Main Hero Title</label>
            <input type="text" name="heroTitle" value={pageSettings.heroTitle || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]" />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Hero Title Size Scale</label>
            <select name="titleSize" value={pageSettings.titleSize || 'text-7xl'} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]">
              <option value="text-5xl">Large (5xl)</option>
              <option value="text-6xl">Very Large (6xl)</option>
              <option value="text-7xl">Massive (7xl)</option>
              <option value="text-8xl">Colossal (8xl)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Hero Subtitle / Description</label>
            <textarea name="heroDescription" rows={4} value={pageSettings.heroDescription || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)] resize-none" />
          </div>
        </div>

        {/* Right Column: Section Labels */}
        <div className="space-y-6">
          <h3 className="font-display text-2xl text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">Section Labels</h3>
          
          <div className="space-y-2">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Spotlight Tag (Hero Documents)</label>
            <input type="text" name="spotlightLabel" value={pageSettings.spotlightLabel || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]" />
          </div>

          <div className="space-y-2 mt-8">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Grid Title</label>
            <input type="text" name="gridTitle" value={pageSettings.gridTitle || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]" />
            <input type="text" name="gridSubtitle" value={pageSettings.gridSubtitle || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-xs text-stone-500 mt-2 focus:outline-none focus:border-[var(--tarius-olive)]" placeholder="Grid Subtitle..." />
          </div>

          <div className="space-y-2 mt-8">
            <label className="text-[10px] uppercase tracking-widest text-stone-500">Ledger Title</label>
            <input type="text" name="ledgerTitle" value={pageSettings.ledgerTitle || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-sm text-[var(--tarius-graphite)] focus:outline-none focus:border-[var(--tarius-olive)]" />
            <input type="text" name="ledgerSubtitle" value={pageSettings.ledgerSubtitle || ''} onChange={handleSettingsChange} className="w-full bg-white border border-[var(--tarius-border)] p-3 text-xs text-stone-500 mt-2 focus:outline-none focus:border-[var(--tarius-olive)]" placeholder="Ledger Subtitle..." />
          </div>
        </div>
      </div>

      <div className="bg-white border-t border-[var(--tarius-border)] p-6 flex justify-end gap-4">
        <button onClick={() => setIsEditingSettings(false)} className="px-8 py-3 text-[10px] uppercase tracking-widest text-stone-500 hover:text-[var(--tarius-graphite)] transition-colors">Discard</button>
        <button onClick={handleSaveSettings} disabled={isSavingSettings} className="px-8 py-3 bg-[var(--tarius-graphite)] text-[var(--tarius-champagne)] text-[10px] uppercase tracking-widest hover:bg-[var(--tarius-olive)] hover:text-white transition-all disabled:opacity-50">
          {isSavingSettings ? 'Saving...' : 'Deploy Global Changes'}
        </button>
      </div>
    </div>
  );

  // --- DOCUMENT CANVAS RENDERER (YOUR PREFERRED STYLE) ---
  const renderCanvas = () => {
    const isSpotlight = formData.templateType === 'spotlight';
    const isGrid = formData.templateType === 'grid';
    const isLedger = formData.templateType === 'ledger';

    return (
      <div className="bg-white border border-[var(--tarius-border)] shadow-2xl overflow-hidden mt-6 animate-in fade-in zoom-in-95 duration-500 rounded-sm">
        
        {/* Editor Toolbar */}
        <div className="bg-[var(--tarius-graphite)] px-6 py-4 flex items-center justify-between border-b border-[var(--tarius-border)]">
          <div className="flex items-center gap-4">
            <span className="text-[10px] uppercase tracking-widest text-[var(--tarius-champagne)]">Canvas Mode</span>
            <select
              name="templateType"
              value={formData.templateType || 'grid'}
              onChange={handleInputChange}
              className="bg-transparent border border-[var(--tarius-champagne)]/30 text-white text-xs px-3 py-1 focus:outline-none focus:border-[var(--tarius-champagne)]"
            >
              <option value="spotlight" className="text-black">Template A: Spotlight (Hero)</option>
              <option value="grid" className="text-black">Template B: Dossier Grid (Card)</option>
              <option value="ledger" className="text-black">Template C: Ledger (Minimal)</option>
            </select>
          </div>
          
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-[10px] uppercase tracking-widest text-stone-400">Live Status:</span>
            <div className="relative">
              <input type="checkbox" checked={formData.isPublished || false} onChange={handleTogglePublish} className="sr-only peer" />
              <div className="w-10 h-5 bg-stone-600 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[var(--tarius-olive)]"></div>
            </div>
            <span className={"text-[10px] uppercase tracking-widest font-bold " + (formData.isPublished ? "text-[var(--tarius-olive)]" : "text-stone-400")}>
              {formData.isPublished ? 'Published' : 'Draft'}
            </span>
          </label>
        </div>

        {/* The Live Visual Builder Area */}
        <div className="p-8 md:p-12 bg-[var(--tarius-ivory)] relative min-h-[400px]">
          
          {/* Template A: Spotlight */}
          {isSpotlight && (
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="w-full md:w-1/2 flex flex-col items-center justify-center text-center">
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="CERTIFICATION TITLE..."
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] font-display text-4xl text-[var(--tarius-graphite)] text-center py-2 focus:outline-none transition-colors mb-6 placeholder-stone-300"
                />
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Enter a detailed description of the certification criteria and meaning..."
                  rows={4}
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] text-stone-600 text-center py-2 focus:outline-none transition-colors resize-none placeholder-stone-300 leading-relaxed"
                />
              </div>
              <div className="w-full md:w-1/2 relative bg-white border border-[var(--tarius-border)] h-[400px] flex items-center justify-center overflow-hidden group shadow-lg">
                
                {/* PDF Dropzone inside Canvas */}
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="bg-white text-[var(--tarius-graphite)] text-[10px] uppercase tracking-widest px-4 py-2 border border-[var(--tarius-border)] hover:bg-[var(--tarius-olive)] hover:text-white transition-colors">Replace PDF</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 bg-black/5 hover:bg-black/10 transition-colors text-center">
                    {isProcessingPdf ? (
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin mb-2"></div>
                    ) : (
                      <>
                        <svg className="text-stone-400 w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--tarius-graphite)]">Drop PDF Here</span>
                      </>
                    )}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                )}
                
              </div>
            </div>
          )}

          {/* Template B: Dossier Grid */}
          {isGrid && (
            <div className="max-w-sm mx-auto bg-white border border-[var(--tarius-border)] shadow-md overflow-hidden group">
              <div className="h-[250px] bg-[var(--tarius-ivory-deep)] relative flex items-center justify-center border-b border-[var(--tarius-border)]">
                 
                 {/* PDF Dropzone inside Canvas */}
                 {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Preview" className="w-full h-full object-cover opacity-90 mix-blend-multiply" />
                    <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <span className="bg-white text-[var(--tarius-graphite)] text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-[var(--tarius-olive)] hover:text-white transition-colors">Replace PDF</span>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 bg-black/5 hover:bg-black/10 transition-colors text-center">
                    {isProcessingPdf ? (
                      <div className="w-8 h-8 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin mb-2"></div>
                    ) : (
                      <>
                        <svg className="text-stone-400 w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <span className="text-[10px] uppercase tracking-widest text-[var(--tarius-graphite)]">Drop PDF</span>
                      </>
                    )}
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                )}

              </div>
              <div className="p-6">
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="Document Title"
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] font-display text-2xl text-[var(--tarius-graphite)] py-1 focus:outline-none transition-colors mb-3 placeholder-stone-300"
                />
                <textarea
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Brief document notes..."
                  rows={2}
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] text-sm text-stone-500 py-1 focus:outline-none transition-colors resize-none placeholder-stone-300"
                />
                <div className="mt-4 pt-4 border-t border-[var(--tarius-border)] text-[10px] uppercase tracking-widest text-[var(--tarius-olive)] text-center">
                  Mock Button: View Document
                </div>
              </div>
            </div>
          )}

          {/* Template C: Ledger */}
          {isLedger && (
            <div className="max-w-3xl mx-auto bg-white border border-[var(--tarius-border)] flex items-center justify-between p-6">
              <div className="flex-1 pr-8">
                <input
                  type="text"
                  name="title"
                  value={formData.title || ''}
                  onChange={handleInputChange}
                  placeholder="Regulatory Filing Name"
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] font-medium text-[var(--tarius-graphite)] py-1 focus:outline-none transition-colors placeholder-stone-300"
                />
                <input
                  type="text"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Date / Reference Number..."
                  className="w-full bg-transparent border-b border-transparent hover:border-[var(--tarius-border)] focus:border-[var(--tarius-olive)] text-xs text-stone-500 py-1 focus:outline-none transition-colors mt-1 placeholder-stone-300"
                />
              </div>
              <div className="w-[100px] shrink-0 border-l border-[var(--tarius-border)] pl-6 flex flex-col items-center gap-2 group relative">
                
                {/* PDF Dropzone inside Canvas */}
                {thumbnailPreview ? (
                  <>
                    <img src={thumbnailPreview} alt="Preview" className="w-10 h-14 object-cover opacity-90 mix-blend-multiply" />
                    <label className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <svg className="w-4 h-4 text-[var(--tarius-graphite)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                      <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                    </label>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center p-2 bg-black/5 hover:bg-black/10 transition-colors text-center">
                    {isProcessingPdf ? (
                      <div className="w-4 h-4 rounded-full border border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin mb-1"></div>
                    ) : (
                      <svg className="text-stone-400 w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    )}
                    <span className="text-[8px] uppercase tracking-widest text-stone-500">PDF</span>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
                  </label>
                )}

              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-stone-50 border-t border-[var(--tarius-border)] flex items-center justify-between">
          <div>
            {!isAdding && formData.id && (
              <button onClick={() => handleDelete(formData.id as string)} className="text-[10px] uppercase tracking-widest text-red-600 hover:underline">
                Delete Document
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-3 mr-4">
              <label className="text-[10px] uppercase tracking-widest text-stone-500">Sort Priority:</label>
              <input 
                type="number" 
                name="displayOrder" 
                value={formData.displayOrder || 0} 
                onChange={handleInputChange} 
                className="w-16 bg-white border border-[var(--tarius-border)] px-2 py-1 text-xs focus:outline-none focus:border-[var(--tarius-olive)]" 
              />
            </div>
            <button onClick={handleCancel} className="px-6 py-3 text-[10px] uppercase tracking-widest text-stone-500 hover:text-[var(--tarius-graphite)] transition-colors">
              Cancel
            </button>
            <button onClick={handleSave} disabled={isSaving || isProcessingPdf} className="px-8 py-3 bg-[var(--tarius-graphite)] text-[var(--tarius-champagne)] text-[10px] uppercase tracking-widest hover:bg-[var(--tarius-olive)] hover:text-white transition-all disabled:opacity-50 shadow-sm rounded-sm">
              {isSaving ? 'Saving...' : 'Deploy to Site'}
            </button>
          </div>
        </div>

      </div>
    );
  };

  return (
    <div className="pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-olive)] mb-3">
            Content Management System
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--tarius-graphite)]">
            Certifications Engine
          </h1>
        </div>

        {!isAdding && !editingId && !isEditingSettings && (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditingSettings(true)}
              className="px-6 py-3 border border-[var(--tarius-border)] bg-white text-[10px] uppercase tracking-widest text-[var(--tarius-graphite)] hover:bg-[var(--tarius-ivory)] transition-all rounded-sm shadow-sm"
            >
              Configure Page Text
            </button>
            <button
              onClick={handleAddNew}
              className="px-6 py-3 border border-[var(--tarius-olive)] bg-[var(--tarius-olive)] text-[10px] uppercase tracking-widest text-white hover:bg-transparent hover:text-[var(--tarius-olive)] transition-all rounded-sm shadow-sm flex items-center gap-2"
            >
              + Add New Canvas Block
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-3 text-stone-500 text-xs uppercase tracking-widest">
          <div className="w-4 h-4 rounded-full border border-stone-300 border-t-stone-600 animate-spin"></div>
          Loading CMS...
        </div>
      ) : (
        <>
          {isEditingSettings ? (
            renderPageSettings()
          ) : (isAdding || editingId) ? (
            renderCanvas()
          ) : (
            <div className="space-y-4">
              {certifications.length === 0 ? (
                <div className="bg-white border border-[var(--tarius-border)] p-12 text-center rounded-sm">
                  <p className="text-stone-500 font-light text-sm">Your certification portfolio is currently empty.</p>
                </div>
              ) : (
                certifications.map((cert) => (
                  <div key={cert.id} className="bg-white border border-[var(--tarius-border)] p-4 flex items-center justify-between group hover:border-[var(--tarius-olive)] transition-colors rounded-sm shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[var(--tarius-ivory)] border border-[var(--tarius-border)] rounded-sm overflow-hidden flex items-center justify-center shrink-0">
                        {cert.thumbnailUrl ? (
                          <img src={cert.thumbnailUrl} alt="thumb" className="w-full h-full object-cover" />
                        ) : (
                          <svg className="w-4 h-4 text-stone-300" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"></path></svg>
                        )}
                      </div>
                      <div>
                        <h4 className="text-[var(--tarius-graphite)] font-medium text-sm">{cert.title || 'Untitled Document'}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-[9px] uppercase tracking-widest text-stone-500 border border-stone-200 px-2 py-0.5 rounded-sm">
                            {cert.templateType} Layout
                          </span>
                          <span className={"text-[9px] uppercase tracking-widest font-bold " + (cert.isPublished ? "text-emerald-600" : "text-amber-600")}>
                            {cert.isPublished ? 'Live' : 'Draft'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => handleEdit(cert)} className="px-4 py-2 border border-transparent text-[var(--tarius-graphite)] text-[10px] uppercase tracking-widest group-hover:border-[var(--tarius-olive)] transition-all rounded-sm">
                      Open Canvas
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}