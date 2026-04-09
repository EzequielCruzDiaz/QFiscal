"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "contabrd_register_draft";

type TipoContrib = "fisica" | "juridica";
type Step = 1 | 2 | 3;

const MONTHS = [
  { value: "1",  label: "Enero" },
  { value: "2",  label: "Febrero" },
  { value: "3",  label: "Marzo" },
  { value: "4",  label: "Abril" },
  { value: "5",  label: "Mayo" },
  { value: "6",  label: "Junio" },
  { value: "7",  label: "Julio" },
  { value: "8",  label: "Agosto" },
  { value: "9",  label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const STEP_LABELS: Record<Step, string> = {
  1: "Datos de Administrador",
  2: "Validación Fiscal",
  3: "Configuración de Período",
};

export default function RegisterPage() {
  const router   = useRouter();
  const supabase = createClient();

  function readDraft() {
    if (typeof window === "undefined") return null;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  const [step, setStep]             = useState<Step>(() => readDraft()?.step ?? 1);
  const [nombre,    setNombre]       = useState<string>(() => readDraft()?.nombre ?? "");
  const [email,     setEmail]        = useState<string>(() => readDraft()?.email ?? "");
  const [password,  setPassword]     = useState<string>(() => readDraft()?.password ?? "");
  const [tipo,      setTipo]         = useState<TipoContrib>(() => readDraft()?.tipo ?? "juridica");
  const [rnc,       setRnc]          = useState<string>(() => readDraft()?.rnc ?? "");
  const [razonSocial, setRazonSocial]= useState<string>(() => readDraft()?.razonSocial ?? "");
  const [direccion, setDireccion]    = useState<string>(() => readDraft()?.direccion ?? "");
  const [mesInicio, setMesInicio]    = useState<string>(() => readDraft()?.mesInicio ?? "1");
  const [moneda,    setMoneda]       = useState<string>(() => readDraft()?.moneda ?? "DOP");

  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState<string | null>(null);

  // Persist draft on every change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        step, nombre, email, password, tipo, rnc, razonSocial, direccion, mesInicio, moneda,
      }));
    } catch {
      // ignore quota errors
    }
  }, [step, nombre, email, password, tipo, rnc, razonSocial, direccion, mesInicio, moneda]);

  function advance() {
    setError(null);
    if (step === 1) {
      if (!nombre.trim() || !email.trim() || password.length < 6) {
        setError("Complete todos los campos. La contraseña debe tener al menos 6 caracteres.");
        return;
      }
    }
    if (step === 2 && !razonSocial.trim()) {
      setError("La razón social es obligatoria.");
      return;
    }
    setStep((s) => (s + 1) as Step);
  }

  function back() {
    setError(null);
    setStep((s) => (s - 1) as Step);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Error al crear la cuenta.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/setup-empresa", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId:    data.user.id,
        nombre:    razonSocial || nombre,
        rnc:       rnc || null,
        tipo,
        direccion: direccion || null,
        mesInicio: parseInt(mesInicio),
        moneda,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error ?? "Error al configurar la empresa.");
      setLoading(false);
      return;
    }

    sessionStorage.removeItem(STORAGE_KEY);
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface">
      {/* Top Nav */}
      <header className="bg-surface-low sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="font-display font-extrabold text-xl tracking-tight text-primary">QFiscal</span>
          <Link href="/login" className="text-sm font-semibold text-on-surface-muted hover:text-primary transition-colors">
            Acceso Socios
          </Link>
        </nav>
      </header>

      <main className="grow flex items-center justify-center py-12 px-6">
        <div className="auth-card w-full max-w-5xl flex flex-col md:flex-row overflow-hidden">

          {/* ── Sidebar ── */}
          <div className="register-sidebar md:w-1/3 p-10 flex flex-col justify-between text-white relative overflow-hidden">
            <div className="brand-ring-1" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-success/10 blur-3xl" />

            <div className="relative z-10">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-success-light mb-4">
                  <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-white leading-tight">
                  Configuración de Identidad Fiscal
                </h2>
                <p className="mt-3 text-sm leading-relaxed opacity-70">
                  Complete el perfil de su organización para habilitar la arquitectura contable según las normativas dominicanas.
                </p>
              </div>

              <div className="space-y-5">
                {([1, 2, 3] as Step[]).map((s) => {
                  const isActive = step === s;
                  const isDone   = step > s;
                  return (
                    <div key={s} className={`flex items-center gap-4 ${!isActive && !isDone ? "opacity-50" : ""}`}>
                      <div className={isDone ? "step-done" : isActive ? "step-active" : "step-pending"}>
                        {isDone ? (
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : s}
                      </div>
                      <span className={`font-display font-semibold text-sm ${isActive ? "text-white" : "text-white/70"}`}>
                        {STEP_LABELS[s]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <div className="p-4 rounded-xl bg-white/5">
                <p className="text-xs italic opacity-70">"La precisión es la base de la confianza financiera."</p>
              </div>
            </div>
          </div>

          {/* ── Form ── */}
          <div className="bg-surface-lowest md:w-2/3 p-8 md:p-12">
            <div className="mb-8">
              <h3 className="font-display text-3xl font-extrabold text-primary tracking-tight">
                Registro de Empresa
              </h3>
              <p className="text-on-surface-muted mt-2">
                {STEP_LABELS[step]}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

              {/* ── Step 1: Datos de Administrador ── */}
              {step === 1 && (
                <div>
                  <div className="form-section-label"><span>Información de Usuario</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-section block mb-2" htmlFor="nombre">Nombre del Administrador</label>
                      <input
                        id="nombre" type="text" value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="label-section block mb-2" htmlFor="email">Correo Electrónico</label>
                      <input
                        id="email" type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="jperez@empresa.do"
                        className="input-field"
                      />
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className="label-section block mb-2" htmlFor="password">Contraseña</label>
                    <input
                      id="password" type="password" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="input-field"
                    />
                  </div>
                </div>
              )}

              {/* ── Step 2: Validación Fiscal ── */}
              {step === 2 && (
                <div>
                  <div className="form-section-label"><span>Identidad Fiscal Dominicana</span></div>

                  <div className="mb-5">
                    <p className="label-section mb-3">Tipo de Contribuyente</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button type="button" onClick={() => setTipo("fisica")}
                        className={`type-card text-left ${tipo === "fisica" ? "type-card-selected" : ""}`}>
                        <svg className="w-5 h-5 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        <span className="font-display font-bold text-sm text-primary">Persona Física</span>
                        <span className="text-[10px] text-on-surface-faint mt-1">Profesional independiente</span>
                      </button>
                      <button type="button" onClick={() => setTipo("juridica")}
                        className={`type-card text-left ${tipo === "juridica" ? "type-card-selected" : ""}`}>
                        <svg className="w-5 h-5 text-primary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                        </svg>
                        <span className="font-display font-bold text-sm text-primary">Persona Jurídica</span>
                        <span className="text-[10px] text-on-surface-faint mt-1">Sociedades comerciales</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                    <div>
                      <label className="label-section block mb-2" htmlFor="rnc">RNC</label>
                      <input
                        id="rnc" type="text" value={rnc}
                        onChange={(e) => setRnc(e.target.value)}
                        placeholder="1-31-XXXXX-X"
                        className="input-field tracking-widest"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="label-section block mb-2" htmlFor="razonSocial">Razón Social</label>
                      <input
                        id="razonSocial" type="text" value={razonSocial}
                        onChange={(e) => setRazonSocial(e.target.value)}
                        placeholder="Nombre legal de la empresa"
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label-section block mb-2" htmlFor="direccion">Dirección Fiscal</label>
                    <div className="relative">
                      <input
                        id="direccion" type="text" value={direccion}
                        onChange={(e) => setDireccion(e.target.value)}
                        placeholder="Av. Winston Churchill #123, Santo Domingo"
                        className="input-field input-field-icon"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-faint">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 3: Configuración de Período ── */}
              {step === 3 && (
                <div>
                  <div className="form-section-label"><span>Período Contable</span></div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="label-section block mb-2" htmlFor="mesInicio">Inicio del Ejercicio Fiscal</label>
                      <select
                        id="mesInicio" value={mesInicio}
                        onChange={(e) => setMesInicio(e.target.value)}
                        className="input-field"
                      >
                        {MONTHS.map((m) => (
                          <option key={m.value} value={m.value}>{m.label}</option>
                        ))}
                      </select>
                      <p className="text-[11px] text-on-surface-faint mt-1.5">
                        En RD, la mayoría de empresas inician en enero.
                      </p>
                    </div>
                    <div>
                      <label className="label-section block mb-2" htmlFor="moneda">Moneda Base</label>
                      <select
                        id="moneda" value={moneda}
                        onChange={(e) => setMoneda(e.target.value)}
                        className="input-field"
                      >
                        <option value="DOP">DOP — Peso Dominicano</option>
                        <option value="USD">USD — Dólar Estadounidense</option>
                      </select>
                      <p className="text-[11px] text-on-surface-faint mt-1.5">
                        Moneda funcional para su contabilidad.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {error && <div className="alert-amber text-sm">{error}</div>}

              {/* Navigation */}
              <div className="auth-divider pt-6 flex items-center justify-between gap-4">
                {step > 1 ? (
                  <button type="button" onClick={back} className="btn-secondary px-6 py-3 text-sm">
                    ← Atrás
                  </button>
                ) : (
                  <div />
                )}

                {step < 3 ? (
                  <button type="button" onClick={advance} className="btn-primary px-10 py-4 text-base">
                    Continuar →
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="btn-primary px-10 py-4 text-base">
                    {loading ? "Creando cuenta..." : "Crear Cuenta"}
                  </button>
                )}
              </div>
            </form>

            <div className="auth-divider mt-6 pt-6 text-center">
              <p className="text-sm text-on-surface-muted">
                ¿Ya tiene cuenta?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline underline-offset-4">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="auth-footer py-6 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-on-surface-faint">
            © 2025 QFiscal. República Dominicana. Todos los derechos reservados.
          </p>
          <nav className="flex gap-6">
            {["Privacidad", "Términos de Servicio", "Ayuda Fiscal"].map((link) => (
              <Link key={link} href="#" className="text-sm text-on-surface-faint hover:underline underline-offset-4">
                {link}
              </Link>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}
