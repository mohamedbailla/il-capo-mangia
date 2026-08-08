"use client";

import { useLang } from "@/lib/i18n";

const sectionHrefs = ["#nosotros", "#menu", "#galeria", "#opiniones", "#reservas"];

export default function Footer() {
  const year = new Date().getFullYear();
  const { t } = useLang();
  const f = t.footer;

  const handleNav = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer style={{ backgroundColor: "var(--dark-bg)", borderTop: "1px solid var(--dark-border)" }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img src="/logo.png" alt="IL Capo Mangia" className="h-16 w-auto" />
            </div>
            <p className="text-sm leading-relaxed mb-4" style={{ color: "var(--text-muted)" }}>{f.tagline}</p>
            <div className="text-xs px-3 py-1.5 rounded-full inline-flex items-center gap-1.5" style={{ backgroundColor: "rgba(200,136,58,0.1)", border: "1px solid rgba(200,136,58,0.3)", color: "var(--gold-light)" }}>
              <svg className="w-3 h-3" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--gold)" /></svg>
              4.6 · 1.230+ {t.testimonials.reviews}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--gold)" }}>{f.nav}</div>
            <ul className="space-y-2">
              {f.links.map((label, i) => (
                <li key={i}>
                  <button className="text-sm animated-underline" style={{ color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }} onClick={() => handleNav(sectionHrefs[i])}>
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--gold)" }}>{f.contact}</div>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>P.º Marítimo Carmen de Burgos, 78<br />04007 Almería</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                <a href="tel:+34640573781" className="text-sm animated-underline" style={{ color: "var(--text-muted)" }}>640 57 37 81</a>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=ilcapomangia%40gmail.com" target="_blank" rel="noopener noreferrer" className="text-sm animated-underline" style={{ color: "var(--text-muted)", textDecoration: "none" }}>ilcapomangia@gmail.com</a>
              </li>
              <li className="flex items-center gap-3 pt-1">
                <a href="https://www.facebook.com/ILcapomangia/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="var(--gold)"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Facebook
                </a>
                <a href="https://wa.me/+34640573781" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs transition-opacity hover:opacity-80" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="var(--gold)"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <div className="text-xs tracking-[0.2em] uppercase mb-4 font-semibold" style={{ color: "var(--gold)" }}>{f.hours}</div>
            <ul className="space-y-1.5 text-sm">
              {f.days.map((h) => (
                <li key={h.day} className="flex justify-between gap-3">
                  <span style={{ color: "var(--text-muted)" }}>{h.day}</span>
                  <span style={{ color: h.h === "Cerrado" || h.h === "Closed" || h.h === "Chiuso" || h.h === "Fermé" ? "#fc8181" : "var(--cream)", fontSize: "0.8rem" }}>{h.h}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs mt-3" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{f.note}</p>
          </div>
        </div>

        <div className="divider-gold mb-6" />

        {/* Designer credit */}
        <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
          <span className="text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
            Diseñado por <span style={{ color: "rgba(255,255,255,0.35)" }}>Meed</span>
            {" · "}
            <a href="https://wa.me/34632013519" target="_blank" rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >632 013 519</a>
            {" · "}
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=epicdead52%40gmail.com" target="_blank" rel="noopener noreferrer"
              style={{ color: "rgba(255,255,255,0.25)", textDecoration: "none" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.25)"; }}
            >epicdead52@gmail.com</a>
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>© {year} Restaurante IL Capo Mangia. {f.rights}</p>
          <a
            href="/admin"
            title="Admin"
            style={{ color: "rgba(255,255,255,0.15)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-muted)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.15)"; }}
          >
            <svg style={{ width: "14px", height: "14px", display: "block" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
