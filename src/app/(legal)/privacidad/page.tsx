import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad — QFiscal",
};

export default function PrivacidadPage() {
  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-surface-high bg-surface-lowest px-8 py-5 flex items-center justify-between">
        <Link href="/login" className="font-display font-extrabold text-xl tracking-tight text-primary">
          QFiscal
        </Link>
        <Link href="/login" className="text-sm font-semibold text-primary hover:underline underline-offset-4">
          ← Volver al inicio
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-10">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-on-surface-faint mb-3">Legal</p>
          <h1 className="font-display text-4xl font-extrabold text-primary tracking-tight mb-3">
            Política de Privacidad
          </h1>
          <p className="text-on-surface-muted">Última actualización: mayo 2025</p>
        </div>

        {[
          {
            titulo: "1. Información que recopilamos",
            cuerpo: `Recopilamos información que usted nos proporciona directamente al registrarse: nombre, correo electrónico, RNC de su empresa y datos de facturas procesadas a través del sistema OCR. No recopilamos datos de pago directamente; los pagos se procesan a través de proveedores certificados PCI-DSS.`,
          },
          {
            titulo: "2. Uso de la información",
            cuerpo: `Utilizamos su información para: (a) brindar y mejorar los servicios de QFiscal; (b) comunicar vencimientos fiscales y alertas DGII; (c) generar reportes contables y estados financieros; (d) cumplir con obligaciones legales aplicables en la República Dominicana.`,
          },
          {
            titulo: "3. Almacenamiento y seguridad",
            cuerpo: `Sus datos se almacenan en servidores seguros de Supabase (AWS us-east-1) con cifrado en reposo (AES-256) y en tránsito (TLS 1.3). Aplicamos Row Level Security (RLS) de Supabase para garantizar que cada empresa solo acceda a sus propios datos.`,
          },
          {
            titulo: "4. Compartir información",
            cuerpo: `No vendemos, alquilamos ni compartimos su información personal con terceros salvo: (a) cuando sea requerido por ley o autoridad competente; (b) con proveedores de servicios que nos ayudan a operar la plataforma (Supabase, Google, Anthropic), quienes están contractualmente obligados a proteger su información.`,
          },
          {
            titulo: "5. Sus derechos",
            cuerpo: `De conformidad con la Ley 172-13 de Protección de Datos Personales de República Dominicana, usted tiene derecho a: acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos contáctenos en soporte@qfiscal.do.`,
          },
          {
            titulo: "6. Cookies",
            cuerpo: `Utilizamos cookies de sesión estrictamente necesarias para la autenticación. No utilizamos cookies de rastreo publicitario ni compartimos datos con redes publicitarias.`,
          },
          {
            titulo: "7. Cambios a esta política",
            cuerpo: `Podemos actualizar esta política periódicamente. Le notificaremos por correo electrónico sobre cambios materiales con al menos 15 días de anticipación.`,
          },
          {
            titulo: "8. Contacto",
            cuerpo: `Para consultas sobre privacidad: soporte@qfiscal.do | QFiscal SRL, Santo Domingo, República Dominicana.`,
          },
        ].map((s) => (
          <section key={s.titulo} className="space-y-3">
            <h2 className="font-display text-lg font-bold text-primary">{s.titulo}</h2>
            <p className="text-on-surface leading-relaxed">{s.cuerpo}</p>
          </section>
        ))}
      </main>

      <footer className="border-t border-surface-high py-8 px-8 text-center">
        <p className="text-sm text-on-surface-faint">© 2025 QFiscal. República Dominicana.</p>
        <div className="flex justify-center gap-6 mt-3">
          <Link href="/privacidad" className="text-sm text-primary font-semibold">Privacidad</Link>
          <Link href="/terminos" className="text-sm text-on-surface-faint hover:underline underline-offset-4">Términos</Link>
        </div>
      </footer>
    </div>
  );
}
