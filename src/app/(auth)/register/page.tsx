"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function RegisterPage() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nombre } },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-blue-500">ContabRD</span>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
          <h1 className="mb-6 text-xl font-semibold text-white">Crear cuenta</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nombre"
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
            />
            <Input
              label="Correo electrónico"
              type="email"
              placeholder="tu@empresa.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
            />
            <Input
              label="Contraseña"
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:border-blue-500"
            />

            {error && (
              <p className="rounded-lg bg-red-900/30 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="text-blue-400 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
