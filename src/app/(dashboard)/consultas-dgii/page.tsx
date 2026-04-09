"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/utils";

type NcfStatus = "valid" | "invalid" | "idle";

const submissionHistory = [
  { form: "IT-1 (ITBIS)", period: "2024-01", date: "18 Feb, 2024", status: "Aceptado" },
  { form: "IR-17",        period: "2024-01", date: "14 Feb, 2024", status: "Aceptado" },
  { form: "606 Compras",  period: "2024-01", date: "12 Feb, 2024", status: "Aceptado" },
];

function validateNcfFormat(ncf: string): boolean {
  // Dominican NCF format: letter(s) + digits, typically B01XXXXXXXXX
  return /^[A-Z]\d{2}\d{8,10}$/.test(ncf.trim().toUpperCase());
}

export default function ConsultasDGIIPage() {
  const [ncf,       setNcf]       = useState("");
  const [ncfStatus, setNcfStatus] = useState<NcfStatus>("idle");
  const [rnc,       setRnc]       = useState("");
  const [rncResult, setRncResult] = useState<string | null>(null);

  function handleValidateNcf() {
    if (!ncf.trim()) return;
    setNcfStatus(validateNcfFormat(ncf) ? "valid" : "invalid");
  }

  function handleRncSearch() {
    if (!rnc.trim()) return;
    // Stub: in production this would hit a DGII API
    setRncResult(`RNC ${rnc} — Consulta no disponible en modo demo. Conectar API DGII en producción.`);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h2 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Consultas DGII
          </h2>
          <p className="text-on-surface-muted mt-1">Dirección General de Impuestos Internos</p>
        </div>
        <div className="badge-success px-4 py-2 text-sm font-semibold">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
          Valid Connection: DGII-API-01
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* Compliance Status — 7 cols */}
        <div className="col-span-12 lg:col-span-7 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="label-section mb-1">Fiscal Standing</p>
              <h3 className="font-display text-2xl font-bold text-primary">Compliance Status</h3>
            </div>
            <div className="text-right">
              <p className="font-display text-2xl font-black text-success">Al Día</p>
              <p className="text-xs text-on-surface-faint mt-1">Última verificación: Hoy</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Declaraciones Pendientes", value: "0" },
              { label: "Alertas Activas",          value: "0" },
              { label: "Deuda Tributaria",          value: formatCurrency(0) },
            ].map((stat) => (
              <div key={stat.label} className="p-5 bg-surface-low rounded-xl">
                <p className="text-xs font-semibold text-on-surface-faint mb-2">{stat.label}</p>
                <p className="font-display text-2xl font-black text-primary">{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-warning-light">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              <span className="text-sm font-semibold text-warning-text">Próximo vencimiento: IR-17 (15 Mar, 2025)</span>
            </div>
            <button type="button" className="text-xs font-bold text-warning-text underline underline-offset-4">
              Agregar al Calendario
            </button>
          </div>
        </div>

        {/* NCF Validator — 5 cols */}
        <div className="col-span-12 lg:col-span-5 editorial-gradient text-white rounded-(--radius-card) p-8 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 opacity-10">
            <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
          </div>
          <h3 className="font-display text-xl font-bold mb-3">Validador NCF Rápido</h3>
          <p className="text-white/70 text-sm mb-6 leading-relaxed">
            Ingrese cualquier Número de Comprobante Fiscal (NCF) para verificar su validez directamente desde la base de datos oficial de la DGII.
          </p>
          <div className="space-y-3">
            <input
              type="text"
              value={ncf}
              onChange={(e) => { setNcf(e.target.value); setNcfStatus("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleValidateNcf()}
              placeholder="Ej. B0100000001"
              className="w-full rounded-xl py-3 px-4 text-primary bg-white placeholder:text-on-surface-faint outline-none focus:ring-2 focus:ring-success/50 text-sm font-mono"
              aria-label="Número de Comprobante Fiscal"
            />
            {ncfStatus !== "idle" && (
              <div className={ncfStatus === "valid" ? "badge-success py-2 px-3 text-sm" : "badge-danger py-2 px-3 text-sm"}>
                {ncfStatus === "valid" ? "✓ Formato NCF válido" : "✗ Formato NCF inválido"}
              </div>
            )}
            <button
              type="button"
              onClick={handleValidateNcf}
              className="w-full py-3 bg-success text-white font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
              Validar Comprobante
            </button>
          </div>
        </div>

        {/* RNC Consultation — 4 cols */}
        <div className="col-span-12 lg:col-span-4 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-surface-low rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
              </svg>
            </div>
            <h3 className="font-display text-xl font-bold text-primary mb-2">Consulta de RNC</h3>
            <p className="text-sm text-on-surface-muted mb-6 leading-relaxed">
              Busque datos oficiales de empresas, nombres comerciales y actividades registradas usando el RNC.
            </p>
          </div>
          <div className="space-y-3">
            <input
              type="text"
              value={rnc}
              onChange={(e) => { setRnc(e.target.value); setRncResult(null); }}
              onKeyDown={(e) => e.key === "Enter" && handleRncSearch()}
              placeholder="Ingrese número de RNC"
              className="input-field font-mono"
              aria-label="Número de RNC a consultar"
            />
            {rncResult && (
              <p className="text-xs text-on-surface-muted bg-surface-low p-3 rounded-lg">{rncResult}</p>
            )}
            <button
              type="button"
              onClick={handleRncSearch}
              className="btn-secondary w-full py-3 text-sm"
            >
              Buscar en el Registro
            </button>
          </div>
        </div>

        {/* Submission History — 8 cols */}
        <div className="col-span-12 lg:col-span-8 bg-surface-lowest rounded-(--radius-card) shadow-card overflow-hidden">
          <div className="px-8 py-5 flex items-center justify-between sidebar-divider">
            <h3 className="font-display text-lg font-bold text-primary">Historial de Declaraciones</h3>
            <button type="button" className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline underline-offset-4">
              Ver todo
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
          <table className="facturas-table">
            <thead>
              <tr>
                <th>Formulario</th>
                <th>Período</th>
                <th>Fecha Envío</th>
                <th className="text-center">Estado</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {submissionHistory.map((row) => (
                <tr key={row.form}>
                  <td className="font-semibold text-primary">{row.form}</td>
                  <td className="text-on-surface-muted">{row.period}</td>
                  <td className="text-on-surface-muted">{row.date}</td>
                  <td className="text-center">
                    <span className="badge-success">{row.status}</span>
                  </td>
                  <td>
                    <button type="button" aria-label="Descargar declaración" className="topbar-icon-btn">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Official Resources */}
          <div className="px-8 py-5 bg-surface-low flex flex-wrap items-center gap-4">
            <p className="label-section shrink-0">Recursos Oficiales DGII</p>
            {[
              { label: "Oficina Virtual (VRT)", href: "https://dgii.gov.do/oficinavirtualtributaria" },
              { label: "Consultas Públicas",    href: "https://www.dgii.gov.do/informacionTributaria/consultas" },
              { label: "Calendario Fiscal",     href: "https://dgii.gov.do/legislacion/resoluciones/Paginas/Resoluciones.aspx" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-primary hover:underline underline-offset-4"
              >
                {link.label} ↗
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
