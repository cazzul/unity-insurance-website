# Diseño: leads del sitio → Airtable CRM → WhatsApp (Green API)

Fecha: 2026-09-08. Autor: Claude (Agente B, integraciones) con auditoría en vivo
de Airtable, Make, Green API y Vercel. Plan de ejecución:
`docs/superpowers/plans/2026-09-08-leads-airtable-whatsapp.md`.

## 1. Objetivo

Cada envío de formulario del sitio (`ConsultForm` y `LeadCaptureModal`) debe:

1. Quedar guardado como registro en la tabla **Leads** de la base de Airtable
   **"Unity Insurance CRM"** (fuente de verdad del CRM).
2. Avisar en tiempo real al grupo de WhatsApp **"Leads Unity"** a través de
   Make y Green API, con un enlace al registro de Airtable.

## 2. Estado verificado el 2026-09-08

| Sistema | Qué existe hoy | Diagnóstico |
|---|---|---|
| **Sitio** (Next 16.3.0, Vercel `prj_AZpcR2FkgLzpu1sBNRdOJHPgh6RA`, equipo `team_aaUMdMfPEnPgvj18Tu8KPQ5F`, repo GitHub `cazzul/unity-insurance-website`, `main` → producción en `unity-insurance-website.vercel.app`, último deploy READY 13:36 UTC) | `POST /api/leads` valida nombre + (teléfono o correo), normaliza el teléfono a E.164 y hace POST a un webhook de Make con la URL escrita en el código. | Funciona, pero **no escribe en Airtable**. La URL del webhook está en el código, no en variables de entorno. No hay framework de pruebas. |
| **Make** (org `8896799`, plan Free: 1000 operaciones/mes, 2 escenarios; espacio privado `teamId 2884867`) | Escenario `6167444` "Unity Seguros — Leads a WhatsApp", activo. Webhook `2777884` "Unity Seguros — Leads Website". Módulos: webhook → HTTP "Make a request" a Green API con el JSON escrito a mano → Google Sheets "Add a row" (hoja "📋 Leads" del spreadsheet `1KAqCBe9eFrEmLKQHni0OgGmEJovrm3CgOnO56B6KIRo`). | 35 ejecuciones, 22 con error. Desde la edición del 2026-09-06 00:41 UTC, todas las repeticiones fallan con `The provided JSON body content is not valid JSON` (saltos de línea literales dentro del string JSON del módulo HTTP). El mensaje va a `17879307196@c.us`, que es **el propio número de la instancia**, no un grupo. |
| **Green API** | Instancia `710522729152`, estado `authorized`, número `+1 787 930 7196`. Responden `api.green-api.com` y `7105.api.greenapi.com`. Sin webhooks entrantes configurados. | Operativa. El token está en texto plano dentro del módulo HTTP del escenario de Make. **No copiar el token a ningún archivo del repo.** |
| **WhatsApp** | Grupos ya creados donde la instancia es miembro: **"Leads Unity"** `120363409278647911@g.us`, "Unity Team" `120363425042880158@g.us`, "Unity Agents" `120363427696968026@g.us`. | El grupo destino existe. No hay que crearlo. |
| **Airtable** | Base "Unity Insurance CRM" `appsTFfScFOoCwuTo`. Tabla **Leads** `tblxELd9tOgKTSAIK`: Nombre (texto, primario), Teléfono (phone), Correo Electrónico (email), Seguro de Interés (selección: Auto, Hogar, Viajero, Inundación, Motora, Vida, Cáncer, Comercial - Propiedad, Comercial - Responsabilidad, Otro), Status (selección: Nuevo, Contactado, Convertido, No Interesado), Fecha de Llegada (fecha y hora, zona America/Puerto_Rico), Comentarios del Agente (texto largo). Tabla Clientes aparte. | 0 registros, 0 automatizaciones. **Nada del sitio llega aquí.** Faltan las opciones "Comercial" y "Escolar" (productos del sitio) y un campo de origen del lead. |
| **Documentación del repo** | `HANDOFF.md` §5 y `PENDIENTES.md` §3 dicen que la ruta escribe en Airtable con `AIRTABLE_API_KEY` y citan la base `appILZGkXur2MUFYY` / tabla `tblHvViPZO4etWUh2`. | Desactualizado: esa base no existe en la cuenta conectada y la ruta hoy solo llama a Make. |
| **Dominio** | `unityinsurancepr.com` responde desde un servidor de parking (`DPS/2.0.0`), no desde Vercel. | Fuera de alcance de este trabajo; anotado en PENDIENTES. |
| **Repo local** | `main` local = `origin/main` = `d641042`, árbol limpio. Otro agente (Agente A) hizo commit y push hoy a las 13:36 UTC desde esta misma carpeta. | Trabajo en paralelo real: releer archivos antes de editar. |

## 3. Diseño

### 3.1 Flujo

```
Formulario (ConsultForm / LeadCaptureModal)
   │  POST /api/leads  (mismo payload que hoy; los componentes no cambian)
   ▼
app/api/leads/route.ts
   │ 1. parseLeadBody()            → 400 si faltan datos
   │ 2. crearLeadEnAirtable()      → 502 si Airtable falla (el visitante ve el error y las alternativas)
   │ 3. notificarMake()            → mejor esfuerzo: si falla, se registra y se responde 200 igual
   ▼                                   (el lead ya está guardado)
Airtable · tabla Leads (registro nuevo, Status = Nuevo)
   │
Make · webhook 2777884 → módulo oficial green-api:SendMessage
   ▼
WhatsApp · grupo "Leads Unity" (120363409278647911@g.us)
```

### 3.2 Por qué el sitio escribe en Airtable directamente (y no Make)

- Airtable es la fuente de verdad. Si Make falla (como falla hoy), el lead no se pierde.
- 2 operaciones de Make por lead en vez de 3: unos 500 leads/mes en el plan Free.
- La conversión de campos vive en código con pruebas, no en mapeos de la interfaz.

Alternativa descartada: que Make cree el registro con su módulo de Airtable. Es
válida si algún día el dueño quiere editar el mapeo sin desplegar el sitio.

### 3.3 Responsabilidades por archivo

| Archivo | Responsabilidad |
|---|---|
| `lib/leads/normalize.ts` | Validar y normalizar el cuerpo del formulario a un `Lead` tipado. Teléfono a E.164, correo en minúsculas, producto del sitio → opción de Airtable, origen (`Formulario web` o `Recurso (lead magnet)`), fecha legible en hora de Puerto Rico. Sin dependencias de Next. |
| `lib/leads/airtable.ts` | Construir los campos del registro y crear el registro vía REST. Devuelve `{ id, url }`. Lanza `AirtableError` si la API responde error. |
| `lib/leads/make.ts` | Construir el payload del webhook y enviarlo. Nunca lanza: devuelve `true`/`false`. |
| `app/api/leads/route.ts` | Orquestar los tres pasos y traducirlos a códigos HTTP. Leer variables de entorno en cada petición. |
| `docs/integraciones/make-blueprint-leads-whatsapp.json` | Blueprint del escenario de Make tal como queda (sin secretos: solo el id de la conexión). |
| `.env.example` | Nombres de las variables que necesita el servidor. |

### 3.4 Contrato de datos

**Entrada** (sin cambios respecto a hoy):

- `ConsultForm`: `{ nombre, telefono, email?, producto, consentimiento: true }`
- `LeadCaptureModal`: `{ nombre, email, notas, consentimiento: true }`

**Registro en Airtable** (tabla Leads, claves = nombres exactos de columna):

| Columna | Valor |
|---|---|
| Nombre | nombre recortado |
| Teléfono | E.164 (`+17875551234`); se omite si no hay |
| Correo Electrónico | minúsculas; se omite si no hay |
| Seguro de Interés | `auto`→Auto, `hogar`→Hogar, `viajero`→Viajero, `cancer`→Cáncer, `comercial`→Comercial, `escolar`→Escolar; id desconocido→Otro; sin producto→se omite |
| Status | `Nuevo` |
| Fecha de Llegada | ISO UTC del momento del envío (Airtable la muestra en hora de PR) |
| Fuente *(nuevo)* | `Formulario web` o `Recurso (lead magnet)` |
| Notas del formulario *(nuevo)* | `Página: <referer>` + `Notas: <notas>` si hay + `Producto del sitio: <id>` si cayó en Otro |
| Consentimiento *(nuevo, checkbox)* | marcado cuando el payload trae `consentimiento: true`; se omite si no |

`Comentarios del Agente` queda libre para el equipo: el sitio nunca lo escribe.

**Payload al webhook de Make:**

```json
{
  "nombre": "Ana Pérez",
  "telefono": "+17875550100",
  "email": "ana@example.com",
  "seguro": "Hogar",
  "fuente": "Formulario web",
  "notas": "Sin notas",
  "pagina": "https://unityinsurancepr.com/seguros/hogar",
  "fecha": "2026-09-08T13:40:00.000Z",
  "fecha_local": "08/09/2026 9:40 AM",
  "airtable_url": "https://airtable.com/appsTFfScFOoCwuTo/tblxELd9tOgKTSAIK/recXXXXXXXXXXXXXX"
}
```

Campos vacíos llegan como texto legible (`No indicado`, `No especificado`,
`Sin notas`) para que el mensaje de WhatsApp nunca muestre huecos.

**Mensaje de WhatsApp** (módulo `green-api:SendMessage`, `chatId` del grupo):

```
🔔 *Nuevo lead · Unity Seguros*

👤 Nombre: {{nombre}}
📱 Tel: {{telefono}}
📧 Email: {{email}}
🛡️ Seguro: {{seguro}}
📍 Fuente: {{fuente}}
📝 Notas: {{notas}}
📅 {{fecha_local}}

📂 CRM: {{airtable_url}}
```

### 3.5 Manejo de errores

| Situación | Respuesta de `/api/leads` | Qué ve el visitante | Qué ve el equipo |
|---|---|---|---|
| Falta `AIRTABLE_API_KEY` o `MAKE_LEADS_WEBHOOK_URL` | 500 | Error genérico + teléfono/WhatsApp | Log en Vercel: "Faltan variables de entorno" |
| Cuerpo inválido o faltan datos | 400 con mensaje | Error genérico del formulario | Nada (el front valida antes) |
| Airtable responde error | 502 | Error genérico + teléfono/WhatsApp | Log con status y cuerpo de Airtable |
| Airtable OK, Make falla | 200 `{ success: true, notificado: false }` | Mensaje de éxito | Lead en Airtable; log del error; sin WhatsApp |
| Todo OK | 200 `{ success: true, id, notificado: true }` | Mensaje de éxito | Registro + mensaje en el grupo |

### 3.6 Configuración

Variables de entorno del servidor (local en `.env.local`, producción y preview
en Vercel): `AIRTABLE_API_KEY` (token personal de Airtable con permisos
`data.records:read`, `data.records:write`, `schema.bases:read`, `schema.bases:write`
solo sobre la base "Unity Insurance CRM") y `MAKE_LEADS_WEBHOOK_URL`.

Identificadores que no son secretos y van como constantes en código: base
`appsTFfScFOoCwuTo`, tabla `tblxELd9tOgKTSAIK`.

### 3.7 Cambios en Airtable

- Opciones nuevas en "Seguro de Interés": `Comercial`, `Escolar`.
- Campos nuevos en Leads: `Fuente` (selección única), `Notas del formulario`
  (texto largo), `Consentimiento` (casilla).

### 3.8 Cambios en Make

- Conexión nueva de tipo GREEN-API (idInstance + token), para sacar el token del módulo HTTP.
- Módulo HTTP "Make a request" → reemplazado por `green-api:SendMessage` al grupo "Leads Unity".
- Módulo Google Sheets → **se quita** (Airtable es el CRM; la hoja queda como
  histórico y se puede volver a añadir en un minuto si se quiere copia).
- El webhook `2777884` se conserva: misma URL que ya usa el sitio.

## 4. Fuera de alcance

Antispam (honeypot/turnstile), deduplicación de leads, dominio propio en
Vercel, automatizaciones dentro de Airtable, respuesta automática al cliente por
WhatsApp, analítica (GA4/Pixel), rotación del token de Green API (recomendada
después de crear la conexión en Make, se hace en la consola de Green API).

## 5. Riesgos y supuestos

- El código usa **nombres** de columna. Renombrar una columna de Leads rompe la
  escritura (Airtable responde 422 → el visitante ve error). Está documentado en
  `lib/leads/airtable.ts` y en HANDOFF.
- Make Free: 1000 operaciones/mes. Si se agotan, deja de llegar el WhatsApp,
  pero el lead se guarda en Airtable.
- Si la sesión de WhatsApp de Green API se desautoriza, el módulo falla; el lead
  se guarda. Revisar estado en la consola de Green API.
- Agente A edita el repo en paralelo: releer del disco antes de editar y no
  tocar `components/**` (el contrato del payload se mantiene, así que no hace falta).
