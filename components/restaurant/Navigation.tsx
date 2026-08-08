"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/i18n";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    { href: "#nosotros", label: t.nav.nosotros },
    { href: "#menu", label: t.nav.menu },
    { href: "#galeria", label: t.nav.galeria },
    { href: "#reservas", label: t.nav.reservas },
    { href: "#ubicacion", label: t.nav.ubicacion },
    { href: "#contacto", label: t.nav.contacto },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(13, 8, 5, 0.97)" : "transparent",
        borderBottom: scrolled ? "1px solid var(--dark-border)" : "none",
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <img
            src="/logo.png"
            alt="IL Capo Mangia"
            className="h-12 w-auto transition-opacity duration-300 group-hover:opacity-80"
          />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="nav-link animated-underline"
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side: CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* CTA */}
          <a
            href="#reservas"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wider uppercase rounded-full transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)" }}
            onClick={(e) => handleNavClick(e as any, "#reservas")}
          >
            {t.nav.reservar}
          </a>
        </div>

        {/* Mobile: hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {/* Hamburger */}
          <button
            className="flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className="block w-6 h-0.5 transition-all duration-300" style={{ backgroundColor: "var(--gold)", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
            <span className="block w-6 h-0.5 transition-all duration-300" style={{ backgroundColor: "var(--gold)", opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-6 h-0.5 transition-all duration-300" style={{ backgroundColor: "var(--gold)", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className="md:hidden transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: menuOpen ? "400px" : "0",
          backgroundColor: "rgba(13, 8, 5, 0.98)",
          borderTop: menuOpen ? "1px solid var(--dark-border)" : "none",
        }}
      >
        <div className="flex flex-col px-6 py-4 gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm tracking-[0.1em] uppercase py-2"
              style={{ color: "var(--cream-muted)" }}
              onClick={(e) => handleNavClick(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#reservas"
            className="mt-2 px-5 py-3 text-sm font-semibold tracking-wider uppercase rounded-full text-center"
            style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)" }}
            onClick={(e) => handleNavClick(e, "#reservas")}
          >
            {t.nav.reservar}
          </a>
        </div>
      </div>
    </nav>
  );
}
