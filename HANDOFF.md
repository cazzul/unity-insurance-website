# HANDOFF — Unity Insurance Group (sitio web)

Documento de coordinación entre agentes que trabajan en paralelo sobre este
repositorio. Léelo completo antes de tocar código. Última actualización:
2026-09-08.

## 1. Estado actual en una frase

Sitio "marca primero" (home + `/nosotros` + `/seguros/[slug]` + `/recursos` +
`/recursos/[slug]` + `/marca`) terminado y verificado: el CTA de todo el sitio
abre un modal de consulta, el formulario del final de cada página es la
conclusión natural, y los recursos (quizzes y guías) se leen completos antes
de pedir el correo. El hero del home es un fondo estático de marca (degradado
navy a teal + escudo de Unity, sin animación ni JS de escena) — reemplazó a la
escena 3D nativa (WebGL, Three.js) que hubo del 2026-08-31 al 2026-09-08; el
pop-up de captura por tiempo/scroll ya no aparece en el home, solo dentro de
las guías; y el copy de todo el sitio se revisó contra `BRANDING/COPYWRITING.MD`.
El home trae un adelanto de "Nuestra historia" con foto real de equipo. Lint,
typecheck y build pasan. Consola del navegador limpia.

## 2. Quién está tocando qué (evitar pisarse)

| Área | Agente | Archivos | Estado |
|---|---|---|---|
| Front-end, diseño, copy, contenido | Agente A (front-end) | `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/nosotros/`, `app/seguros/[slug]/`, `app/recursos/`, `app/marca/`, `components/**`, `lib/content.ts`, `lib/constants.ts`, `lib/product-details.ts`, `lib/resources.ts`, `lib/quote-form-context.tsx`, `lib/lead-capture.ts`, `public/images/**`, `../FOTOS/LOGO/**`, `PROMPT-FRONTEND.md`, `PENDIENTES.md` | Rediseño "marca primero" (2026-08-30), hero 3D → hero estático (2026-08-31 → 2026-09-08), copy y pop-up solo en guías, ver registro |
| Backend de leads (Airtable + Make + WhatsApp) | Agente B (integraciones) | `app/api/leads/route.ts`, `lib/leads/**` (normalize, airtable, make + pruebas), `docs/superpowers/**`, `.env.example`, `vitest.config.mts`; la parte de `handleSubmit`/`fetch` en `components/ui/ConsultForm.tsx` y `components/ui/LeadCaptureModal.tsx` | Listo (2026-09-08): cada envío crea un registro en Airtable (base "Unity Insurance CRM", tabla Leads) y avisa al grupo de WhatsApp "Leads Unity" vía Make + Green API. Diseño en `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md` |

Regla de convivencia:

- `components/ui/ConsultForm.tsx` y `components/ui/LeadCaptureModal.tsx`
  son **compartidos**. Agente A es dueño del marcado, estilos y textos.
  Agente B es dueño de `handleSubmit`, los estados `isLoading`/`hasError` y
  el `fetch` a `/api/leads`. Si necesitas tocar la parte del otro, deja un
  comentario `// HANDOFF:` explicando qué y por qué. `ConsultForm` se monta
  dentro de `ConsultSection.tsx` (fijo, al final de cada página) y de
  `ConsultModal.tsx` (pop-up, un único componente en `app/layout.tsx`): no
  dupliques lógica de envío, solo ese archivo la tiene. El payload de
  `ConsultForm` lleva `nombre`, `telefono`, `email`, `producto`,
  `consentimiento: true`; el de `LeadCaptureModal` lleva `nombre`, `email`,
  `notas` (sin teléfono — la ruta ya lo acepta como opcional cuando hay
  correo, ver §5).
- Nadie edita `app/globals.css` ni `components/ui/Button.tsx` sin leer §4:
  son la base visual de todo el sitio.
- `lib/content.ts` y `lib/constants.ts` son la única fuente de textos y datos
  de contacto. Los componentes solo pintan. Para cambiar un texto, no toques
  el componente.
- Antes de editar un archivo, vuelve a leerlo del disco: ambos agentes están
  escribiendo en la misma carpeta y el archivo puede haber cambiado.

## 3. Cómo correr y verificar

```bash
npm run dev            # puerto 3000 por defecto (ver nota abajo)
npm run lint           # debe salir sin errores ni warnings
npm run build          # debe compilar sin errores ni warnings
```

Nota sobre puertos: el puerto 3000 de esta máquina a veces lo ocupa otro
proyecto del dueño ("Atelier"). Si `curl localhost:3000` devuelve
`<title>Atelier</title>`, levanta el sitio con `npm run dev -- --port 3100`.
Next se niega a arrancar dos `dev` sobre la misma carpeta: si ya hay uno, úsalo.

Ciclo de verificación obligatorio después de cada cambio (así se hizo todo lo
que existe hoy):

1. `npm run lint` y `npm run build` limpios.
2. Abrir en navegador real: consola sin errores ni warnings.
3. Flujo completo: el header muestra el logo a color a la derecha sobre
   fondo blanco; "CONSULTA Y ORIENTACIÓN" (header, barra de anuncio,
   tarjeta Hogar) abre el **modal**, no hace scroll; en la tarjeta Hogar
   preselecciona `hogar`; el modal cierra con Escape, el overlay o ✕; "Ver
   qué cubre" abre `/seguros/hogar` con el producto ya fijado en su
   formulario del final de página; desde `/nosotros`, el botón del header
   también abre el modal (mismo contexto que el home, sin
   `QuoteFormProvider` anidado). En un quiz de `/recursos/[slug]`
   (`quiz-huracan` o `checklist-seguro-de-casa`), contestar todas las
   preguntas muestra el resultado difuminado con un pop-up para
   desbloquearlo con nombre y correo; en una guía, el pop-up de correo
   aparece solo tras 45s o 60% de scroll.
4. En 375 px: hamburguesa abre; tocar "FAQ" navega y cierra el menú; barra
   inferior fija (Llamar / WhatsApp / Consulta) visible; el logo sigue a la
   derecha del header.
5. Captura de página completa y comparar con la sección 9 del
   `PROMPT-FRONTEND.md`: el formulario debe ser la penúltima sección del
   home, justo antes del footer (y §9.11 para las páginas internas).

Verificación en navegador sin instalar nada: Chrome local por DevTools
Protocol con un script de Node 22 (viewport 375×800 para consola y flujos,
altura completa solo para capturas). Con `--window-size=375` a secas Chrome
no baja de ~500 px y la captura sale recortada: no es un fallo del sitio.

## 4. Sistema de diseño vigente (cambió hoy, 2026-08-25)

Fuente de verdad: proyecto de Claude Design "Unity Insurance Group",
artboard `01 Fundamentos de Marca` (proyecto
`07094990-212b-4c58-844e-d3f98d21d9f9`). Reproducido en `/marca`.

- Colores (variables en `app/globals.css`, clases `bg-unity-*` /
  `text-unity-*`): navy `#0B2549`, navy medio `#143A6B`, teal `#0E7C9B`,
  teal oscuro (hover) `#0B6580`, teal claro `#1B9AB8`, teal pálido `#7FD3E4`
  (solo etiquetas sobre oscuro), tinta `#16223A`, gris medio `#3F4E66`, gris
  `#5A6B82`, líneas `#C9D3E0`, fondo claro `#F2F5F9`. Degradado del escudo:
  clase `bg-brand-gradient`, solo en fondos completos, nunca detrás de texto
  largo. Sin verde, sin rojo genérico de Tailwind, sin morado.
- Tipografía: Montserrat (700/800) en h1–h4, etiquetas, botones y tagline;
  Source Sans 3 en cuerpo. Se cargan en `app/layout.tsx`. La clase
  `font-heading` aplica Montserrat a cualquier elemento. `font-script` ya no
  es cursiva: es Montserrat 800.
- Radios: 16 px tarjetas y fotos (`rounded-2xl`), píldora en botones y chips
  (`rounded-full`), 10 px en inputs (`rounded-[10px]`, 56 px de alto).
- Forma firma: el arco (`arc-right`, `arc-bottom` en globals). Hoy se usa en
  `BannerCTA` y en la portada de `/marca`. Un solo arco por pieza.
- Iconos: Lucide, trazo 1.75, dentro de círculo lleno alternando navy y teal.
- CTAs siempre en MAYÚSCULAS (el componente `Button` lo aplica solo).

Decisiones anteriores que este sistema reemplazó (no volver a ellas sin
pedirlo el dueño): Merriweather + Open Sans, botones de 6 px, teal `#1ECAD3`.

## 5. Riesgos abiertos (leer antes de probar el formulario)

- **Formulario en local:** `POST /api/leads` necesita `.env.local` con
  `AIRTABLE_API_KEY` y `MAKE_LEADS_WEBHOOK_URL` (copiar `.env.example`; el
  token se crea en airtable.com/create/tokens con acceso a la base "Unity
  Insurance CRM" `appsTFfScFOoCwuTo`). Sin ellas la ruta responde 500 y el
  formulario muestra "Hubo un error al enviar". En producción las variables
  ya están cargadas en Vercel (Production y Preview). La ruta escribe en la
  tabla Leads `tblxELd9tOgKTSAIK` usando los **nombres** de columna
  (`Nombre`, `Teléfono`, `Correo Electrónico`, `Seguro de Interés`, `Status`,
  `Fecha de Llegada`, `Fuente`, `Notas del formulario`, `Consentimiento`):
  renombrar una columna rompe el envío (Airtable responde 422 → el
  visitante ve error). Los productos del sitio se mapean a opciones de
  "Seguro de Interés" en `lib/leads/normalize.ts`; si se añade un producto,
  añadir la opción en Airtable y en ese mapa. Pruebas: `npm test` (41
  pruebas). Nunca poner tokens en código ni en este archivo.
- **Aviso a WhatsApp vía Make (pendiente de higiene, no de funcionalidad):**
  el escenario `6167444` "Unity Seguros — Leads a WhatsApp" en Make envía
  correctamente al grupo "Leads Unity" hoy, pero el módulo sigue siendo un
  HTTP genérico con el token de Green API escrito en texto plano dentro del
  mapper (visible a cualquiera con acceso de edición al escenario). Falta
  migrar a una conexión oficial GREEN-API y al módulo `green-api:SendMessage`
  — ver `docs/superpowers/plans/2026-09-08-leads-airtable-whatsapp.md`
  Task 7 (diferida a pedido del dueño el 2026-09-08: "funciona, no lo
  toques todavía"). Si `notificarMake` falla, el lead ya quedó guardado en
  Airtable (`notificado: false` en la respuesta), así que un fallo de Make
  nunca pierde un lead.
- Los avisos de error de los formularios ya usan el rojo del sistema
  (`#8A2B2B` sobre `#F6E3E3`), alineado el 2026-08-29.
- `LeadCaptureModal` (recursos) envía `nombre`, `email` y `notas` — **sin
  teléfono**. La ruta (2026-08-30) ya no exige teléfono si llega correo:
  requiere `nombre` + (`telefono` o `email`). La nota describe el origen
  ("Lead magnet: <recurso> (resultado)" en quizzes, "Newsletter: próximas
  guías..." en guías) y queda en el campo `Notas del formulario`; `Fuente`
  es `"Recurso (lead magnet)"` para estos leads (ver detalle de columnas
  arriba en este mismo punto).
- El texto "Enviando..." del botón y el spinner son de Agente B; respetan la
  regla de mayúsculas porque `Button` la aplica por CSS.
- Logos de aseguradoras: 15 cargados en `public/images/insurers/`. MAPFRE,
  AIG, Multinational y Antilles venían en blanco y se invirtieron a oscuro.
  Falta confirmar autorización de uso de marca con cada una.

## 6. Reglas de contenido (no negociables)

- Español, tono de tú, nivel de lectura de tercer grado. Frases cortas.
- Voz de los captions de Instagram de Unity: "te orientamos", "te acompañamos
  en cada paso", "con gusto revisamos tu póliza contigo", "cubierta",
  "Prevenir hoy es proteger lo que más importa".
- Prohibido: guiones largos, "no es X, es Y", "Gratis. Sin compromiso." como
  muletilla, adverbios de relleno, emoji, hashtags, superlativos sin prueba,
  promesas de tiempo o precio inventadas, testimonios inventados.
- Lo que no se sabe se deja en `PENDIENTES.md`, nunca se inventa. Datos
  legales (`LEGAL` en `lib/constants.ts`) están vacíos a propósito y el
  footer los oculta hasta que existan.

## 7. Pendientes que requieren al dueño

Lista completa y actualizada en `PENDIENTES.md`. Resumen: nombre legal,
licencia, dirección, horario, política de privacidad, reseñas reales con
permiso, tiempo de respuesta comprometido, rangos de precio, patrocinadores
reales, contenido de recursos y blog, confirmar si se ofrecen vida y planes
médicos, autorización de logos.

## 8. Documentos de referencia en el repo

- `PROMPT-FRONTEND.md`: guía completa del front-end con el framework
  ¿Qué? ¿Cómo? ¿Por qué? ¿Cuándo? ¿Cuánto? Secciones 3, 4 y 5 ya reflejan el
  sistema de diseño nuevo.
- `PENDIENTES.md`: todo lo que espera información o decisión del dueño.
- `AGENTS.md` / `CLAUDE.md`: esta versión de Next.js (16, Turbopack) tiene
  cambios; leer `node_modules/next/dist/docs/` antes de usar APIs de Next.
- `/marca` en el sitio: referencia visual viva del sistema de diseño.

## 9. Cómo actualizar este archivo

Cada agente añade una línea en el registro de abajo al terminar un bloque de
trabajo, con fecha, qué cambió y qué archivos tocó. Sin narrativa larga.

### Registro

- 2026-08-25 · Agente A · Sistema de diseño "Fundamentos de Marca" aplicado
  a todo el sitio (colores, Montserrat + Source Sans 3, radios 16/999,
  arco en BannerCTA, iconos en círculo) y página `/marca` creada. Archivos:
  `app/globals.css`, `app/layout.tsx`, `app/marca/page.tsx`,
  `components/ui/Button.tsx`, `components/ui/ProductCard.tsx`,
  `components/sections/BannerCTA.tsx`, `components/sections/ProductGrid.tsx`,
  radios en todos los componentes, `public/images/brand/unity-logo.png`,
  `PROMPT-FRONTEND.md` §3–5.
- 2026-08-25 · Agente B · Ruta `app/api/leads/route.ts` (Airtable) y
  conexión del formulario en `QuoteSection` con estados de carga y error.
  Falta `.env.local` con `AIRTABLE_API_KEY`.
- 2026-08-25 · Agente A · Contexto de marca desde las láminas oficiales de
  `../FOTOS/` (historia, visión, pilares, valores, "18 años de experiencia
  combinada"). Nueva sección `#nosotros` (`AboutSection.tsx`, reemplaza a
  `WhyChooseGrid.tsx`, borrado). Confianza pasa de foto a panel de cifras
  (`trustStats`). Eventos usa 5 fotos reales nuevas en
  `public/images/eventos/` (1600 px) + celda CTA a Instagram. Las 6 capturas
  de 414 px de `public/images/equipo/` quedan solo en Instagram. Todas las
  galerías pasan de `background-image` a `next/image` con `alt`.
  `BRAND.yearsExperience` es `"18"` (antes `"18+"`, duplicaba el "+").
  Archivos: `lib/content.ts`, `lib/constants.ts`, `app/page.tsx`,
  `app/layout.tsx`, `components/sections/{AboutSection,TrustSection,
  EventsSection,InstagramFeed,BannerCTA}.tsx`, `components/layout/Footer.tsx`,
  `PROMPT-FRONTEND.md` §9, `PENDIENTES.md`.
- 2026-08-29 · Agente A · Fase 1 (estructura y copy). Home nuevo: Hero (logo
  + tagline + misión), SubHero (cifras), Servicios, Por qué Unity (3 puntos),
  Consulta y orientación (formulario renombrado, `#consulta`, con casilla de
  consentimiento), Recursos gratis (3 lead magnets detrás de formulario),
  FAQ, Contacto directo (con horario). CTA "Consulta y orientación" en todo
  el sitio. Páginas nuevas: `/nosotros`, `/seguros/[slug]` (6, contenido
  técnico en `lib/product-details.ts`), `/recursos/[slug]` (3, contenido en
  `lib/resources.ts`). `scrollToQuoteForm` navega a `/#consulta` si la
  página no tiene formulario; `QuoteFormProvider` acepta `initialProduct`.
  `products[0].id` es `hogar` (antes `propiedad`). Ruta de leads: acepta
  `notas` (cambio mínimo con `// HANDOFF:`). Borrados: `QuoteSection.tsx`,
  `TrustSection.tsx`, `Resources.tsx`, `ui/TrustCard.tsx`. Sin montar:
  `Testimonials`, `BlogPreview`, `SplitFeatures`. Docs: `PROMPT-FRONTEND.md`
  §9, `PENDIENTES.md`, este archivo.
- 2026-08-30 · Agente A · Fotos del sitio generadas con Google Flow según la
  guía de estilo del dueño (centro de la isla, humilde, luz de tarde). Banco
  en `../FOTOS/FOTOS_GENERADAS/` (originales, WebP y `GUIA_ESTILO.md` con
  prompts, registro y prompts de video). En el sitio:
  `public/images/lifestyle/{familia-agente-poliza,casa-interior-pr,mayor-con-agente}.webp`
  (≤ 200 KB, 1280 px) reemplazan a `familia-auto.jpg`, `casa-propiedad.jpg` y
  `tranquilidad-hogar.jpg` (borrados). `heroContent.photos` lleva `position`
  para el recorte cuadrado (`Hero.tsx`). **Regla**: son imágenes ambientales
  generadas; no presentarlas como equipo o clientes. Archivos: `lib/content.ts`,
  `components/sections/{Hero,BannerCTA}.tsx`, `PENDIENTES.md`,
  `PROMPT-FRONTEND.md` §9.3.
- 2026-08-30 · Agente A · Rediseño "marca primero" (notas de reunión del
  28 de agosto): construir marca antes de pedir datos.
  - **Header**: fondo blanco, menú a la izquierda, logo a color a la
    derecha (`public/images/brand/unity-logo-notag.png`, recortado del
    lockup con `sharp` para quitar el eslogan sin tocar el escudo).
  - **Hero**: dos columnas. Izquierda: escudo solo
    (`unity-shield-icon.png`) → h1 "Unity Insurance Group" → eslogan como
    subtítulo en itálica. Derecha (`HeroBackdrop.tsx`, nuevo): degradado de
    marca + escudo flotante (`@keyframes floatLogo`, respeta
    `prefers-reduced-motion`) + video de fondo (`heroContent.video`,
    generado en Flow: ver PENDIENTES.md) + las dos fotos de siempre.
  - **Modal de consulta**: `ConsultForm.tsx` (lógica extraída de la vieja
    `ConsultSection.tsx`) se monta en `ConsultModal.tsx` (pop-up, único en
    `app/layout.tsx`, vía `openConsult()`/`isConsultOpen`/`closeConsult()`
    del contexto) y en `ConsultSection.tsx` (fijo, ahora la **penúltima**
    sección del home, antes del footer). Casi todos los CTA del sitio abren
    el modal; `SetSelectedProduct.tsx` fija el producto en páginas de
    producto sin crear un `QuoteFormProvider` anidado (antes lo hacía, y
    dejaba el modal del layout desconectado de ese contexto — bug corregido
    antes de llegar a producción). `OpenConsultButton.tsx` para páginas
    servidor.
  - **Recursos, sin puerta previa**: `LeadMagnetForm.tsx` y la puerta antes
    de leer se eliminaron. Ahora: `ResourceQuiz.tsx` (reemplaza
    `HurricaneQuiz.tsx`) muestra el resultado con nivel bueno/regular/malo
    (tokens `--result-good/mid/bad` en `globals.css`) envuelto en
    `ResultsGate.tsx` (difuminado sutil hasta desbloquear). Las guías usan
    `ScrollLeadCapture.tsx` (45s o 60% de scroll, una vez por sesión).
    Ambos abren `LeadCaptureModal.tsx` (nombre + correo, sin teléfono).
    Estado de "ya dejó su correo" en `lib/lead-capture.ts`
    (`sessionStorage`, con `useSyncExternalStore` para leerlo sin romper
    hidratación ni el lint `react-hooks/set-state-in-effect`).
    `checklist-seguro-de-casa` pasó de checklist a quiz (mismo mecanismo);
    nuevo recurso `5-errores-seguro-auto`. Todos marcados `pending: true`
    ("De prueba": contenido verídico, no el texto final). Home:
    `LeadMagnets.tsx` → `RecentResources.tsx` (enlaza directo a
    `/recursos/[slug]`, sin formulario inline); nueva bóveda `app/recursos/page.tsx`.
  - **Eslogan**: solo aparece en el hero y como eyebrow en "Por qué Unity"
    (`WhyUnity.tsx`); se quitó de `SubHero.tsx` y del footer (texto, no el
    logo).
  - **Redundancias eliminadas**: "gratis"/"Sin costo" solo en la pregunta
    dedicada de la FAQ; subtítulos repetidos fuera de Servicios, Contacto,
    Footer.
  - **Ruta de leads**: `telefono` ahora opcional si llega `email` (los
    envíos de `LeadCaptureModal` no piden teléfono).
  - Borrados: `HurricaneQuiz.tsx`, `LeadMagnetForm.tsx`, `LeadMagnets.tsx`.
  - Archivos nuevos: `components/ui/{ConsultForm,ConsultModal,
    OpenConsultButton,SetSelectedProduct,LeadCaptureModal,ResultsGate,
    ScrollLeadCapture,ResourceQuiz}.tsx`, `components/sections/{HeroBackdrop,
    RecentResources}.tsx`, `lib/lead-capture.ts`, `app/recursos/page.tsx`,
    `public/images/brand/{unity-logo-notag,unity-shield-icon}.png`,
    `public/video/hero-loop.mp4`.
  - Verificado: lint, typecheck y build limpios (18 páginas, incluye
    `/recursos` y los 4 `/recursos/[slug]`).
- 2026-08-30 (tarde) · Agente A · Hero a pantalla completa + fotos de IA
  fuera del landing + historia en el home, a pedido del dueño.
  - **Video del hero**: el dueño proveyó un video nuevo (logo de Unity
    animado en un ambiente, no generado por este flujo de Flow) para
    reemplazar el clip abstracto. `HeroBackdrop.tsx` cambió de panel lateral
    (`300px`/`440px`) a capa `absolute inset-0` que cubre todo el `<section>`
    del hero; se quitaron el escudo flotante (`animate-float-logo`, borrado
    de `globals.css`) y las dos fotos inclinadas. `Hero.tsx` ya no usa grid
    de 2 columnas: el contenido (h1, eslogan, botones) se ancla abajo con
    `flex justify-end` sobre `.hero-video-scrim` (`globals.css`, degradado
    navy). **El scrim es responsive a propósito**: en móvil el video se
    recorta mucho más que en escritorio (`object-cover` en una caja angosta
    y alta hace zoom al centro), así que el panel sólido es más grande ahí
    (opaco hasta 56% de la caja, vs. 30% en escritorio) — sin esto, el
    texto quedaba encima del logo del propio video (bug real, encontrado y
    corregido en este mismo bloque, ver captura antes/después no incluida
    aquí). Botón secundario del hero pasó de `variant="outline"` a
    `variant="ghost"` (legible sobre fondo oscuro). Nuevo `heroContent.poster`
    (`public/video/hero-poster.webp`): se usa antes de que cargue el video y
    con `prefers-reduced-motion`. `heroContent.icon` y `heroContent.photos`
    se eliminaron de `lib/content.ts` (ya no se usan en ningún lado).
    Video anterior archivado en
    `../FOTOS/FOTOS_GENERADAS/video/hero-loop-v1-abstracto-archivado.mp4`
    (no en `public/`, para no desplegarlo sin uso).
  - **Fotos de IA fuera del landing**: las tres `public/images/lifestyle/*.webp`
    ya no aparecen en el home (vivían en el Hero, ya rediseñado). Siguen sin
    tocar en `/nosotros` (`BannerCTA.tsx`, fuera del landing) y en
    `splitFeatures` (sección que no se monta, ver §9.12 de
    `PROMPT-FRONTEND.md`) — avisar si también hay que retirarlas de ahí.
  - **Historia en el home**: nueva `StorySection.tsx` (`id="historia"`,
    entre `SubHero` y `ProductGrid` en `app/page.tsx`), contenido en
    `storyContent` (`lib/content.ts`, reutiliza `aboutContent.story` sin
    duplicar el texto). Foto real de `public/images/eventos/equipo-unity.jpg`
    (no IA), mismo alt que ya existía para esa foto en `eventImages`. Botón
    "Conoce más sobre nosotros" enlaza a `/nosotros`.
  - Archivos nuevos: `components/sections/StorySection.tsx`,
    `public/video/hero-poster.webp`,
    `../FOTOS/FOTOS_GENERADAS/video/{hero-loop-v2-original,
    hero-loop-v1-abstracto-archivado}.mp4`.
  - Verificado: lint, typecheck y build limpios; CDP en 390 y 1440 con
    `prefers-reduced-motion` normal y `reduce` (el poster reemplaza al
    video); confirmado que el scrim móvil corrigió el choque de texto
    sobre el logo del video.
- 2026-08-31 · Agente A · Pop-up solo en guías + hero 3D nativo (WebGL) +
  auditoría de copy con `BRANDING/COPYWRITING.MD`, los tres a pedido del
  dueño.
  - **Pop-up solo en guías**: `app/page.tsx` ya no importa ni monta
    `ScrollLeadCapture`. Sin cambios en `ScrollLeadCapture.tsx` ni en
    `app/recursos/[slug]/page.tsx` (ahí sigue igual, solo para `kind:
    "guide"`).
  - **Hero 3D nativo**: el video de fondo se reemplazó por una escena
    WebGL (Three.js) del lockup de Unity extruido en 3D, con parallax de
    cámara/luz al mouse, reacción al scroll y animación de entrada. Nuevo
    módulo `lib/hero-scene/` (`types`, `capabilities`, `animation`,
    `logo-geometry`, `environment`, `camera-rig`, `create-hero-scene.ts` —
    único archivo que importa `three`) más `components/sections/HeroScene.tsx`
    (carga diferida tras `load` + idle, nunca antes del LCP; cae al poster
    si no hay WebGL, si `prefers-reduced-motion: reduce`, o si algo falla).
    `HeroBackdrop.tsx` pasó de `<video>` a `<picture>`-like (poster
    desktop/móvil con `next/image`) + `HeroScene` encima con fundido de
    opacidad cuando el primer frame está listo (`.hero-scene-canvas.is-ready`
    en `globals.css`, antes `.hero-video-scrim` ahora `.hero-scrim`).
    **La geometría se generó vectorizando el trazado que subió el dueño**
    (`Corporate_logo_animation_in_envi….mp4` original descartado; en su
    lugar `file.svg` y `Adobe Express - file.png` en la raíz de
    `UNITY SEGUROS/`, copiados a `../FOTOS/LOGO/unity-lockup-{trace.svg,2752.png}`)
    con `scripts/build-logo-assets.mjs` (Node, usa `ShapePath.toShapes()`
    de `three` para resolver huecos por regla de relleno, igual que un
    navegador — **los huecos reales de las letras y el negativo del escudo
    NO están en el path[0] del SVG, son 20 `<path>` casi blancos separados,
    asignados por punto-en-polígono**; ver comentarios del script antes de
    tocarlo). Genera `lib/hero-scene/unity-logo.json` y la textura
    `public/images/brand/unity-shield-albedo-1024.webp`. Los posters
    (`public/images/hero/hero-poster{,-mobile}.webp`) se generan con
    `scripts/capture-hero-poster.mjs` (CDP, `setCaptureMode(true)` en el
    handle de depuración `window.__unityHero`, solo en dev) — **al
    capturar hay que ocultar también los `<img>` del poster además del
    scrim**, si no un "fantasma" del poster viejo se filtra detrás del
    canvas en capturas headless con GPU (encontrado y corregido en este
    bloque). En móvil la escena muestra solo el escudo (el lockup completo
    mediría menos de 120px de ancho, la marca exige mínimo 120px);
    `min-h` del hero en `Hero.tsx` se ajustó por breakpoint (680/700/720/
    760/820) para darle aire al encuadre. Verificado con GPU real en Chrome
    headless (`--use-gl=angle --use-angle=metal`, **nunca** `--disable-gpu`:
    rompe WebGL por completo aunque se pidan otras banderas): 60 fps en
    escritorio, el loop se pausa fuera del viewport y con la pestaña
    oculta (`IntersectionObserver` + `visibilitychange`), el chunk de
    `three` (~170 KB gzip) carga diferido y no aparece en el HTML inicial.
    `public/video/` se borró (video anterior archivado en
    `../FOTOS/FOTOS_GENERADAS/video/`, ya sin uso).
  - **Copy**: auditoría de todo el sitio contra `BRANDING/COPYWRITING.MD`
    (tono, beneficios antes que pólizas, prueba social), sin violar las
    prohibiciones de `Sistema de diseño para branding/CLAUDE.md` (sin
    guiones largos, sin "no es X, es Y", sin cifras inventadas). Nuevo
    `heroContent.subtitle` (con `{n}` de `insurers.length`, mismo patrón
    que `whyUnityPoints`), título de `WhyUnity.tsx`, dos FAQ de objeciones,
    `InsurersMarquee` también en el home (después de `WhyUnity`, antes de
    `RecentResources`; con `prefers-reduced-motion: reduce` en
    `globals.css`, hueco de accesibilidad preexistente que se cerró de
    paso), `product.headline` por producto (h1 propio en
    `/seguros/[slug]`, con fallback a `product.title`), `commercialLines`
    pasó de `string[]` a `{name, benefit}[]`, y `sponsors` vacío (la fila
    de patrocinadores en `EventsSection.tsx` ahora es condicional).
  - Archivos nuevos: `lib/hero-scene/{types,capabilities,animation,
    logo-geometry,environment,camera-rig,create-hero-scene}.ts`,
    `lib/hero-scene/unity-logo.json`, `components/sections/HeroScene.tsx`,
    `scripts/{build-logo-assets,capture-hero-poster}.mjs`,
    `public/images/brand/unity-shield-albedo-1024.webp`,
    `public/images/hero/hero-poster{,-mobile}.webp`,
    `../FOTOS/LOGO/unity-lockup-{trace.svg,2752.png}`. Dependencias:
    `three@0.185.1`, `@types/three@0.185.4` (dev), `sharp@0.35.4` (dev).
  - Borrados: `public/video/` completo (video y poster viejos).
  - Verificado: lint, typecheck y build limpios (18 páginas); barrido CDP
    de las 14 páginas del sitio sin errores de consola; modal de consulta
    sigue abriendo desde el hero con la escena 3D encima; pop-up ausente
    en el home y presente en una guía tras 60% de scroll; reduced-motion y
    "sin WebGL" (`--disable-3d-apis`) caen limpio al poster.
- 2026-09-08 · Agente A · Hero: escena 3D → fondo estático de marca, a
  pedido del dueño.
  - **`HeroBackdrop.tsx`** pasó de video/WebGL a un solo fondo:
    `bg-brand-gradient` (degradado navy a teal ya definido en
    `globals.css`) con el escudo (`unity-shield-icon.png`, el mismo
    recorte del lockup que ya se usaba) en un `next/image fill` anclado a
    la derecha — chico y arriba en móvil para no invadir el bloque de
    texto, grande y centrado verticalmente desde `lg:`. `.hero-scrim`
    sigue igual (el degradado que ancla el texto). `Hero.tsx` ya no le
    pasa `poster`/`posterMobile`/`textureUrl` a `HeroBackdrop`.
  - **Borrados**: `components/sections/HeroScene.tsx`, todo
    `lib/hero-scene/` (types, capabilities, animation, logo-geometry,
    environment, camera-rig, create-hero-scene, unity-logo.json),
    `scripts/{build-logo-assets,capture-hero-poster}.mjs`,
    `public/images/hero/` (los dos posters del render 3D),
    `public/images/brand/unity-shield-albedo-1024.webp` (textura del
    escudo, sin uso). Dependencia `three` (+ `@types/three`)
    desinstalada — nada la importa ya. `heroContent` (`lib/content.ts`)
    perdió `poster`, `posterMobile` y `scene.texture`; conserva
    `headline`, `tagline`, `subtitle`, `cta`, `ctaSecondary`.
  - **Por qué**: el dueño pidió volver a una imagen fija, sin la escena
    interactiva. El pipeline de geometría 3D (§9.3.1 de
    `PROMPT-FRONTEND.md`, ya retirada) y los activos fuente en
    `../FOTOS/LOGO/` quedan intactos por si se retoma más adelante.
  - Verificado: `rm -rf .next && npm run build` limpio (18 páginas), lint
    limpio, captura CDP en 1440px y 390px sin errores de consola.
- 2026-09-08 (tarde) · Agente A · Header: de dos filas a una sola franja
  navy compacta, a pedido del dueño (boceto de referencia).
  - **`Header.tsx`** reescrito: una sola `<div justify-between>` en vez
    de la fila blanca + franja navy de antes. Logo en blanco
    (`brightness-0 invert` sobre `unity-logo-notag.png`, antes a
    color). Botones más chicos por defecto, tamaño completo desde
    `xl:` (1280px) — a 1024-1279px el texto partía línea con el tamaño
    fijo anterior.
  - **`navItems`** (`lib/content.ts`) pasó de 6 entradas sueltas
    (Servicios, Por qué Unity, Recursos, FAQ, Nosotros, Contacto) a 3
    grupos: "Por qué Unity" (enlace), "Seguros y Productos" (dropdown,
    antes "Servicios"), "Guías y Recursos" (dropdown nuevo: Recursos +
    FAQ). `desktopNavItems`/`flatMap` en `Header.tsx` (que aplanaba
    "Servicios" en 6 enlaces sueltos para escritorio) se eliminó — ya
    no hace falta, los 3 grupos se mapean directo con `DropdownNav`.
    "Nosotros" y "FAQ" salen del header (FAQ vive en "Guías y
    Recursos"; Nosotros solo queda en el footer, que ya lo tenía en su
    columna "Más" — confirmado antes de quitarlo).
  - **Botón de teléfono**: "Contáctanos" (enlazaba a `/#contacto`) pasó
    a "Llámanos" (`variant="ghost"`, `CONTACT.phoneHref`, `tel:`
    directo) a pedido del dueño — antes abría una sección, ahora llama
    directo.
  - Verificado: `rm -rf .next && npm run build` limpio (18 páginas);
    `npx eslint` acotado a los archivos tocados limpio (el `npm run
    lint` global falla por un ENOENT ajeno en
    `.claude/worktrees/leads-airtable-whatsapp/.next/`, de otra sesión
    en curso — no relacionado con este cambio); captura CDP en 1440px,
    1024px (breakpoint `lg`, el punto más apretado), 390px cerrado y
    390px con el menú abierto, y el dropdown "Seguros y Productos"
    desplegado — todo sin errores de consola.
- 2026-09-08 · Agente B · Integración de leads completa: la ruta guarda en
  Airtable (tabla Leads, campos nuevos `Fuente`, `Notas del formulario`,
  `Consentimiento`; opciones nuevas `Comercial` y `Escolar` en "Seguro de
  Interés") y luego avisa al webhook de Make, que reenvía al grupo de
  WhatsApp "Leads Unity" vía Green API. Vitest añadido (42 pruebas). Las
  variables `AIRTABLE_API_KEY` y `MAKE_LEADS_WEBHOOK_URL` ya están en
  Vercel (Production y Preview) y en `.env.local`. Trabajo hecho en un
  worktree aislado (`worktree-leads-airtable-whatsapp`) y fusionado a
  `main`. Pendiente (no bloqueante, ver §5): migrar el escenario de Make
  del módulo HTTP genérico a la conexión oficial GREEN-API para sacar el
  token del texto plano. Archivos: `app/api/leads/route.ts` (+ test),
  `lib/leads/{normalize,airtable,make}.ts` (+ tests), `vitest.config.mts`,
  `package.json`, `.env.example`, `.gitignore`, `docs/superpowers/**`,
  `HANDOFF.md`, `PENDIENTES.md`.
- 2026-09-08 (tarde) · Agente A · Logo SVG oficial del dueño: header
  vuelve a blanco, escudo del hero pasa de WebP a SVG.
  - El dueño proveyó el lockup completo y el "escudo solo" como SVG
    (exportados de una herramienta de diseño, 115 `<path>` con clases
    de color para el efecto de degradado 3D falso). **Ambos archivos
    llevan un `<path>` de fondo blanco sólido integrado** (todo el
    lienzo 2752×1538, clase `.a`/`.s0`) — no son transparentes tal
    cual se recibieron. El "escudo solo" además **no es un recorte
    real**: es el mismo lockup completo con el `viewBox` angosto
    (898×1538) recortando solo la vista, con el resto del contenido
    (incluido el fondo blanco de 2752px) técnicamente presente fuera
    del área visible. Se quitó ese primer `<path>` de fondo con un
    script de Node (regex sobre el `d="m0 2q1376 0 2752 0..."`, el
    mismo patrón en los dos archivos) para dejar el arte realmente
    transparente. Originales intactos en
    `../FOTOS/LOGO/{unity-lockup-full,unity-shield-only}.svg`;
    versiones transparentes en
    `../FOTOS/LOGO/{unity-lockup-transparent,unity-shield-transparent}.svg`
    y copiadas a `public/images/brand/{unity-lockup,unity-shield}.svg`.
  - **Header vuelve a fondo blanco** (`Header.tsx`): el lockup a color
    lleva el texto "UNITY INSURANCE GROUP" en navy/gris (clase `.ac`
    `#1d264f` y gris), invisible sobre el navy de la franja compacta
    del cambio anterior de hoy — confirmado visualmente antes de
    decidir el cambio. Botón "Llámanos" pasó de `variant="ghost"`
    (borde blanco, para fondo oscuro) a `variant="outline"` (borde
    navy, para fondo claro); `DropdownNav` ya no lleva la prop `dark`.
  - **Escudo del hero**: `HeroBackdrop.tsx` cambia de
    `unity-shield-icon-hd.webp` (rasterizado, se veía algo borroso al
    escalarlo grande) a `unity-shield.svg` (vectorial, nítido a
    cualquier tamaño). Mismo posicionamiento y tamaños responsive de
    antes, solo cambió el `src`.
  - **`/marca` y `Footer.tsx`** también actualizados al SVG nuevo (a
    pedido del dueño, para consistencia): las 4 instancias de
    `unity-logo.png` en `/marca` y la de `logo-mark.png` en el footer
    pasan a `unity-lockup.svg`, mismo patrón `brightness-0 invert`
    donde ya se usaba sobre fondo oscuro.
  - Borrados (sin uso en ningún lado tras el cambio):
    `public/images/brand/{unity-logo,unity-logo-notag}.png`,
    `public/images/brand/unity-shield-icon-hd.webp`,
    `public/logo-mark.png`.
  - Verificado: `rm -rf .next && npm run build` limpio (18 páginas);
    `npx eslint` acotado limpio; captura CDP del header + hero en
    1440px y 390px, y de la portada + sección "Logo" de `/marca` en
    1440px — todo sin errores de consola, sin caja blanca residual
    detrás del logo sobre fondos oscuros.
- 2026-09-08 (tarde, más tarde) · Agente A · Logo definitivo: el dueño
  proveyó el render oficial en PNG con transparencia real (dentro de
  un SVG-contenedor con la imagen embebida en base64), reemplazando
  los SVG de paths reconstruidos del cambio anterior.
  - El dueño compartió "Unity Logo Transparente.svg" — un SVG que en
    realidad solo envuelve una imagen PNG en base64
    (`<image href="data:image/png;base64,...">`), no paths
    vectoriales. Extraído con Node (`base64` → `Buffer` → archivo):
    2757×1540, `hasAlpha: true` confirmado con `sharp().metadata()` —
    transparencia real, no simulada por el visor.
  - **`unity-lockup.webp`**: el PNG completo convertido a WebP
    (calidad 92) con `sharp`, 425 KB → 142 KB. Reemplaza
    `unity-lockup.svg` (que tenía las facetas del degradado
    reconstruidas a mano vía paths con clases de color — visualmente
    correcto pero menos fiel que el render oficial).
  - **`unity-shield.webp`**: escudo solo, recortado de la misma
    imagen con `sharp().extract()` + `.trim()` en dos pasos (extraer
    región aproximada primero, recortar transparencia sobrante en un
    segundo paso — `.trim()` fallaba con "bad extract area" al
    encadenarlo directo tras `.extract()` en la misma pipeline).
    727×789, WebP calidad 92, 135 KB → 59 KB. Reemplaza
    `unity-shield.svg`.
  - Los dos `.svg` reconstruidos del cambio anterior de hoy se
    borraron; todas las referencias (`Header.tsx`, `Footer.tsx`,
    `HeroBackdrop.tsx`, las 4 en `app/marca/page.tsx`) pasaron de
    `.svg` a `.webp`, ajustando `width`/`height` a las dimensiones
    reales del PNG (2757×1538 en vez de 2752×1538 — el ancho real del
    render es 2757, no 2752).
  - Verificado: `rm -rf .next && npm run build` limpio (18 páginas);
    `npm run lint` global limpio; captura CDP del header+hero en
    1440px y 390px, y de `/marca` en 1440px — sin errores de consola.
    Calidad visual notablemente mejor que el SVG reconstruido: el
    degradado del escudo se ve con la textura real del render 3D
    original en vez de facetas planas por clase de color.
