# Leads del sitio → Airtable CRM → WhatsApp (Green API) — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada envío de los formularios del sitio quede guardado en la tabla Leads de Airtable y avise al grupo de WhatsApp "Leads Unity" vía Make + Green API.

**Architecture:** La ruta `POST /api/leads` valida y normaliza el payload, crea el registro en Airtable (fuente de verdad, falla dura con 502) y luego avisa al webhook de Make (mejor esfuerzo, nunca bloquea el 200). El escenario de Make se simplifica a webhook → módulo oficial `green-api:SendMessage` al grupo. La lógica vive en `lib/leads/*` sin dependencias de Next para probarla con Vitest.

**Tech Stack:** Next.js 16.3.0 (App Router, route handlers con `Request`/`Response` estándar), TypeScript 5, Vitest + vite-tsconfig-paths (nuevo), Airtable REST API v0 + Metadata API, Make (webhook `gateway:CustomWebHook` + app `green-api` v1), Green API, Vercel.

**Spec:** `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md` (léela primero: trae la auditoría del 2026-09-08 y el contrato de datos).

## Global Constraints

- Next `16.3.0`, React `19.2.8`, TypeScript `^5`. Node 22 en local, 24.x en Vercel. Antes de usar una API de Next, leer `node_modules/next/dist/docs/` (esta versión tiene cambios).
- Solo se añaden `devDependencies` (`vitest`, `vite-tsconfig-paths`). Ninguna dependencia de runtime nueva.
- `npm run lint`, `npm run build` y `npm test` limpios antes de cada commit.
- Commits en español, sin prefijos tipo `feat:` (estilo del repo: "Reemplazar el hero 3D..."), y con el trailer `Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>`.
- Nunca commitear `.env.local`. Nunca escribir el token de Green API ni el token de Airtable en archivos del repo, en HANDOFF, ni en este plan.
- Otro agente (Agente A) edita este repo en paralelo. Releer cada archivo del disco justo antes de editarlo. No tocar `components/**`: el contrato del payload de `ConsultForm` y `LeadCaptureModal` no cambia.
- Nombres exactos de columnas de la tabla Leads (con acentos): `Nombre`, `Teléfono`, `Correo Electrónico`, `Seguro de Interés`, `Status`, `Fecha de Llegada`, `Fuente`, `Notas del formulario`, `Consentimiento`.
- Identificadores fijos: base Airtable `appsTFfScFOoCwuTo`, tabla Leads `tblxELd9tOgKTSAIK`; Make org `8896799`, espacio privado `teamId 2884867`, escenario `6167444`, webhook `2777884`; Green API `idInstance 710522729152`; grupo WhatsApp "Leads Unity" `120363409278647911@g.us`; Vercel proyecto `prj_AZpcR2FkgLzpu1sBNRdOJHPgh6RA`, equipo `team_aaUMdMfPEnPgvj18Tu8KPQ5F` (slug `yadielmano-5171s-projects`).
- Servidor de desarrollo en el puerto **3100** (`npm run dev -- --port 3100`): el 3000 suele estar ocupado por otro proyecto.
- No hacer `git push` hasta la Task 9: cada push a `main` despliega a producción.
- Directorio de trabajo de todos los comandos: `/Users/yadielcasul/Desktop/UNITY SEGUROS/WEBSITE`.

---

## Mapa de archivos

| Acción | Archivo | Responsabilidad |
|---|---|---|
| Crear | `.env.example` | Nombres de variables del servidor |
| Modificar | `.gitignore` | Permitir `.env.example` |
| Crear | `vitest.config.mts` | Runner de pruebas (Node, alias `@/`) |
| Modificar | `package.json` | script `test` + devDependencies |
| Crear | `lib/leads/normalize.ts` + `normalize.test.ts` | Validar/normalizar payload → `Lead` |
| Crear | `lib/leads/airtable.ts` + `airtable.test.ts` | Crear registro en Leads |
| Crear | `lib/leads/make.ts` + `make.test.ts` | Payload y envío al webhook |
| Reescribir | `app/api/leads/route.ts` + `route.test.ts` | Orquestación y códigos HTTP |
| Crear | `docs/integraciones/make-blueprint-leads-whatsapp.json` | Blueprint final del escenario |
| Modificar | `HANDOFF.md`, `PENDIENTES.md` | Estado real de la integración |

---

### Task 1: Preparar Airtable (token, opciones y campos nuevos) y variables locales

**Files:**
- Create: `.env.example`
- Modify: `.gitignore` (línea `.env*`)
- Create (no se commitea): `.env.local`

**Interfaces:**
- Produces: variables `AIRTABLE_API_KEY` y `MAKE_LEADS_WEBHOOK_URL` en `.env.local`; tabla Leads con opciones `Comercial` y `Escolar` y campos `Fuente`, `Notas del formulario`, `Consentimiento`. Las Tasks 4, 6 y 8 dependen de esto.

- [ ] **Step 1: Crear el token personal de Airtable (acción del dueño, en el navegador)**

Ir a https://airtable.com/create/tokens → "Create new token":
- Nombre: `Unity website leads`
- Scopes: `data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write`
- Access: solo la base **Unity Insurance CRM**
- Crear y copiar el token (empieza por `pat`). Solo se muestra una vez.

- [ ] **Step 2: Crear `.env.local` (no se commitea) con las dos variables**

```bash
cat > .env.local <<'ENV'
AIRTABLE_API_KEY=PEGAR_AQUI_EL_TOKEN_pat...
MAKE_LEADS_WEBHOOK_URL=https://hook.us2.make.com/iqdy7iiuizvqz631orbapj9ghpszwspx
ENV
```

Reemplazar el valor de `AIRTABLE_API_KEY` por el token real. La URL del webhook es la misma que hoy está escrita en `app/api/leads/route.ts` línea 6 (sale del código en la Task 6).

- [ ] **Step 3: Verificar que el token ve la tabla Leads**

```bash
set -a; source .env.local; set +a
curl -s -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/meta/bases/appsTFfScFOoCwuTo/tables" \
| python3 -c "import sys,json; t=[x for x in json.load(sys.stdin)['tables'] if x['id']=='tblxELd9tOgKTSAIK'][0]; print([f['name'] for f in t['fields']])"
```

Esperado: `['Nombre', 'Teléfono', 'Correo Electrónico', 'Seguro de Interés', 'Status', 'Fecha de Llegada', 'Comentarios del Agente']`. Si sale `{"error":...}`, el token o sus permisos están mal: volver al Step 1.

- [ ] **Step 4: Añadir las opciones `Comercial` y `Escolar` a "Seguro de Interés" (interfaz de Airtable)**

La API de metadatos no permite añadir opciones a una selección existente, así que se hace en la interfaz: abrir la base → tabla **Leads** → clic en la cabecera **Seguro de Interés** → *Edit field* → *Add an option* → escribir `Comercial` → *Add an option* → `Escolar` → *Save*.

Alternativa sin interfaz (crea las opciones al vuelo, luego borra el registro):

```bash
REC=$(curl -s -X POST -H "Authorization: Bearer $AIRTABLE_API_KEY" -H "Content-Type: application/json" \
  "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK" \
  -d '{"fields":{"Nombre":"PRUEBA opciones (borrar)","Seguro de Interés":"Comercial"},"typecast":true}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
curl -s -X DELETE -H "Authorization: Bearer $AIRTABLE_API_KEY" "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/$REC"
REC=$(curl -s -X POST -H "Authorization: Bearer $AIRTABLE_API_KEY" -H "Content-Type: application/json" \
  "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK" \
  -d '{"fields":{"Nombre":"PRUEBA opciones (borrar)","Seguro de Interés":"Escolar"},"typecast":true}' | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
curl -s -X DELETE -H "Authorization: Bearer $AIRTABLE_API_KEY" "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/$REC"
```

- [ ] **Step 5: Crear los tres campos nuevos con la Metadata API**

```bash
API="https://api.airtable.com/v0/meta/bases/appsTFfScFOoCwuTo/tables/tblxELd9tOgKTSAIK/fields"
H1="Authorization: Bearer $AIRTABLE_API_KEY"; H2="Content-Type: application/json"
curl -s -X POST -H "$H1" -H "$H2" "$API" -d '{"name":"Fuente","type":"singleSelect","description":"De dónde llegó el lead. Lo llena el sitio web.","options":{"choices":[{"name":"Formulario web","color":"blueBright"},{"name":"Recurso (lead magnet)","color":"tealBright"}]}}'; echo
curl -s -X POST -H "$H1" -H "$H2" "$API" -d '{"name":"Notas del formulario","type":"multilineText","description":"Página desde la que envió y lo que escribió el visitante. Lo llena el sitio web; no editar a mano. Para notas del equipo usar Comentarios del Agente."}'; echo
curl -s -X POST -H "$H1" -H "$H2" "$API" -d '{"name":"Consentimiento","type":"checkbox","description":"El visitante marcó la casilla de consentimiento de contacto en el sitio.","options":{"icon":"check","color":"greenBright"}}'; echo
```

Esperado: tres respuestas JSON con `"id":"fld..."` cada una. Si alguna dice `DUPLICATE_OR_EMPTY_FIELD_NAME`, el campo ya existía: seguir.

- [ ] **Step 6: Verificar el esquema final**

```bash
curl -s -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/meta/bases/appsTFfScFOoCwuTo/tables" \
| python3 -c "
import sys,json
t=[x for x in json.load(sys.stdin)['tables'] if x['id']=='tblxELd9tOgKTSAIK'][0]
nombres=[f['name'] for f in t['fields']]
seguro=[c['name'] for f in t['fields'] if f['name']=='Seguro de Interés' for c in f['options']['choices']]
faltan=[n for n in ['Fuente','Notas del formulario','Consentimiento'] if n not in nombres]+[o for o in ['Comercial','Escolar'] if o not in seguro]
print('OK' if not faltan else 'FALTAN: '+', '.join(faltan))"
```

Esperado: `OK`.

- [ ] **Step 7: Crear `.env.example` y permitirlo en `.gitignore`**

```bash
cat > .env.example <<'ENV'
# Variables del servidor para POST /api/leads. Copia este archivo a .env.local
# (ignorado por git) y pon los valores reales. Ver docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md
# Token personal de Airtable (https://airtable.com/create/tokens) con acceso a la base "Unity Insurance CRM".
AIRTABLE_API_KEY=
# URL del webhook "Unity Seguros — Leads Website" del escenario de Make "Unity Seguros — Leads a WhatsApp".
MAKE_LEADS_WEBHOOK_URL=
ENV
printf '\n# El ejemplo de variables sí se versiona (la negación debe ir después de .env*)\n!.env.example\n' >> .gitignore
grep -n "env" .gitignore
```

Esperado: `.gitignore` muestra `.env*` y, más abajo, `!.env.example`. Confirmar que `git status --short` lista `.env.example` y **no** lista `.env.local`.

- [ ] **Step 8: Commit**

```bash
git add .env.example .gitignore
git commit -m "Añadir .env.example con las variables de la integración de leads

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 2: Instalar Vitest

**Files:**
- Create: `vitest.config.mts`
- Modify: `package.json` (scripts y devDependencies)

**Interfaces:**
- Produces: `npm test` (ejecuta `vitest run`); alias `@/` resuelto en pruebas; entorno Node. Todas las tareas siguientes lo usan.

- [ ] **Step 1: Instalar dependencias de desarrollo**

```bash
npm install -D vitest vite-tsconfig-paths
```

- [ ] **Step 2: Crear la configuración**

```ts
// vitest.config.mts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Pruebas unitarias en Node para lib/leads y la ruta /api/leads.
// No hace falta jsdom: no se prueban componentes.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
```

- [ ] **Step 3: Añadir el script `test` a `package.json`**

En `"scripts"`, después de `"lint": "eslint"`, añadir `"test": "vitest run"`. El bloque queda:

```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "vitest run"
}
```

- [ ] **Step 4: Verificar que el runner arranca**

Run: `npx vitest run --passWithNoTests`
Expected: `No test files found, exiting with code 0`.

- [ ] **Step 5: Lint y build siguen limpios**

Run: `npm run lint && npm run build`
Expected: sin errores ni warnings.

- [ ] **Step 6: Commit**

```bash
git add vitest.config.mts package.json package-lock.json
git commit -m "Añadir Vitest para probar la integración de leads

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 3: `lib/leads/normalize.ts` — validar y normalizar el payload

**Files:**
- Create: `lib/leads/normalize.ts`
- Test: `lib/leads/normalize.test.ts`

**Interfaces:**
- Produces:
  - `type Fuente = "Formulario web" | "Recurso (lead magnet)"`
  - `interface Lead { nombre: string; telefono: string | null; email: string; productoId: string; seguro: string | null; fuente: Fuente; notas: string; pagina: string; consentimiento: boolean }`
  - `type ParseResult = { ok: true; lead: Lead } | { ok: false; error: string }`
  - `parseLeadBody(body: unknown, pagina: string): ParseResult`
  - `normalizarTelefono(v: unknown): string | null`
  - `mapSeguro(productoId: string): string | null`
  - `formatFechaPR(date: Date): string` → `"08/09/2026 9:40 AM"`
  - `texto(v: unknown): string`

- [ ] **Step 1: Escribir las pruebas (fallan porque el módulo no existe)**

```ts
// lib/leads/normalize.test.ts
import { describe, expect, it } from "vitest";
import {
  formatFechaPR,
  mapSeguro,
  normalizarTelefono,
  parseLeadBody,
} from "./normalize";

const PAGINA = "https://unityinsurancepr.com/seguros/hogar";

describe("normalizarTelefono", () => {
  it.each([
    ["787-555-1234", "+17875551234"],
    ["5551234", "+17875551234"],
    ["(939) 555-1234", "+19395551234"],
    ["+1 787 555 1234", "+17875551234"],
    ["1-787-555-1234", "+17875551234"],
  ])("convierte %s en %s", (entrada, esperado) => {
    expect(normalizarTelefono(entrada)).toBe(esperado);
  });

  it.each([["12345"], ["+34 600 000 000"], [""], ["   "]])(
    "rechaza %j",
    (entrada) => {
      expect(normalizarTelefono(entrada)).toBeNull();
    },
  );

  it("rechaza valores que no son texto", () => {
    expect(normalizarTelefono(undefined)).toBeNull();
    expect(normalizarTelefono(7875551234)).toBeNull();
  });
});

describe("mapSeguro", () => {
  it.each([
    ["auto", "Auto"],
    ["hogar", "Hogar"],
    ["viajero", "Viajero"],
    ["cancer", "Cáncer"],
    ["comercial", "Comercial"],
    ["escolar", "Escolar"],
  ])("mapea %s a la opción %s de Airtable", (id, opcion) => {
    expect(mapSeguro(id)).toBe(opcion);
  });

  it("devuelve null sin producto y Otro con un id desconocido", () => {
    expect(mapSeguro("")).toBeNull();
    expect(mapSeguro("vida")).toBe("Otro");
  });
});

describe("formatFechaPR", () => {
  it("formatea en hora de Puerto Rico (UTC-4, sin horario de verano)", () => {
    expect(formatFechaPR(new Date("2026-09-08T13:40:00.000Z"))).toBe("08/09/2026 9:40 AM");
    expect(formatFechaPR(new Date("2026-01-15T03:05:00.000Z"))).toBe("14/01/2026 11:05 PM");
  });
});

describe("parseLeadBody", () => {
  it("acepta el payload de ConsultForm", () => {
    const r = parseLeadBody(
      { nombre: " Ana Pérez ", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true },
      PAGINA,
    );
    expect(r).toEqual({
      ok: true,
      lead: {
        nombre: "Ana Pérez",
        telefono: "+17875550100",
        email: "",
        productoId: "hogar",
        seguro: "Hogar",
        fuente: "Formulario web",
        notas: "",
        pagina: PAGINA,
        consentimiento: true,
      },
    });
  });

  it("acepta el payload de LeadCaptureModal (sin teléfono, con notas)", () => {
    const r = parseLeadBody(
      { nombre: "Luis Ortiz", email: "Luis@Example.com", notas: "Lead magnet: Quiz huracán (resultado)", consentimiento: true },
      "https://unityinsurancepr.com/recursos/quiz-huracan",
    );
    expect(r).toEqual({
      ok: true,
      lead: {
        nombre: "Luis Ortiz",
        telefono: null,
        email: "luis@example.com",
        productoId: "",
        seguro: null,
        fuente: "Recurso (lead magnet)",
        notas: "Lead magnet: Quiz huracán (resultado)",
        pagina: "https://unityinsurancepr.com/recursos/quiz-huracan",
        consentimiento: true,
      },
    });
  });

  it("rechaza sin nombre", () => {
    expect(parseLeadBody({ telefono: "787-555-0100" }, PAGINA)).toEqual({
      ok: false,
      error: "El nombre es requerido",
    });
  });

  it("rechaza sin teléfono ni correo", () => {
    expect(parseLeadBody({ nombre: "Ana" }, PAGINA)).toEqual({
      ok: false,
      error: "Teléfono o correo son requeridos",
    });
  });

  it("explica cuando el teléfono no es válido y no hay correo", () => {
    expect(parseLeadBody({ nombre: "Ana", telefono: "123" }, PAGINA)).toEqual({
      ok: false,
      error: "Teléfono no válido: usa un número de Puerto Rico o Estados Unidos",
    });
  });

  it("rechaza cuerpos que no son objetos", () => {
    expect(parseLeadBody(null, PAGINA).ok).toBe(false);
    expect(parseLeadBody("texto", PAGINA).ok).toBe(false);
  });

  it("consentimiento solo es true si llega exactamente true", () => {
    const r = parseLeadBody({ nombre: "Ana", telefono: "787-555-0100", consentimiento: "sí" }, PAGINA);
    expect(r.ok && r.lead.consentimiento).toBe(false);
  });
});
```

- [ ] **Step 2: Correr las pruebas y ver que fallan**

Run: `npx vitest run lib/leads/normalize.test.ts`
Expected: FAIL, `Failed to resolve import "./normalize"`.

- [ ] **Step 3: Implementar el módulo**

```ts
// lib/leads/normalize.ts
// Validación y normalización del cuerpo que mandan ConsultForm y
// LeadCaptureModal. Sin dependencias de Next para probarlo en Node.

export type Fuente = "Formulario web" | "Recurso (lead magnet)";

export interface Lead {
  nombre: string;
  /** E.164, por ejemplo +17875551234. null si no llegó o no es válido. */
  telefono: string | null;
  /** En minúsculas. "" si no llegó. */
  email: string;
  /** id del producto en el sitio (auto, hogar, comercial, cancer, viajero, escolar) o "". */
  productoId: string;
  /** Opción de "Seguro de Interés" en Airtable. null si no hay producto. */
  seguro: string | null;
  fuente: Fuente;
  notas: string;
  /** URL desde la que se envió (cabecera referer). */
  pagina: string;
  consentimiento: boolean;
}

export type ParseResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: string };

// Opciones de "Seguro de Interés" en la tabla Leads de Airtable.
// Si cambian los productos del sitio (lib/content.ts) o las opciones en
// Airtable, hay que actualizar este mapa.
const SEGURO_POR_PRODUCTO: Record<string, string> = {
  auto: "Auto",
  hogar: "Hogar",
  comercial: "Comercial",
  cancer: "Cáncer",
  viajero: "Viajero",
  escolar: "Escolar",
};

export function texto(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// 7 dígitos: área 787. 10 dígitos: código de país 1. Salida E.164 o null.
export function normalizarTelefono(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  let d = v.replace(/\D/g, "");
  if (d.length === 7) d = "787" + d;
  if (d.length === 10) d = "1" + d;
  return d.length === 11 && d.startsWith("1") ? `+${d}` : null;
}

export function mapSeguro(productoId: string): string | null {
  if (!productoId) return null;
  return SEGURO_POR_PRODUCTO[productoId] ?? "Otro";
}

export function parseLeadBody(body: unknown, pagina: string): ParseResult {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const nombre = texto(b.nombre);
  const email = texto(b.email).toLowerCase();
  const telefonoCrudo = texto(b.telefono);
  const telefono = normalizarTelefono(telefonoCrudo);
  const productoId = texto(b.producto);
  const notas = texto(b.notas);

  if (!nombre) return { ok: false, error: "El nombre es requerido" };
  if (!telefono && !email) {
    return {
      ok: false,
      error: telefonoCrudo
        ? "Teléfono no válido: usa un número de Puerto Rico o Estados Unidos"
        : "Teléfono o correo son requeridos",
    };
  }

  // LeadCaptureModal manda notas y ningún producto; ConsultForm manda producto.
  const esLeadMagnet = !productoId && notas.length > 0;

  return {
    ok: true,
    lead: {
      nombre,
      telefono,
      email,
      productoId,
      seguro: mapSeguro(productoId),
      fuente: esLeadMagnet ? "Recurso (lead magnet)" : "Formulario web",
      notas,
      pagina,
      consentimiento: b.consentimiento === true,
    },
  };
}

// "08/09/2026 9:40 AM" en hora de Puerto Rico. Se arma a partir de las
// partes para que no dependa del locale del servidor.
export function formatFechaPR(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Puerto_Rico",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get("minute")} ${get("dayPeriod")}`;
}
```

- [ ] **Step 4: Correr las pruebas y ver que pasan**

Run: `npx vitest run lib/leads/normalize.test.ts`
Expected: PASS, 0 fallos (todos los `it` e `it.each` en verde).

- [ ] **Step 5: Lint**

Run: `npm run lint`
Expected: sin errores.

- [ ] **Step 6: Commit**

```bash
git add lib/leads/normalize.ts lib/leads/normalize.test.ts
git commit -m "Normalizar el payload de leads en un módulo con pruebas

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 4: `lib/leads/airtable.ts` — crear el registro en la tabla Leads

**Files:**
- Create: `lib/leads/airtable.ts`
- Test: `lib/leads/airtable.test.ts`

**Interfaces:**
- Consumes: `Lead` de `lib/leads/normalize.ts`.
- Produces:
  - `const AIRTABLE_BASE_ID = "appsTFfScFOoCwuTo"`, `const AIRTABLE_LEADS_TABLE_ID = "tblxELd9tOgKTSAIK"`
  - `interface AirtableDeps { apiKey: string; fetch?: typeof fetch; now?: () => Date }`
  - `interface AirtableRecord { id: string; url: string }`
  - `class AirtableError extends Error { status: number }`
  - `construirCampos(lead: Lead, ahora: Date): Record<string, unknown>`
  - `crearLeadEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord>`

- [ ] **Step 1: Escribir las pruebas**

```ts
// lib/leads/airtable.test.ts
import { describe, expect, it, vi } from "vitest";
import {
  AIRTABLE_BASE_ID,
  AIRTABLE_LEADS_TABLE_ID,
  construirCampos,
  crearLeadEnAirtable,
} from "./airtable";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z");

const leadWeb: Lead = {
  nombre: "Ana Pérez",
  telefono: "+17875550100",
  email: "ana@example.com",
  productoId: "hogar",
  seguro: "Hogar",
  fuente: "Formulario web",
  notas: "",
  pagina: "https://unityinsurancepr.com/seguros/hogar",
  consentimiento: true,
};

const leadRecurso: Lead = {
  nombre: "Luis Ortiz",
  telefono: null,
  email: "luis@example.com",
  productoId: "",
  seguro: null,
  fuente: "Recurso (lead magnet)",
  notas: "Lead magnet: Quiz huracán (resultado)",
  pagina: "https://unityinsurancepr.com/recursos/quiz-huracan",
  consentimiento: true,
};

describe("construirCampos", () => {
  it("mapea un lead del formulario de consulta a las columnas de Leads", () => {
    expect(construirCampos(leadWeb, ahora)).toEqual({
      Nombre: "Ana Pérez",
      Teléfono: "+17875550100",
      "Correo Electrónico": "ana@example.com",
      "Seguro de Interés": "Hogar",
      Status: "Nuevo",
      "Fecha de Llegada": "2026-09-08T13:40:00.000Z",
      Fuente: "Formulario web",
      "Notas del formulario": "Página: https://unityinsurancepr.com/seguros/hogar",
      Consentimiento: true,
    });
  });

  it("omite teléfono, seguro y consentimiento cuando no aplican", () => {
    const campos = construirCampos({ ...leadRecurso, consentimiento: false }, ahora);
    expect(campos).not.toHaveProperty("Teléfono");
    expect(campos).not.toHaveProperty("Seguro de Interés");
    expect(campos).not.toHaveProperty("Consentimiento");
    expect(campos["Notas del formulario"]).toBe(
      "Página: https://unityinsurancepr.com/recursos/quiz-huracan\nNotas: Lead magnet: Quiz huracán (resultado)",
    );
  });

  it("anota el producto original cuando cae en Otro", () => {
    const campos = construirCampos({ ...leadWeb, productoId: "vida", seguro: "Otro" }, ahora);
    expect(campos["Seguro de Interés"]).toBe("Otro");
    expect(campos["Notas del formulario"]).toContain("Producto del sitio: vida");
  });
});

describe("crearLeadEnAirtable", () => {
  it("hace POST a la tabla Leads con el token y devuelve id y url", async () => {
    const fetchMock = vi.fn(async () => new Response(JSON.stringify({ id: "recABC" }), { status: 200 }));
    const r = await crearLeadEnAirtable(leadWeb, {
      apiKey: "pat_test",
      fetch: fetchMock as unknown as typeof fetch,
      now: () => ahora,
    });
    expect(r).toEqual({
      id: "recABC",
      url: `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}/recABC`,
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}`);
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer pat_test");
    expect(JSON.parse(init.body as string)).toEqual({ fields: construirCampos(leadWeb, ahora) });
  });

  it("lanza AirtableError con el status si la API responde error", async () => {
    const fetchMock = vi.fn(
      async () => new Response('{"error":{"type":"INVALID_MULTIPLE_CHOICE_OPTIONS"}}', { status: 422 }),
    );
    await expect(
      crearLeadEnAirtable(leadWeb, { apiKey: "pat_test", fetch: fetchMock as unknown as typeof fetch, now: () => ahora }),
    ).rejects.toMatchObject({ name: "AirtableError", status: 422 });
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run lib/leads/airtable.test.ts`
Expected: FAIL, `Failed to resolve import "./airtable"`.

- [ ] **Step 3: Implementar el módulo**

```ts
// lib/leads/airtable.ts
// Escritura de leads en la base "Unity Insurance CRM", tabla Leads.
// Usa la REST API de Airtable con fetch nativo (sin SDK).
import type { Lead } from "./normalize";

export const AIRTABLE_BASE_ID = "appsTFfScFOoCwuTo"; // Unity Insurance CRM
export const AIRTABLE_LEADS_TABLE_ID = "tblxELd9tOgKTSAIK"; // tabla Leads

// Nombres exactos de columna. Si alguien renombra una columna en Airtable,
// la API responde 422 y el formulario muestra error: actualizar aquí.
const CAMPOS = {
  nombre: "Nombre",
  telefono: "Teléfono",
  email: "Correo Electrónico",
  seguro: "Seguro de Interés",
  status: "Status",
  fecha: "Fecha de Llegada",
  fuente: "Fuente",
  notasFormulario: "Notas del formulario",
  consentimiento: "Consentimiento",
} as const;

export interface AirtableDeps {
  apiKey: string;
  fetch?: typeof fetch;
  now?: () => Date;
}

export interface AirtableRecord {
  id: string;
  url: string;
}

export class AirtableError extends Error {
  status: number;
  constructor(status: number, body: string) {
    super(`Airtable ${status}: ${body}`);
    this.name = "AirtableError";
    this.status = status;
  }
}

export function construirCampos(lead: Lead, ahora: Date): Record<string, unknown> {
  const notas = [
    `Página: ${lead.pagina}`,
    lead.notas ? `Notas: ${lead.notas}` : "",
    lead.seguro === "Otro" && lead.productoId ? `Producto del sitio: ${lead.productoId}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const campos: Record<string, unknown> = {
    [CAMPOS.nombre]: lead.nombre,
    [CAMPOS.status]: "Nuevo",
    [CAMPOS.fecha]: ahora.toISOString(),
    [CAMPOS.fuente]: lead.fuente,
    [CAMPOS.notasFormulario]: notas,
  };
  if (lead.telefono) campos[CAMPOS.telefono] = lead.telefono;
  if (lead.email) campos[CAMPOS.email] = lead.email;
  if (lead.seguro) campos[CAMPOS.seguro] = lead.seguro;
  // La casilla solo se manda cuando es true: Airtable trata "sin valor" como desmarcada.
  if (lead.consentimiento) campos[CAMPOS.consentimiento] = true;
  return campos;
}

export async function crearLeadEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord> {
  const doFetch = deps.fetch ?? fetch;
  const ahora = (deps.now ?? (() => new Date()))();
  const res = await doFetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${deps.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fields: construirCampos(lead, ahora) }),
  });
  if (!res.ok) throw new AirtableError(res.status, await res.text());
  const data = (await res.json()) as { id: string };
  return {
    id: data.id,
    url: `https://airtable.com/${AIRTABLE_BASE_ID}/${AIRTABLE_LEADS_TABLE_ID}/${data.id}`,
  };
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run lib/leads/airtable.test.ts`
Expected: PASS (5 pruebas).

- [ ] **Step 5: Lint y commit**

```bash
npm run lint
git add lib/leads/airtable.ts lib/leads/airtable.test.ts
git commit -m "Crear registros de leads en la tabla Leads de Airtable

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 5: `lib/leads/make.ts` — payload y aviso al webhook de Make

**Files:**
- Create: `lib/leads/make.ts`
- Test: `lib/leads/make.test.ts`

**Interfaces:**
- Consumes: `Lead`, `formatFechaPR` de `lib/leads/normalize.ts`.
- Produces:
  - `interface MakePayload { nombre; telefono; email; seguro; fuente; notas; pagina; fecha; fecha_local; airtable_url }` (todos `string`)
  - `construirPayloadMake(lead: Lead, airtableUrl: string, ahora: Date): MakePayload`
  - `notificarMake(payload: MakePayload, deps: { webhookUrl: string; fetch?: typeof fetch }): Promise<boolean>` (nunca lanza)

- [ ] **Step 1: Escribir las pruebas**

```ts
// lib/leads/make.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { construirPayloadMake, notificarMake } from "./make";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z");
const WEBHOOK = "https://hook.us2.make.com/prueba";

const lead: Lead = {
  nombre: "Ana Pérez",
  telefono: "+17875550100",
  email: "ana@example.com",
  productoId: "hogar",
  seguro: "Hogar",
  fuente: "Formulario web",
  notas: "",
  pagina: "https://unityinsurancepr.com/seguros/hogar",
  consentimiento: true,
};

describe("construirPayloadMake", () => {
  it("arma el payload con fecha local de Puerto Rico y la URL de Airtable", () => {
    expect(construirPayloadMake(lead, "https://airtable.com/app/tbl/rec1", ahora)).toEqual({
      nombre: "Ana Pérez",
      telefono: "+17875550100",
      email: "ana@example.com",
      seguro: "Hogar",
      fuente: "Formulario web",
      notas: "Sin notas",
      pagina: "https://unityinsurancepr.com/seguros/hogar",
      fecha: "2026-09-08T13:40:00.000Z",
      fecha_local: "08/09/2026 9:40 AM",
      airtable_url: "https://airtable.com/app/tbl/rec1",
    });
  });

  it("usa textos legibles cuando faltan datos", () => {
    const p = construirPayloadMake({ ...lead, telefono: null, email: "", seguro: null }, "u", ahora);
    expect(p.telefono).toBe("No indicado");
    expect(p.email).toBe("No indicado");
    expect(p.seguro).toBe("No especificado");
  });
});

describe("notificarMake", () => {
  afterEach(() => vi.restoreAllMocks());

  it("devuelve true cuando el webhook acepta", async () => {
    const fetchMock = vi.fn(async () => new Response("Accepted", { status: 200 }));
    const payload = construirPayloadMake(lead, "u", ahora);
    await expect(
      notificarMake(payload, { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(true);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(WEBHOOK);
    expect(init.method).toBe("POST");
    expect(JSON.parse(init.body as string)).toEqual(payload);
  });

  it("devuelve false y no lanza si el webhook responde error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => new Response("error", { status: 500 }));
    await expect(
      notificarMake(construirPayloadMake(lead, "u", ahora), { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it("devuelve false y no lanza si la red falla", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const fetchMock = vi.fn(async () => {
      throw new Error("ECONNRESET");
    });
    await expect(
      notificarMake(construirPayloadMake(lead, "u", ahora), { webhookUrl: WEBHOOK, fetch: fetchMock as unknown as typeof fetch }),
    ).resolves.toBe(false);
  });
});
```

- [ ] **Step 2: Correr y ver que falla**

Run: `npx vitest run lib/leads/make.test.ts`
Expected: FAIL, `Failed to resolve import "./make"`.

- [ ] **Step 3: Implementar el módulo**

```ts
// lib/leads/make.ts
// Aviso al escenario de Make "Unity Seguros — Leads a WhatsApp" (webhook),
// que reenvía el lead al grupo de WhatsApp "Leads Unity" vía Green API.
// Es "mejor esfuerzo": cuando se llama aquí, el lead ya está en Airtable.
import { formatFechaPR, type Lead } from "./normalize";

export interface MakePayload {
  nombre: string;
  telefono: string;
  email: string;
  seguro: string;
  fuente: string;
  notas: string;
  pagina: string;
  /** ISO UTC */
  fecha: string;
  /** "08/09/2026 9:40 AM", hora de Puerto Rico */
  fecha_local: string;
  airtable_url: string;
}

export function construirPayloadMake(lead: Lead, airtableUrl: string, ahora: Date): MakePayload {
  return {
    nombre: lead.nombre,
    telefono: lead.telefono ?? "No indicado",
    email: lead.email || "No indicado",
    seguro: lead.seguro ?? "No especificado",
    fuente: lead.fuente,
    notas: lead.notas || "Sin notas",
    pagina: lead.pagina,
    fecha: ahora.toISOString(),
    fecha_local: formatFechaPR(ahora),
    airtable_url: airtableUrl,
  };
}

export async function notificarMake(
  payload: MakePayload,
  deps: { webhookUrl: string; fetch?: typeof fetch },
): Promise<boolean> {
  const doFetch = deps.fetch ?? fetch;
  try {
    const res = await doFetch(deps.webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Make webhook error:", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("Make webhook error:", err);
    return false;
  }
}
```

- [ ] **Step 4: Correr y ver que pasa**

Run: `npx vitest run lib/leads/make.test.ts`
Expected: PASS (5 pruebas).

- [ ] **Step 5: Lint y commit**

```bash
npm run lint
git add lib/leads/make.ts lib/leads/make.test.ts
git commit -m "Avisar al webhook de Make con el lead y su enlace de Airtable

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 6: Reescribir `app/api/leads/route.ts` (orquestación)

**Files:**
- Rewrite: `app/api/leads/route.ts`
- Test: `app/api/leads/route.test.ts`

**Interfaces:**
- Consumes: `parseLeadBody` (Task 3), `crearLeadEnAirtable`/`AirtableError` (Task 4), `construirPayloadMake`/`notificarMake` (Task 5). Variables `AIRTABLE_API_KEY`, `MAKE_LEADS_WEBHOOK_URL`.
- Produces: `POST(req: Request): Promise<Response>` con los códigos de la spec §3.5. El payload que mandan `ConsultForm` y `LeadCaptureModal` no cambia.

- [ ] **Step 1: Releer el archivo actual del disco** (Agente A trabaja en paralelo)

Run: `cat app/api/leads/route.ts`
Confirmar que sigue siendo la versión que llama al webhook de Make con la URL escrita en el código. Si cambió, leer HANDOFF.md antes de seguir.

- [ ] **Step 2: Escribir las pruebas de la ruta**

```ts
// app/api/leads/route.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const AIRTABLE_URL = "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK";
const MAKE_URL = "https://hook.us2.make.com/prueba";
const REFERER = "https://unityinsurancepr.com/seguros/hogar";

function peticion(body: unknown) {
  return new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", referer: REFERER },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const consulta = { nombre: "Ana Pérez", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true };

function fetchQueResponde(airtableStatus: number, makeStatus: number) {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u.startsWith(AIRTABLE_URL)) {
      return new Response(airtableStatus === 200 ? JSON.stringify({ id: "recTEST123" }) : '{"error":"x"}', {
        status: airtableStatus,
      });
    }
    if (u === MAKE_URL) return new Response(makeStatus === 200 ? "Accepted" : "error", { status: makeStatus });
    throw new Error(`URL inesperada: ${u}`);
  });
}

describe("POST /api/leads", () => {
  beforeEach(() => {
    vi.stubEnv("AIRTABLE_API_KEY", "pat_test");
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", MAKE_URL);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("responde 500 sin llamar a nadie si faltan variables de entorno", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    const fetchMock = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("responde 400 si el cuerpo no es JSON", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 200));
    const res = await POST(peticion("esto no es json"));
    expect(res.status).toBe(400);
  });

  it("responde 400 con el motivo si faltan datos", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 200));
    const res = await POST(peticion({ telefono: "787-555-0100" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El nombre es requerido" });
  });

  it("guarda en Airtable, avisa a Make y responde 200", async () => {
    const fetchMock = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: "recTEST123", notificado: true });

    const [llamadaAirtable, llamadaMake] = fetchMock.mock.calls as unknown as [string, RequestInit][];
    expect(String(llamadaAirtable[0])).toBe(AIRTABLE_URL);
    const camposAirtable = JSON.parse(llamadaAirtable[1].body as string).fields;
    expect(camposAirtable["Seguro de Interés"]).toBe("Hogar");
    expect(camposAirtable["Notas del formulario"]).toBe(`Página: ${REFERER}`);

    expect(String(llamadaMake[0])).toBe(MAKE_URL);
    const payloadMake = JSON.parse(llamadaMake[1].body as string);
    expect(payloadMake.airtable_url).toBe(
      "https://airtable.com/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/recTEST123",
    );
    expect(payloadMake.pagina).toBe(REFERER);
  });

  it("responde 502 y no llama a Make si Airtable falla", async () => {
    const fetchMock = fetchQueResponde(422, 200);
    vi.stubGlobal("fetch", fetchMock);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(502);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("responde 200 con notificado=false si Make falla", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 500));
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, id: "recTEST123", notificado: false });
  });
});
```

- [ ] **Step 3: Correr y ver que falla**

Run: `npx vitest run app/api/leads/route.test.ts`
Expected: FAIL. La ruta actual devuelve `{ success: true }` sin `id`, llama al webhook escrito en el código (la prueba lanza `URL inesperada`) e importa `next/server`.

- [ ] **Step 4: Reescribir la ruta**

Reemplazar **todo** el contenido de `app/api/leads/route.ts` por:

```ts
// app/api/leads/route.ts
// Flujo de un lead del sitio:
//   formulario → Airtable (tabla Leads, fuente de verdad) → Make (webhook) → WhatsApp (Green API, grupo "Leads Unity").
// Si Airtable falla, el visitante ve el error y las alternativas de contacto (502).
// Si Make falla, el lead ya está guardado: se registra el error y se responde 200.
// Diseño: docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md
import { AirtableError, crearLeadEnAirtable, type AirtableRecord } from "@/lib/leads/airtable";
import { construirPayloadMake, notificarMake } from "@/lib/leads/make";
import { parseLeadBody } from "@/lib/leads/normalize";

export async function POST(req: Request) {
  // Se leen en cada petición (no al cargar el módulo) para fallar con claridad
  // si faltan y para poder probarlas.
  const apiKey = process.env.AIRTABLE_API_KEY;
  const webhookUrl = process.env.MAKE_LEADS_WEBHOOK_URL;
  if (!apiKey || !webhookUrl) {
    console.error("Faltan variables de entorno: AIRTABLE_API_KEY y/o MAKE_LEADS_WEBHOOK_URL");
    return Response.json({ error: "Configuración incompleta del servidor" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Cuerpo inválido" }, { status: 400 });
  }

  const pagina = req.headers.get("referer") ?? "https://unityinsurancepr.com";
  const parsed = parseLeadBody(body, pagina);
  if (!parsed.ok) {
    return Response.json({ error: parsed.error }, { status: 400 });
  }

  const ahora = new Date();
  let registro: AirtableRecord;
  try {
    registro = await crearLeadEnAirtable(parsed.lead, { apiKey, now: () => ahora });
  } catch (err) {
    console.error("Airtable error:", err instanceof AirtableError ? err.message : err);
    return Response.json({ error: "No se pudo guardar la consulta" }, { status: 502 });
  }

  const notificado = await notificarMake(construirPayloadMake(parsed.lead, registro.url, ahora), {
    webhookUrl,
  });

  return Response.json({ success: true, id: registro.id, notificado });
}
```

Nota: `Response.json(...)` es el estándar Web que Next 16 recomienda en route handlers (ver `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`). No importar `next/server`: así la ruta se prueba en Node sin el runtime de Next.

- [ ] **Step 5: Correr todas las pruebas**

Run: `npm test`
Expected: PASS, 4 archivos de prueba, 0 fallos.

- [ ] **Step 6: Lint y build**

Run: `npm run lint && npm run build`
Expected: sin errores ni warnings. El build debe listar `ƒ /api/leads` como ruta dinámica.

- [ ] **Step 7: Commit**

```bash
git add app/api/leads/route.ts app/api/leads/route.test.ts
git commit -m "Guardar cada lead en Airtable antes de avisar a Make

La ruta ya no lleva la URL del webhook en el código: usa
AIRTABLE_API_KEY y MAKE_LEADS_WEBHOOK_URL.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 7: Reconfigurar el escenario de Make (conexión Green API + mensaje al grupo)

**Estado a 2026-09-08 14:00 UTC (verificado en vivo antes de escribir esta
tarea):** el dueño ya corrigió el módulo HTTP a mano — el `chatId` apunta al
grupo correcto `120363409278647911@g.us` y el JSON del cuerpo ya no tiene
saltos de línea literales (`\\n` en vez de `\n`). Las últimas 3 ejecuciones
(2026-09-08 13:54 UTC) terminaron en verde. **El envío a WhatsApp ya
funciona hoy: no reparar el mensaje ni el chatId.** Lo que sigue pendiente
de la spec es (a) sacar el token de Green API del módulo HTTP moviéndolo a
una conexión oficial, y (b) quitar el módulo de Google Sheets (Airtable ya
es la fuente de verdad desde la Task 6). Si al llegar a esta tarea
`scenarios_get(6167444)` muestra algo distinto (por ejemplo si el dueño
volvió a tocarlo), tratar esta descripción como desactualizada y volver a
verificar antes de tocar nada.

**Files:**
- Create: `docs/integraciones/make-blueprint-leads-whatsapp.json`

**Interfaces:**
- Consumes: payload de `construirPayloadMake` (Task 5): `nombre, telefono, email, seguro, fuente, notas, pagina, fecha, fecha_local, airtable_url`.
- Produces: escenario `6167444` con dos módulos (webhook `2777884` → `green-api:SendMessage` al grupo `120363409278647911@g.us`), sin módulo HTTP ni Google Sheets.

- [ ] **Step 1: Crear la conexión GREEN-API en Make (acción del dueño, en el navegador)**

El objetivo de este paso es reemplazar el módulo HTTP (que hoy funciona
pero tiene el token de Green API escrito en texto plano dentro del mapper)
por el módulo oficial `green-api:SendMessage`, que usa una conexión en vez
de un token suelto. En https://us2.make.com → espacio "Yadiel's space" →
**Connections** → *Add* → buscar **GREEN-API** →
- Connection name: `Unity Seguros — Green API`
- idInstance: `710522729152`
- apiTokenInstance: el token de la consola de Green API (https://console.green-api.com, instancia 710522729152). Es el mismo que hoy está al final de la URL del módulo HTTP del escenario.
- Si pide API URL: `https://7105.api.greenapi.com`
Guardar.

- [ ] **Step 2: Obtener el id numérico de la conexión**

Con el MCP de Make: `connections_list` con `teamId: 2884867` y `type: ["green-api"]` → anotar `id`. Sin MCP: en Make, *Connections* → clic en la conexión → el id aparece en la URL (`.../connections/NNNNNNNN`). Guardarlo en la variable de shell:

```bash
CONN_ID=NNNNNNNN
```

- [ ] **Step 3: Escribir el blueprint nuevo en el repo**

```bash
mkdir -p docs/integraciones
cat > docs/integraciones/make-blueprint-leads-whatsapp.json <<'JSON'
{
  "name": "Unity Seguros — Leads a WhatsApp",
  "flow": [
    {
      "id": 1,
      "module": "gateway:CustomWebHook",
      "version": 1,
      "parameters": { "hook": 2777884, "maxResults": 1 },
      "mapper": {},
      "metadata": {
        "designer": { "x": 0, "y": 0 },
        "expect": [
          { "name": "nombre", "type": "text", "label": "Nombre" },
          { "name": "telefono", "type": "text", "label": "Teléfono" },
          { "name": "email", "type": "text", "label": "Email" },
          { "name": "seguro", "type": "text", "label": "Seguro" },
          { "name": "fuente", "type": "text", "label": "Fuente" },
          { "name": "notas", "type": "text", "label": "Notas" },
          { "name": "pagina", "type": "text", "label": "Página" },
          { "name": "fecha", "type": "text", "label": "Fecha (ISO)" },
          { "name": "fecha_local", "type": "text", "label": "Fecha (Puerto Rico)" },
          { "name": "airtable_url", "type": "text", "label": "URL en Airtable" }
        ]
      }
    },
    {
      "id": 2,
      "module": "green-api:SendMessage",
      "version": 1,
      "parameters": { "__IMTCONN__": __CONNECTION_ID__ },
      "mapper": {
        "chatId": "120363409278647911@g.us",
        "message": "🔔 *Nuevo lead · Unity Seguros*\n\n👤 Nombre: {{1.nombre}}\n📱 Tel: {{1.telefono}}\n📧 Email: {{1.email}}\n🛡️ Seguro: {{1.seguro}}\n📍 Fuente: {{1.fuente}}\n📝 Notas: {{1.notas}}\n📅 {{1.fecha_local}}\n\n📂 CRM: {{1.airtable_url}}",
        "linkPreview": false
      },
      "metadata": { "designer": { "x": 300, "y": 0 } }
    }
  ],
  "metadata": { "instant": true, "version": 1 },
  "scheduling": { "type": "on-demand" }
}
JSON
sed -i '' "s/__CONNECTION_ID__/$CONN_ID/" docs/integraciones/make-blueprint-leads-whatsapp.json
python3 -c "import json; b=json.load(open('docs/integraciones/make-blueprint-leads-whatsapp.json')); print('conexión:', b['flow'][1]['parameters']['__IMTCONN__'], '| módulos:', [m['module'] for m in b['flow']])"
```

Esperado: `conexión: NNNNNNNN | módulos: ['gateway:CustomWebHook', 'green-api:SendMessage']` (número real, no el texto `__CONNECTION_ID__`).

- [ ] **Step 4: Aplicar el blueprint al escenario 6167444**

Opción A (MCP de Make): `scenarios_update` con `scenarioId: 6167444` y `blueprint` = el objeto del archivo (campos `name`, `flow`, `metadata`, `scheduling`). Si responde que el escenario está activo y no admite cambios, ejecutar `scenarios_deactivate` (6167444), repetir `scenarios_update`, y luego `scenarios_activate` (6167444).

Opción B (interfaz): abrir el escenario → menú `...` de la barra inferior → **Import Blueprint** → elegir `docs/integraciones/make-blueprint-leads-whatsapp.json` → *Save* → activar el interruptor si quedó apagado.

- [ ] **Step 5: Verificar el escenario**

Con MCP: `scenarios_get` (6167444) → `blueprint.flow` tiene exactamente 2 módulos, el segundo es `green-api:SendMessage` con `chatId` `120363409278647911@g.us`, y `isActive` es `true`. En la interfaz: el lienzo muestra Webhook → GREEN-API, sin HTTP ni Google Sheets, e interruptor encendido.

- [ ] **Step 6: Prueba directa del webhook**

```bash
set -a; source .env.local; set +a
curl -s -X POST "$MAKE_LEADS_WEBHOOK_URL" -H "Content-Type: application/json" -d '{
  "nombre": "PRUEBA Make (ignorar)", "telefono": "+17875550100", "email": "prueba@example.com",
  "seguro": "Hogar", "fuente": "Formulario web", "notas": "Prueba del escenario nuevo",
  "pagina": "https://unityinsurancepr.com/", "fecha": "2026-09-08T13:40:00.000Z",
  "fecha_local": "08/09/2026 9:40 AM", "airtable_url": "https://airtable.com/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK"
}'; echo
```

Esperado: `Accepted`. En menos de 10 segundos, el grupo "Leads Unity" recibe el mensaje con los diez campos y saltos de línea correctos. En Make, *History* muestra la ejecución en verde con 2 operaciones. Si aparece en rojo, abrir la ejecución: el error viene del módulo GREEN-API (conexión o chatId) y hay que corregir el Step 1 o el `chatId`.

- [ ] **Step 7: Commit**

```bash
git add docs/integraciones/make-blueprint-leads-whatsapp.json
git commit -m "Guardar el blueprint del escenario de Make de leads a WhatsApp

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
```

---

### Task 8: Prueba de extremo a extremo en local

**Files:** ninguno (verificación).

**Interfaces:**
- Consumes: `.env.local` (Task 1), ruta nueva (Task 6), escenario nuevo (Task 7).

- [ ] **Step 1: Levantar el servidor**

Run (en una terminal aparte o en segundo plano): `npm run dev -- --port 3100`
Expected: `Ready` en `http://localhost:3100`.

- [ ] **Step 2: Enviar un lead de prueba como lo hace ConsultForm**

```bash
curl -s -X POST http://localhost:3100/api/leads \
  -H "Content-Type: application/json" -H "Referer: http://localhost:3100/seguros/hogar" \
  -d '{"nombre":"PRUEBA e2e local (borrar)","telefono":"787-555-0100","email":"prueba@example.com","producto":"hogar","consentimiento":true}'; echo
```

Esperado: `{"success":true,"id":"rec...","notificado":true}`. Anotar el `id`.

- [ ] **Step 3: Enviar un lead de prueba como lo hace LeadCaptureModal**

```bash
curl -s -X POST http://localhost:3100/api/leads \
  -H "Content-Type: application/json" -H "Referer: http://localhost:3100/recursos/quiz-huracan" \
  -d '{"nombre":"PRUEBA e2e recurso (borrar)","email":"prueba2@example.com","notas":"Lead magnet: Quiz huracán (resultado)","consentimiento":true}'; echo
```

Esperado: `{"success":true,"id":"rec...","notificado":true}`. Anotar el `id`.

- [ ] **Step 4: Verificar los registros en Airtable**

```bash
set -a; source .env.local; set +a
curl -s -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK?maxRecords=5&sort%5B0%5D%5Bfield%5D=Fecha%20de%20Llegada&sort%5B0%5D%5Bdirection%5D=desc" \
| python3 -c "import sys,json; [print(r['id'], '|', r['fields']) for r in json.load(sys.stdin)['records']]"
```

Esperado: los dos registros con `Status: Nuevo`, `Fuente` correcto (`Formulario web` / `Recurso (lead magnet)`), `Seguro de Interés: Hogar` solo en el primero, `Consentimiento: True`, `Notas del formulario` con la página (y las notas en el segundo). En el grupo "Leads Unity" hay dos mensajes con el enlace `📂 CRM:` que abre cada registro.

- [ ] **Step 5: Probar el fallo de Airtable (token inválido → 502, sin WhatsApp)**

```bash
AIRTABLE_API_KEY=pat_invalido MAKE_LEADS_WEBHOOK_URL=$MAKE_LEADS_WEBHOOK_URL npx next start --port 3200 >/dev/null 2>&1 &
PID_START=$!
sleep 4
curl -s -o /dev/null -w "HTTP %{http_code}\n" -X POST http://localhost:3200/api/leads -H "Content-Type: application/json" \
  -d '{"nombre":"PRUEBA fallo (no debe guardarse)","telefono":"787-555-0100","producto":"auto","consentimiento":true}'
kill $PID_START
```

(Requiere `npm run build` previo, que ya se hizo en la Task 6.) Esperado: `HTTP 502`, ningún registro nuevo en Airtable y ningún mensaje nuevo en el grupo.

- [ ] **Step 6: Borrar los registros de prueba**

```bash
for REC in recXXXXXXXXXXXXXX recYYYYYYYYYYYYYY; do
  curl -s -X DELETE -H "Authorization: Bearer $AIRTABLE_API_KEY" "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/$REC"; echo
done
```

Sustituir por los dos ids anotados en los Steps 2 y 3. Esperado: `{"deleted":true,"id":"rec..."}` en cada uno. Avisar en el grupo que esos dos mensajes fueron pruebas.

- [ ] **Step 7: Detener el servidor de desarrollo** (Ctrl+C o `kill` del proceso del Step 1).

---

### Task 9: Variables en Vercel, despliegue y prueba en producción

**Files:** ninguno en el repo (`.vercel/` está en `.gitignore`).

**Interfaces:**
- Consumes: commits de las Tasks 1 a 7 en `main` local.
- Produces: producción en `https://unity-insurance-website.vercel.app` con la integración activa.

- [ ] **Step 1: Iniciar sesión y vincular el proyecto con la CLI de Vercel**

```bash
npx vercel@latest login
npx vercel@latest link --yes --scope yadielmano-5171s-projects --project unity-insurance-website
```

Esperado: `Linked to yadielmano-5171s-projects/unity-insurance-website`. Confirmar que `git status --short` no muestra `.vercel/` (está ignorado).

- [ ] **Step 2: Cargar las dos variables en Production y Preview**

```bash
set -a; source .env.local; set +a
for ENVIRONMENT in production preview; do
  printf '%s' "$AIRTABLE_API_KEY" | npx vercel@latest env add AIRTABLE_API_KEY $ENVIRONMENT
  printf '%s' "$MAKE_LEADS_WEBHOOK_URL" | npx vercel@latest env add MAKE_LEADS_WEBHOOK_URL $ENVIRONMENT
done
npx vercel@latest env ls
```

Esperado: la lista muestra `AIRTABLE_API_KEY` y `MAKE_LEADS_WEBHOOK_URL` en Production y Preview. Alternativa sin CLI: vercel.com → equipo `yadielmano-5171's projects` → proyecto `unity-insurance-website` → *Settings* → *Environment Variables* → añadir ambas para Production y Preview.

- [ ] **Step 3: Verificación final antes del push**

```bash
git fetch origin && git status -sb
npm run lint && npm test && npm run build
```

Esperado: `## main...origin/main [ahead N]` sin `behind` (si hay `behind`, Agente A empujó algo: `git pull --rebase origin main`, volver a correr lint/test/build). Todo limpio.

- [ ] **Step 4: Push (dispara el despliegue a producción)**

```bash
git push origin main
npx vercel@latest ls unity-insurance-website | head -5
```

Esperado: en 1 a 3 minutos el último deployment aparece como `● Ready` con target Production. Alternativa: MCP de Vercel `get_project` (`prj_AZpcR2FkgLzpu1sBNRdOJHPgh6RA`) → `latestDeployment.readyState: "READY"` con `createdAt` posterior al push.

- [ ] **Step 5: Prueba en producción**

```bash
curl -s -X POST https://unity-insurance-website.vercel.app/api/leads \
  -H "Content-Type: application/json" -H "Referer: https://unity-insurance-website.vercel.app/seguros/auto" \
  -d '{"nombre":"PRUEBA producción (borrar)","telefono":"787-555-0100","producto":"auto","consentimiento":true}'; echo
```

Esperado: `{"success":true,"id":"rec...","notificado":true}`; registro en Airtable con `Seguro de Interés: Auto`; mensaje en "Leads Unity". Si responde 500, faltan variables: revisar el Step 2 y hacer *Redeploy* del último deployment (las variables solo aplican a despliegues nuevos).

- [ ] **Step 6: Prueba desde el navegador real**

Abrir `https://unity-insurance-website.vercel.app`, clic en "CONSULTA Y ORIENTACIÓN", llenar el modal con nombre `PRUEBA navegador (borrar)`, teléfono `787-555-0100`, seguro Hogar, marcar la casilla, enviar. Esperado: mensaje de éxito "Recibimos tus datos..." y consola del navegador sin errores. Registro y WhatsApp llegan.

- [ ] **Step 7: Borrar los dos registros de prueba de producción**

```bash
set -a; source .env.local; set +a
curl -s -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK?filterByFormula=FIND(%22PRUEBA%22%2C%7BNombre%7D)" \
| python3 -c "import sys,json; [print(r['id'], r['fields']['Nombre']) for r in json.load(sys.stdin)['records']]"
```

Para cada id listado: `curl -s -X DELETE -H "Authorization: Bearer $AIRTABLE_API_KEY" "https://api.airtable.com/v0/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/<id>"`. Esperado: la consulta anterior vuelve vacía.

---

### Task 10: Actualizar HANDOFF.md y PENDIENTES.md

**Files:**
- Modify: `HANDOFF.md` (§2 fila de Agente B, §5 primer bullet, §9 registro)
- Modify: `PENDIENTES.md` (§3 bullets 1 y 3, §5 hosting)

**Interfaces:**
- Consumes: resultado de las Tasks 1 a 9.

- [ ] **Step 1: Releer ambos archivos del disco** (Agente A los edita también).

- [ ] **Step 2: HANDOFF.md §2, fila "Backend de leads"**

Reemplazar la fila de la tabla que empieza por `| Backend de leads (Airtable) | Agente B (integraciones) |` por:

```markdown
| Backend de leads (Airtable + Make + WhatsApp) | Agente B (integraciones) | `app/api/leads/route.ts`, `lib/leads/**` (normalize, airtable, make + pruebas), `docs/integraciones/**`, `docs/superpowers/**`, `.env.example`, `vitest.config.mts`; la parte de `handleSubmit`/`fetch` en `components/ui/ConsultForm.tsx` y `components/ui/LeadCaptureModal.tsx` | Listo (2026-09-08): cada envío crea un registro en Airtable (base "Unity Insurance CRM", tabla Leads) y avisa al grupo de WhatsApp "Leads Unity" vía Make + Green API. Diseño en `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md` |
```

- [ ] **Step 3: HANDOFF.md §5, primer bullet**

Reemplazar el bullet completo que empieza por `- **El formulario hoy siempre falla al enviar en local.**` (hasta `Nunca poner la llave en código ni en este archivo.`) por:

```markdown
- **Formulario en local:** `POST /api/leads` necesita `.env.local` con
  `AIRTABLE_API_KEY` y `MAKE_LEADS_WEBHOOK_URL` (copiar `.env.example`; el
  token se crea en airtable.com/create/tokens con acceso a la base "Unity
  Insurance CRM" `appsTFfScFOoCwuTo`). Sin ellas la ruta responde 500 y el
  formulario muestra "Hubo un error al enviar". En producción las variables
  ya están en Vercel (Production y Preview). La ruta escribe en la tabla
  Leads `tblxELd9tOgKTSAIK` usando los **nombres** de columna (`Nombre`,
  `Teléfono`, `Correo Electrónico`, `Seguro de Interés`, `Status`, `Fecha de
  Llegada`, `Fuente`, `Notas del formulario`, `Consentimiento`): renombrar una
  columna rompe el envío (Airtable responde 422 → el visitante ve error).
  Los productos del sitio se mapean a opciones de "Seguro de Interés" en
  `lib/leads/normalize.ts`; si se añade un producto, añadir la opción en
  Airtable y en ese mapa. Pruebas: `npm test`. Nunca poner tokens en código
  ni en este archivo.
```

- [ ] **Step 4: HANDOFF.md §9, registro**

Añadir al final del registro:

```markdown
- 2026-09-08 · Agente B · Integración de leads completa: la ruta guarda en
  Airtable (tabla Leads, campos nuevos `Fuente`, `Notas del formulario`,
  `Consentimiento`; opciones nuevas `Comercial` y `Escolar`) y luego avisa al
  webhook de Make, cuyo escenario `6167444` ahora es webhook → módulo oficial
  GREEN-API → grupo "Leads Unity" (se quitó Google Sheets; la hoja queda como
  histórico). Vitest añadido. Variables en Vercel. Archivos: `app/api/leads/
  route.ts` (+ test), `lib/leads/{normalize,airtable,make}.ts` (+ tests),
  `vitest.config.mts`, `package.json`, `.env.example`, `.gitignore`,
  `docs/integraciones/make-blueprint-leads-whatsapp.json`,
  `docs/superpowers/**`, `HANDOFF.md`, `PENDIENTES.md`.
```

- [ ] **Step 5: PENDIENTES.md §3**

Reemplazar el primer bullet (`- [~] Envío real del formulario de cotización: ...` hasta `(ver HANDOFF.md §5).`) por:

```markdown
- [x] Envío real del formulario: **conectado a Airtable y WhatsApp**
      (2026-09-08). `POST /api/leads` crea el registro en la tabla Leads de
      "Unity Insurance CRM" y avisa al grupo "Leads Unity" vía Make + Green
      API. Detalle en `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md`.
```

Reemplazar el tercer bullet (`- [ ] Seguimiento interno del lead (CRM, notificación al agente en tiempo real). ...`) por:

```markdown
- [x] Notificación al agente en tiempo real: cada lead llega al grupo de
      WhatsApp "Leads Unity" con enlace al registro de Airtable (2026-09-08).
      Falta definir el proceso interno de seguimiento (quién toma el lead,
      cuándo pasa a "Contactado"). Dato clave del research: llamar a un lead
      en 5 minutos vs. 30 aumenta 100x la probabilidad de contactarlo
      (estudio MIT/InsideSales).
```

Añadir debajo, en la misma sección:

```markdown
- [ ] Rotar el token de Green API en console.green-api.com: estuvo en texto
      plano dentro del módulo HTTP del escenario viejo de Make. Tras rotarlo,
      actualizar la conexión "Unity Seguros — Green API" en Make.
- [ ] Antispam del formulario (honeypot o Turnstile) si empiezan a llegar
      leads basura al grupo.
```

- [ ] **Step 6: PENDIENTES.md §5, hosting**

Reemplazar `- [ ] Hosting y despliegue` por:

```markdown
- [~] Hosting y despliegue: producción en Vercel
      (`unity-insurance-website.vercel.app`, proyecto
      `unity-insurance-website`, deploy automático desde `main`). Falta
      apuntar `unityinsurancepr.com` a Vercel: hoy responde desde un servidor
      de parking (verificado 2026-09-08).
```

- [ ] **Step 7: Commit y push**

```bash
git add HANDOFF.md PENDIENTES.md
git commit -m "Documentar la integración de leads con Airtable y WhatsApp

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>"
git push origin main
```

Esperado: Vercel vuelve a desplegar (solo docs) y queda `● Ready`.

---

## Autorrevisión del plan (hecha al escribirlo)

- **Cobertura de la spec:** §3.1 flujo → Tasks 6 y 7; §3.3 archivos → Tasks 1 a 7; §3.4 contrato → Tasks 3, 4, 5 (pruebas fijan valores exactos); §3.5 errores → Task 6 (pruebas 500/400/502/200); §3.6 configuración → Tasks 1 y 9; §3.7 Airtable → Task 1; §3.8 Make → Task 7; documentación → Task 10.
- **Sin placeholders:** los únicos valores que el ejecutor completa son secretos o ids que nacen durante la ejecución (token de Airtable, id de la conexión Green API, ids de registros de prueba), cada uno con el paso que lo produce.
- **Consistencia de tipos:** `Lead`, `Fuente`, `ParseResult` (Task 3) se usan igual en Tasks 4, 5, 6; `AirtableRecord.url` (Task 4) alimenta `construirPayloadMake(lead, airtableUrl, ahora)` (Task 5) y la prueba de la ruta (Task 6) espera la misma URL; los nombres de columnas en `construirCampos` coinciden con los creados en Task 1 y documentados en Task 10.
