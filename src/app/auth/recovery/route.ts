import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Dedicated callback for password-recovery emails.
 * Supabase replaces the entire query string with ?code=xxx when redirecting,
 * so we cannot rely on a custom ?next= param surviving.
 * This route is exclusively used by resetPasswordForEmail, so it always
 * redirects to /reset-password after the PKCE code exchange.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/reset-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
