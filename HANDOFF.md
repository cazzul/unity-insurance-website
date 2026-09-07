# HANDOFF — Unity Insurance Group (sitio web)

Documento de coordinación entre agentes que trabajan en paralelo sobre este
repositorio. Léelo completo antes de tocar código. Última actualización:
2026-08-31.

## 1. Estado actual en una frase

Sitio "marca primero" (home + `/nosotros` + `/seguros/[slug]` + `/recursos` +
`/recursos/[slug]` + `/marca`) terminado y verificado: el CTA de todo el sitio
abre un modal de consulta, el formulario del final de cada página es la
conclusión natural, y los recursos (quizzes y guías) se leen completos antes
de pedir el correo. El hero del home es ahora una escena 3D nativa (WebGL,
Three.js) del logo de Unity, interactiva, no un video ni un panel lateral; el
pop-up de captura por tiempo/scroll ya no aparece en el home, solo dentro de
las guías; y el copy de todo el sitio se revisó contra `BRANDING/COPYWRITING.MD`.
El home trae un adelanto de "Nuestra historia" con foto real de equipo. Lint,
typecheck y build pasan. Consola del navegador limpia.

## 2. Quién está tocando qué (evitar pisarse)

| Área | Agente | Archivos | Estado |
|---|---|---|---|
| Front-end, diseño, copy, contenido | Agente A (front-end) | `app/globals.css`, `app/layout.tsx`, `app/page.tsx`, `app/nosotros/`, `app/seguros/[slug]/`, `app/recursos/`, `app/marca/`, `components/**`, `lib/content.ts`, `lib/constants.ts`, `lib/product-details.ts`, `lib/resources.ts`, `lib/hero-scene/**`, `lib/quote-form-context.tsx`, `lib/lead-capture.ts`, `public/images/**`, `scripts/build-logo-assets.mjs`, `scripts/capture-hero-poster.mjs`, `../FOTOS/LOGO/**`, `PROMPT-FRONTEND.md`, `PENDIENTES.md` | Rediseño "marca primero" (2026-08-30) + hero 3D, copy y pop-up solo en guías (2026-08-31), ver registro |
| Backend de leads (Airtable) | Agente B (integraciones) | `app/api/leads/route.ts`, la parte de `fetch`/estados de carga y error en `components/ui/ConsultForm.tsx` (antes la lógica vivía en `ConsultSection.tsx`) y en `components/ui/LeadCaptureModal.tsx` (antes `LeadMagnetForm.tsx`), carpeta `../CRM` | En curso; falta variable de entorno (ver §5) |

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

- **El formulario hoy siempre falla al enviar en local.** `QuoteSection`
  hace `POST /api/leads`; la ruta exige `process.env.AIRTABLE_API_KEY` y
  **no existe `.env.local`** en el repo. Sin la variable, la API responde
  500 y el usuario ve "Hubo un error al enviar". Agente B: crear
  `.env.local` (está en `.gitignore`) con `AIRTABLE_API_KEY=...` y confirmar
  que la base `appILZGkXur2MUFYY` / tabla `tblHvViPZO4etWUh2` (Prospectos)
  tiene los campos `Nombre`, `Teléfono`, `Email`, `Fuente`, `Estado`,
  `Fecha de entrada`, `Notas`. Nunca poner la llave en código ni en este
  archivo.
- Los avisos de error de los formularios ya usan el rojo del sistema
  (`#8A2B2B` sobre `#F6E3E3`), alineado el 2026-08-29.
- `LeadCaptureModal` (recursos) envía `nombre`, `email` y `notas` — **sin
  teléfono**. La ruta (2026-08-30) ya no exige teléfono si llega correo:
  requiere `nombre` + (`telefono` o `email`). La nota describe el origen
  ("Lead magnet: <recurso> (resultado)" en quizzes, "Newsletter: próximas
  guías..." en guías) y queda en el campo `Notas` de Airtable; `Fuente`
  sigue siendo `"Website"`. Si el CRM quiere distinguir la fuente, Agente B
  decide el valor (es un campo de opciones; no inventar valores desde el
  front).
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
