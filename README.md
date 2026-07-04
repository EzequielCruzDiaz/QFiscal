# QFiscal

**Plataforma de contabilidad fiscal moderna para la República Dominicana.**  
Gestiona facturas, valida NCF/RNC ante la DGII y genera reportes financieros con inteligencia artificial.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwindcss)](https://tailwindcss.com)

---

## Capturas de pantalla

### Dashboard Principal
![Dashboard](screenshots/dashboard.png)
> KPIs fiscales en tiempo real, facturas recientes y calendario DGII con próximas fechas de vencimiento.

### Procesamiento de Facturas con OCR
![Facturas OCR](screenshots/facturas-ocr.png)
> Extracción automática de datos fiscales (NCF, RNC, ITBIS, totales) usando IA. Campos editables para correcciones manuales.

### Consultas DGII
![Consultas DGII](screenshots/consultas-dgii.png)
> Validador de NCF y búsqueda de RNC en tiempo real contra los registros de la DGII.

### Reportes Financieros
![Reportes](screenshots/reportes.png)
> Estado de resultados (P&L), balance general, flujo de caja y resumen mensual exportable a CSV.

### Chat con Asistente Fiscal IA
![Chat IA](screenshots/chat.png)
> Asistente especializado en fiscalidad dominicana. Calculadoras de ISR e ITBIS integradas.

### Gestión de Empresa
![Empresa](screenshots/empresa.png)
> Administración de datos fiscales, invitación de miembros y gestión de roles (admin/contador/usuario).

---

## Funcionalidades

| Módulo | Descripción |
|---|---|
| **OCR de Facturas** | Extrae NCF, RNC, proveedor, subtotal e ITBIS automáticamente de imágenes/PDF |
| **Validador NCF** | Consulta comprobantes fiscales en tiempo real contra la API de la DGII |
| **Lookup RNC** | Verifica el estado de cualquier RNC ante la DGII |
| **Declaraciones** | Seguimiento de IT-1, IR-17, IR-2, 606, 607 y TSS con fechas de vencimiento |
| **Reportes** | P&L anual, balance general y flujo de caja exportables |
| **Chat IA** | Asistente fiscal entrenado en normativas dominicanas (DGII, ISR, ITBIS) |
| **Multi-usuario** | Roles admin/contador/usuario por empresa |
| **Mobile-friendly** | Sidebar responsive con menú hamburguesa |

---

## Stack tecnológico

- **Frontend:** Next.js 15 App Router, TypeScript, Tailwind CSS v4
- **Backend:** Next.js API Routes (Edge & Node.js)
- **Base de datos:** Supabase (PostgreSQL) con Row Level Security
- **Auth:** Supabase Auth (email/password, PKCE, recuperación de contraseña)
- **IA:** Google Gemini (default) / Anthropic Claude (configurable via `AI_PROVIDER`)
- **DGII API:** `dgii-ts` — wrapper sobre la API MegaPlus de la DGII
- **Storage:** Supabase Storage (facturas en PDF/imágenes)

---

## Instalación

### Requisitos previos
- Node.js 18+
- Cuenta en [Supabase](https://supabase.com)
- API key de [Google Gemini](https://aistudio.google.com) o [Anthropic](https://console.anthropic.com)

### 1. Clonar el repositorio

```bash
git clone https://github.com/EzequielCruzDiaz/ContabRD.git
cd ContabRD
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# IA: "gemini" (default) o "claude"
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-gemini-key
ANTHROPIC_API_KEY=tu-anthropic-key   # opcional
```

### 3. Configurar la base de datos

En el **SQL Editor de Supabase**, ejecuta en orden:

1. `supabase/schema.sql` — tablas base y RLS
2. `supabase/migrations/001_fix_rls_policies.sql` — políticas adicionales

También crea el bucket de storage:
```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('facturas', 'facturas', false);
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## Estructura del proyecto

```
src/
├── app/
│   ├── (auth)/          # Login, registro, recuperación de contraseña
│   ├── (dashboard)/     # Dashboard, facturas, chat, reportes, empresa
│   └── api/             # API routes (factura, chat, dgii, empresa, auth)
├── components/
│   ├── dashboard/       # Sidebar, Topbar, WelcomeBanner, DashboardShell
│   └── reportes/        # ExportButtons, MonthlySummary, CashflowDownloadBtn
├── lib/
│   ├── ai/              # Cliente IA (Gemini/Claude)
│   ├── supabase/        # Clientes server/browser
│   └── dgii-calendar.ts # Generador de eventos DGII
└── types/
    └── index.ts         # Tipos globales (Empresa, Factura, Declaracion, etc.)
```

---

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clave anónima de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | Clave service role (backend only) |
| `AI_PROVIDER` | ❌ | `gemini` (default) o `claude` |
| `GEMINI_API_KEY` | ✅* | Requerida si `AI_PROVIDER=gemini` |
| `ANTHROPIC_API_KEY` | ✅* | Requerida si `AI_PROVIDER=claude` |

---

## Licencia

MIT © 2025 [Ezequiel Cruz](https://github.com/EzequielCruzDiaz) — República Dominicana
