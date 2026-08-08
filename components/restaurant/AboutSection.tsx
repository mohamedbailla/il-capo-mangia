"use client";

import { useLang } from "@/lib/i18n";

export default function AboutSection() {
  const { t } = useLang();
  const a = t.about;

  return (
    <section id="nosotros" className="section-padding" style={{ backgroundColor: "var(--dark-surface)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Image */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-2xl" style={{ border: "1px solid var(--dark-border)" }} />
            <img
              src="/team.jpg"
              alt="El equipo de IL Capo Mangia"
              className="relative z-10 w-full rounded-2xl object-cover object-top"
              style={{ height: "420px", border: "1px solid var(--dark-border)" }}
            />
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-5 z-20 px-6 py-4 rounded-xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--gold)" }}>
              <div className="text-3xl font-bold" style={{ color: "var(--gold)", fontFamily: "Georgia, serif" }}>4.6</div>
              <div className="flex mt-1">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= 4 ? "var(--gold)" : "var(--dark-border)"} />
                  </svg>
                ))}
              </div>
              <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Google Reviews</div>
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
              <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{a.tag}</span>
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>
              {a.title1}
              <span className="block italic font-normal" style={{ color: "var(--gold-light)" }}>{a.title2}</span>
            </h2>

            <div className="space-y-4 text-base leading-relaxed" style={{ color: "var(--cream-muted)" }}>
              <p>{a.p1.replace("IL Capo Mangia", "")}<strong style={{ color: "var(--cream)" }}>IL Capo Mangia</strong>{a.p1.split("IL Capo Mangia")[1]}</p>
              <p>{a.p2}</p>
              <p>{a.p3}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10 pt-8" style={{ borderTop: "1px solid var(--dark-border)" }}>
              {[
                { value: "1.230+", label: a.stat1 },
                { value: "4.6★", label: a.stat2 },
                { value: "€10–20", label: a.stat3 },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold" style={{ color: "var(--gold)", fontFamily: "Georgia, serif" }}>{stat.value}</div>
                  <div className="text-xs mt-1 tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Services */}
            <div className="flex flex-wrap gap-3 mt-8">
              {[a.svc1, a.svc2, a.svc3].map((s) => (
                <span key={s} className="px-4 py-1.5 text-xs rounded-full tracking-wider" style={{ backgroundColor: "rgba(200, 136, 58, 0.1)", border: "1px solid rgba(200, 136, 58, 0.3)", color: "var(--gold-light)" }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
