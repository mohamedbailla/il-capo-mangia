"use client";

import { useState } from "react";
import { useLang, Lang } from "@/lib/i18n";

const FLAGS: Record<Lang, string> = { es: "🇪🇸", en: "🇬🇧", it: "🇮🇹", fr: "🇫🇷" };
const LABELS: Record<Lang, string> = { es: "ES", en: "EN", it: "IT", fr: "FR" };
const NAMES: Record<Lang, string> = { es: "Español", en: "English", it: "Italiano", fr: "Français" };

export default function FloatingLangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1.5rem",
        left: "1.5rem",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.5rem",
      }}
    >
      {/* Options — appear above the button */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(8px) scale(0.95)",
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.2s ease, transform 0.2s ease",
          transformOrigin: "bottom left",
        }}
      >
        {(["es", "en", "fr", "it"] as Lang[]).map((l) => (
          <button
            key={l}
            onClick={() => { setLang(l); setOpen(false); }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 0.875rem",
              borderRadius: "9999px",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
              border: lang === l ? "1px solid var(--gold)" : "1px solid var(--dark-border)",
              backgroundColor: lang === l ? "rgba(200,136,58,0.18)" : "rgba(13,8,5,0.92)",
              color: lang === l ? "var(--gold)" : "var(--cream-muted)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
              transition: "all 0.15s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (lang !== l) {
                e.currentTarget.style.borderColor = "rgba(200,136,58,0.5)";
                e.currentTarget.style.color = "var(--cream)";
              }
            }}
            onMouseLeave={(e) => {
              if (lang !== l) {
                e.currentTarget.style.borderColor = "var(--dark-border)";
                e.currentTarget.style.color = "var(--cream-muted)";
              }
            }}
          >
            <span style={{ fontSize: "1rem" }}>{FLAGS[l]}</span>
            <span>{NAMES[l]}</span>
          </button>
        ))}
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Cambiar idioma"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.65rem 1rem",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          cursor: "pointer",
          border: "1px solid rgba(200,136,58,0.5)",
          backgroundColor: open ? "rgba(200,136,58,0.2)" : "rgba(13,8,5,0.92)",
          color: "var(--gold)",
          backdropFilter: "blur(14px)",
          boxShadow: open
            ? "0 6px 30px rgba(200,136,58,0.35)"
            : "0 4px 24px rgba(0,0,0,0.55)",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 30px rgba(200,136,58,0.35)"; }}
        onMouseLeave={(e) => { if (!open) e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.55)"; }}
      >
        <span style={{ fontSize: "1.1rem" }}>{FLAGS[lang]}</span>
        <span>{LABELS[lang]}</span>
        <svg
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          style={{
            width: "0.75rem", height: "0.75rem",
            transition: "transform 0.2s ease",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
