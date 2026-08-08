"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const testimonials = [
  { name: "María García", location: "Almería", rating: 5, text: "La mejor pizza que he comido fuera de Italia. La masa es perfecta, crujiente por fuera y esponjosa por dentro. El ambiente es precioso y el servicio excelente. ¡Volveré sin duda!", date: "Hace 2 semanas", initial: "M" },
  { name: "Carlos Rodríguez", location: "Málaga", rating: 5, text: "Fui con mi familia para celebrar un cumpleaños y quedamos encantados. Las pastas frescas son increíbles, especialmente la carbonara. Ambiente muy acogedor y personal muy atento.", date: "Hace 1 mes", initial: "C" },
  { name: "Laura Martínez", location: "Granada", rating: 5, text: "Llevamos años viniendo a IL Capo Mangia siempre que estamos en Almería. El tiramisú es el mejor de la ciudad y los antipastos son para lamer los dedos. ¡Altamente recomendado!", date: "Hace 3 semanas", initial: "L" },
  { name: "Antonio Pérez", location: "Almería", rating: 4, text: "Excelente relación calidad-precio. La ubicación junto al paseo marítimo es perfecta. Los riscos y las bruschetas de entrada son espectaculares. La terraza es muy agradable.", date: "Hace 2 meses", initial: "A" },
  { name: "Sophie Dubois", location: "Francia", rating: 5, text: "Un restaurant magnifique! We were visiting Almería and this was the highlight of our trip. Authentic Italian flavors, beautiful Mediterranean setting, and incredibly warm service.", date: "Hace 1 mes", initial: "S" },
  { name: "Jorge Fernández", location: "Madrid", rating: 5, text: "Vine de visita a Almería y busqué el mejor restaurante italiano. No me equivoqué. El branzino al forno estaba cocinado a la perfección. Una experiencia gastronómica memorable.", date: "Hace 5 semanas", initial: "J" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <svg key={s} className="w-3.5 h-3.5" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= rating ? "var(--gold)" : "var(--dark-border)"} />
        </svg>
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const { t } = useLang();
  const tr = t.testimonials;

  return (
    <section id="opiniones" className="section-padding" style={{ backgroundColor: "var(--dark-bg)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{tr.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>
            {tr.title1}
            <span className="block italic font-normal" style={{ color: "var(--gold-light)" }}>{tr.title2}</span>
          </h2>

          {/* Google Rating Badge */}
          <div className="inline-flex items-center gap-4 px-8 py-4 rounded-full mt-4" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
            <div className="flex flex-col items-center">
              <span className="text-3xl font-bold" style={{ color: "var(--gold)", fontFamily: "Georgia, serif" }}>4.6</span>
              <div className="flex mt-0.5">
                {[1,2,3,4,5].map((s) => (
                  <svg key={s} className="w-3 h-3" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill={s <= 4 ? "var(--gold)" : "none"} stroke={s > 4 ? "var(--gold)" : "none"} strokeWidth={1.5} />
                  </svg>
                ))}
              </div>
            </div>
            <div className="h-10 w-px" style={{ backgroundColor: "var(--dark-border)" }} />
            <div className="text-left">
              <div className="text-sm font-semibold" style={{ color: "var(--cream)" }}>1.230+ {tr.reviews}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{tr.on}</div>
            </div>
          </div>
        </div>

        {/* Testimonial grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-xl transition-all duration-300"
              style={{
                backgroundColor: "var(--dark-card)",
                border: `1px solid ${hoveredIdx === i ? "var(--gold)" : "var(--dark-border)"}`,
                boxShadow: hoveredIdx === i ? "0 10px 30px rgba(200, 136, 58, 0.1)" : "none",
              }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="text-2xl mb-3" style={{ color: "var(--gold)", opacity: 0.4 }}>"</div>
              <StarRating rating={t.rating} />
              <p className="text-sm leading-relaxed mt-3 mb-4" style={{ color: "var(--cream-muted)", fontStyle: "italic" }}>{t.text}</p>
              <div className="flex items-center gap-3 pt-4" style={{ borderTop: "1px solid var(--dark-border)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0" style={{ backgroundColor: "rgba(200, 136, 58, 0.2)", color: "var(--gold)" }}>{t.initial}</div>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--cream)" }}>{t.name}</div>
                  <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.location} · {t.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
