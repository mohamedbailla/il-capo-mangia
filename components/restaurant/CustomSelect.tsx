"use client";

import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
  placeholder: string;
  hasError?: boolean;
}

export default function CustomSelect({ value, onChange, options, placeholder, hasError }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o.value === value);

  // Group options by their group label
  const groups: { label: string | null; items: Option[] }[] = [];
  for (const opt of options) {
    const g = opt.group ?? null;
    const existing = groups.find(x => x.label === g);
    if (existing) existing.items.push(opt);
    else groups.push({ label: g, items: [opt] });
  }

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
          color: selected ? "var(--cream)" : "var(--text-muted)",
          outline: "none",
          textAlign: "left",
          transition: "border-color 0.2s",
        }}
      >
        <span>{selected ? selected.label : placeholder}</span>
        <svg
          style={{ width: "14px", height: "14px", flexShrink: 0, transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
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
            boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
            width: "100%",
            maxHeight: "260px",
            overflowY: "auto",
            padding: "0.375rem",
          }}
        >
          {groups.map((group, gi) => (
            <div key={gi}>
              {group.label && (
                <div style={{
                  padding: "0.4rem 0.75rem 0.2rem",
                  fontSize: "0.6rem",
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  borderTop: gi > 0 ? "1px solid var(--dark-border)" : undefined,
                  marginTop: gi > 0 ? "0.25rem" : undefined,
                  paddingTop: gi > 0 ? "0.5rem" : undefined,
                }}>
                  {group.label}
                </div>
              )}
              {group.items.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => { onChange(opt.value); setOpen(false); }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "0.5rem 0.75rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.85rem",
                      fontWeight: isSelected ? 700 : 400,
                      cursor: opt.disabled ? "not-allowed" : "pointer",
                      border: "none",
                      backgroundColor: isSelected ? "rgba(200,136,58,0.2)" : "transparent",
                      color: isSelected ? "var(--gold)" : opt.disabled ? "rgba(255,255,255,0.2)" : "var(--cream)",
                      transition: "background-color 0.1s",
                    }}
                    onMouseEnter={(e) => { if (!opt.disabled && !isSelected) e.currentTarget.style.backgroundColor = "rgba(200,136,58,0.1)"; }}
                    onMouseLeave={(e) => { if (!opt.disabled && !isSelected) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    {isSelected && <span style={{ marginRight: "0.4rem", color: "var(--gold)" }}>✓</span>}
                    {opt.label}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
