"use client";

import { useState } from "react";
import { useLang } from "@/lib/i18n";

const galleryImages = [
  { src: "/paella-horno.jpg", alt: "Paella de marisco al horno de leña" },
  { src: "/pizza-horno.jpg", alt: "Pizza artesanal recién salida del horno de leña" },
  { src: "/arroz-meloso.jpg", alt: "Arroz meloso con pulpo y azafrán" },
  { src: "/drinks.jpg", alt: "Selección de bebidas y cócteles" },
];

export default function GallerySection() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const { t } = useLang();
  const labels = t.gallery.labels;

  return (
    <section id="galeria" className="section-padding" style={{ backgroundColor: "var(--dark-surface)" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{t.gallery.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>{t.gallery.title}</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{t.gallery.subtitle}</p>
        </div>

        {/* Gallery Grid — 4 equal tiles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {galleryImages.map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl cursor-pointer group"
              style={{ height: "300px" }}
              onClick={() => setLightbox(img.src)}
            >
              <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: "linear-gradient(to top, rgba(13, 8, 5, 0.85) 0%, transparent 60%)" }}>
                <span className="text-sm font-medium" style={{ color: "var(--cream)", fontFamily: "Georgia, serif" }}>{labels[i]}</span>
              </div>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ border: "2px solid rgba(200, 136, 58, 0.5)" }} />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.92)" }} onClick={() => setLightbox(null)}>
          <div className="relative max-w-4xl w-full">
            <img src={lightbox} alt="Gallery" className="w-full rounded-xl object-contain max-h-[80vh]" />
            <button className="absolute -top-4 -right-4 w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)" }} onClick={() => setLightbox(null)}>×</button>
          </div>
        </div>
      )}
    </section>
  );
}
