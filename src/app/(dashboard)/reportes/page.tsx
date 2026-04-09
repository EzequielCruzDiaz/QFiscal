import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

type MonthData = { mes: string; total: number; itbis: number };

export default async function ReportesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles").select("empresa_id").eq("id", user!.id).single();

  const empresaId = profile?.empresa_id ?? "";
  const year = new Date().getFullYear();

  const { data: facturas } = await supabase
    .from("facturas")
    .select("total, itbis, subtotal, estado, fecha_factura")
    .eq("empresa_id", empresaId)
    .gte("fecha_factura", `${year}-01-01`)
    .lte("fecha_factura", `${year}-12-31`);

  // Aggregate by month
  const monthlyData: MonthData[] = MONTHS.map((mes, i) => {
    const month = String(i + 1).padStart(2, "0");
    const rows = (facturas ?? []).filter((f) =>
      f.fecha_factura?.startsWith(`${year}-${month}`)
    );
    return {
      mes,
      total: rows.reduce((s, f) => s + (f.total ?? 0), 0),
      itbis: rows.reduce((s, f) => s + (f.itbis ?? 0), 0),
    };
  });

  const ingresosTotales  = (facturas ?? []).reduce((s, f) => s + (f.total ?? 0), 0);
  const gastosTotales    = (facturas ?? []).reduce((s, f) => s + (f.subtotal ?? 0), 0);
  const itbisTotales     = (facturas ?? []).reduce((s, f) => s + (f.itbis ?? 0), 0);
  const margenNeto       = ingresosTotales - gastosTotales;
  const pendientes       = (facturas ?? [])
    .filter((f) => f.estado === "pendiente")
    .reduce((s, f) => s + (f.total ?? 0), 0);

  const maxMonthTotal = Math.max(...monthlyData.map((m) => m.total), 1);

  const last3Months = monthlyData
    .filter((m) => m.total > 0)
    .slice(-3)
    .reverse();

  const currentMonth = new Date().toLocaleDateString("es-DO", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <p className="label-section mb-1">Financial Insights</p>
          <h2 className="font-display text-3xl font-extrabold text-primary tracking-tight">
            Reportes y Estados Financieros
          </h2>
          <p className="text-on-surface-muted mt-1">Período Fiscal: {currentMonth}</p>
        </div>
        <Link
          href="/chat"
          className="btn-primary flex items-center gap-2 py-3.5 px-6"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
          Solicitar interpretación al Asistente IA
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">

        {/* P&L Card — 8 cols */}
        <div className="col-span-12 lg:col-span-8 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h3 className="font-display text-xl font-bold text-primary mb-1">Estado de Resultados (P&amp;L)</h3>
              <p className="text-sm text-on-surface-muted">Rendimiento operativo anual</p>
            </div>
            <div className="flex gap-2">
              <span className="badge-success">DOP$</span>
              <span className="badge-info">Anual</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="h-48 flex items-end gap-2 mb-6">
            {monthlyData.map((m) => {
              const pct = maxMonthTotal > 0 ? Math.round((m.total / maxMonthTotal) * 100) : 0;
              const isCurrentMonth = MONTHS[new Date().getMonth()] === m.mes;
              return (
                <div key={m.mes} className="flex-1 flex flex-col items-center gap-1" title={`${m.mes}: ${formatCurrency(m.total)}`}>
                  <div className="w-full flex flex-col justify-end" style={{ height: "160px" }}>
                    <div
                      className={`w-full rounded-t-lg transition-all ${isCurrentMonth ? "bg-primary" : "bg-surface-high hover:bg-primary/30"}`}
                      style={{ height: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-on-surface-faint font-medium">{m.mes}</span>
                </div>
              );
            })}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-6 pt-6 sidebar-divider">
            <div>
              <p className="label-section mb-1">Ingresos Totales</p>
              <p className="font-display text-2xl font-black text-primary">{formatCurrency(ingresosTotales)}</p>
              <div className="flex items-center gap-1 mt-1 text-success text-xs font-bold">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                Período actual
              </div>
            </div>
            <div>
              <p className="label-section mb-1">Gastos Operativos</p>
              <p className="font-display text-2xl font-black text-primary">{formatCurrency(gastosTotales)}</p>
              <p className="text-xs text-on-surface-faint mt-1">Sin ITBIS</p>
            </div>
            <div>
              <p className="label-section mb-1">Margen Neto</p>
              <p className="font-display text-2xl font-black text-success">{formatCurrency(margenNeto)}</p>
              <p className="text-xs text-on-surface-faint mt-1">ITBIS: {formatCurrency(itbisTotales)}</p>
            </div>
          </div>
        </div>

        {/* Balance General — 4 cols */}
        <div className="col-span-12 lg:col-span-4 editorial-gradient rounded-(--radius-card) p-8 text-white flex flex-col justify-between">
          <div>
            <h3 className="font-display text-xl font-bold mb-6">Balance General</h3>
            <div className="space-y-5">
              <div className="flex justify-between items-end pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Activos Totales</p>
                  <p className="font-display text-2xl font-bold">{formatCurrency(ingresosTotales)}</p>
                </div>
                <svg className="w-6 h-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18-3a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 013 6v3m18-3V6" />
                </svg>
              </div>
              <div className="flex justify-between items-end pb-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Pasivos Totales</p>
                  <p className="font-display text-2xl font-bold">{formatCurrency(pendientes)}</p>
                </div>
                <svg className="w-6 h-6 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                </svg>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider opacity-60 mb-1">Patrimonio Neto</p>
                  <p className="font-display text-3xl font-black" style={{ color: "#86f8c9" }}>
                    {formatCurrency(margenNeto)}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm italic opacity-60">
              "Mantén un ratio de solvencia positivo para una salud financiera óptima."
            </p>
          </div>
        </div>

        {/* Monthly Summary — 6 cols */}
        <div className="col-span-12 lg:col-span-6 bg-surface-low rounded-(--radius-card) p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-lg font-bold text-primary">
              Resumen Mensual: Ingresos vs Gastos
            </h3>
            <button type="button" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
              Ver todo →
            </button>
          </div>
          <div className="space-y-3">
            {last3Months.length > 0 ? last3Months.map((m) => {
              const gastoPct = m.total > 0 ? Math.round((m.itbis / m.total) * 100) : 0;
              const netoPct  = 100 - gastoPct;
              return (
                <div key={m.mes} className="bg-surface-lowest p-4 rounded-xl">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-primary">{m.mes}</span>
                    <span className="text-on-surface-muted">
                      Neto: <span className="text-success font-bold">{formatCurrency(m.total - m.itbis)}</span>
                    </span>
                  </div>
                  <div className="h-2 w-full bg-surface-high rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary rounded-l-full" style={{ width: `${netoPct}%` }} />
                    <div className="h-full bg-warning rounded-r-full" style={{ width: `${gastoPct}%` }} />
                  </div>
                </div>
              );
            }) : (
              <div className="text-center py-8 text-on-surface-faint text-sm">
                No hay datos de períodos anteriores.
              </div>
            )}
          </div>
        </div>

        {/* Cash Flow — 6 cols */}
        <div className="col-span-12 lg:col-span-6 bg-surface-lowest rounded-(--radius-card) p-8 shadow-card">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display text-lg font-bold text-primary">Flujo de Caja (Cash Flow)</h3>
              <span className="badge-warning text-xs mt-1">Siguiente Pago DOP {new Date().toLocaleDateString("es-DO", { month: "long" }).toUpperCase()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div className="p-5 bg-success-light rounded-xl">
              <p className="label-section text-success-text mb-2">Entradas de Efectivo</p>
              <p className="font-display text-xl font-black text-primary">{formatCurrency(ingresosTotales)}</p>
              <div className="flex items-center gap-1 mt-2">
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                </svg>
                <span className="text-xs font-semibold text-success">Positivo</span>
              </div>
            </div>
            <div className="p-5 bg-danger-light rounded-xl">
              <p className="label-section text-danger mb-2">Salidas de Efectivo</p>
              <p className="font-display text-xl font-black text-primary">{formatCurrency(gastosTotales)}</p>
              <div className="flex items-center gap-1 mt-2">
                <svg className="w-4 h-4 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
                </svg>
                <span className="text-xs font-semibold text-danger">Gastos</span>
              </div>
            </div>
          </div>
          <div className="p-4 bg-surface-low rounded-xl flex items-center justify-between">
            <div>
              <p className="label-section mb-1">Disponibilidad en Banco</p>
              <p className="font-display text-lg font-black text-primary">{formatCurrency(margenNeto)}</p>
            </div>
            <button type="button" aria-label="Descargar flujo de caja" className="topbar-icon-btn">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap gap-4 pt-4">
        <button type="button" className="btn-secondary flex items-center gap-2 py-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          Descargar Dossier Completo (PDF, XLSX)
        </button>
        <button type="button" className="btn-secondary flex items-center gap-2 py-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Programar Reporte
        </button>
        <button type="button" className="btn-secondary flex items-center gap-2 py-3">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Exportar Datos
        </button>
      </div>
    </div>
  );
}
