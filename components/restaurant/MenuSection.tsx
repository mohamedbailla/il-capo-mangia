"use client";

import { useState, useRef, useEffect } from "react";
import { useLang } from "@/lib/i18n";

const menuData = [
  {
    icon: "🥗",
    items: [
      { name: "Bruschetta al Pomodoro", desc: "Pan tostado con tomate fresco, albahaca y aceite de oliva virgen extra", price: "6,50€" },
      { name: "Carpaccio di Manzo", desc: "Finas láminas de ternera con rúcula, parmesano y limón", price: "9,90€" },
      { name: "Burrata con Prosciutto", desc: "Burrata cremosa con jamón de Parma, higos y reducción de balsámico", price: "11,50€" },
      { name: "Antipasto della Casa", desc: "Selección de embutidos italianos, quesos y verduras a la plancha", price: "13,90€" },
      { name: "Zuppa di Pomodoro", desc: "Crema de tomate asado con albahaca fresca y crostini", price: "7,50€" },
    ],
  },
  {
    icon: "🍕",
    items: [
      { name: "Margherita", desc: "Tomate San Marzano, mozzarella fior di latte, albahaca fresca", price: "10,90€" },
      { name: "Diavola", desc: "Tomate, mozzarella, salami piccante, aceitunas negras", price: "12,50€" },
      { name: "Quattro Formaggi", desc: "Mozzarella, gorgonzola, parmesano, taleggio", price: "13,90€" },
      { name: "Prosciutto e Funghi", desc: "Tomate, mozzarella, jamón cocido, champiñones", price: "12,90€" },
      { name: "Capricciosa", desc: "Tomate, mozzarella, jamón, champiñones, alcachofas, aceitunas", price: "14,50€" },
      { name: "Tartufo Nero", desc: "Crema de trufa, mozzarella, champiñones mixtos, aceite de trufa", price: "16,90€" },
    ],
  },
  {
    icon: "🍝",
    items: [
      { name: "Spaghetti Carbonara", desc: "Pasta fresca con guanciale, huevo, pecorino romano y pimienta negra", price: "11,90€" },
      { name: "Penne all'Arrabbiata", desc: "Salsa de tomate picante, ajo, guindilla y pecorino", price: "9,90€" },
      { name: "Tagliatelle al Ragù", desc: "Pasta fresca con ragù bolognese tradicional cocinado 4 horas", price: "13,50€" },
      { name: "Rigatoni alla Norma", desc: "Berenjenas fritas, tomate, ricotta salata y albahaca", price: "11,50€" },
      { name: "Lasagna della Nonna", desc: "Lasaña tradicional con ragù, bechamel y parmesano", price: "13,90€" },
      { name: "Gnocchi al Pesto", desc: "Gnocchi caseros con pesto genovés, patatas y judías verdes", price: "12,50€" },
    ],
  },
  {
    icon: "🥩",
    items: [
      { name: "Branzino al Forno", desc: "Lubina al horno con limón, alcaparras, aceitunas y hierbas mediterráneas", price: "18,90€" },
      { name: "Tagliata di Manzo", desc: "Ternera a la plancha con rúcula, parmesano y reducción balsámica", price: "22,50€" },
      { name: "Saltimbocca alla Romana", desc: "Ternera con jamón de Parma, salvia y vino blanco", price: "19,90€" },
      { name: "Pollo alla Parmigiana", desc: "Pechuga empanada con salsa de tomate, mozzarella y parmesano", price: "16,50€" },
    ],
  },
  {
    icon: "🍮",
    items: [
      { name: "Tiramisù della Casa", desc: "Tiramisú clásico con mascarpone, bizcochos de soletilla y café", price: "6,50€" },
      { name: "Panna Cotta", desc: "Panna cotta de vainilla con coulis de frutos rojos", price: "5,90€" },
      { name: "Cannoli Siciliani", desc: "Cannoli rellenos de ricotta dulce con pistachos y chispas de chocolate", price: "6,90€" },
      { name: "Gelato Artigianale", desc: "Helado artesanal italiano — 3 bolas a elegir", price: "5,50€" },
    ],
  },
  {
    icon: "🍷",
    items: [
      { name: "Vino de la Casa", desc: "Selección del sommelier — tinto, blanco o rosado", price: "desde 3,50€" },
      { name: "Prosecco DOC", desc: "Espumoso italiano Prosecco di Valdobbiadene", price: "5,90€" },
      { name: "Aperol Spritz", desc: "Aperol, Prosecco y soda con naranja fresca", price: "6,50€" },
      { name: "Negroni", desc: "Gin, Campari y vermut rosso", price: "7,50€" },
      { name: "Agua / Refrescos", desc: "Agua mineral, Coca-Cola, Fanta, etc.", price: "desde 2,20€" },
      { name: "Café Italiano", desc: "Espresso, cappuccino, macchiato, americano", price: "desde 1,80€" },
    ],
  },
];

export default function MenuSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [prevIdx, setPrevIdx] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const { t } = useLang();
  const cats = t.menu.cats;
  const current = menuData[activeIdx];
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  // Move sliding indicator to the active button
  useEffect(() => {
    const btn = btnRefs.current[activeIdx];
    if (!btn) return;
    const parent = btn.parentElement;
    if (!parent) return;
    const pRect = parent.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    setIndicatorStyle({ left: bRect.left - pRect.left, width: bRect.width });
  }, [activeIdx, cats]);

  const switchTab = (i: number) => {
    if (i === activeIdx || animating) return;
    setPrevIdx(activeIdx);
    setAnimating(true);
    setActiveIdx(i);
    setTimeout(() => { setAnimating(false); setPrevIdx(null); }, 350);
  };

  return (
    <section id="menu" className="section-padding" style={{ backgroundColor: "var(--dark-bg)" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{t.menu.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>{t.menu.title}</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{t.menu.subtitle}</p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10" style={{ position: "relative" }}>
          {cats.map((cat, i) => {
            const isActive = activeIdx === i;
            return (
              <button
                key={i}
                ref={(el) => { btnRefs.current[i] = el; }}
                onClick={() => switchTab(i)}
                className="flex items-center gap-2 px-5 py-2.5 text-sm rounded-full font-medium"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  border: `1px solid ${isActive ? "var(--gold)" : "var(--dark-border)"}`,
                  backgroundColor: isActive ? "var(--gold)" : "var(--dark-card)",
                  color: isActive ? "var(--dark-bg)" : "var(--cream-muted)",
                  transition: "background-color 0.25s ease, border-color 0.25s ease, color 0.25s ease, transform 0.2s ease, box-shadow 0.2s ease",
                  transform: isActive ? "translateY(-2px) scale(1.04)" : "translateY(0) scale(1)",
                  boxShadow: isActive ? "0 6px 20px rgba(200,136,58,0.4)" : "none",
                  cursor: "pointer",
                  fontWeight: isActive ? 700 : 500,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "rgba(200,136,58,0.5)";
                    e.currentTarget.style.color = "var(--cream)";
                    e.currentTarget.style.transform = "translateY(-2px) scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 4px 12px rgba(200,136,58,0.2)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = "var(--dark-border)";
                    e.currentTarget.style.color = "var(--cream-muted)";
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                {/* Ripple layer */}
                <span
                  style={{
                    position: "absolute", inset: 0, borderRadius: "inherit",
                    background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)",
                    opacity: isActive ? 1 : 0,
                    transition: "opacity 0.3s ease",
                    pointerEvents: "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "1.1rem",
                    display: "inline-block",
                    transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                    transform: isActive ? "scale(1.25) rotate(-8deg)" : "scale(1) rotate(0deg)",
                  }}
                >
                  {menuData[i].icon}
                </span>
                <span style={{ position: "relative", zIndex: 1 }}>{cat}</span>
              </button>
            );
          })}
        </div>

        {/* Menu items — animate in on tab switch */}
        <div
          key={activeIdx}
          className="grid sm:grid-cols-2 gap-4"
          style={{
            animation: "menuFadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both",
          }}
        >
          {current.items.map((item, i) => (
            <div
              key={i}
              className="p-5 rounded-xl"
              style={{
                backgroundColor: "var(--dark-card)",
                border: "1px solid var(--dark-border)",
                animation: `menuFadeUp 0.4s cubic-bezier(0.22,1,0.36,1) ${i * 55}ms both`,
                transition: "border-color 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(200,136,58,0.4)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(200,136,58,0.12)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--dark-border)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="text-base font-semibold mb-1" style={{ color: "var(--cream)", fontFamily: "Georgia, serif" }}>{item.name}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                </div>
                <span className="text-sm font-bold whitespace-nowrap mt-0.5" style={{ color: "var(--gold)" }}>{item.price}</span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-xs mt-8" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{t.menu.disclaimer}</p>
      </div>

      <style>{`
        @keyframes menuFadeUp {
          from { opacity: 0; transform: translateY(18px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
      `}</style>
    </section>
  );
}

