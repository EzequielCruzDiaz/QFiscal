import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Handles the PKCE code exchange after Supabase sends an auth email link.
 * Used by: password reset, email confirmation, magic links.
 *
 * Supabase appends ?code=...&next=/reset-password to this URL in the email.
 * We exchange the code for a session, then redirect to `next`.
 */
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Something went wrong — send user back to login
  return NextResponse.redirect(`${origin}/login?error=link_expired`);
}
