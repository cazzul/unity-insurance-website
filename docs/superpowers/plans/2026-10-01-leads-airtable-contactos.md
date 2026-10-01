# Leads del sitio → Airtable (Contactos) → Make → WhatsApp — Plan de implementación

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Que cada envío del formulario quede como contacto Prospecto en la tabla Contactos de "Unity Base De Datos" y avise al grupo de WhatsApp vía Make, sin perder el lead si una de las dos vías falla.

**Architecture:** `POST /api/leads` valida el cuerpo, crea el contacto con el módulo nuevo `lib/leads/airtable.ts` y avisa siempre a Make con un campo `crm` (enlace al registro o aviso ⚠️). Responde 200 si al menos una vía funcionó. La lógica vive en `lib/leads/*`, sin dependencias de Next, y se prueba con Vitest y `fetch` simulado.

**Tech Stack:** Next.js 16.3 (route handler), TypeScript 5, Vitest 5, Airtable REST API v0, Make (webhook + Green API), Vercel.

**Spec:** `docs/superpowers/specs/2026-10-01-leads-airtable-contactos-design.md` (leerlo primero: trae el estado verificado y los contratos).

## Global Constraints

- Sin commits ni push hasta que el dueño los pida. Ninguna acción sobre Airtable, Make, Vercel o WhatsApp sin su OK explícito en ese momento.
- Punto de partida: el árbol de trabajo (sin commit) ya tiene el arreglo "solo Make" y los 6 cambios del sitio, todo verificado. No revertirlos.
- Textos, comentarios y nombres de pruebas en español, como el resto del repo.
- Base `apppVYXN8TeViNaNp`, tabla Contactos `tblqpMjs8KSRkT6uY`; token en `AIRTABLE_API_KEY`; webhook en `MAKE_LEADS_WEBHOOK_URL`.
- Campos de Contactos por ID de campo (los IDs están en el primer test de la Task 1); opciones por nombre exacto: `Prospecto`, `Página Web`, `Prospecto Nuevo`.
- Tiempos máximos: Airtable 6000 ms, Make 4000 ms.
- `crm` con Airtable caído: `⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano.`
- Respuestas: 200 `{ "success": true, "guardado": <bool>, "notificado": <bool> }` si al menos una vía funcionó; 502 si fallan las dos; 500 si faltan las dos variables de entorno; 400 sin cambios.
- Nunca registrar ni escribir en archivos nombre, teléfono, correo, tokens ni la URL del webhook de Make. No guardar copias del escenario de Make (la URL de Green API lleva un token).
- `npm`, `vitest`, `eslint`, `tsc` y `next` se ejecutan solo en la copia fuera de iCloud (los `node_modules` de `~/Desktop` están evictados y se cuelgan). `SCR` = carpeta scratchpad de la sesión; `"$SCR/sync.sh"` copia el proyecto a `$SCR/site` con `rsync -a --delete --exclude node_modules --exclude .next --exclude .git`, y los comandos corren con `cd "$SCR/site"`. Si no existe, crearla con ese `rsync` y `npm ci --prefer-offline`.

## Review Focus

1. **Correo mal escrito:** Airtable lo rechaza con 422; el lead igual llega a WhatsApp con el aviso ⚠️ y el visitante ve éxito. → Task 3.
2. **Lead de recurso** (sin teléfono, sin producto, sin consentimiento): no se escribe teléfono ni líneas de seguro o consentimiento. → Task 1.
3. **Nombres con tildes, ñ, apóstrofos o emojis** (p. ej. "Ñandú O'Neil 😀") pasan intactos. → Task 1.
4. **Producto desconocido** (id viejo o URL manipulada): se escribe "Seguro de interés: Otro" sin fallar. → Task 1.
5. **Datos del lead en los logs:** nunca deben aparecer cuando Airtable falla. → Task 3.

---

### Task 1: Módulo de Airtable (Contactos)

**Files:**
- Create: `lib/leads/airtable.ts`
- Test: `lib/leads/airtable.test.ts` (nuevo)
- Modify: `lib/leads/normalize.ts` (solo el comentario de `Lead.seguro`: "Etiqueta del seguro para el aviso de WhatsApp y las Notas del CRM. null si no hay producto.")

**Interfaces:**
- Consumes: `Lead` y `formatFechaPR(date: Date): string` de `./normalize`.
- Produces en `lib/leads/airtable.ts`:
  - `AIRTABLE_BASE_ID: string`, `AIRTABLE_CONTACTOS_TABLE_ID: string`
  - `interface AirtableDeps { apiKey: string; fetch?: typeof fetch; now?: () => Date }`
  - `interface AirtableRecord { id: string; url: string }`
  - `class AirtableError extends Error { status: number }`
  - `construirCampos(lead: Lead, ahora: Date): Record<string, string>`
  - `crearContactoEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord>`

- [ ] **Step 1: Escribir las pruebas que fallan** en `lib/leads/airtable.test.ts`

```ts
import { describe, expect, it, vi } from "vitest";
import { construirCampos, crearContactoEnAirtable } from "./airtable";
import type { Lead } from "./normalize";

const ahora = new Date("2026-09-08T13:40:00.000Z"); // 08/09/2026 9:40 AM en PR
const formulario: Lead = {
  nombre: "Ana Pérez", telefono: "+17875550100", email: "ana@example.com",
  productoId: "hogar", seguro: "Hogar", fuente: "Formulario web", notas: "Quiero revisar mi póliza",
  pagina: "https://unityinsurancepr.com/seguros/hogar", consentimiento: true,
};
const recurso: Lead = {
  nombre: "Luis Ortiz", telefono: null, email: "luis@example.com", productoId: "", seguro: null,
  fuente: "Recurso (lead magnet)", notas: "Lead magnet: Quiz huracán (resultado)",
  pagina: "https://unityinsurancepr.com/recursos/quiz-huracan", consentimiento: false,
};

describe("construirCampos", () => {
  it("arma los campos de Contactos por ID para un lead de formulario", () => {
    expect(construirCampos(formulario, ahora)).toEqual({
      fldufB2e3CQcgJsJR: "Ana Pérez",
      fldvmDLxIzhcN9Bdw: "+17875550100",
      fldqQyhX2M8cZK5ZJ: "ana@example.com",
      fldoUaEN5AesdFj49: "Prospecto",
      fldqcqzf8LIKC7mM1: "Página Web",
      fldAygh93t8c6sZH3: "Prospecto Nuevo",
      fldLhd7dArz3gJjHB: [
        "Seguro de interés: Hogar",
        "Fuente: Formulario web",
        "Página: https://unityinsurancepr.com/seguros/hogar",
        "Llegó: 08/09/2026 9:40 AM",
        "Consentimiento: sí",
        "Notas del visitante: Quiero revisar mi póliza",
      ].join("\n"),
    });
  });

  it("omite teléfono, seguro y consentimiento en un lead de recurso", () => {
    expect(construirCampos(recurso, ahora)).toEqual({
      fldufB2e3CQcgJsJR: "Luis Ortiz",
      fldqQyhX2M8cZK5ZJ: "luis@example.com",
      fldoUaEN5AesdFj49: "Prospecto",
      fldqcqzf8LIKC7mM1: "Página Web",
      fldAygh93t8c6sZH3: "Prospecto Nuevo",
      fldLhd7dArz3gJjHB: [
        "Fuente: Recurso (lead magnet)",
        "Página: https://unityinsurancepr.com/recursos/quiz-huracan",
        "Llegó: 08/09/2026 9:40 AM",
        "Notas del visitante: Lead magnet: Quiz huracán (resultado)",
      ].join("\n"),
    });
  });

  it("omite el correo vacío y las notas del visitante si no hay", () => {
    const campos = construirCampos({ ...formulario, email: "", notas: "" }, ahora);
    expect(campos).not.toHaveProperty("fldqQyhX2M8cZK5ZJ");
    expect(campos["fldLhd7dArz3gJjHB"]).not.toContain("Notas del visitante");
  });

  it("escribe tal cual un producto desconocido (Otro)", () => {
    const campos = construirCampos({ ...formulario, productoId: "vida", seguro: "Otro" }, ahora);
    expect(campos["fldLhd7dArz3gJjHB"].split("\n")[0]).toBe("Seguro de interés: Otro");
  });

  it("conserva tildes, ñ, apóstrofos y emojis del nombre", () => {
    const campos = construirCampos({ ...formulario, nombre: "Ñandú O'Neil 😀" }, ahora);
    expect(campos["fldufB2e3CQcgJsJR"]).toBe("Ñandú O'Neil 😀");
  });
});

describe("crearContactoEnAirtable", () => {
  const llamar = (respuesta: () => Response) => {
    const fetchMock = vi.fn(async () => respuesta());
    const promesa = crearContactoEnAirtable(formulario, {
      apiKey: "pat_test", fetch: fetchMock as unknown as typeof fetch, now: () => ahora,
    });
    return { fetchMock, promesa };
  };

  it("crea el registro y devuelve su id y su URL", async () => {
    const { fetchMock, promesa } = llamar(() => new Response(JSON.stringify({ id: "recABC" }), { status: 200 }));
    await expect(promesa).resolves.toEqual({
      id: "recABC",
      url: "https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/recABC",
    });
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.airtable.com/v0/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({ Authorization: "Bearer pat_test", "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string).fields["fldufB2e3CQcgJsJR"]).toBe("Ana Pérez");
  });

  it("lanza AirtableError con el estado cuando la API rechaza", async () => {
    const { promesa } = llamar(() => new Response('{"error":{"type":"INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND"}}', { status: 403 }));
    await expect(promesa).rejects.toMatchObject({ name: "AirtableError", status: 403 });
  });

  it("propaga el error de red", async () => {
    const { promesa } = llamar(() => { throw new TypeError("fetch failed"); });
    await expect(promesa).rejects.toThrow("fetch failed");
  });
});
```

- [ ] **Step 2: Verificar que falla**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run lib/leads/airtable.test.ts`
Expected: FAIL con `Failed to resolve import "./airtable"`.

- [ ] **Step 3: Implementar `construirCampos(lead: Lead, ahora: Date): Record<string, string>` en `lib/leads/airtable.ts`**

IDs y valores fijos exactamente como en el primer test. Teléfono y correo solo si traen valor. Notas: una línea por dato, en el orden del spec §4, unidas con `\n`; "Llegó" usa `formatFechaPR(ahora)`; las líneas sin dato se omiten.

- [ ] **Step 4: Implementar `AirtableError` y `crearContactoEnAirtable(lead: Lead, deps: AirtableDeps): Promise<AirtableRecord>` en `lib/leads/airtable.ts`**

`POST` a la URL de la tabla con cabeceras como objeto plano, cuerpo `{ fields: construirCampos(lead, ahora) }` y `signal: AbortSignal.timeout(6000)`. `ahora` sale de `deps.now` (por defecto `new Date()`). Si `!res.ok`, lanzar `new AirtableError(res.status, await res.text())` (mensaje `Airtable <estado>: <cuerpo>`). La URL del registro es `https://airtable.com/<base>/<tabla>/<id>`.

- [ ] **Step 5: Verificar que pasa**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run lib/leads/airtable.test.ts`
Expected: PASS, 8 pruebas.

- [ ] **Step 6: Actualizar el comentario de `Lead.seguro` en `lib/leads/normalize.ts`** con el texto indicado en Files.

---

### Task 2: Payload de Make con `crm`

**Files:**
- Modify: `lib/leads/make.ts`
- Test: `lib/leads/make.test.ts`

**Interfaces:**
- Consumes: `Lead`, `formatFechaPR` de `./normalize`.
- Produces en `lib/leads/make.ts`:
  - `MakePayload` con el campo nuevo `crm: string` (después de `fecha_local`)
  - `construirPayloadMake(lead: Lead, crm: string, ahora: Date): MakePayload`
  - `notificarMake(payload: MakePayload, deps: { webhookUrl: string; fetch?: typeof fetch }): Promise<boolean>` (misma firma; tiempo máximo 4000 ms)

- [ ] **Step 1: Actualizar `lib/leads/make.test.ts`**

La prueba del payload pasa a:

```ts
const REGISTRO = "https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/rec1";
expect(construirPayloadMake(lead, REGISTRO, ahora)).toEqual({
  nombre: "Ana Pérez", telefono: "+17875550100", email: "ana@example.com", seguro: "Hogar",
  fuente: "Formulario web", notas: "Sin notas", pagina: "https://unityinsurancepr.com/seguros/hogar",
  fecha: "2026-09-08T13:40:00.000Z", fecha_local: "08/09/2026 9:40 AM", crm: REGISTRO,
});
```

El resto de llamadas a `construirPayloadMake` pasan `"u"` como `crm`.

- [ ] **Step 2: Verificar que falla**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run lib/leads/make.test.ts`
Expected: FAIL con `TypeError: ahora.toISOString is not a function` (la firma actual solo tiene `lead` y `ahora`, así que `ahora` recibe el texto del `crm`).

- [ ] **Step 3: Implementar la firma y el campo en `lib/leads/make.ts`**

`crm` copiado tal cual al payload. Cambiar `AbortSignal.timeout(5000)` a `4000`. Reescribir el comentario de cabecera: Make avisa al grupo de WhatsApp; un `false` lo trata la ruta, que decide según haya guardado en Airtable.

- [ ] **Step 4: Verificar que pasa**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run lib/leads/make.test.ts`
Expected: PASS.

---

### Task 3: Ruta `/api/leads`, variables y documentación

**Files:**
- Modify: `app/api/leads/route.ts`
- Test: `app/api/leads/route.test.ts`
- Modify: `.env.example`
- Modify: `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md` (una línea al inicio, ver Step 6)

**Interfaces:**
- Consumes: `crearContactoEnAirtable`, `AirtableError` (Task 1); `construirPayloadMake`, `notificarMake` (Task 2); `parseLeadBody(body: unknown, pagina: string): ParseResult`.
- Produces: `POST(req: Request): Promise<Response>` con el contrato de respuestas de Global Constraints.

- [ ] **Step 1: Reescribir `app/api/leads/route.test.ts`**

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

const AIRTABLE_URL = "https://api.airtable.com/v0/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY";
const MAKE_URL = "https://hook.us2.make.com/prueba";
const REFERER = "https://unityinsurancepr.com/seguros/hogar";
const REGISTRO = "https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/recTEST123";
const AVISO = "⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano.";
const consulta = { nombre: "Ana Pérez", telefono: "787-555-0100", email: "", producto: "hogar", consentimiento: true };

const peticion = (body: unknown) =>
  new Request("http://localhost/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json", referer: REFERER },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });

// Responde según el destino; cualquier otra URL hace fallar la prueba.
function fetchQueResponde(airtable: 200 | 403 | 422 | 500 | "red", make: 200 | 500) {
  return vi.fn(async (url: string | URL | Request) => {
    const u = String(url);
    if (u === AIRTABLE_URL) {
      if (airtable === "red") throw new TypeError("fetch failed");
      return new Response(airtable === 200 ? JSON.stringify({ id: "recTEST123" }) : '{"error":"x"}', { status: airtable });
    }
    if (u === MAKE_URL) return new Response(make === 200 ? "Accepted" : "error", { status: make });
    throw new Error(`URL inesperada: ${u}`);
  });
}
type Fetch = ReturnType<typeof fetchQueResponde>;
const llamadas = (f: Fetch) => f.mock.calls as unknown as [string, RequestInit][];
const urls = (f: Fetch) => llamadas(f).map(([u]) => String(u));
const cuerpoMake = (f: Fetch) =>
  JSON.parse(llamadas(f).find(([u]) => String(u) === MAKE_URL)![1].body as string);

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

  it("responde 500 sin llamar a nadie si faltan las dos variables", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    expect((await POST(peticion(consulta))).status).toBe(500);
    expect(f).not.toHaveBeenCalled();
  });

  it("responde 400 si el cuerpo no es JSON o faltan datos, sin llamar a nadie", async () => {
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    expect((await POST(peticion("esto no es json"))).status).toBe(400);
    const res = await POST(peticion({ telefono: "787-555-0100" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "El nombre es requerido" });
    expect(f).not.toHaveBeenCalled();
  });

  it("guarda en Airtable, avisa a Make con el enlace y responde 200", async () => {
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: true });
    expect(urls(f)).toEqual([AIRTABLE_URL, MAKE_URL]);
    expect(llamadas(f)[0][1].headers).toMatchObject({ Authorization: "Bearer pat_test" });
    expect(cuerpoMake(f)).toMatchObject({ crm: REGISTRO, seguro: "Hogar", pagina: REFERER });
  });

  it("responde 200 con notificado=false si Make falla y el lead ya está en Airtable", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(200, 500));
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: false });
  });

  it.each([403, 422, 500, "red"] as const)(
    "con Airtable %s avisa a Make con el aviso ⚠️ y responde 200",
    async (airtable) => {
      const f = fetchQueResponde(airtable, 200);
      vi.stubGlobal("fetch", f);
      const res = await POST(peticion(consulta));
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ success: true, guardado: false, notificado: true });
      expect(cuerpoMake(f).crm).toBe(AVISO);
    },
  );

  it("responde 502 si fallan Airtable y Make", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(403, 500));
    expect((await POST(peticion(consulta))).status).toBe(502);
  });

  it("sin AIRTABLE_API_KEY omite Airtable y avisa a Make con el aviso", async () => {
    vi.stubEnv("AIRTABLE_API_KEY", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(await res.json()).toEqual({ success: true, guardado: false, notificado: true });
    expect(urls(f)).toEqual([MAKE_URL]);
    expect(cuerpoMake(f).crm).toBe(AVISO);
  });

  it("sin MAKE_LEADS_WEBHOOK_URL guarda en Airtable y responde 200 sin avisar", async () => {
    vi.stubEnv("MAKE_LEADS_WEBHOOK_URL", "");
    const f = fetchQueResponde(200, 200);
    vi.stubGlobal("fetch", f);
    const res = await POST(peticion(consulta));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ success: true, guardado: true, notificado: false });
    expect(urls(f)).toEqual([AIRTABLE_URL]);
  });

  it("no registra datos del lead en los logs cuando Airtable falla", async () => {
    vi.stubGlobal("fetch", fetchQueResponde(403, 200));
    await POST(peticion(consulta));
    const registro = JSON.stringify(vi.mocked(console.error).mock.calls);
    expect(registro).not.toContain("Ana Pérez");
    expect(registro).not.toContain("787");
  });
});
```

- [ ] **Step 2: Verificar que falla**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run app/api/leads/route.test.ts`
Expected: FAIL (la ruta actual no llama a Airtable ni devuelve `guardado`).

- [ ] **Step 3: Reescribir `POST(req: Request): Promise<Response>` en `app/api/leads/route.ts`**

Orden: leer las dos variables en cada petición → 500 si faltan ambas → `parseLeadBody` (400) → `const ahora = new Date()` → Airtable (omitido sin llave; cualquier error cuenta como fallo y se registra con `console.error`, solo estado y cuerpo del error, nunca el lead) → `crm` = URL del registro o `AVISO` → Make con `construirPayloadMake(lead, crm, ahora)` (omitido sin URL) → 502 `{ error: "No se pudo enviar la consulta" }` si ninguna vía funcionó → 200 con `guardado` y `notificado`. Actualizar el comentario de cabecera con este flujo y la referencia al spec nuevo.

- [ ] **Step 4: Verificar que pasa**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run`
Expected: PASS, toda la suite.

- [ ] **Step 5: Restaurar `AIRTABLE_API_KEY` en `.env.example`**

```
# Variables del servidor para POST /api/leads. Copia este archivo a .env.local
# (ignorado por control de versiones) y pon los valores reales.
# Token personal de Airtable (https://airtable.com/create/tokens) con permiso data.records:write sobre la base "Unity Base De Datos".
AIRTABLE_API_KEY=
# URL del webhook "Unity Seguros — Leads Website" del escenario de Make "Unity Seguros — Leads a WhatsApp".
MAKE_LEADS_WEBHOOK_URL=
```

- [ ] **Step 6: Añadir al inicio de `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md`**

```
> **Reemplazado en parte el 2026-10-01** por `2026-10-01-leads-airtable-contactos-design.md`: la base "Unity Insurance CRM" y su tabla "Leads" ya no existen; el flujo actual escribe en Contactos de "Unity Base De Datos".
```

---

### Task 4: Verificación local completa

**Files:** ninguno.

**Interfaces:** Consumes Tasks 1 a 3.

- [ ] **Step 1: Suite, lint, tipos y build**

Run: `"$SCR/sync.sh" && cd "$SCR/site" && npx vitest run && npx eslint . && npx tsc --noEmit && npm run build`
Expected: 5 archivos de prueba en verde, eslint y `tsc` sin salida, build con código de salida 0.

- [ ] **Step 2: Humo con servidor real y webhook falso, sin token de Airtable**

Levantar `$SCR/fake-webhook.mjs "$SCR/hooks.log"` (puerto 3999) y `MAKE_LEADS_WEBHOOK_URL=http://127.0.0.1:3999/hook npx next start -p 3200` desde `$SCR/site`; enviar con `curl -i -X POST http://localhost:3200/api/leads -H 'Content-Type: application/json' -d '{"nombre":"Prueba Local","telefono":"787-555-0100","email":"","producto":"impericia-profesional","consentimiento":true}'`.
Expected: `HTTP/1.1 200` con `{"success":true,"guardado":false,"notificado":true}`; `$SCR/hooks.log` contiene `"seguro":"Impericia Profesional"` y `"crm":"⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano."`. Detener ambos procesos por su PID (no usar `pkill` genéricos).

---

### Task 5: Registro temporal en Airtable (requiere OK del dueño)

**Files:** ninguno.

**Interfaces:** Consumes los campos y valores del primer test de la Task 1.

- [ ] **Step 1:** Pedir al dueño OK para crear y borrar un registro temporal en Contactos.
- [ ] **Step 2:** Cargar con ToolSearch `create_records_for_table`, `list_records_for_table` y `delete_records_for_table` del conector de Airtable. Crear en `tblqpMjs8KSRkT6uY` un registro con los mismos valores del primer test: nombre "PRUEBA — borrar", teléfono `+17875550100`, correo `prueba@example.com`, Tipo `Prospecto`, Origen `Página Web`, Fase `Prospecto Nuevo` y Notas de seis líneas con la fecha actual (por ID de campo si la herramienta lo permite; si no, por los nombres actuales).
- [ ] **Step 3:** Leerlo de vuelta. Expected: los tres valores de selección, el teléfono tal cual y las seis líneas de Notas.
- [ ] **Step 4:** Borrarlo y confirmar que ya no aparece. Si Airtable rechaza algún valor (p. ej. el formato del teléfono), parar, avisar al dueño y corregir el spec y la Task 1 antes de seguir.

---

### Task 6: Escenario de Make (requiere OK del dueño)

**Files:** ninguno.

**Interfaces:** Consumes el payload de la Task 2 (`fecha_local`, `pagina`, `crm`).

- [ ] **Step 1:** Pedir OK. Con `scenarios_get` (escenario `6167444`) confirmar que el mensaje actual del módulo 2 es exactamente el "Antes" del spec §5; si difiere, parar y avisar.
- [ ] **Step 2:** Con `scenarios_update` (cargar su esquema con ToolSearch) cambiar solo `dataStructureBodyContent.message` del módulo 2 al texto "Después" del spec §5 y añadir `fecha_local`, `pagina` y `crm` (tipo text) a `metadata.interface` del módulo 1. Construir el blueprint en memoria, sin escribirlo en disco.
- [ ] **Step 3:** Con `scenarios_get` verificar: mensaje nuevo, los tres campos declarados, la URL del módulo HTTP sin cambios (compararla sin imprimirla) y el escenario activo.
- [ ] **Step 4:** Pedir OK para la prueba. Enviar con `curl` un `POST` al webhook (URL de `hooks_list`, equipo `2884867`) con `{"nombre":"PRUEBA — ignorar","telefono":"+17875550100","email":"No indicado","seguro":"Hogar","fuente":"Formulario web","notas":"Sin notas","pagina":"https://unityinsurancepr.com/","fecha":"2026-10-01T15:00:00.000Z","fecha_local":"01/10/2026 11:00 AM","crm":"https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/recPRUEBA"}`. Expected: `executions_list` muestra la ejecución con estado 1 y el dueño confirma que el grupo recibió el mensaje con "📅 01/10/2026 11:00 AM" y "📂 CRM: …".
- [ ] **Step 5:** Si falla, revertir al texto y la lista de campos "Antes" del spec §5.

---

### Task 7: Despliegue y prueba en vivo (decide el dueño)

**Files:** ninguno (commits solo si el dueño los pide).

**Interfaces:** Consumes Tasks 1 a 6.

- [ ] **Step 1:** Preguntar al dueño la vía: (a) `main`, con o sin los 6 cambios del sitio, en commits separados por tema (leads: `app/api/leads`, `lib/leads`, `.env.example`, `components/ui/ConsultForm.tsx`, `docs/superpowers`; contenido: el resto); (b) rama aparte con preview; si el preview exige autenticación de Vercel, la prueba en vivo se hace en producción con el nombre "PRUEBA". Excluir siempre de los commits `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, `PENDIENTES.md`, `PROMPT-FRONTEND.md`, `public/images/eventos/team-photo-2024 2.jpg` y `unityinsurancepr.com-audit/`.
- [ ] **Step 2:** Tras el push, esperar con `list_deployments` (proyecto `prj_AZpcR2FkgLzpu1sBNRdOJHPgh6RA`, equipo `team_aaUMdMfPEnPgvj18Tu8KPQ5F`) a que el deployment del commit esté `READY`.
- [ ] **Step 3:** Pedir OK y enviar la prueba en vivo: `curl -i -X POST https://www.unityinsurancepr.com/api/leads -H 'Content-Type: application/json' -H 'Referer: https://www.unityinsurancepr.com/seguros/impericia-profesional' -d '{"nombre":"PRUEBA — ignorar","telefono":"787-555-0100","email":"","producto":"impericia-profesional","consentimiento":true}'`. Expected: `200` con `{"success":true,"guardado":true,"notificado":true}`.
- [ ] **Step 4:** Verificar: el registro aparece en Contactos (buscar "PRUEBA"), el dueño confirma el mensaje en WhatsApp con el enlace, y `get_runtime_errors` (última hora) no muestra errores de Airtable.
- [ ] **Step 5:** Borrar el registro de prueba de Contactos.
- [ ] **Step 6 (solo si `guardado:false`):** leer el error en los logs de Vercel: `403` = el token no tiene acceso a la base (recrearlo con acceso a "Unity Base De Datos" y volver a desplegar); `422` = una opción o un campo fue renombrado o borrado (corregir el código o la base).
- [ ] **Step 7:** Actualizar la memoria `project-leads-sin-airtable.md` (Airtable reconectado el 2026-10-01 con la base nueva, enfoque A, spec y plan) y su línea en `MEMORY.md`.
