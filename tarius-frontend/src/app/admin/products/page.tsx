// Filename: src/app/admin/products/page.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/api';

interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  price: string | null;
  description: string;
  notes: string | null;
  image: string | null;
  amazonLink: string | null;
  flipkartLink: string | null;
  accentColor: string | null;
  isPublished: boolean;
  category: string | null;
  inventory: number | null;
  weight: string | null;
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('Product')
      .select('*')
      .order('createdAt', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const handleEditClick = (product: Product) => {
    setIsAdding(false);
    setEditingId(product.id);
    setFormData(product);
  };

  const handleAddClick = () => {
    setEditingId(null);
    setIsAdding(true);
    setFormData({
      id: `prod_${Math.random().toString(36).substr(2, 9)}`,
      name: '',
      subtitle: '',
      price: '',
      description: '',
      notes: '',
      image: '',
      amazonLink: '',
      flipkartLink: '',
      accentColor: '#c8b99a',
      isPublished: false,
      category: '',
      inventory: 0,
      weight: '',
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }));
  };

  const handleTogglePublish = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      isPublished: e.target.checked,
    }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);

    if (isAdding) {
      const { error } = await supabase
        .from('Product')
        .insert([{ ...formData, slug: formData.name?.toLowerCase().replace(/\s+/g, '-') }]);
      
      if (error) {
        console.error('Error creating product:', error);
        alert('Failed to create product.');
      }
    } else if (editingId) {
      const { error } = await supabase
        .from('Product')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product.');
      }
    }

    setIsSaving(false);
    setEditingId(null);
    setIsAdding(false);
    setFormData({});
    await fetchProducts();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this formulation? This cannot be undone.')) {
      return;
    }
    
    setIsDeleting(true);
    const { error } = await supabase.from('Product').delete().eq('id', id);
    setIsDeleting(false);

    if (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product.');
    } else {
      setEditingId(null);
      await fetchProducts();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          <div className="w-10 h-10 rounded-full border-2 border-[var(--tarius-border)] border-t-[var(--tarius-olive)] animate-spin" />
          <p className="text-[10px] uppercase tracking-[0.25em] text-[var(--tarius-graphite)]">
            Loading Inventory...
          </p>
        </div>
      </div>
    );
  }

  const renderForm = () => (
    <form onSubmit={handleSave} className="p-8 md:p-10 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6 mb-10 border-b border-[var(--tarius-border)] pb-6">
        <div>
          <h3 className="font-display text-3xl text-[var(--tarius-olive)]">
            {isAdding ? 'Create New Formulation' : 'Edit Formulation'}
          </h3>
          {!isAdding && formData.id && (
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-2">
              ID: {formData.id}
            </p>
          )}
        </div>

        <label className="flex items-center gap-4 cursor-pointer group">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 group-hover:text-[var(--tarius-graphite)] transition-colors">
            Published Status
          </span>
          <div className="relative">
            <input
              type="checkbox"
              checked={formData.isPublished || false}
              onChange={handleTogglePublish}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-stone-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white peer-checked:after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--tarius-olive)] border border-[var(--tarius-border)]" />
          </div>
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 mb-10">
        <div className="space-y-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">General Specifications</p>
          
          <div className="relative group">
            <input
              type="text"
              name="name"
              required
              value={formData.name || ''}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
              placeholder="Formulation Name"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Formulation Name
            </label>
          </div>

          <div className="relative group">
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle || ''}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
              placeholder="Subtitle"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Subtitle
            </label>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="relative group">
              <input
                type="text"
                name="category"
                value={formData.category || ''}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
                placeholder="Category"
              />
              <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                Category
              </label>
            </div>
            
            <div className="relative group">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    name="accentColor"
                    value={formData.accentColor || ''}
                    onChange={handleInputChange}
                    className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
                    placeholder="Accent Color"
                  />
                  <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                    Accent Color
                  </label>
                </div>
                <div
                  className="w-8 h-8 rounded-full border border-[var(--tarius-border)] shadow-sm shrink-0"
                  style={{ backgroundColor: formData.accentColor || 'transparent' }}
                />
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <input
              type="url"
              name="image"
              value={formData.image || ''}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
              placeholder="Media Image URL"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Media Image URL
            </label>
          </div>
        </div>

        <div className="space-y-8">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--tarius-olive)] border-b border-[var(--tarius-border)] pb-2">Logistics & E-Commerce</p>
          
          <div className="grid grid-cols-3 gap-6">
            <div className="relative group">
              <input
                type="text"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
                placeholder="Price"
              />
              <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                Price
              </label>
            </div>
            
            <div className="relative group">
              <input
                type="text"
                name="weight"
                value={formData.weight || ''}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
                placeholder="Weight"
              />
              <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                Weight
              </label>
            </div>
            
            <div className="relative group">
              <input
                type="number"
                name="inventory"
                value={formData.inventory === null ? '' : formData.inventory}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
                placeholder="Stock"
              />
              <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
                Stock Count
              </label>
            </div>
          </div>

          <div className="relative group">
            <input
              type="url"
              name="amazonLink"
              value={formData.amazonLink || ''}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
              placeholder="Amazon Partner Link"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Amazon Partner Link
            </label>
          </div>

          <div className="relative group">
            <input
              type="url"
              name="flipkartLink"
              value={formData.flipkartLink || ''}
              onChange={handleInputChange}
              className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent"
              placeholder="Flipkart Partner Link"
            />
            <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-4 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
              Flipkart Partner Link
            </label>
          </div>
        </div>
      </div>

      <div className="space-y-8 mb-10">
        <div className="relative group">
          <textarea
            name="description"
            rows={4}
            required
            value={formData.description || ''}
            onChange={handleInputChange}
            className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent resize-none leading-relaxed"
            placeholder="Detailed Description"
          />
          <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-6 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
            Detailed Description
          </label>
        </div>
        
        <div className="relative group">
          <textarea
            name="notes"
            rows={2}
            value={formData.notes || ''}
            onChange={handleInputChange}
            className="w-full bg-transparent border-b border-[var(--tarius-border)] py-3 text-[var(--tarius-graphite)] text-sm focus:outline-none focus:border-[var(--tarius-olive)] transition-colors peer placeholder-transparent resize-none leading-relaxed"
            placeholder="Internal / Additional Notes"
          />
          <label className="absolute left-0 top-3 text-stone-500 text-[10px] uppercase tracking-widest transition-all peer-focus:-top-6 peer-focus:text-[10px] peer-focus:text-[var(--tarius-olive)] peer-valid:-top-6 peer-valid:text-[10px] peer-valid:text-stone-500 pointer-events-none">
            Internal / Additional Notes
          </label>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-[var(--tarius-border)]">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            type="submit"
            disabled={isSaving}
            className="px-8 py-4 bg-white border border-[var(--tarius-olive)] text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest hover:bg-[var(--tarius-olive)] hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm rounded-sm"
          >
            {isSaving ? 'Committing...' : (isAdding ? 'Publish Formulation' : 'Save Dossier')}
          </button>
          <button
            type="button"
            onClick={handleCancelEdit}
            className="px-8 py-4 text-stone-500 text-[10px] uppercase tracking-widest hover:text-[var(--tarius-graphite)] transition-colors"
          >
            Cancel
          </button>
        </div>

        {!isAdding && formData.id && (
          <button
            type="button"
            onClick={() => handleDelete(formData.id as string)}
            disabled={isDeleting}
            className="w-full sm:w-auto px-6 py-4 text-red-600/70 text-[10px] uppercase tracking-widest hover:text-red-600 transition-colors"
          >
            {isDeleting ? 'Removing...' : 'Delete Formulation'}
          </button>
        )}
      </div>
    </form>
  );

  return (
    <div className="text-[var(--tarius-graphite)] pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--tarius-olive)] mb-3">
            Inventory Management
          </p>
          <h1 className="font-display text-4xl md:text-5xl text-[var(--tarius-graphite)]">
            Product Matrix
          </h1>
        </div>

        {!isAdding && (
          <button
            type="button"
            onClick={handleAddClick}
            className="px-6 py-3 border border-[var(--tarius-olive)] bg-[var(--tarius-olive)] text-[10px] uppercase tracking-widest text-white hover:bg-transparent hover:text-[var(--tarius-olive)] transition-all rounded-sm shadow-sm"
          >
            + Add New Formulation
          </button>
        )}
      </div>

      <div className="grid gap-6">
        {isAdding && (
          <div className="border border-[var(--tarius-olive)] bg-[var(--tarius-ivory-deep)] shadow-[0_10px_40px_rgba(31,33,28,0.08)] rounded-sm mb-8">
            {renderForm()}
          </div>
        )}

        {!isAdding && products.length === 0 ? (
          <div className="border border-[var(--tarius-border)] bg-white p-12 text-center rounded-sm">
            <p className="text-sm text-stone-500">
              No formulations found. Click "Add New Formulation" to begin.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              className={`border transition-all duration-700 overflow-hidden relative rounded-sm ${
                editingId === product.id
                  ? 'border-[var(--tarius-olive)] bg-[var(--tarius-ivory-deep)] shadow-[0_10px_40px_rgba(31,33,28,0.08)]'
                  : 'border-[var(--tarius-border)] bg-white hover:border-[var(--tarius-olive)]/40 shadow-sm'
              }`}
            >
              {editingId !== product.id && (
                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div
                      className="w-14 h-14 shrink-0 rounded-full shadow-md border border-[var(--tarius-border)]"
                      style={{
                        backgroundColor: product.accentColor || 'var(--tarius-champagne)',
                      }}
                    />
                    <div>
                      <h3 className="font-display text-2xl text-[var(--tarius-graphite)]">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-[var(--tarius-graphite-soft)] font-light tracking-wide">
                          {product.subtitle}
                        </p>
                        {product.price && (
                          <>
                            <span className="text-[var(--tarius-border)]">•</span>
                            <p className="text-[10px] font-medium text-[var(--tarius-olive)]">{product.price}</p>
                          </>
                        )}
                        {product.inventory !== null && (
                          <>
                            <span className="text-[var(--tarius-border)]">•</span>
                            <p className="text-[10px] text-stone-500">Stock: {product.inventory}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 self-start md:self-auto">
                    <div className="flex items-center gap-3 bg-[var(--tarius-ivory)] px-4 py-2 rounded-full border border-[var(--tarius-border)]">
                      <span
                        className={`w-2 h-2 rounded-full shadow-sm ${
                          product.isPublished
                            ? 'bg-emerald-500 shadow-emerald-500/40'
                            : 'bg-stone-300'
                        }`}
                      />
                      <span className="text-[10px] uppercase tracking-widest text-[var(--tarius-graphite)] font-medium">
                        {product.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <button
                      onClick={() => handleEditClick(product)}
                      className="px-5 py-2 border border-[var(--tarius-olive)] text-[var(--tarius-olive)] text-[10px] uppercase tracking-widest rounded-sm hover:bg-[var(--tarius-olive)] hover:text-white transition-colors"
                    >
                      Edit Dossier
                    </button>
                  </div>
                </div>
              )}

              {editingId === product.id && renderForm()}
            </div>
          ))
        )}
      </div>
    </div>
  );
}