"use client";

import { useLang } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useLang();

  const handleScroll = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="inicio" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(https://bty-reactus-resource-prod.s3.us-east-1.amazonaws.com/reactus/llm_server/e747b26a356d416ebc9f67c177bbea5d/image2/46578ac2f8af44e08379e9d02ca1f7e9.png)" }}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 60%, rgba(200, 136, 58, 0.12) 0%, transparent 70%)" }} />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Ornament */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16" style={{ backgroundColor: "var(--gold)" }} />
          <span className="text-xs tracking-[0.4em] uppercase" style={{ color: "var(--gold)" }}>
            {t.hero.subtitle}
          </span>
          <div className="h-px w-16" style={{ backgroundColor: "var(--gold)" }} />
        </div>

        {/* Logo */}
        <img
          src="/logo.png"
          alt="IL Capo Mangia"
          className="mx-auto mb-6 drop-shadow-2xl"
          style={{ width: "420px", maxWidth: "90vw", filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.6))" }}
        />

        {/* Tagline */}
        <p
          className="text-base sm:text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ color: "var(--cream-muted)", fontFamily: "Georgia, serif", fontStyle: "italic" }}
        >
          {t.hero.tagline}
        </p>

        {/* Rating */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  fill={star <= 4 ? "var(--gold)" : "none"}
                  stroke={star > 4 ? "var(--gold)" : "none"}
                  strokeWidth={1.5}
                />
              </svg>
            ))}
          </div>
          <span className="text-sm" style={{ color: "var(--gold-light)" }}>
            4.6 ★ — {t.hero.reviews}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => handleScroll("#reservas")}
            className="px-8 py-4 text-sm font-bold tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg min-w-[180px]"
            style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)", boxShadow: "0 0 30px rgba(200, 136, 58, 0.3)" }}
          >
            {t.hero.cta1}
          </button>
          <button
            onClick={() => handleScroll("#menu")}
            className="px-8 py-4 text-sm font-bold tracking-widest uppercase rounded-full border transition-all duration-300 hover:scale-105 min-w-[180px]"
            style={{ borderColor: "var(--gold)", color: "var(--cream)", backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(200, 136, 58, 0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
          >
            {t.hero.cta2}
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--gold)" }}>
          {t.hero.scroll}
        </span>
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
