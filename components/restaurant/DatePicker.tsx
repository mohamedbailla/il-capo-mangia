"use client";

import { useState, useRef, useEffect } from "react";
import { Lang } from "@/lib/i18n";

// Locale strings per language
const LOCALES: Record<Lang, string> = {
  es: "es-ES",
  en: "en-GB",
  it: "it-IT",
  fr: "fr-FR",
};

// Day-of-week labels (Mon first) per language
const WEEKDAYS: Record<Lang, string[]> = {
  es: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  en: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  it: ["Lu", "Ma", "Me", "Gi", "Ve", "Sa", "Do"],
  fr: ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"],
};

interface Props {
  value: string;           // "YYYY-MM-DD" or ""
  onChange: (v: string) => void;
  min: string;             // "YYYY-MM-DD"
  max: string;             // "YYYY-MM-DD"
  lang: Lang;
  placeholder: string;
  hasError?: boolean;
}

function pad(n: number) { return String(n).padStart(2, "0"); }
function toYMD(y: number, m: number, d: number) { return `${y}-${pad(m + 1)}-${pad(d)}`; }
function parseYMD(s: string) {
  const [y, m, d] = s.split("-").map(Number);
  return { y, m: m - 1, d };
}

// Returns the day-of-week index starting Monday (0=Mon … 6=Sun)
function mondayFirst(jsDay: number) { return (jsDay + 6) % 7; }

export default function DatePicker({ value, onChange, min, max, lang, placeholder, hasError }: Props) {
  const today = new Date();
  const initDate = value ? parseYMD(value) : null;
  const [viewYear, setViewYear] = useState(initDate?.y ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(initDate?.m ?? today.getMonth());
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const minDate = parseYMD(min);
  const maxDate = parseYMD(max);

  function isDisabled(y: number, m: number, d: number) {
    const ymd = toYMD(y, m, d);
    if (ymd < min || ymd > max) return true;
    const dow = new Date(ymd + "T12:00:00").getDay();
    return dow === 2; // Tuesday closed
  }

  function isTuesday(y: number, m: number, d: number) {
    return new Date(toYMD(y, m, d) + "T12:00:00").getDay() === 2;
  }

  function isWednesday(y: number, m: number, d: number) {
    return new Date(toYMD(y, m, d) + "T12:00:00").getDay() === 3;
  }

  const locale = LOCALES[lang];

  // Month name
  const monthName = new Date(viewYear, viewMonth, 1).toLocaleDateString(locale, { month: "long", year: "numeric" });

  // Build calendar grid (Mon-first, 6 rows)
  const firstDow = mondayFirst(new Date(viewYear, viewMonth, 1).getDay());
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells: Array<{ d: number | null }> = [];
  for (let i = 0; i < firstDow; i++) cells.push({ d: null });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d });
  while (cells.length % 7 !== 0) cells.push({ d: null });

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const canGoPrev = viewYear > minDate.y || (viewYear === minDate.y && viewMonth > minDate.m);
  const canGoNext = viewYear < maxDate.y || (viewYear === maxDate.y && viewMonth < maxDate.m);

  // Display value
  const displayValue = value
    ? new Date(value + "T12:00:00").toLocaleDateString(locale, { day: "numeric", month: "long", year: "numeric" })
    : "";

  const weekdays = WEEKDAYS[lang];

  return (
    <div ref={ref} style={{ position: "relative", width: "100%" }}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0.75rem 1rem",
          borderRadius: "0.5rem",
          fontSize: "0.875rem",
          cursor: "pointer",
          backgroundColor: "var(--dark-surface)",
          border: `1px solid ${hasError ? "rgba(229,62,62,0.6)" : open ? "var(--gold)" : "var(--dark-border)"}`,
          color: displayValue ? "var(--cream)" : "var(--text-muted)",
          outline: "none",
          textAlign: "left",
          transition: "border-color 0.2s",
        }}
      >
        <span>{displayValue || placeholder}</span>
        <svg style={{ width: "14px", height: "14px", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
        </svg>
      </button>

      {/* Calendar dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 200,
            backgroundColor: "var(--dark-card)",
            border: "1px solid var(--gold)",
            borderRadius: "0.875rem",
            padding: "1rem",
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            width: "min(300px, 90vw)",
          }}
        >
          {/* Month nav */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <button type="button" onClick={prevMonth} disabled={!canGoPrev}
              style={{ background: "none", border: "none", cursor: canGoPrev ? "pointer" : "not-allowed", color: canGoPrev ? "var(--gold)" : "var(--dark-border)", padding: "4px 8px", borderRadius: "6px" }}>
              ‹
            </button>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--cream)", textTransform: "capitalize", letterSpacing: "0.03em" }}>
              {monthName}
            </span>
            <button type="button" onClick={nextMonth} disabled={!canGoNext}
              style={{ background: "none", border: "none", cursor: canGoNext ? "pointer" : "not-allowed", color: canGoNext ? "var(--gold)" : "var(--dark-border)", padding: "4px 8px", borderRadius: "6px" }}>
              ›
            </button>
          </div>

          {/* Weekday headers */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px", marginBottom: "4px" }}>
            {weekdays.map(wd => (
              <div key={wd} style={{ textAlign: "center", fontSize: "0.65rem", fontWeight: 700, color: "var(--text-muted)", padding: "2px 0", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                {wd}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "2px" }}>
            {cells.map((cell, i) => {
              if (!cell.d) return <div key={i} />;
              const ymd = toYMD(viewYear, viewMonth, cell.d);
              const disabled = isDisabled(viewYear, viewMonth, cell.d);
              const isTue = isTuesday(viewYear, viewMonth, cell.d);
              const isWed = isWednesday(viewYear, viewMonth, cell.d);
              const isSelected = ymd === value;
              const isToday = ymd === today.toISOString().split("T")[0];

              return (
                <button
                  key={i}
                  type="button"
                  disabled={disabled}
                  onClick={() => { onChange(ymd); setOpen(false); }}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    borderRadius: "6px",
                    fontSize: "0.75rem",
                    fontWeight: isSelected ? 700 : 400,
                    border: isToday && !isSelected ? "1px solid rgba(200,136,58,0.4)" : "1px solid transparent",
                    cursor: disabled ? "not-allowed" : "pointer",
                    backgroundColor: isSelected
                      ? "var(--gold)"
                      : isTue
                      ? "rgba(229,62,62,0.08)"
                      : isWed
                      ? "rgba(200,136,58,0.06)"
                      : "transparent",
                    color: isSelected
                      ? "var(--dark-bg)"
                      : disabled
                      ? "rgba(255,255,255,0.15)"
                      : isTue
                      ? "rgba(252,129,129,0.4)"
                      : isWed
                      ? "var(--gold-light)"
                      : "var(--cream)",
                    transition: "background-color 0.1s",
                  }}
                  onMouseEnter={(e) => { if (!disabled && !isSelected) e.currentTarget.style.backgroundColor = "rgba(200,136,58,0.2)"; }}
                  onMouseLeave={(e) => {
                    if (!disabled && !isSelected) e.currentTarget.style.backgroundColor =
                      isTue ? "rgba(229,62,62,0.08)" : isWed ? "rgba(200,136,58,0.06)" : "transparent";
                  }}
                >
                  {cell.d}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ marginTop: "0.75rem", paddingTop: "0.5rem", borderTop: "1px solid var(--dark-border)", display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <span style={{ fontSize: "0.6rem", color: "rgba(252,129,129,0.5)" }}>✕ Cerrado</span>
            <span style={{ fontSize: "0.6rem", color: "var(--gold-light)" }}>◆ Solo cenas</span>
          </div>
        </div>
      )}
    </div>
  );
}
