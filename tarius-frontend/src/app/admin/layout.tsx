// Filename: src/app/admin/layout.tsx

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Product Matrix', href: '/admin/products' },
    { name: 'Knowledge Base', href: '/admin/faqs' },
    { name: 'Private Concierge', href: '/admin/inquiries' },
  ];

  return (
    <div className="flex min-h-[calc(100vh-76px)] pt-[76px] bg-[var(--tarius-ivory)] font-body selection:bg-[var(--tarius-olive)] selection:text-white">
      <aside className="w-64 border-r border-[var(--tarius-border)] bg-[var(--tarius-ivory-deep)] flex flex-col fixed top-[76px] h-[calc(100vh-76px)] z-20 shadow-xl">
        <div className="p-8 border-b border-[var(--tarius-border)]">
          <Link
            href="/admin/products"
            className="font-display text-2xl tracking-[0.15em] text-[var(--tarius-graphite)] block hover:text-[var(--tarius-olive)] transition-colors"
          >
            TARIUS
          </Link>
          <p className="text-eyebrow text-[var(--tarius-olive)] mt-2">
            Admin Sanctuary
          </p>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname && pathname.startsWith(item.href + '/'));

            return (
              <Link
                key={item.name}
                href={item.href}
                className={"px-4 py-3 text-xs tracking-widest uppercase rounded-md transition-all flex items-center gap-3 group border " + (isActive ? "text-[var(--tarius-graphite)] bg-white shadow-sm border-[var(--tarius-border)]" : "text-stone-500 hover:text-[var(--tarius-graphite)] hover:bg-white/50 border-transparent")}
              >
                <span
                  className={"w-1.5 h-1.5 rounded-full transition-all " + (isActive ? "bg-[var(--tarius-olive)] shadow-[0_0_8px_var(--tarius-olive)]" : "bg-stone-300 group-hover:bg-[var(--tarius-olive)]")}
                ></span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-[var(--tarius-border)] bg-black/5">
          <Link
            href="/"
            className="text-[10px] tracking-widest uppercase text-stone-500 hover:text-[var(--tarius-olive)] transition-colors flex items-center gap-2"
          >
            Return to Shop
          </Link>
        </div>
      </aside>

      <main className="ml-64 flex-1 relative min-h-[calc(100vh-76px)]">
        <div className="fixed top-[76px] right-0 w-[600px] h-[600px] bg-[var(--tarius-champagne)]/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
        <div className="relative z-10 p-12 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-forwards">
          {children}
        </div>
      </main>
    </div>
  );
}