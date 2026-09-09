// Filename: src/components/products/TrackedLink.tsx

'use client';

import React from 'react';
import { supabase } from '@/lib/api';

interface TrackedLinkProps {
  productId: string;
  productName: string;
  storeName: string;
  url: string;
}

export default function TrackedLink({ productId, productName, storeName, url }: TrackedLinkProps) {
  
  const handleOutboundClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    // We do NOT use e.preventDefault() because we want the link to open normally in a new tab.
    // We just quietly fire off the tracking event to Supabase in the background.
    
    try {
      await supabase.from('LinkClickEvent').insert([
        {
          productId: productId,
          productName: productName,
          storeName: storeName,
          url: url
        }
      ]);
    } catch (error) {
      console.error("Tracking failed silently:", error);
    }
  };

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      onClick={handleOutboundClick}
      className="btn-tarius flex-1 text-center hover:bg-[var(--tarius-olive)] hover:border-[var(--tarius-olive)] hover:text-white"
    >
      Reserve on {storeName}
    </a>
  );
}