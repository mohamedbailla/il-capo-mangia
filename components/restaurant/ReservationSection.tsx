"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLang } from "@/lib/i18n";
import DatePicker from "@/components/restaurant/DatePicker";
import CustomSelect from "@/components/restaurant/CustomSelect";

const schema = (errPhone: string) => z.object({
  nombre: z.string().min(2),
  telefono: z.string()
    .regex(/^\+?[\d\s\-().]{7,15}$/, errPhone)
    .refine((v) => { const d = v.replace(/\D/g, ""); return d.length >= 7 && d.length <= 15; }, errPhone),
  email: z.string().email().optional().or(z.literal("")),
  personas: z.string().min(1),
  fecha: z.string().min(1),
  hora: z.string().min(1),
  notas: z.string().optional(),
});

type FormData = z.infer<ReturnType<typeof schema>>;

const lunchSlots = ["13:00","13:30","14:00","14:30","15:00"];
const dinnerSlots = ["20:00","20:30","21:00","21:30","22:00","22:30"];

function getMinDate() { const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split("T")[0]; }
function getMaxDate() { const d = new Date(); d.setMonth(d.getMonth() + 3); return d.toISOString().split("T")[0]; }
function getDayOfWeek(dateStr: string) { if (!dateStr) return -1; return new Date(dateStr + "T12:00:00").getDay(); }
function isClosedDay(dateStr: string) { return getDayOfWeek(dateStr) === 2; }
function isWednesday(dateStr: string) { return getDayOfWeek(dateStr) === 3; }

export default function ReservationSection() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, lang } = useLang();
  const r = t.reservation;

  const resolver = useMemo(() => zodResolver(schema(r.err_phone)), [lang]);
  const { register, handleSubmit, watch, setValue, formState: { errors }, reset } = useForm<FormData>({ resolver });
  const watchedDate = watch("fecha");
  const watchedHora = watch("hora");
  const watchedPersonas = watch("personas");
  const isWed = isWednesday(watchedDate);

  // Clear a lunch slot if user switches to Wednesday
  if (isWed && watchedHora && lunchSlots.includes(watchedHora)) {
    setValue("hora", "");
  }

  const onSubmit = async (data: FormData) => {
    if (isClosedDay(data.fecha)) { setError(r.err_tuesday); return; }
    if (isWednesday(data.fecha) && lunchSlots.includes(data.hora)) { setError(r.err_wed_lunch); return; }
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, personas: parseInt(data.personas) }),
      });
      const json = await res.json();
      if (json.success) { setSubmitted(true); reset(); }
      else setError(json.error || "Error");
    } catch { setError("Error de conexión"); }
    finally { setLoading(false); }
  };

  const inputStyle = {
    backgroundColor: "var(--dark-surface)", border: "1px solid var(--dark-border)",
    color: "var(--cream)", borderRadius: "0.5rem", padding: "0.75rem 1rem",
    width: "100%", fontSize: "0.875rem", transition: "border-color 0.2s ease", outline: "none",
  };
  const labelStyle = {
    display: "block", fontSize: "0.75rem", letterSpacing: "0.05em",
    textTransform: "uppercase" as const, marginBottom: "0.5rem", color: "var(--cream-muted)",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "var(--gold)"; };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { e.target.style.borderColor = "var(--dark-border)"; };

  return (
    <section id="reservas" className="section-padding" style={{ backgroundColor: "var(--dark-surface)" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
            <span className="text-xs tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>{r.tag}</span>
            <div className="h-px w-10" style={{ backgroundColor: "var(--gold)" }} />
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ fontFamily: "Georgia, serif", color: "var(--cream)" }}>{r.title}</h2>
          <p className="text-base max-w-lg mx-auto" style={{ color: "var(--text-muted)", fontStyle: "italic" }}>{r.subtitle}</p>
          <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>{r.hint}</p>
        </div>

        {submitted ? (
          <div className="text-center py-16 px-8 rounded-2xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--gold)" }}>
            <div className="text-5xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold mb-3" style={{ fontFamily: "Georgia, serif", color: "var(--gold)" }}>{r.success_title}</h3>
            <p className="text-base mb-6" style={{ color: "var(--cream-muted)" }}>{r.success_msg}</p>
            <button onClick={() => setSubmitted(false)} className="px-6 py-3 text-sm font-semibold tracking-wider uppercase rounded-full" style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)" }}>
              {r.success_btn}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl" style={{ backgroundColor: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>{r.nombre}</label>
                <input {...register("nombre")} placeholder={r.nombrePlaceholder} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                {errors.nombre && <p className="text-xs mt-1" style={{ color: "#fc8181" }}>{r.nombre.replace(" *","")}</p>}
              </div>
              <div>
                <label style={labelStyle}>{r.telefono}</label>
                <input {...register("telefono")} placeholder={r.telefonoPlaceholder} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                {errors.telefono && <p className="text-xs mt-1" style={{ color: "#fc8181" }}>{errors.telefono.message || r.telefono.replace(" *","")}</p>}
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>{r.email}</label>
                <input {...register("email")} type="email" placeholder="su@email.com" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label style={labelStyle}>{r.personas}</label>
                <CustomSelect
                  value={watchedPersonas || ""}
                  onChange={(v) => setValue("personas", v, { shouldValidate: true })}
                  placeholder={r.selectPersonas}
                  hasError={!!errors.personas}
                  options={[
                    ...[1,2,3,4,5,6,7,8,9,10].map(n => ({ value: String(n), label: `${n} ${n === 1 ? r.persona : r.personas_pl}` })),
                    { value: "11", label: r.grupos },
                  ]}
                />
                {errors.personas && <p className="text-xs mt-1" style={{ color: "#fc8181" }}>{r.personas.replace(" *","")}</p>}
              </div>
              <div>
                <label style={labelStyle}>{r.fecha}</label>
                <DatePicker
                  value={watchedDate || ""}
                  onChange={(v) => setValue("fecha", v, { shouldValidate: true })}
                  min={getMinDate()}
                  max={getMaxDate()}
                  lang={lang}
                  placeholder={r.selectFecha}
                  hasError={!!errors.fecha}
                />
                {errors.fecha && <p className="text-xs mt-1" style={{ color: "#fc8181" }}>{r.fecha.replace(" *","")}</p>}
                {watchedDate && isClosedDay(watchedDate) && <p className="text-xs mt-1" style={{ color: "#f6a623" }}>{r.warn_tuesday}</p>}
                {watchedDate && isWednesday(watchedDate) && <p className="text-xs mt-1" style={{ color: "#f6a623" }}>{r.warn_wednesday}</p>}
              </div>
              <div>
                <label style={labelStyle}>{r.hora}</label>
                <CustomSelect
                  value={watchedHora || ""}
                  onChange={(v) => setValue("hora", v, { shouldValidate: true })}
                  placeholder={r.selectHora}
                  hasError={!!errors.hora}
                  options={[
                    ...(!isWed ? lunchSlots.map(t => ({ value: t, label: t, group: r.comidas })) : []),
                    ...dinnerSlots.map(t => ({ value: t, label: t, group: r.cenas })),
                  ]}
                />
                {errors.hora && <p className="text-xs mt-1" style={{ color: "#fc8181" }}>{r.hora.replace(" *","")}</p>}
              </div>
              <div className="sm:col-span-2">
                <label style={labelStyle}>{r.notas}</label>
                <textarea {...register("notas")} rows={3} placeholder={r.notasPlaceholder} style={{ ...inputStyle, resize: "none" }} onFocus={onFocus} onBlur={onBlur} />
              </div>
            </div>

            {error && (
              <div className="mt-4 p-4 rounded-lg text-sm" style={{ backgroundColor: "rgba(229,62,62,0.1)", border: "1px solid rgba(229,62,62,0.3)", color: "#fc8181" }}>{error}</div>
            )}

            <button type="submit" disabled={loading} className="w-full mt-6 py-4 text-sm font-bold tracking-widest uppercase rounded-full transition-all duration-300 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed" style={{ backgroundColor: "var(--gold)", color: "var(--dark-bg)", boxShadow: "0 4px 20px rgba(200,136,58,0.3)" }}>
              {loading ? r.submitting : r.submit}
            </button>
            <p className="text-xs text-center mt-4" style={{ color: "var(--text-muted)" }}>{r.fine_print}</p>
          </form>
        )}
      </div>
    </section>
  );
}
