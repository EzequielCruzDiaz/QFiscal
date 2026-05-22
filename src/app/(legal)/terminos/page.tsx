import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio — QFiscal",
};

export default function TerminosPage() {
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
            Términos de Servicio
          </h1>
          <p className="text-on-surface-muted">Última actualización: mayo 2025</p>
        </div>

        {[
          {
            titulo: "1. Aceptación de los términos",
            cuerpo: `Al acceder y utilizar QFiscal, usted acepta estar vinculado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no utilice el servicio. El uso continuado del servicio constituye su aceptación de cualquier modificación posterior.`,
          },
          {
            titulo: "2. Descripción del servicio",
            cuerpo: `QFiscal es una plataforma SaaS de gestión fiscal y contable diseñada para empresas domiciliadas en la República Dominicana. El servicio incluye: procesamiento OCR de facturas con IA, consultas a la DGII, generación de reportes financieros, asistente fiscal IA y calendario de obligaciones tributarias.`,
          },
          {
            titulo: "3. Cuentas de usuario",
            cuerpo: `Usted es responsable de mantener la confidencialidad de sus credenciales de acceso y de todas las actividades que ocurran bajo su cuenta. Debe notificarnos inmediatamente sobre cualquier uso no autorizado. QFiscal no será responsable por pérdidas derivadas del uso no autorizado de su cuenta.`,
          },
          {
            titulo: "4. Uso aceptable",
            cuerpo: `Usted se compromete a no: (a) usar el servicio para actividades ilegales; (b) intentar acceder a datos de otras empresas; (c) realizar ingeniería inversa del software; (d) sobrecargar deliberadamente la infraestructura; (e) usar el servicio para procesar facturas falsas o fraudulentas.`,
          },
          {
            titulo: "5. Precisión de la información fiscal",
            cuerpo: `QFiscal utiliza inteligencia artificial para el análisis de documentos y la asistencia fiscal. Si bien nos esforzamos por la precisión, el servicio no reemplaza el asesoramiento de un contador certificado. QFiscal no asume responsabilidad por errores en declaraciones fiscales basadas en información generada por el sistema.`,
          },
          {
            titulo: "6. Facturación y pagos",
            cuerpo: `Los planes de suscripción se facturan mensual o anualmente según el plan seleccionado. Los precios se expresan en pesos dominicanos (DOP) e incluyen ITBIS. No se realizan reembolsos por períodos parciales salvo en casos de error atribuible a QFiscal.`,
          },
          {
            titulo: "7. Propiedad intelectual",
            cuerpo: `QFiscal y todo su contenido, características y funcionalidad son propiedad de QFiscal SRL y están protegidos por las leyes de propiedad intelectual aplicables. Se le otorga una licencia limitada, no exclusiva y no transferible para utilizar el servicio de acuerdo con estos términos.`,
          },
          {
            titulo: "8. Limitación de responsabilidad",
            cuerpo: `En la máxima medida permitida por la ley, QFiscal no será responsable por daños indirectos, incidentales, especiales o consecuentes. Nuestra responsabilidad total no excederá el monto pagado por usted en los últimos 3 meses de servicio.`,
          },
          {
            titulo: "9. Terminación",
            cuerpo: `QFiscal puede suspender o terminar su acceso al servicio en caso de violación de estos términos, con o sin previo aviso. Usted puede cancelar su suscripción en cualquier momento desde la configuración de su cuenta.`,
          },
          {
            titulo: "10. Ley aplicable",
            cuerpo: `Estos términos se rigen por las leyes de la República Dominicana. Cualquier disputa se someterá a la jurisdicción de los tribunales competentes de Santo Domingo, República Dominicana.`,
          },
          {
            titulo: "11. Contacto",
            cuerpo: `Para consultas sobre estos términos: legal@qfiscal.do | QFiscal SRL, Santo Domingo, República Dominicana.`,
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
          <Link href="/privacidad" className="text-sm text-on-surface-faint hover:underline underline-offset-4">Privacidad</Link>
          <Link href="/terminos" className="text-sm text-primary font-semibold">Términos</Link>
        </div>
      </footer>
    </div>
  );
}
