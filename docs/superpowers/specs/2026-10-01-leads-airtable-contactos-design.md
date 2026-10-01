# Diseño: leads del sitio → Airtable (Contactos) → Make → WhatsApp

**Fecha:** 2026-10-01 · **Estado:** borrador para revisión del dueño (sin commit) ·
**Reemplaza en parte:** `2026-09-08-leads-airtable-whatsapp-design.md` (la base y la tabla
cambiaron; el flujo general se conserva).

## 1. Contexto y objetivo

- El 2026-10-01 el dueño eliminó la base "Unity Insurance CRM" (`appsTFfScFOoCwuTo`) y creó
  "Unity Base De Datos" (`apppVYXN8TeViNaNp`). La tabla "Leads" ya no existe.
- Producción corre el commit `96fcd76` (deploy del 2026-09-18), que guarda primero en
  Airtable y solo después avisa a Make. Desde la eliminación cada envío falla con
  `Airtable 403: INVALID_PERMISSIONS_OR_MODEL_NOT_FOUND` y **no llega a Make** (error visto
  el 2026-10-01 a las 10:38 a. m., hora de PR). Hoy el formulario pierde todos los leads.
- **Objetivo:** cada envío de `ConsultForm` y `LeadCaptureModal` queda como contacto
  Prospecto en la tabla Contactos y avisa al grupo de WhatsApp vía Make. Si una de las dos
  vías falla, el lead no se pierde.
- **Decisiones del dueño (2026-10-01):**
  - Enfoque A: el sitio escribe en Airtable y luego avisa a Make.
  - El seguro de interés va dentro del campo Notas (no se crea un campo nuevo).
  - No se sube nada a producción hasta que el dueño lo pida; mientras tanto el formulario
    sigue fallando.
  - El token de Airtable ya fue creado y guardado por el dueño en Vercel.

## 2. Estado verificado (2026-10-01, solo lectura)

| Sistema | Hallazgo |
|---|---|
| Airtable | Una base accesible: "Unity Base De Datos" `apppVYXN8TeViNaNp` (espacio "My First Workspace"). Tablas: Contactos `tblqpMjs8KSRkT6uY`, Pólizas `tblNIIcvZN3d7aPGz`, Historial de Contacto `tblw0bJJsDecXm6f5`. Sin automatizaciones. |
| Make | Org `8896799`, equipo `2884867`. Escenario "Unity Seguros — Leads a WhatsApp" `6167444`, activo, última edición 2026-09-08. Webhook `2777884` habilitado, cola 0. Módulos: webhook → HTTP (Green API `sendMessage`). **Sin módulo ni conexión de Airtable.** Plan Free (1 000 operaciones/mes; cada lead usa 2). |
| Vercel | Proyecto `prj_AZpcR2FkgLzpu1sBNRdOJHPgh6RA`, equipo `team_aaUMdMfPEnPgvj18Tu8KPQ5F`. Variables en Production y Preview: `MAKE_LEADS_WEBHOOK_URL` (cifrada, sin cambios desde 2026-09-08) y `AIRTABLE_API_KEY` (sensible, actualizada 2026-10-01 11:01 a. m. PR). Último deploy de producción: `dpl_D8X1xvTo5egBhgHAB7ue2Kx3Ltgf` (2026-09-18). |
| Token | **Permisos sin verificar**: Vercel oculta el valor y ningún deploy lo ha usado. Las variables nuevas solo aplican a despliegues nuevos. Se valida con el primer envío de prueba (sección 8). |

## 3. Flujo

```
ConsultForm / LeadCaptureModal
        │  POST /api/leads
        ▼
  parseLeadBody (sin cambios)
        │
        ├─ 1. Airtable: crear registro en Contactos ──► { id, url }   (o falla)
        │
        └─ 2. Make: avisar SIEMPRE, con `crm` = url del registro o aviso ⚠️
                    │
                    ▼
            WhatsApp (grupo de leads, vía Green API)

  Respuesta: 200 si al menos una vía funcionó · 502 si fallaron las dos
```

El orden es secuencial porque Make necesita la URL del registro. Se intenta Make aunque
Airtable haya fallado.

## 4. Contrato con Airtable

- `POST https://api.airtable.com/v0/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY`
- Cabeceras: `Authorization: Bearer ${AIRTABLE_API_KEY}`, `Content-Type: application/json`.
- Cuerpo: `{ "fields": { <id de campo>: valor } }`. Se escribe con **IDs de campo** (no
  nombres) para sobrevivir a que se renombren columnas.
- Permiso del token: `data.records:write` sobre la base nueva.
- Respuesta usada: `id`. URL del registro:
  `https://airtable.com/apppVYXN8TeViNaNp/tblqpMjs8KSRkT6uY/<id>`.

| Campo (nombre actual) | ID | Valor |
|---|---|---|
| Nombre Completo | `fldufB2e3CQcgJsJR` | `lead.nombre` |
| Teléfono | `fldvmDLxIzhcN9Bdw` | `lead.telefono` (E.164); se omite si es `null` |
| Correo Electrónico | `fldqQyhX2M8cZK5ZJ` | `lead.email`; se omite si es `""` |
| Tipo de Contacto | `fldoUaEN5AesdFj49` | `"Prospecto"` (fijo) |
| Origen del Lead | `fldqcqzf8LIKC7mM1` | `"Página Web"` (fijo; también para recursos) |
| Fase del Lead (Pipeline) | `fldAygh93t8c6sZH3` | `"Prospecto Nuevo"` (fijo) |
| Notas | `fldLhd7dArz3gJjHB` | texto multilínea, ver abajo |

Las opciones de selección se escriben por **nombre** exacto. Si el dueño renombra o borra
una de ellas, Airtable responde 422 y se activa la ruta de fallo (sección 6).

**Formato de Notas** (una línea por dato, en este orden; las líneas sin dato se omiten):

```
Seguro de interés: Hogar            ← solo si hay producto (`lead.seguro`)
Fuente: Formulario web              ← siempre (o "Recurso (lead magnet)")
Página: https://unityinsurancepr.com/seguros/hogar   ← siempre
Llegó: 08/09/2026 9:40 AM           ← siempre, hora de PR (`formatFechaPR`)
Consentimiento: sí                  ← solo si `lead.consentimiento` es true
Notas del visitante: <texto>        ← solo si el visitante escribió notas
```

No se escriben: Fecha de Nacimiento, Pólizas, Historial de Contacto, Próximo Seguimiento
ni los campos calculados.

## 5. Contrato con Make

**Payload del sitio al webhook** (se conservan todos los campos actuales y se añade `crm`):

`nombre, telefono, email, seguro, fuente, notas, pagina, fecha (ISO UTC), fecha_local, crm`

- `crm` con Airtable correcto: la URL del registro.
- `crm` con Airtable caído: `⚠️ NO se guardó en el CRM (Airtable). Anótalo a mano.`
- El campo `airtable_url` desaparece del payload (ya no se envía desde 2026-10-01).

**Cambios en el escenario `6167444`** (lo hace Claude con el conector de Make y el OK del
dueño, o el dueño en la interfaz; el resto del escenario no se toca):

1. Mensaje del módulo HTTP (`dataStructureBodyContent.message`):
   - Antes: `👤 Nombre: {{1.nombre}}\n📱 Tel: {{1.telefono}}\n📧 Email: {{1.email}}\n🛡️ Seguro de Interes: {{1.seguro}}\n📍 Fuente: {{1.fuente}}\n📅 {{1.fecha}}`
   - Después: `👤 Nombre: {{1.nombre}}\n📱 Tel: {{1.telefono}}\n📧 Email: {{1.email}}\n🛡️ Seguro de Interes: {{1.seguro}}\n📍 Fuente: {{1.fuente}}\n📅 {{1.fecha_local}}\n📂 CRM: {{1.crm}}`
2. Estructura de datos del webhook (`metadata.interface` del módulo 1): añadir `fecha_local`,
   `pagina` y `crm` (texto). Hoy solo declara nombre, telefono, email, seguro, fuente,
   notas, fecha.
3. **Reversión:** restaurar el mensaje "Antes" y la lista de campos original. No se guarda
   copia del escenario completo porque la URL del módulo HTTP contiene el token de Green
   API (secreto); solo se cambian los dos valores de arriba.

## 6. Manejo de errores

| Airtable | Make | Visitante | Qué ocurre |
|---|---|---|---|
| ok | ok | 200 | normal |
| ok | falla | 200 | queda en el CRM, sin WhatsApp; error en los logs de Vercel |
| falla | ok | 200 | WhatsApp con el aviso ⚠️ en `crm`; error en los logs |
| falla | falla | 502 | el visitante ve el error con las alternativas de contacto |

- Falta `AIRTABLE_API_KEY` → se trata como "Airtable falla" (se omite y se registra en logs).
  Falta `MAKE_LEADS_WEBHOOK_URL` → se trata como "Make falla". Faltan las dos → 500.
- Esto permite desplegar antes de validar el token sin tumbar el formulario.
- 400 con el motivo si el cuerpo no es válido (sin cambios).
- Tiempos máximos: Airtable 6 s, Make 4 s (peor caso 10 s en total).
- Respuesta 200: `{ "success": true, "guardado": <bool>, "notificado": <bool> }`. Los clientes
  solo miran `res.ok`.
- Los logs registran el estado y el cuerpo del error de Airtable (no contiene datos del
  lead); nunca se registran nombre, teléfono ni correo.

## 7. Pruebas

Unitarias (Vitest, `fetch` simulado, expectativas escritas a mano):

- `lib/leads/airtable.test.ts` (nuevo): cuerpo exacto con IDs y valores para un lead de
  formulario completo; lead de recurso (sin teléfono ni producto); se omiten teléfono y
  correo vacíos; formato exacto de Notas con y sin consentimiento/notas; URL del registro;
  `AirtableError` con el estado cuando la API responde 403/422; el error de red se propaga.
- `lib/leads/make.test.ts`: el payload incluye `crm` y ya no incluye `airtable_url`.
- `app/api/leads/route.test.ts`: las 4 filas de la matriz de la sección 6, falta de cada
  variable de entorno por separado y de las dos, 400 por cuerpo inválido, y que Make se
  llama aunque Airtable falle.
- Verificación del proyecto completa: `npm test`, lint, `tsc` y `next build`. En esta
  máquina los archivos de `node_modules` dentro de `~/Desktop` están evictados por iCloud
  (disco casi lleno) y `npm`/`next` se cuelgan ahí: se ejecutan desde una copia fuera de
  iCloud (`rsync` del proyecto + `npm ci --prefer-offline`).

Reales (cada una con OK explícito del dueño):

- Registro temporal en Contactos con los mismos campos y valores (vía el conector de
  Airtable), comprobar que Airtable los acepta (IDs de campo, opciones, teléfono E.164) y
  borrarlo enseguida.
- Tras el despliegue: un envío de prueba con nombre "PRUEBA — ignorar". Comprobar el
  registro en Contactos, el mensaje en WhatsApp con el enlace y los logs de Vercel; borrar
  el registro de prueba.

## 8. Orden de ejecución

1. **Dueño (hecho):** token con `data.records:write` sobre la base nueva guardado como
   `AIRTABLE_API_KEY` (Production y Preview).
2. **Claude:** pruebas primero, implementación y verificación local.
3. **Claude, con OK:** prueba del registro temporal en Airtable.
4. **Claude, con OK:** cambio del escenario de Make (sección 5).
5. **Dueño decide:** despliegue a `main` (con o sin los otros 6 cambios ya verificados, en
   commits separados por tema) o despliegue de prueba (preview) en una rama aparte. Por
   diseño un token inválido no rompe el formulario: los leads llegan a WhatsApp con el
   aviso ⚠️.
6. **Claude, con OK:** envío de prueba en vivo, verificación y limpieza de registros.
7. Actualizar `.env.example` y la memoria del proyecto.

## 9. Riesgos y puntos abiertos

- **Token sin permiso sobre la base nueva** → Airtable 403; los leads siguen llegando por
  WhatsApp con el aviso. Se corrige recreando el token con acceso a la base.
- **Opciones de selección renombradas** ("Prospecto", "Prospecto Nuevo", "Página Web") →
  422; mismo comportamiento. Los nombres exactos están en la sección 4.
- **Base recreada otra vez** → hay que actualizar los IDs en un solo lugar de
  `lib/leads/airtable.ts` y las constantes de base y tabla.
- **Vista previa protegida:** si el preview exige autenticación de Vercel, el envío de
  prueba se hace en producción con el nombre "PRUEBA".
- **Duplicados:** dos envíos de la misma persona crean dos contactos (aceptado).
- **Mientras no se despliegue**, producción sigue perdiendo leads (decisión del dueño).

## 10. Fuera de alcance

- Crear el campo "Seguro de Interés" o cualquier otro campo en Airtable.
- Escribir en Pólizas o Historial de Contacto; deduplicar contactos.
- Agregar "Escolar" o "Impericia Profesional" a las opciones de Línea de Seguro de Pólizas
  (decisión del dueño sobre su CRM).
- Cambios al formulario o a los textos del sitio.

## 11. Archivos a tocar

| Archivo | Cambio |
|---|---|
| `lib/leads/airtable.ts` + `airtable.test.ts` | nuevos (el módulo anterior se borró el 2026-10-01) |
| `lib/leads/make.ts` + `make.test.ts` | `crm` en el payload; `construirPayloadMake(lead, crm, ahora)`; tiempo máximo de 5 s a 4 s |
| `app/api/leads/route.ts` + `route.test.ts` | flujo nuevo y matriz de errores |
| `lib/leads/normalize.ts` | solo comentarios (la etiqueta del seguro ahora también va a Notas) |
| `.env.example` | volver a incluir `AIRTABLE_API_KEY` |
| `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md` | nota al inicio: reemplazado en parte por este documento |
