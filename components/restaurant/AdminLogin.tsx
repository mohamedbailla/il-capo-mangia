"use client";

import { useState, useEffect } from "react";

const CORRECT = "admin1234";
const SESSION_KEY = "ilcapo_admin_auth";

interface AdminGateProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(SESSION_KEY);
    setAuthed(stored === "1");
  }, []);

  const login = () => {
    sessionStorage.setItem(SESSION_KEY, "1");
    setAuthed(true);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  return { authed, login, logout };
}

export function AdminLoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [show, setShow] = useState(false);

  const attempt = () => {
    if (value === CORRECT) {
      onSuccess();
    } else {
      setError(true);
      setShaking(true);
      setValue("");
      setTimeout(() => { setShaking(false); setError(false); }, 600);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") attempt();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--dark-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          backgroundColor: "var(--dark-card)",
          border: "1px solid var(--dark-border)",
          borderRadius: "1.25rem",
          padding: "2.5rem",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6)",
          animation: shaking ? "shake 0.5s ease" : undefined,
        }}
      >
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <img
            src="/logo.png"
            alt="IL Capo Mangia"
            style={{ height: "56px", width: "auto", margin: "0 auto 1rem" }}
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
            </svg>
            <span
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "var(--gold)",
                fontWeight: 700,
              }}
            >
              Área Restringida
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Introduce la contraseña para acceder al panel de administración
          </p>
        </div>

        {/* Input */}
        <div style={{ position: "relative", marginBottom: "1rem" }}>
          <input
            type={show ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Contraseña"
            autoFocus
            style={{
              width: "100%",
              padding: "0.875rem 3rem 0.875rem 1rem",
              borderRadius: "0.75rem",
              fontSize: "0.9rem",
              outline: "none",
              backgroundColor: "var(--dark-surface)",
              border: `1px solid ${error ? "rgba(229,62,62,0.6)" : "var(--dark-border)"}`,
              color: "var(--cream)",
              transition: "border-color 0.2s",
              boxSizing: "border-box",
            }}
            onFocus={(e) => { if (!error) e.target.style.borderColor = "rgba(200,136,58,0.6)"; }}
            onBlur={(e) => { if (!error) e.target.style.borderColor = "var(--dark-border)"; }}
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            style={{
              position: "absolute", right: "0.75rem", top: "50%",
              transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-muted)", padding: "0.25rem",
            }}
          >
            {show ? (
              <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <p style={{ fontSize: "0.75rem", color: "#fc8181", marginBottom: "0.75rem", textAlign: "center" }}>
            Contraseña incorrecta. Inténtalo de nuevo.
          </p>
        )}

        <button
          onClick={attempt}
          style={{
            width: "100%",
            padding: "0.875rem",
            borderRadius: "9999px",
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            cursor: "pointer",
            border: "none",
            backgroundColor: "var(--gold)",
            color: "var(--dark-bg)",
            boxShadow: "0 4px 20px rgba(200,136,58,0.35)",
            transition: "transform 0.15s ease, box-shadow 0.15s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.02)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          Acceder al Panel
        </button>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/"
            style={{ fontSize: "0.75rem", color: "var(--text-muted)", textDecoration: "none" }}
          >
            ← Volver al sitio
          </a>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15%       { transform: translateX(-8px); }
          30%       { transform: translateX(8px); }
          45%       { transform: translateX(-6px); }
          60%       { transform: translateX(6px); }
          75%       { transform: translateX(-4px); }
          90%       { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
