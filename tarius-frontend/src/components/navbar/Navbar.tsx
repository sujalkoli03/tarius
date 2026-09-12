"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const navigation = [
  { label: "Shop", href: "/products" },
  { label: "Our Story", href: "/#story" },
  { label: "Quality", href: "/#quality" },
  { label: "Certifications", href: "/certifications" },
  { label: "FAQ", href: "/#faq" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleFaqClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
  
    if (pathname === "/") return;
    e.preventDefault();
    router.push("/#faq");
    let attempts = 0;
    const tryScroll = () => {
      const el = document.getElementById("faq");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (attempts < 40) {
        attempts += 1;
        window.setTimeout(tryScroll, 50);
      }
    };
    window.setTimeout(tryScroll, 50);
  };

  // Do not render the public navbar on any admin route
  if (pathname && pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--tarius-border)] bg-[var(--tarius-ivory)]/95 backdrop-blur-md">
      <nav
        className="container-tarius flex h-[96px] items-center justify-between"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex items-center"
          aria-label="TARIUS home"
        >
          <Image
            src="/LOGO_TARIUS.png"
            alt="TARIUS"
            width={660}
            height={200}
            priority
            className="h-[114px] w-auto max-w-[400px] object-contain sm:max-w-none"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={item.href === "/#faq" ? handleFaqClick : undefined}
              className="text-eyebrow relative py-2 text-[var(--tarius-graphite)] transition-opacity duration-200 hover:opacity-60"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            className="btn-tarius ml-2"
          >
            Explore TARIUS
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="relative z-[60] flex h-11 w-11 items-center justify-center lg:hidden"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className="flex w-6 flex-col gap-[6px]">
            <span
              className={"block h-px w-full bg-[var(--tarius-graphite)] transition-transform duration-300 " + (isMenuOpen ? "translate-y-[3.5px] rotate-45" : "")}
            />
            <span
              className={"block h-px w-full bg-[var(--tarius-graphite)] transition-opacity duration-300 " + (isMenuOpen ? "opacity-0" : "")}
            />
            <span
              className={"block h-px w-full bg-[var(--tarius-graphite)] transition-transform duration-300 " + (isMenuOpen ? "-translate-y-[3.5px] -rotate-45" : "")}
            />
          </span>
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={"overflow-hidden border-t border-[var(--tarius-border)] bg-[var(--tarius-ivory)] transition-[max-height,opacity] duration-300 lg:hidden " + (isMenuOpen ? "max-h-[420px] opacity-100" : "max-h-0 opacity-0")}
      >
        <div className="container-tarius flex flex-col py-5">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={(e) => { closeMenu(); if (item.href === "/#faq") handleFaqClick(e); }}
              className="border-b border-[var(--tarius-border)] py-4 text-sm font-medium uppercase tracking-[0.14em]"
            >
              {item.label}
            </Link>
          ))}

          <Link
            href="/#contact"
            onClick={closeMenu}
            className="btn-tarius mt-5 w-full"
          >
            Explore TARIUS
          </Link>
        </div>
      </div>
    </header>
  );
}