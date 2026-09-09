// Filename: src/app/admin/layout.tsx

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminEmail, setAdminEmail] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createBrowserClient(
        process.env['NEXT_PUBLIC_SUPABASE_URL'] as string,
        process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setAdminEmail(user.email);
      }
    };
    
    if (!['/admin/login', '/admin/reset-password', '/admin/forgot-password'].includes(pathname || '')) {
      fetchUser();
    }
  }, [pathname]);

  if (['/admin/login', '/admin/reset-password', '/admin/forgot-password'].includes(pathname || '')) {
    return <>{children}</>;
  }

  // SIMPLIFIED NAVIGATION NAMES
  const navItems = [
    { name: 'Analytics', href: '/admin/analytics' },
    { name: 'Products', href: '/admin/products' },
    { name: 'FAQs', href: '/admin/faqs' },
    { name: 'Inquiries', href: '/admin/inquiries' },
  ];

  const handleSignOut = async () => {
    const supabase = createBrowserClient(
      process.env['NEXT_PUBLIC_SUPABASE_URL'] as string,
      process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] as string
    );
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-[calc(100vh-76px)] pt-[76px] bg-[var(--tarius-ivory)] font-body selection:bg-[var(--tarius-olive)] selection:text-white">
      <aside className="w-64 border-r border-[var(--tarius-border)] bg-[var(--tarius-ivory-deep)] flex flex-col fixed top-[76px] h-[calc(100vh-76px)] z-20 shadow-xl">
        <div className="p-8 border-b border-[var(--tarius-border)]">
          <Link
            href="/admin"
            className="font-display text-2xl tracking-[0.15em] text-[var(--tarius-graphite)] block hover:text-[var(--tarius-olive)] transition-colors"
          >
            TARIUS
          </Link>
          <p className="text-eyebrow text-[var(--tarius-olive)] mt-2">
            Admin Dashboard
          </p>
        </div>

        <nav className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto">
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

        <div className="p-6 border-t border-[var(--tarius-border)] bg-black/5 flex flex-col gap-5">
          <div className="flex flex-col gap-1 border-b border-[var(--tarius-border)] pb-4">
            <span className="text-[9px] uppercase tracking-widest text-stone-500">Active Session</span>
            <span className="text-xs text-[var(--tarius-graphite)] font-medium truncate" title={adminEmail || ''}>
              {adminEmail || 'Loading...'}
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-[10px] tracking-widest uppercase text-stone-500 hover:text-[var(--tarius-olive)] transition-colors flex items-center gap-2"
            >
              Return to Site
            </Link>
            
            <button
              onClick={handleSignOut}
              className="text-left text-[10px] tracking-widest uppercase text-red-700/70 hover:text-red-700 transition-colors flex items-center gap-2"
            >
              Sign Out
            </button>
          </div>
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