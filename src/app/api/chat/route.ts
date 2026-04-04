import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { chatCompletion } from "@/lib/ai/client";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { message, history } = await req.json();

  const reply = await chatCompletion(
    [...history, { role: "user", content: message }],
    SYSTEM_PROMPT
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("empresa_id")
    .eq("id", user.id)
    .single();

  await supabase.from("chat_mensajes").insert([
    {
      empresa_id: profile?.empresa_id,
      usuario_id: user.id,
      rol: "user",
      contenido: message,
    },
    {
      empresa_id: profile?.empresa_id,
      usuario_id: user.id,
      rol: "assistant",
      contenido: reply,
    },
  ]);

  return NextResponse.json({ reply });
}
