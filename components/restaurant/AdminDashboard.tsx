"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ReservationStatus = "pending" | "confirmed" | "cancelled";

interface Reservation {
  id: number;
  nombre: string;
  telefono: string;
  email: string;
  personas: number;
  fecha: string;
  hora: string;
  notas: string | null;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

const STATUS_LABELS: Record<ReservationStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmada",
  cancelled: "Cancelada",
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
  pending: "status-pending",
  confirmed: "status-confirmed",
  cancelled: "status-cancelled",
};

const LUNCH_SLOTS = ["13:00","13:30","14:00","14:30","15:00"];
const DINNER_SLOTS = ["20:00","20:30","21:00","21:30","22:00","22:30"];

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("es-ES", {
      day: "2-digit", month: "short", year: "numeric",
    });
  } catch { return dateStr; }
}

function getDayOfWeek(dateStr: string) {
  if (!dateStr) return -1;
  return new Date(dateStr + "T12:00:00").getDay();
}
function isTuesday(dateStr: string) { return getDayOfWeek(dateStr) === 2; }
function isWednesday(dateStr: string) { return getDayOfWeek(dateStr) === 3; }
function todayISO() { return new Date().toISOString().split("T")[0]; }

/* ─── New Booking Modal ──────────────────────────────────────────────── */
interface NewBookingForm {
  nombre: string;
  telefono: string;
  email: string;
  personas: string;
  fecha: string;
  hora: string;
  notas: string;
  status: ReservationStatus;
}

const EMPTY_FORM: NewBookingForm = {
  nombre: "", telefono: "", email: "",
  personas: "2", fecha: "", hora: "",
  notas: "", status: "confirmed",
};

function NewBookingModal({
  onClose,
  onCreated,
  showToast,
}: {
  onClose: () => void;
  onCreated: (r: Reservation) => void;
  showToast: (msg: string, type: "success" | "error") => void;
}) {
  const [form, setForm] = useState<NewBookingForm>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof NewBookingForm, string>>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on backdrop click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (key: keyof NewBookingForm, value: string) => {
    setForm((p) => {
      const next = { ...p, [key]: value };
      // Auto-clear a lunch slot when Wednesday is selected
      if (key === "fecha" && isWednesday(value) && LUNCH_SLOTS.includes(p.hora)) {
        next.hora = "";
      }
      return next;
    });
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: Partial<Record<keyof NewBookingForm, string>> = {};
    if (!form.nombre.trim()) e.nombre = "Nombre obligatorio";
    if (!form.telefono.trim()) {
      e.telefono = "Teléfono obligatorio";
    } else {
      const digits = form.telefono.replace(/\D/g, "");
      if (digits.length < 7 || digits.length > 15) e.telefono = "Teléfono no válido";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = "Email no válido";
    }
    if (!form.personas) e.personas = "Personas obligatorio";
    if (!form.fecha) e.fecha = "Fecha obligatoria";
    else if (isTuesday(form.fecha)) e.fecha = "Cerrado los martes";
    if (!form.hora) e.hora = "Hora obligatoria";
    else if (isWednesday(form.fecha) && LUNCH_SLOTS.includes(form.hora)) {
      e.hora = "Miércoles solo cenas";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: form.nombre.trim(),
          telefono: form.telefono.trim(),
          email: form.email.trim() || null,
          personas: parseInt(form.personas),
          fecha: form.fecha,
          hora: form.hora,
          notas: form.notas.trim() || null,
          status: form.status,
        }),
      });
      const json = await res.json();
      if (json.success) {
        onCreated(json.data);
        showToast("Reserva creada correctamente", "success");
        onClose();
      } else {
        showToast(json.error || "Error al crear", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls: React.CSSProperties = {
    backgroundColor: "var(--dark-surface)",
    border: "1px solid var(--dark-border)",
    color: "var(--cream)",
    borderRadius: "0.5rem",
    padding: "0.625rem 0.875rem",
    fontSize: "0.875rem",
    width: "100%",
    outline: "none",
  };
  const errCls: React.CSSProperties = { color: "#fc8181", fontSize: "0.7rem", marginTop: "0.25rem" };
  const labelCls: React.CSSProperties = {
    display: "block", fontSize: "0.7rem", letterSpacing: "0.05em",
    textTransform: "uppercase", marginBottom: "0.35rem", color: "var(--cream-muted)",
  };

  const isWed = isWednesday(form.fecha);
  const visibleSlots = [
    ...(!isWed ? LUNCH_SLOTS : []),
    ...DINNER_SLOTS,
  ];

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)", maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Modal header */}
        <div
          className="flex items-center justify-between px-6 py-4 sticky top-0 z-10"
          style={{ backgroundColor: "var(--dark-card)", borderBottom: "1px solid var(--dark-border)" }}
        >
          <div className="flex items-center gap-2">
            <span style={{ color: "var(--gold)", fontSize: "1.1rem" }}>📋</span>
            <h2 style={{ fontFamily: "Georgia, serif", color: "var(--cream)", fontSize: "1.1rem", fontWeight: 700 }}>
              Nueva Reserva
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-lg"
            style={{ color: "var(--text-muted)", background: "none", border: "1px solid var(--dark-border)" }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Nombre + Teléfono */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label style={labelCls}>Nombre *</label>
              <input
                value={form.nombre}
                onChange={(e) => set("nombre", e.target.value)}
                placeholder="Juan García"
                style={{ ...inputCls, borderColor: errors.nombre ? "#fc8181" : "var(--dark-border)" }}
                onFocus={(e) => { e.target.style.borderColor = errors.nombre ? "#fc8181" : "var(--gold)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.nombre ? "#fc8181" : "var(--dark-border)"; }}
              />
              {errors.nombre && <p style={errCls}>{errors.nombre}</p>}
            </div>
            <div>
              <label style={labelCls}>Teléfono *</label>
              <input
                value={form.telefono}
                onChange={(e) => set("telefono", e.target.value)}
                placeholder="+34 600 000 000"
                style={{ ...inputCls, borderColor: errors.telefono ? "#fc8181" : "var(--dark-border)" }}
                onFocus={(e) => { e.target.style.borderColor = errors.telefono ? "#fc8181" : "var(--gold)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.telefono ? "#fc8181" : "var(--dark-border)"; }}
              />
              {errors.telefono && <p style={errCls}>{errors.telefono}</p>}
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={labelCls}>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
              placeholder="cliente@email.com (opcional)"
              style={{ ...inputCls, borderColor: errors.email ? "#fc8181" : "var(--dark-border)" }}
              onFocus={(e) => { e.target.style.borderColor = errors.email ? "#fc8181" : "var(--gold)"; }}
              onBlur={(e) => { e.target.style.borderColor = errors.email ? "#fc8181" : "var(--dark-border)"; }}
            />
            {errors.email && <p style={errCls}>{errors.email}</p>}
          </div>

          {/* Fecha + Hora + Personas */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label style={labelCls}>Fecha *</label>
              <input
                type="date"
                value={form.fecha}
                min={todayISO()}
                onChange={(e) => set("fecha", e.target.value)}
                style={{
                  ...inputCls,
                  borderColor: errors.fecha ? "#fc8181" : "var(--dark-border)",
                  colorScheme: "dark",
                }}
                onFocus={(e) => { e.target.style.borderColor = errors.fecha ? "#fc8181" : "var(--gold)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.fecha ? "#fc8181" : "var(--dark-border)"; }}
              />
              {errors.fecha && <p style={errCls}>{errors.fecha}</p>}
              {form.fecha && isTuesday(form.fecha) && !errors.fecha && (
                <p style={{ ...errCls, color: "#f6a623" }}>Cerrado los martes</p>
              )}
              {form.fecha && isWednesday(form.fecha) && (
                <p style={{ color: "#f6a623", fontSize: "0.7rem", marginTop: "0.25rem" }}>Miércoles: solo cenas</p>
              )}
            </div>
            <div>
              <label style={labelCls}>Hora *</label>
              <select
                value={form.hora}
                onChange={(e) => set("hora", e.target.value)}
                style={{
                  ...inputCls,
                  borderColor: errors.hora ? "#fc8181" : "var(--dark-border)",
                  cursor: "pointer",
                }}
                onFocus={(e) => { e.target.style.borderColor = errors.hora ? "#fc8181" : "var(--gold)"; }}
                onBlur={(e) => { e.target.style.borderColor = errors.hora ? "#fc8181" : "var(--dark-border)"; }}
              >
                <option value="">-- Hora --</option>
                {!isWed && (
                  <optgroup label="Comidas">
                    {LUNCH_SLOTS.map(h => <option key={h} value={h}>{h}</option>)}
                  </optgroup>
                )}
                <optgroup label="Cenas">
                  {DINNER_SLOTS.map(h => <option key={h} value={h}>{h}</option>)}
                </optgroup>
              </select>
              {errors.hora && <p style={errCls}>{errors.hora}</p>}
            </div>
            <div>
              <label style={labelCls}>Personas *</label>
              <select
                value={form.personas}
                onChange={(e) => set("personas", e.target.value)}
                style={{ ...inputCls, cursor: "pointer" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--dark-border)"; }}
              >
                {[1,2,3,4,5,6,7,8,9,10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? "persona" : "personas"}</option>
                ))}
                <option value="11">Grupo +10</option>
              </select>
            </div>
          </div>

          {/* Notas */}
          <div>
            <label style={labelCls}>Notas internas</label>
            <textarea
              value={form.notas}
              onChange={(e) => set("notas", e.target.value)}
              rows={2}
              placeholder="Alergias, preferencias, ocasión especial..."
              style={{ ...inputCls, resize: "none" }}
              onFocus={(e) => { e.target.style.borderColor = "var(--gold)"; }}
              onBlur={(e) => { e.target.style.borderColor = "var(--dark-border)"; }}
            />
          </div>

          {/* Estado inicial */}
          <div>
            <label style={labelCls}>Estado inicial</label>
            <div className="flex gap-2">
              {(["confirmed", "pending"] as ReservationStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => set("status", s)}
                  className="flex-1 py-2 text-xs font-semibold rounded-lg transition-all"
                  style={{
                    backgroundColor: form.status === s
                      ? s === "confirmed" ? "rgba(72,187,120,0.2)" : "rgba(200,136,58,0.15)"
                      : "var(--dark-surface)",
                    border: `1px solid ${form.status === s
                      ? s === "confirmed" ? "rgba(72,187,120,0.5)" : "rgba(200,136,58,0.5)"
                      : "var(--dark-border)"}`,
                    color: form.status === s
                      ? s === "confirmed" ? "#48bb78" : "var(--gold-light)"
                      : "var(--text-muted)",
                  }}
                >
                  {s === "confirmed" ? "✓ Confirmada" : "⏳ Pendiente"}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div
            className="flex gap-3 pt-2"
            style={{ borderTop: "1px solid var(--dark-border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm rounded-xl"
              style={{
                backgroundColor: "var(--dark-surface)",
                border: "1px solid var(--dark-border)",
                color: "var(--text-muted)",
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 text-sm font-bold rounded-xl transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: "var(--gold)",
                color: "var(--dark-bg)",
                border: "none",
              }}
            >
              {loading ? "Guardando..." : "Crear Reserva"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────── */
export default function AdminDashboard({ onLogout }: { onLogout?: () => void }) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [filterStatus, setFilterStatus] = useState<ReservationStatus | "all">("all");
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showNewModal, setShowNewModal] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const url = debouncedSearch
        ? `/api/reservations?search=${encodeURIComponent(debouncedSearch)}`
        : "/api/reservations";
      const res = await fetch(url);
      const json = await res.json();
      if (json.success) setReservations(json.data);
    } catch {
      showToast("Error al cargar reservas", "error");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const updateStatus = async (id: number, status: ReservationStatus) => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/reservations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? { ...r, status } : r))
        );
        if (selected?.id === id) setSelected((p) => p ? { ...p, status } : null);
        showToast(`Reserva ${STATUS_LABELS[status].toLowerCase()}`, "success");
      } else {
        showToast(json.error || "Error al actualizar", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const deleteReservation = async (id: number) => {
    setActionLoading(id);
    setDeleteConfirm(null);
    try {
      const res = await fetch(`/api/reservations/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        setReservations((prev) => prev.filter((r) => r.id !== id));
        if (selected?.id === id) setSelected(null);
        showToast("Reserva eliminada", "success");
      } else {
        showToast(json.error || "Error al eliminar", "error");
      }
    } catch {
      showToast("Error de conexión", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreated = (r: Reservation) => {
    setReservations((prev) => [r, ...prev]);
    setSelected(r);
  };

  const filtered = reservations.filter((r) =>
    filterStatus === "all" ? true : r.status === filterStatus
  );

  const counts = {
    all: reservations.length,
    pending: reservations.filter((r) => r.status === "pending").length,
    confirmed: reservations.filter((r) => r.status === "confirmed").length,
    cancelled: reservations.filter((r) => r.status === "cancelled").length,
  };

  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--dark-surface)",
    border: "1px solid var(--dark-border)",
    color: "var(--cream)",
    borderRadius: "0.5rem",
    padding: "0.625rem 1rem",
    fontSize: "0.875rem",
    outline: "none",
  };

  return (
    <div style={{ backgroundColor: "var(--dark-bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between"
        style={{
          backgroundColor: "rgba(13, 8, 5, 0.97)",
          borderBottom: "1px solid var(--dark-border)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-3">
          <a href="/" className="hidden sm:flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)", textDecoration: "none" }}>
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
            Sitio web
          </a>
          <span className="hidden sm:block" style={{ color: "var(--dark-border)" }}>|</span>
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="IL Capo Mangia" className="h-9 w-auto" />
            <span className="text-base font-semibold" style={{ color: "var(--cream)", fontFamily: "Georgia, serif" }}>
              Panel de Administración
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* NEW BOOKING BUTTON */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
            style={{
              backgroundColor: "var(--gold)",
              color: "var(--dark-bg)",
              border: "none",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">Nueva Reserva</span>
            <span className="sm:hidden">Nueva</span>
          </button>
          <button
            onClick={fetchReservations}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)", color: "var(--gold)" }}
            title="Actualizar"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
              style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)", color: "var(--text-muted)" }}
              title="Cerrar sesión"
              onMouseEnter={(e) => { e.currentTarget.style.color = "#fc8181"; e.currentTarget.style.borderColor = "rgba(229,62,62,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)"; e.currentTarget.style.borderColor = "var(--dark-border)"; }}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
              </svg>
              <span className="hidden sm:inline">Salir</span>
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { key: "all", label: "Total", count: counts.all },
            { key: "pending", label: "Pendientes", count: counts.pending },
            { key: "confirmed", label: "Confirmadas", count: counts.confirmed },
            { key: "cancelled", label: "Canceladas", count: counts.cancelled },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilterStatus(stat.key as ReservationStatus | "all")}
              className="p-4 rounded-xl text-left transition-all duration-200"
              style={{
                backgroundColor: filterStatus === stat.key ? "rgba(200, 136, 58, 0.15)" : "var(--dark-card)",
                border: `1px solid ${filterStatus === stat.key ? "var(--gold)" : "var(--dark-border)"}`,
              }}
            >
              <div className="text-2xl font-bold" style={{ color: "var(--gold)", fontFamily: "Georgia, serif" }}>
                {stat.count}
              </div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </div>
            </button>
          ))}
        </div>

        {/* Search + Quick New */}
        <div className="mb-5 flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--text-muted)"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, email o teléfono..."
              style={{ ...inputStyle, paddingLeft: "2.5rem", width: "100%" }}
            />
          </div>
          {/* Secondary "New" button in content area for visibility */}
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold transition-all shrink-0"
            style={{
              backgroundColor: "rgba(200,136,58,0.12)",
              border: "1px solid rgba(200,136,58,0.4)",
              color: "var(--gold)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(200,136,58,0.2)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(200,136,58,0.12)"; }}
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Añadir reserva
          </button>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-5 gap-5">
          {/* Table */}
          <div className="lg:col-span-3">
            <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--dark-border)" }}>
              {loading ? (
                <div className="flex items-center justify-center py-16" style={{ backgroundColor: "var(--dark-card)" }}>
                  <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: "var(--dark-border)", borderTopColor: "var(--gold)" }}
                  />
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16" style={{ backgroundColor: "var(--dark-card)" }}>
                  <div className="text-4xl mb-3">📋</div>
                  <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                    {search ? "No se encontraron reservas" : "No hay reservas aún"}
                  </div>
                  {!search && (
                    <button
                      onClick={() => setShowNewModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
                      style={{
                        backgroundColor: "rgba(200,136,58,0.15)",
                        border: "1px solid rgba(200,136,58,0.4)",
                        color: "var(--gold)",
                      }}
                    >
                      + Crear primera reserva
                    </button>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr style={{ backgroundColor: "var(--dark-surface)", borderBottom: "1px solid var(--dark-border)" }}>
                        <th className="text-left px-4 py-3 text-xs tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Cliente</th>
                        <th className="text-left px-4 py-3 text-xs tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Fecha / Hora</th>
                        <th className="text-left px-4 py-3 text-xs tracking-wider uppercase hidden sm:table-cell" style={{ color: "var(--text-muted)" }}>Personas</th>
                        <th className="text-left px-4 py-3 text-xs tracking-wider uppercase" style={{ color: "var(--text-muted)" }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => setSelected(r)}
                          className="cursor-pointer transition-colors"
                          style={{
                            borderBottom: "1px solid var(--dark-border)",
                            backgroundColor: selected?.id === r.id
                              ? "rgba(200, 136, 58, 0.1)"
                              : "var(--dark-card)",
                          }}
                          onMouseEnter={(e) => {
                            if (selected?.id !== r.id)
                              e.currentTarget.style.backgroundColor = "var(--dark-surface)";
                          }}
                          onMouseLeave={(e) => {
                            if (selected?.id !== r.id)
                              e.currentTarget.style.backgroundColor = "var(--dark-card)";
                          }}
                        >
                          <td className="px-4 py-3">
                            <div className="text-sm font-medium" style={{ color: "var(--cream)" }}>{r.nombre}</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{r.telefono}</div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm" style={{ color: "var(--cream)" }}>{r.fecha}</div>
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>{r.hora}</div>
                          </td>
                          <td className="px-4 py-3 hidden sm:table-cell">
                            <span className="text-sm" style={{ color: "var(--cream-muted)" }}>{r.personas} pax</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_STYLES[r.status]}`}>
                              {STATUS_LABELS[r.status]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
              {filtered.length} reserva{filtered.length !== 1 ? "s" : ""}
              {filterStatus !== "all" ? ` ${STATUS_LABELS[filterStatus as ReservationStatus].toLowerCase()}s` : ""}
              {search ? ` · filtrado por "${search}"` : ""}
            </p>
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <div
                className="rounded-xl p-5 sticky top-24"
                style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-lg font-bold" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>
                      {selected.nombre}
                    </h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium mt-1 inline-block ${STATUS_STYLES[selected.status]}`}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="text-xl leading-none"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-3 mb-5">
                  {[
                    { icon: "📅", label: "Fecha", value: selected.fecha },
                    { icon: "🕐", label: "Hora", value: selected.hora },
                    { icon: "👥", label: "Personas", value: `${selected.personas} persona${selected.personas !== 1 ? "s" : ""}` },
                    { icon: "📞", label: "Teléfono", value: selected.telefono, href: `tel:${selected.telefono}` },
                    ...(selected.email ? [{ icon: "✉️", label: "Email", value: selected.email, href: `mailto:${selected.email}` }] : []),
                  ].map((item) => (
                    <div key={item.label} className="flex gap-3">
                      <span className="text-sm">{item.icon}</span>
                      <div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>{item.label}</div>
                        {item.href ? (
                          <a href={item.href} className="text-sm" style={{ color: "var(--gold)" }}>{item.value}</a>
                        ) : (
                          <div className="text-sm" style={{ color: "var(--cream)" }}>{item.value}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  {selected.notas && (
                    <div className="flex gap-3">
                      <span className="text-sm">📝</span>
                      <div>
                        <div className="text-xs" style={{ color: "var(--text-muted)" }}>Notas</div>
                        <div className="text-sm" style={{ color: "var(--cream-muted)", fontStyle: "italic" }}>{selected.notas}</div>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3">
                    <span className="text-sm">🕒</span>
                    <div>
                      <div className="text-xs" style={{ color: "var(--text-muted)" }}>Recibida</div>
                      <div className="text-xs" style={{ color: "var(--cream-muted)" }}>{formatDate(selected.createdAt)}</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  {selected.status !== "confirmed" && (
                    <button
                      onClick={() => updateStatus(selected.id, "confirmed")}
                      disabled={actionLoading === selected.id}
                      className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "rgba(72, 187, 120, 0.2)", color: "#48bb78", border: "1px solid rgba(72, 187, 120, 0.3)" }}
                    >
                      ✓ Confirmar Reserva
                    </button>
                  )}
                  {selected.status !== "pending" && selected.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(selected.id, "pending")}
                      disabled={actionLoading === selected.id}
                      className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "rgba(200, 136, 58, 0.15)", color: "var(--gold-light)", border: "1px solid rgba(200, 136, 58, 0.3)" }}
                    >
                      ↩ Marcar Pendiente
                    </button>
                  )}
                  {selected.status !== "cancelled" && (
                    <button
                      onClick={() => updateStatus(selected.id, "cancelled")}
                      disabled={actionLoading === selected.id}
                      className="w-full py-2.5 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50"
                      style={{ backgroundColor: "rgba(229, 62, 62, 0.1)", color: "#fc8181", border: "1px solid rgba(229, 62, 62, 0.3)" }}
                    >
                      ✕ Cancelar Reserva
                    </button>
                  )}
                  <div className="pt-1" style={{ borderTop: "1px solid var(--dark-border)" }}>
                    {deleteConfirm === selected.id ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => deleteReservation(selected.id)}
                          disabled={actionLoading === selected.id}
                          className="flex-1 py-2 text-xs font-semibold rounded-lg"
                          style={{ backgroundColor: "rgba(229, 62, 62, 0.2)", color: "#fc8181", border: "1px solid rgba(229, 62, 62, 0.4)" }}
                        >
                          Confirmar eliminación
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-3 py-2 text-xs rounded-lg"
                          style={{ backgroundColor: "var(--dark-surface)", color: "var(--text-muted)", border: "1px solid var(--dark-border)" }}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(selected.id)}
                        className="w-full py-2.5 text-sm text-center rounded-lg transition-opacity"
                        style={{ color: "var(--text-muted)", background: "none", border: "1px solid var(--dark-border)" }}
                      >
                        🗑 Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="rounded-xl p-8 flex flex-col items-center justify-center text-center"
                style={{ backgroundColor: "var(--dark-card)", border: "1px dashed var(--dark-border)", minHeight: "200px" }}
              >
                <div className="text-4xl mb-3">👆</div>
                <div className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
                  Selecciona una reserva para ver los detalles y gestionar su estado
                </div>
                <button
                  onClick={() => setShowNewModal(true)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold"
                  style={{
                    backgroundColor: "rgba(200,136,58,0.15)",
                    border: "1px solid rgba(200,136,58,0.4)",
                    color: "var(--gold)",
                  }}
                >
                  + Nueva reserva manual
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg"
          style={{
            backgroundColor: toast.type === "success" ? "rgba(72, 187, 120, 0.95)" : "rgba(229, 62, 62, 0.95)",
            color: "white",
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* New Booking Modal */}
      {showNewModal && (
        <NewBookingModal
          onClose={() => setShowNewModal(false)}
          onCreated={handleCreated}
          showToast={showToast}
        />
      )}
    </div>
  );
}
