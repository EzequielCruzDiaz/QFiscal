"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Enforces the "Recordar en este dispositivo" preference.
 *
 * On every mount it checks two signals:
 *  - `localStorage.remember-me`  — the user's preference (persists across browser restarts)
 *  - `sessionStorage.session-started` — flag set at login time (cleared when browser closes)
 *
 * If remember-me is "false" AND session-started is gone (browser was closed and reopened),
 * the Supabase session cookie is still valid but the user didn't want it persisted,
 * so we sign out and redirect to /login.
 */
export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const sessionStarted = sessionStorage.getItem("session-started");
    const rememberMe     = localStorage.getItem("remember-me");

    if (!sessionStarted && rememberMe === "false") {
      // Browser was closed and reopened — user chose not to be remembered
      const supabase = createClient();
      supabase.auth.signOut().then(() => {
        router.replace("/login");
      });
      return;
    }

    // Mark the current browser session as active
    sessionStorage.setItem("session-started", "1");
  }, [router]);

  return <>{children}</>;
}
