import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

// Uses service role to bypass RLS — only called server-side during onboarding
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { userId, nombre, rnc, tipo, direccion, mesInicio, moneda } = await req.json();

  if (!userId || !nombre) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  // 1. Crear empresa
  const { data: empresa, error: empresaError } = await supabaseAdmin
    .from("empresas")
    .insert({
      nombre,
      rnc:        rnc        ?? null,
      tipo:       tipo       ?? null,
      direccion:  direccion  ?? null,
      mes_inicio: mesInicio  ?? 1,
      moneda:     moneda     ?? "DOP",
    })
    .select("id")
    .single();

  if (empresaError) {
    return NextResponse.json({ error: empresaError.message }, { status: 500 });
  }

  // 2. Vincular empresa al perfil del usuario recién creado
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      empresa_id: empresa.id,
      rol: "admin",
      // store tipo and direccion in metadata via raw data if needed later
    })
    .eq("id", userId);

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  return NextResponse.json({ empresaId: empresa.id });
}
