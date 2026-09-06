// Filename: src/app/admin/inquiries/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  preferredContact: string;
  tier: string;
  deliveryInstructions: string | null;
  status: string;
  createdAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Inquiry>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Inquiry')
      .select('*')
      .order('createdAt', { ascending: false });

    if (error) {
      console.error('Error fetching inquiries:', error);
    } else {
      setInquiries(data || []);
    }
    setLoading(false);
  };

  const handleViewClick = (inquiry: Inquiry) => {
    setViewingId(inquiry.id);
    setFormData(inquiry);
  };

  const handleCloseView = () => {
    setViewingId(null);
    setFormData({});
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      status: e.target.value,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!viewingId) return;

    setIsSaving(true);
    const { error } = await supabase
      .from('Inquiry')
      .update({ status: formData.status })
      .eq('id', viewingId);

    setIsSaving(false);

    if (error) {
      console.error('Error updating inquiry status:', error);
      alert('Failed to update status.');
    } else {
      setViewingId(null);
      setFormData({});
      await fetchInquiries();
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this dossier? This cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    const { error } = await supabase.from('Inquiry').delete().eq('id', id);
    setIsDeleting(false);

    if (error) {
      console.error('Error deleting inquiry:', error);
      alert('Failed to delete inquiry.');
    } else {
      setViewingId(null);
      await fetchInquiries();
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'contacted':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'allocated':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'archived':
        return 'bg-stone-100 text-stone-600 border-stone-200';
      default:
        return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--tarius-graphite)]">
            Retrieving Dossiers...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-[var(--tarius-graphite)] pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-olive)] mb-3">
            Private Concierge
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--tarius-graphite)]">
            Client Dossiers
          </h1>
        </div>
      </div>

      <div className="grid gap-6">
        {inquiries.length === 0 ? (
          <div className="border border-[var(--tarius-border)] bg-white p-12 text-center rounded-sm">
            <p className="text-sm text-stone-500">
              No private allocations requested yet.
            </p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className={`border transition-all duration-700 overflow-hidden relative rounded-sm ${
                viewingId === inquiry.id
                  ? 'border-[var(--tarius-olive)] bg-[var(--tarius-ivory-deep)] shadow-[0_10px_40px_rgba(31,33,28,0.08)]'
                  : 'border-[var(--tarius-border)] bg-white hover:border-[var(--tarius-olive)]/40 shadow-sm'
              }`}
            >
              {viewingId !== inquiry.id && (
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6 max-w-2xl">
                    <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[var(--tarius-ivory)] border border-[var(--tarius-border)] rounded-full">
                      <span className="font-display text-lg text-[var(--tarius-olive)] uppercase">
                        {inquiry.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-display text-xl md:text-2xl text-[var(--tarius-graphite)] line-clamp-1">
                        {inquiry.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-[var(--tarius-graphite-soft)] font-light tracking-wide line-clamp-1">
                          {inquiry.tier}
                        </p>
                        <span className="text-[var(--tarius-border)] hidden sm:inline">•</span>
                        <p className="text-[10px] font-medium text-[var(--tarius-olive)] hidden sm:inline">
                          {new Date(inquiry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 self-start md:self-auto shrink-0">
                    <div className={`px-4 py-1.5 rounded-full border text-[10px] uppercase tracking-widest font-medium ${getStatusStyle(inquiry.status)}`}>
                      {inquiry.status}
                    </div>

                    <button
                      onClick={() => handleViewClick(inquiry)}
                      className="px-5 py-2 border border-[var(--tarius-olive)] text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest rounded-sm hover:bg-[var(--tarius-olive)] hover:text-white transition-colors"
                    >
                      Review Dossier
                    </button>
                  </div>
                </div>
              )}

              {viewingId === inquiry.id && (
                <form
                  onSubmit={handleSave}
                  className="p-8 md:p-10 animate-in fade-in slide-in-from-top-4 duration-500"
                >
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10 border-b border-[var(--tarius-border)] pb-6">
                    <div>
                      <h3 className="font-display text-3xl text-[var(--tarius-olive)]">
                        Review Dossier
                      </h3>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-2">
                        Received: {new Date(formData.createdAt as string).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col relative group min-w-[200px]">
                      <label className="text-[10px] uppercase tracking-widest text-stone-500 mb-2">
                        Concierge Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleStatusChange}
                        className="w-full bg-transparent border-b border-[var(--tarius-border)] py-2 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors appearance-none cursor-pointer"
                      >
                        <option value="pending">Pending Review</option>
                        <option value="contacted">Client Contacted</option>
                        <option value="allocated">Allocation Secured</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 mb-10">
                    <div className="space-y-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">Client Details</p>
                      
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Full Name</p>
                        <p className="text-sm font-medium">{formData.name}</p>
                      </div>
                      
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Secure Email</p>
                        <p className="text-sm font-medium">{formData.email}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Preferred Method of Contact</p>
                        <p className="text-sm font-medium capitalize">{formData.preferredContact}</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">Request Information</p>
                      
                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Nature of Inquiry</p>
                        <p className="text-sm font-medium capitalize">{formData.tier}</p>
                      </div>

                      <div>
                        <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-2">Custom Message / Notes</p>
                        <div className="bg-white/50 border border-[var(--tarius-border)] rounded-sm p-4 text-sm leading-relaxed min-h-[100px]">
                          {formData.deliveryInstructions || <span className="text-stone-400 italic">No additional notes provided.</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--tarius-border)]">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-8 py-4 bg-white border border-[var(--tarius-olive)] text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest hover:bg-[var(--tarius-olive)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-sm"
                      >
                        {isSaving ? 'Updating...' : 'Update Status'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCloseView}
                        className="px-8 py-4 text-stone-500 text-[10px] uppercase tracking-widest hover:text-[var(--tarius-graphite)] transition-colors"
                      >
                        Close Dossier
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDelete(formData.id as string)}
                      disabled={isDeleting}
                      className="w-full sm:w-auto px-6 py-4 text-red-600/70 text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors"
                    >
                      {isDeleting ? 'Erasing...' : 'Erase Dossier'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}