"use client";

import { useLang } from "@/lib/i18n";

export default function LocationSection() {
  const { t } = useLang();
  const l = t.location;
  const address = "P.º Marítimo Carmen de Burgos, 78, 04007 Almería, Spain";
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
  const phoneUrl = "tel:+34640573781";

  return (
    <section id="ubicacion" className="section-padding" style={{ backgroundColor: "var(--dark-bg)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{l.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>{l.title}</h2>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Map */}
          <div className="lg:col-span-3 rounded-2xl overflow-hidden" style={{ border: "1px solid var(--dark-border)" }}>
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.2!2d-2.4630!3d36.8340!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(address)}!5e0!3m2!1ses!2ses!4v1!5m2!1ses!2ses&q=${encodeURIComponent(address)}`}
              width="100%" height="400"
              style={{ border: "none", display: "block" }}
              allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de IL Capo Mangia"
            />
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Address */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "rgba(200,136,58,0.15)" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase mb-1" style={{ color: "var(--text-muted)" }}>{l.address}</div>
                  <div className="text-sm font-medium" style={{ color: "var(--cream)" }}>P.º Marítimo Carmen de Burgos, 78</div>
                  <div className="text-sm" style={{ color: "var(--cream-muted)" }}>04007 Almería, España</div>
                </div>
              </div>
            </div>

            {/* Phone */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(200,136,58,0.15)" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                </div>
                <div>
                  <div className="text-xs tracking-wider uppercase mb-1" style={{ color: "var(--text-muted)" }}>{l.phone}</div>
                  <a href={phoneUrl} className="text-sm font-medium animated-underline" style={{ color: "var(--gold)" }}>640 57 37 81</a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="p-5 rounded-xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(200,136,58,0.15)" }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div className="flex-1">
                  <div className="text-xs tracking-wider uppercase mb-2" style={{ color: "var(--text-muted)" }}>{l.hours}</div>
                  <div className="space-y-1 text-sm">
                    {l.days.map((h) => (
                      <div key={h.day} className="flex justify-between gap-4">
                        <span style={{ color: "var(--cream-muted)" }}>{h.day}</span>
                        <span style={{ color: h.hours === l.closed || h.hours === "Cerrado" || h.hours === "Closed" || h.hours === "Chiuso" || h.hours === "Fermé" ? "#fc8181" : "var(--cream)", fontWeight: 500 }}>{h.hours}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs mt-2" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{l.note}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:scale-105" style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" /></svg>
                {l.directions}
              </a>
              <a href={phoneUrl} className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold tracking-wider uppercase border transition-all duration-300 hover:scale-105" style={{ borderColor: "var(--gold)", color: "var(--gold)", backgroundColor: "transparent" }}>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
                {l.call}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
