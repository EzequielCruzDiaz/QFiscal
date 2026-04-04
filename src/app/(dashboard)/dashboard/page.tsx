import { createClient } from "@/lib/supabase/server";
import KpiCard from "@/components/dashboard/KpiCard";
import ActivityFeed from "@/components/dashboard/ActivityFeed";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, empresa_id")
    .eq("id", user!.id)
    .single();

  const { count: totalFacturas } = await supabase
    .from("facturas")
    .select("*", { count: "exact", head: true })
    .eq("empresa_id", profile?.empresa_id ?? "");

  const { data: facturasMes } = await supabase
    .from("facturas")
    .select("itbis, total")
    .eq("empresa_id", profile?.empresa_id ?? "")
    .gte("created_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

  const itbisMes = facturasMes?.reduce((sum, f) => sum + (f.itbis ?? 0), 0) ?? 0;
  const ingresosMes = facturasMes?.reduce((sum, f) => sum + (f.total ?? 0), 0) ?? 0;

  const { data: recientes } = await supabase
    .from("facturas")
    .select("id, proveedor, ncf, total, created_at")
    .eq("empresa_id", profile?.empresa_id ?? "")
    .order("created_at", { ascending: false })
    .limit(5);

  const activityItems = (recientes ?? []).map((f) => ({
    id: f.id,
    description: `Factura de ${f.proveedor ?? "desconocido"} — NCF ${f.ncf ?? "N/A"}`,
    time: new Date(f.created_at).toLocaleDateString("es-DO"),
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">
          Hola{profile?.nombre ? `, ${profile.nombre}` : ""}
        </h1>
        <p className="mt-1 text-sm text-gray-400">Resumen de tu actividad contable</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <KpiCard
          title="Facturas registradas"
          value={String(totalFacturas ?? 0)}
          subtitle="Total histórico"
        />
        <KpiCard
          title="ITBIS este mes"
          value={`RD$${itbisMes.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`}
          subtitle="18% sobre compras"
        />
        <KpiCard
          title="Compras este mes"
          value={`RD$${ingresosMes.toLocaleString("es-DO", { minimumFractionDigits: 2 })}`}
          subtitle="Total facturas"
        />
      </div>

      <ActivityFeed items={activityItems} />
    </div>
  );
}
