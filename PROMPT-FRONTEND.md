# PROMPT: Front-end de Unity Insurance Group

Eres un agente que construye el front-end del sitio de Unity Insurance Group.
Lee este documento completo antes de escribir código. Cada concepto está
explicado con 5 preguntas: **¿Qué? ¿Cómo? ¿Por qué? ¿Cuándo? ¿Cuánto?**
Si algo no está aquí y no lo sabes, NO lo inventes. Márcalo como pendiente.

---

## 1. La misión del sitio

- **¿Qué?** Una página que convierte visitantes en clientes de seguros.
- **¿Cómo?** Marca primero: el visitante entiende quién es Unity antes de
  que se le pida nada, elige su seguro, y deja su nombre y teléfono cuando
  ya tiene contexto — en un modal que abre desde cualquier CTA, o en el
  formulario del final de la página.
- **¿Por qué?** La gente no busca "una póliza". Busca no perder su casa,
  su auto o su negocio. El sitio le muestra el camino sin confundirla, y
  sin pedirle nada antes de tiempo.
- **¿Cuándo?** El visitante llega desde un anuncio, de Google o de
  Instagram. Puede llegar con prisa o con miedo. El sitio debe funcionar
  para los dos.
- **¿Cuánto?** Un home de 8 secciones (más header, modal de consulta y
  footer) y páginas internas: `/nosotros`, una por seguro
  (`/seguros/[slug]`), la bóveda de recursos (`/recursos`) y una por
  recurso (`/recursos/[slug]`). Cada sección tiene un solo trabajo.
  La acción de todo el sitio es "Consulta y orientación", que lleva al
  formulario (`#consulta`).

---

## 2. La marca

### El nombre

- **¿Qué?** Unity Insurance Group.
- **¿Cómo?** Siempre completo en textos legales. "Unity" solo, en frases
  cortas de marketing.
- **¿Por qué?** El nombre repetido crea memoria. La memoria crea confianza.
- **¿Cuándo?** En el header (logo), el footer y el mensaje de éxito del
  formulario.
- **¿Cuánto?** No lo repitas en cada párrafo. Dos o tres veces visibles
  por pantalla es suficiente.

### El lema (tagline)

- **¿Qué?** "Unidos para protegerte".
- **¿Cómo?** En letra script (Dancing Script), color teal. Es la firma de
  la marca.
- **¿Por qué?** Dice en tres palabras lo que vende Unity: unión y
  protección.
- **¿Cuándo?** Obligatorio en el hero y en el footer. Opcional en la
  sección de confianza.
- **¿Cuánto?** Tamaño 2xl a 3xl en el hero. Nunca en mayúsculas: la letra
  script no se lee bien en mayúsculas.

### El logo

- **¿Qué?** Un escudo con la letra U y el texto "UNITY INSURANCE GROUP".
- **¿Cómo?** Usa el archivo `/logo-mark.png` (fondo transparente, sin
  bordes vacíos). Sobre fondo oscuro, aplícale los filtros CSS
  `brightness-0 invert` para que salga blanco.
- **¿Por qué?** El archivo original `/logo.png` tiene fondo blanco sólido.
  Si lo inviertes, sale un cuadrado blanco. Por eso existe `/logo-mark.png`.
- **¿Cuándo?** Header (arriba a la izquierda, siempre visible) y footer.
- **¿Cuánto?** Altura de 36 a 44 píxeles en el header. El ancho se ajusta
  solo (width auto).

---

## 3. Los colores

- **¿Qué?** La paleta del sistema de diseño Unity (documento "01
  Fundamentos de Marca", v1.0). Dos azules cargan la identidad:
  1. **Navy Unity** `#0B2549`: fondos, titulares, barras.
  2. **Navy medio** `#143A6B`: degradados y capas.
  3. **Teal Unity** `#0E7C9B`: acento, palabra clave, iconos, botón
     primario. Hover: **teal oscuro** `#0B6580`.
  4. **Teal claro** `#1B9AB8`: botones activos, subrayados. **Teal pálido**
     `#7FD3E4` solo para etiquetas sobre fondo oscuro.
  5. Neutrales: **tinta** `#16223A` (cuerpo de texto), **gris** `#5A6B82`
     (apoyo), **gris medio** `#3F4E66` (párrafos de apoyo), **gris claro**
     `#C9D3E0` (líneas), **fondo claro** `#F2F5F9`.
  6. **Degradado del escudo**: `linear-gradient(135deg, #0B2549, #143A6B
     48%, #0E7C9B)`. Solo en fondos completos. Nunca detrás de texto largo.
- **¿Cómo?** Están definidos como variables CSS en `app/globals.css`
  (`--unity-navy`, `--unity-teal`, `--unity-line`, etc.) y se usan como
  clases de Tailwind (`bg-unity-navy`, `text-unity-teal-dark`). El
  degradado es la clase `bg-brand-gradient`.
- **¿Por qué?** Muchos colores confunden y se ven baratos. Pocos colores
  se ven profesionales. Un seguro vende confianza; la confianza se ve
  ordenada.
- **¿Cuándo?** Navy para fondos oscuros y títulos. Teal solo para acciones
  y acentos. Si algo no es un botón ni un acento, no lleva teal.
- **¿Cuánto?** Prohibido: verde, rojo, morado, azul genérico de Tailwind
  (`blue-600`). Si necesitas un color de éxito o error, usa teal para
  éxito y navy para texto de error. No agregues colores nuevos.

---

## 4. Las letras (tipografía)

- **¿Qué?** Dos familias, sin excepciones (sistema de diseño Unity):
  1. **Montserrat** (pesos 700 y 800): todo lo que se lee de lejos.
     Títulos h1 a h4, etiquetas en caja alta, botones y el tagline.
  2. **Source Sans 3** (pesos 400 y 600): todo lo que se lee de cerca.
     Párrafos, formularios, pies de foto. Cursiva solo en citas de
     clientes.
- **¿Cómo?** Se cargan con `next/font/google` en `app/layout.tsx`. Una
  regla global en `globals.css` pone Montserrat en h1–h4 solita. Para
  etiquetas y botones usa la clase `font-heading`. La clase `font-script`
  ya no es letra cursiva: ahora es Montserrat 800 (el sistema no usa
  script).
- **¿Por qué?** Montserrat pesa y se lee de lejos; Source Sans 3 es cómoda
  para leer una póliza. Dos familias mantienen la marca ordenada.
- **¿Cuándo?** Siempre. Si creas un componente nuevo con un `<h2>`, ya
  saldrá en Montserrat.
- **¿Cuánto?** Escala del sistema: display 76/74 · 800; título de sección
  46/50 · 800; subtítulo 26/31 · 700; etiqueta 15 · 700 · tracking 0.22em
  en caja alta; entradilla 22/34 · 400; cuerpo 17/28 · 400. En móvil,
  el hero baja a 3xl y los títulos de sección a 3xl. Las etiquetas van en
  mayúsculas; los títulos, en caja normal.

---

## 5. Las esquinas (border radius)

- **¿Qué?** Radio 16 / 999 (sistema de diseño Unity): 16 px en tarjetas y
  fotos, píldora (999 px) en botones y chips, 10 px en campos de
  formulario.
- **¿Cómo?** Tarjetas y fotos: `rounded-2xl` (16px). Botones y chips:
  `rounded-full`. Inputs: `rounded-[10px]` de 56 px de alto con borde
  `unity-line` de 1.5 px. Tarjeta blanca: sombra suave
  `0 2px 14px rgba(11,37,73,0.07)`, nunca borde y sombra a la vez.
- **¿Por qué?** Es la regla del documento de marca. El sitio, los posts y
  los anuncios deben verse como una sola familia.
- **¿Cuándo?** En todo elemento con borde o fondo. Espaciado siempre en
  múltiplos de 8.
- **¿Cuánto?** Sin valores sueltos (12px, 20px). Los círculos de iconos
  son círculos completos y alternan navy y teal en cada fila.

---

## 6. El espacio (whitespace)

- **¿Qué?** Aire entre secciones y dentro de las tarjetas.
- **¿Cómo?** Secciones: `py-20` en móvil, `py-28` en escritorio. Títulos
  de sección: margen inferior `mb-14`. Grillas: `gap-6` mínimo.
- **¿Por qué?** Una página apretada parece que esconde algo. Una página
  con aire parece transparente. En seguros, parecer transparente es
  vender.
- **¿Cuándo?** Siempre. Si dudas entre más espacio o menos, elige más.
- **¿Cuánto?** El contenido nunca toca los bordes: contenedor máximo
  `max-w-7xl` con `px-4` en móvil y `px-8` en escritorio.

---

## 7. El lenguaje (copywriting)

- **¿Qué?** Español simple. Nivel de tercer grado.
- **¿Cómo?** Frases cortas. Una idea por frase. Palabras de todos los
  días. Tono de "tú".
  - Bien: "El compulsorio cubre el auto del otro. No cubre el tuyo."
  - Mal: "La cobertura compulsoria provee protección de responsabilidad
    frente a terceros."
- **¿Por qué?** La gente ya está confundida con los seguros. Si el sitio
  también confunde, la persona se va. El que entiende, compra.
- **¿Cuándo?** En todo el sitio: títulos, descripciones, FAQ, mensajes de
  error y de éxito.
- **¿Cuánto?** Reglas duras:
  - Sin adverbios ("realmente", "simplemente", "rápidamente").
  - Sin jerga sin explicar. Si usas "deducible", el contexto lo explica.
  - Descripciones de producto: máximo 2 líneas.
  - Palabras clave permitidas: protección, cobertura, cubierta,
    tranquilidad, gratis, sin compromiso.
  - Sin promesas absolutas: nunca "el mejor precio", nunca "cubre todo".

### 7.1 Principios de `BRANDING/COPYWRITING.MD` (auditoría 2026-08-31)

El dueño pidió auditar el copy del sitio contra esa guía. Son principios de
**estructura y énfasis**, no licencia para romper las reglas de arriba ni las
del sistema de diseño — cuando chocan, ganan las prohibiciones (guiones
largos, "no es X, es Y", preguntas retóricas autorrespondidas, aperturas de
relleno, hype, cifras inventadas, emoji: ver `Sistema de diseño para
branding/CLAUDE.md`, sección "Copia").

- **P1 — Beneficios antes que pólizas**: no describas la cobertura técnica,
  di qué hace por la persona. "Te respalda si alguien sufre daños y te
  responsabilizan", no "cobertura de responsabilidad pública".
- **P2 — Vocabulario emocional sobrio**: tranquilidad, seguridad, respaldo,
  protección, confianza. Nunca "el mejor", "revolucionario".
- **P3 — Voz local y cercana**: "en Puerto Rico", "tu familia", "tu
  negocio", "tu carro", "tu casa". El producto se llama "Auto"; en el
  cuerpo del texto, "carro".
- **P4 — Escaneable**: frases cortas, párrafos de 1 a 3 líneas, bullets.
- **P5 — Un bloque, un CTA**: presenta → beneficios → prueba social → una
  sola acción clara. No mezclar dos llamados a la acción en el mismo
  bloque.
- **P6 — Anticipar objeciones**: precio, confianza, tiempo, "¿me
  responderán cuando pase algo?", "¿tengo que comprar algo?". Se
  responden sin prometer tiempos ni precios (PENDIENTES.md §3b).
- **P7 — Titulares directos**: "Protege tu carro", no juegos de palabras.

Aplicado en la auditoría: subtítulo de beneficio en el hero
(`heroContent.subtitle`), título "Lo que cambia cuando trabajas con Unity"
(antes "Por qué Unity"), dos FAQ de objeciones nuevas, la cinta de
aseguradoras (`InsurersMarquee`) también en el home como prueba social
después de "Por qué Unity", un h1 propio por página de producto
(`product.headline`, P7) y el beneficio de cada línea comercial
(`commercialLines`, P1). Los textos oficiales de marca (`aboutContent`,
`BRAND.tagline`, historia, valores) no se tocaron: son de la presentación
oficial, no de esta guía genérica de referencia de mercado.

---

## 8. Los botones (CTAs)

- **¿Qué?** Botones que piden una acción clara.
- **¿Cómo?** Componente `Button` (`components/ui/Button.tsx`). Ya pone
  MAYÚSCULAS solo (clase `uppercase`), así que escribe el texto normal y
  se muestra en mayúsculas. Variantes: `primary` (teal), `outline` (borde
  teal), `ghost` (borde gris), `white` (fondo blanco, para fondos oscuros).
- **¿Por qué?** Las mayúsculas hacen que el botón grite "aquí se hace
  clic". Un solo estilo de botón repetido enseña al visitante dónde
  actuar.
- **¿Cuándo?** El CTA principal aparece arriba (barra de anuncio + header),
  a mitad (tarjetas de producto, banner) y al final (splits, formulario).
  El visitante nunca debe hacer scroll de más de 2 pantallas sin ver un
  CTA.
- **¿Cuánto?** Textos exactos que ya existen:
  - "AGENDA TU CONSULTA Y ORIENTACIÓN" (hero, header escritorio, banner,
    barra de anuncio, tarjetas de producto, páginas de producto/recursos)
  - "CONSULTA" (header y barra fija en móvil)
  - "AGENDA TU CONSULTA" (botón de envío del formulario)
  - "LLÁMANOS" / "LLAMA AHORA" (teléfono: `tel:7879225558`)
  - "VER MI RESULTADO" (desbloquear el resultado de un quiz de Recursos)
  - "ACCESO A LA GUÍA" / "QUIERO RECIBIRLAS" (pop-up de correo en Recursos)
  Un CTA = una acción. Casi todos abren el modal de consulta
  (`openConsult()` del contexto), no navegan ni hacen scroll. No inventes
  CTAs nuevos sin razón.

---

## 9. La estructura, sección por sección

Estructura "marca primero" (decidida por el dueño el 2026-08-30, reemplaza la
de Fase 1 del 2026-08-29). El visitante lee y entiende quién es Unity antes
de que se le pida dejar sus datos: el logo ancla la marca desde el header, el
eslogan aparece temprano y sin forzar, y el formulario de consulta pasa a ser
la conclusión natural de la página (penúltima sección, justo antes del
footer) en vez del segundo bloque. El CTA de todo el sitio es "Consulta y
orientación" y casi siempre abre un modal (`ConsultModal`, montado una vez en
`app/layout.tsx`), no hace scroll.

### 9.1 Barra de anuncio (arriba de todo)

- **¿Qué?** Una franja teal con un mensaje de temporada.
- **¿Cómo?** Botón de ancho completo. Texto: "TEMPORADA DE HURACANES:
  AGENDA TU CONSULTA Y ORIENTACIÓN" + flecha. Al hacer clic, abre el modal
  de consulta (`openConsult()`). Solo en el home.
- **¿Por qué?** La urgencia de temporada (huracanes) es la razón #1 por la
  que alguien revisa su seguro en Puerto Rico.
- **¿Cuándo?** Visible al cargar. No es fija: se va al hacer scroll.
- **¿Cuánto?** Una línea. Chip "NUEVO" a la izquierda (se oculta en móvil).

### 9.2 Header (navegación)

- **¿Qué?** Barra fija arriba, fondo **blanco**, logo **a color**.
- **¿Cómo?** El contenedor es `justify-between` con dos grupos: el menú a
  la **izquierda** (`Servicios ▾` con los 6 seguros a `/seguros/[slug]`,
  Por qué Unity, Recursos, FAQ, Nosotros, Contacto) y, a la **derecha**,
  agrupados: teléfono (`outline`, borde navy) + botón "CONSULTA Y
  ORIENTACIÓN" (teal) + el logo a color, sin el eslogan
  (`/images/brand/unity-logo-notag.png`, `max-h-[44px]`), como último
  elemento y dentro de un `<Link href="/">`. En móvil: hamburguesa a la
  izquierda; a la derecha, botón "CONSULTA" + el mismo logo. El menú móvil
  se CIERRA solo al tocar un enlace. Los enlaces usan `/#ancla` para
  funcionar desde cualquier página.
- **¿Por qué?** El logo en la esquina superior derecha es el estándar
  visual que ancla la marca durante el scroll (pedido del dueño). Fondo
  blanco porque el logo a color lleva texto navy: sobre navy sería
  ilegible sin invertirlo, y para eso ya existe el header navy anterior.
- **¿Cuándo?** Siempre visible (sticky, z-50). El botón de consulta abre el
  modal (`openConsult()` del contexto, `lib/quote-form-context.tsx`); ya no
  hace scroll a ningún ancla.
- **¿Cuánto?** 6 enlaces. Los dropdowns abren con hover en escritorio y con
  tap en móvil. "Reclamaciones" y "Blog" siguen fuera del menú hasta tener
  contenido (PENDIENTES).

### 9.3 Hero

- **¿Qué?** La primera pantalla, a pantalla completa. Un fondo estático de
  marca (degradado navy a teal, `bg-brand-gradient`) con el escudo de
  Unity como elemento gráfico, ancorado a la derecha; el nombre, el
  eslogan, un subtítulo de beneficio y la acción se anclan abajo, sobre
  un degradado. Sin animación, sin video, sin JS de por medio — reemplaza
  la escena 3D nativa (WebGL, Three.js) que hubo del 2026-08-31 al
  2026-09-08 (a pedido del dueño: volver a un fondo estático).
- **¿Cómo?** `Hero.tsx`: `<section>` `relative isolate`, con
  `HeroBackdrop` como capa `absolute inset-0` y el contenido en
  `relative z-10`, anclado abajo (`flex flex-col justify-end`, altura
  mínima por breakpoint: `680px` móvil, `700px` sm, `720px` md, `760px`
  lg, `820px` xl). Adentro, en orden: h1 "Unity Insurance Group"
  (Montserrat 800, blanco) → eslogan "Unidos para protegerte" en itálica,
  `text-unity-teal-pale` → subtítulo de beneficio (`heroContent.subtitle`,
  con `{n}` = `insurers.length`, mismo patrón que `whyUnityPoints`) →
  botón teal "AGENDA TU CONSULTA Y ORIENTACIÓN" (abre el modal) + botón
  `variant="ghost"` "LLÁMANOS". `HeroBackdrop.tsx`: `div` con
  `bg-brand-gradient` de fondo completo, el escudo
  (`public/images/brand/unity-shield-icon.png`) en un `next/image fill`
  posicionado a la derecha (más chico y anclado arriba en móvil para no
  invadir el bloque de texto; grande y centrado verticalmente desde
  `lg:`), y encima `.hero-scrim` (degradado navy de abajo hacia arriba
  que ancla el texto). El degradado es más sólido en móvil que en
  escritorio (`@media (min-width: 1024px)` en `globals.css`).
- **¿Por qué?** El dueño pidió volver a un fondo estático (2026-09-08).
  El h1, el eslogan y el subtítulo en HTML siguen ahí por SEO y
  accesibilidad, anclados abajo para no pisar el escudo.
- **¿Cuándo?** Lo primero que se ve tras el header.
- **¿Cuánto?** Sin JS adicional: la imagen del escudo carga con
  `priority` igual que antes el poster. Textos en `heroContent`
  (`lib/content.ts`): `headline`, `tagline`, `subtitle`, `cta`,
  `ctaSecondary` (ya no lleva `poster`/`posterMobile`/`scene`).

### 9.3b Nuestra historia (`#historia`, solo en el home)

- **¿Qué?** Adelanto corto de "quiénes somos" en el home, entre el
  sub-hero y los servicios. Marca primero: la persona entiende quién es
  Unity antes de ver qué vende.
- **¿Cómo?** `StorySection.tsx`, contenido en `storyContent`
  (`lib/content.ts`, reutiliza los dos párrafos de `aboutContent.story` —
  no duplicar el texto, referenciarlo). Eyebrow "Nuestra historia" → h2
  "Por qué existe Unity" → los dos párrafos → botón outline "Conoce más
  sobre nosotros" (enlaza a `/nosotros`). A la derecha, una foto real de
  `public/images/eventos/` (hoy `equipo-unity.jpg`, recorte `object-top`
  en `aspect-[4/5]`) — **nunca** una foto generada por IA aquí: es
  literalmente el equipo. La versión completa (pilares, visión, valores)
  sigue solo en `/nosotros` (`AboutSection.tsx`); no repetir todo eso en
  el home.
- **¿Por qué?** El dueño pidió que hubiera parte de la historia de Unity en
  el landing page principal, no solo en `/nosotros`.
- **¿Cuándo?** Después de las cifras del sub-hero, antes del grid de
  servicios.

### 9.4 Sub-hero (quiénes somos y cifras)

- **¿Qué?** Franja sobre el degradado del escudo con una línea de quiénes
  somos y tres cifras.
- **¿Cómo?** Izquierda: "Somos una oficina de servicios de seguros en Puerto
  Rico. Trabajamos con familias y con negocios." (el eslogan ya apareció en
  el hero: aquí no se repite). Derecha: "18+ años de experiencia
  combinada", número de aseguradoras (calculado de `insurers.length`) y
  "1 a 1 servicio personalizado en cada etapa".
- **¿Por qué?** Números que vienen de la presentación oficial (lámina 02).
  La frase exacta es "experiencia combinada": no decir "18 años sirviendo".
- **¿Cuándo?** Justo bajo el hero.
- **¿Cuánto?** 3 cifras (`trustStats`). Sin foto. Degradado solo como fondo
  completo con textos cortos (regla del sistema).

### 9.5 Servicios (`#servicios`)

- **¿Qué?** "Protección para lo que importa": 6 tarjetas de seguro.
- **¿Cómo?** Grilla 1→2→3 columnas. Cada tarjeta: chip badge → icono en
  círculo (navy/teal alternando) → título → descripción → botón "CONSULTA Y
  ORIENTACIÓN" (abre el modal con el producto preseleccionado) → enlace
  "Ver qué cubre" a `/seguros/[slug]`.
- **¿Por qué?** El orden vende: Hogar primero (mayor dolor en PR), después
  Comercial, después Auto. Cáncer, Viajero y Escolar son secundarios.
- **¿Cuándo?** Tercera sección.
- **¿Cuánto?** Exactamente 6 (decisión del dueño): Hogar, Comercial, Auto,
  Cáncer, Viajero, Escolar. Los ids son los slugs de las páginas.

### 9.6 Por qué Unity (`#por-que-unity`)

- **¿Qué?** El eslogan reaparece aquí, discreto, como segundo punto de
  énfasis (el primero fue el hero) — seguido de tres puntos de
  diferenciación.
- **¿Cómo?** Eyebrow "Unidos para protegerte" (13px, `tracking-[0.08em]`,
  `text-unity-teal`, sentence case) → título "Por qué Unity" → tres
  tarjetas claras con icono en círculo: "Te explicamos antes de firmar" /
  "La mayoría te explica el seguro después de firmar. Nosotros, antes.",
  "Comparamos {n} aseguradoras" / "Das tus datos una vez. Buscamos precio y
  cubierta en {n} compañías.", "Una persona conoce tu caso" / "Te atiende
  la persona que manejará tu póliza, hasta el pago de una reclamación."
  `{n}` se reemplaza por `insurers.length`.
- **¿Por qué?** Son las tres cosas que el material de marca repite
  (`_FRAMEWORK_COPY.md` y sistema de diseño): educar antes, comparar,
  atención humana. El eslogan se mantiene solo en el hero y aquí: en el
  nav, footer y botones no aparece (pierde peso si está en todas partes).
- **¿Cuándo?** Después de los productos, antes de pedir datos.
- **¿Cuánto?** Exactamente 3 (`whyUnityPoints`). Una frase de título y dos
  de texto.

### 9.7 Consulta y orientación (modal + `#consulta`)

- **¿Qué?** El formulario que gana el dinero, en dos sitios con el mismo
  contenido: un **modal** (la vía rápida desde cualquier CTA) y una
  **sección fija** al final de cada página, justo antes del footer (la
  conclusión natural, no el segundo bloque).
- **¿Cómo?** El formulario en sí vive en `components/ui/ConsultForm.tsx`
  (campos + envío, sin envoltorio): Nombre (requerido), Teléfono
  (requerido), Seguro que te interesa (select, requerido), Correo
  (opcional) → casilla obligatoria "Acepto que Unity me contacte por
  teléfono o WhatsApp sobre esta consulta." (texto del sistema de diseño) →
  botón "AGENDA TU CONSULTA" → nota "Usamos tus datos solo para
  contactarte. Toda cotización está sujeta a elegibilidad y aprobación de
  la aseguradora." → teléfono y WhatsApp como alternativa. Envía
  `POST /api/leads` (Airtable). Error en `#8A2B2B` sobre `#F6E3E3`. Al
  enviar: check teal y mensaje de confirmación. `ConsultModal.tsx` lo
  envuelve en un diálogo (`fixed inset-0`, overlay, ✕, cierra con Escape o
  clic fuera, bloquea el scroll del body) montado una vez en
  `app/layout.tsx`; `ConsultSection.tsx` lo envuelve en la sección fija del
  final de la página, con `id="consulta"`.
- **¿Por qué?** Pedir poco = más gente completa. El consentimiento habilita
  legalmente el WhatsApp posterior. El modal existe porque un botón que
  hace scroll de golpe hasta el fondo rompe el ritmo de lectura; abrirlo
  encima del contenido no.
- **¿Cuándo?** El modal se abre desde el header, la barra de anuncio, la
  barra fija móvil, las tarjetas de producto, el banner de `/nosotros` y el
  cierre de cada página de producto o recurso — todo vía `openConsult()`
  del contexto (`lib/quote-form-context.tsx`), o `OpenConsultButton.tsx` en
  páginas servidor. Los botones de producto preseleccionan el seguro; las
  páginas de producto también fijan el producto al montar
  (`SetSelectedProduct.tsx`, sin crear un `QuoteFormProvider` anidado: solo
  hay un contexto, el del layout raíz, para que el modal y la sección fija
  compartan el mismo estado).
- **¿Cuánto?** 4 campos + 1 casilla. Ni uno más. Sin promesas de tiempo de
  respuesta (PENDIENTES 3b).

### 9.8 Recursos más recientes (`#recursos`) y la bóveda `/recursos`

- **¿Qué?** Tarjetas que enlazan **directamente** a cada recurso — sin
  formulario de por medio. La captura de correo ocurre después de leer, no
  antes: el visitante que llegó desde redes ya tiene interés; pedirle el
  correo antes de dejarlo leer es fricción que no se ha ganado.
- **¿Cómo?** En el home, `RecentResources.tsx` muestra los 3 recursos más
  recientes (chip "De prueba" mientras el contenido no sea el final
  aprobado) con enlace "Hacer el quiz" / "Leer la guía" y un enlace final
  "Ver todos los recursos" a la página `/recursos` (bóveda con todos, para
  cuando la lista crezca). Cada recurso vive en `lib/resources.ts` con
  `kind: "quiz" | "guide"`:
  - **Quiz** (`quiz-huracan`, `checklist-seguro-de-casa`, este último ya no
    es una lista para marcar sino un quiz de sí/no con el mismo mecanismo):
    preguntas de sí/no (`ResourceQuiz.tsx`) → al contestar todas, "Ver mi
    resultado" revela un bloque de resultado con nivel **bueno / regular /
    malo** (colores `--result-good` / `--result-mid` / `--result-bad` del
    sistema, apagados, con su icono) envuelto en `ResultsGate.tsx`: el
    resultado se ve **difuminado** (`blur-[7px]`, sutil) con una tarjeta
    encima ("Tu resultado está listo" → botón que abre el pop-up de
    correo). Al enviar nombre y correo, se desvanece el difuminado con
    transición; si cierra el pop-up sin enviar, el resultado sigue
    difuminado y el botón queda para reabrirlo.
  - **Guía** (`guia-compulsorio-vs-full-cover`, `5-errores-seguro-auto`):
    tabla comparativa o lista numerada, **completa y legible sin puerta**.
    `ScrollLeadCapture.tsx` dispara el pop-up de correo a los 45 segundos
    en la página o al 60% de scroll (lo que ocurra primero), una sola vez
    por sesión, ofreciendo recibir más contenido — no bloquea nada de lo
    que ya se leyó.
  - El pop-up de correo (`LeadCaptureModal.tsx`, reutilizado por ambos
    mecanismos) pide solo **Nombre y Correo** (sin teléfono: es una oferta
    de contenido, no una solicitud de consulta), con la nota "También
    recibirás consejos de Unity. Puedes darte de baja cuando quieras."
    Envía a `/api/leads` con `notas` describiendo el recurso; la ruta
    acepta el lead sin teléfono si trae correo. El estado de "ya dejó su
    correo" vive en `sessionStorage` (`lib/lead-capture.ts`): una vez
    capturado en cualquier recurso, los quizzes del resto de la sesión
    aparecen desbloqueados de una vez.
- **¿Por qué?** Educar es la estrategia; pedir el dato cuando ya hay interés
  genuino da leads más calificados y una experiencia que se siente útil,
  no invasiva.
- **¿Cuándo?** Después de "Por qué Unity" en el home.
- **¿Cuánto?** 4 recursos hoy (`lib/resources.ts`), contenido **de prueba**:
  verídico pero no el texto final aprobado por el dueño (PENDIENTES.md).
  Sin precios.

### 9.9 FAQ (`#faq`)

- **¿Qué?** Acordeón de preguntas generales.
- **¿Cómo?** Una pregunta abierta a la vez, primera abierta por defecto,
  flecha que rota. Preguntas: costo, consulta gratis (única mención de
  "gratis" del home: no se repite en cada CTA), inundación, compulsorio,
  reclamaciones, aseguradoras, contacto.
- **¿Por qué?** Responde dudas antes de que llamen.
- **¿Cuándo?** Penúltima sección.
- **¿Cuánto?** 7 preguntas, respuestas de 1–2 frases. PENDIENTE: preguntas
  reales del equipo. Las preguntas por producto viven en cada página de
  seguro.

### 9.10 Contacto directo (`#contacto`), Consulta (`#consulta`) y Footer

- **¿Qué?** Tres tarjetas de contacto + horario, luego la sección de
  consulta (9.7) como penúltimo bloque, y el footer navy al final.
- **¿Cómo?** Contacto: Llámanos (tel), WhatsApp (mensaje prellenado), Correo,
  y la línea "Horario: Lunes a viernes, 8:00 a.m. a 5:00 p.m." desde
  `LEGAL.horario`. Sin subtítulo (el título ya dice todo). Footer: logo
  blanco (con su lema, es el lockup completo de marca — distinto de repetir
  el eslogan en prosa), columnas Contacto, Servicios (a `/seguros/[slug]`)
  y Más (Recursos, FAQ, Nosotros, Contacto), disclaimer de cotización +
  copyright, sin el eslogan como texto aparte. Dirección y licencia
  aparecen SOLOS cuando se llenen en `LEGAL`.
- **¿Por qué?** El que llegó al final sin convertir encuentra ahí todas las
  puertas: contacto directo, el formulario, y el mapa completo del sitio.
- **¿Cuándo?** Las tres, en ese orden, cierran la página.
- **¿Cuánto?** 3 canales + horario. Teléfono real: 787-922-5558. Email:
  service@unityinsurancepr.com.

### 9.11 Páginas internas

- **`/seguros/[slug]`** (una por producto, estáticas): banda navy con icono,
  kicker "Seguro de X", h1, intro y botón que abre el modal de consulta →
  "Qué cubre" (check teal) → "Qué no cubre" (x navy) → "Quién puede
  aplicar" → "Preguntas frecuentes de este seguro" (acordeón) → "Caso
  ilustrativo" (tarjeta navy con arco horizontal, sin primas, con aviso de
  que es un ejemplo) → sección de consulta con el producto fijado → "Ver
  todos los seguros". Contenido en `lib/product-details.ts`. Viajero,
  Cáncer, Auto y Hogar completos; Comercial muestra las líneas comerciales
  de la lámina 08; Escolar y Comercial llevan aviso de "guía en
  preparación".
- **`/recursos`** (bóveda, estática): todos los recursos en un grid, con su
  tipo (Quiz/Guía) y el mismo chip "De prueba" mientras aplique.
- **`/recursos/[slug]`** (una por recurso, estáticas): banda navy + el quiz
  o la guía completa (ver 9.8) + preguntas frecuentes si el recurso las
  trae + cierre con botón que abre el modal de consulta + enlace a
  "/recursos". El pop-up de captura por scroll/tiempo (solo en guías) se
  monta fuera de `<main>`, junto al footer.
- **`/nosotros`**: `AboutSection` (historia, pilares, visión, valores) →
  cinta de aseguradoras → Eventos (5 fotos reales + celda a Instagram) →
  Instagram (6 capturas) → Banner CTA con arco (botón abre el modal) →
  Footer.
- **`/marca`**: guía viva del sistema de diseño (noindex).

### 9.12 Secciones sin montar

`Testimonials`, `BlogPreview` y `SplitFeatures` existen en
`components/sections/` pero no se montan en ninguna página (decisión del
dueño, 2026-08-29): vuelven cuando haya reseñas reales con permiso y
artículos escritos. NUNCA inventes una reseña.

---

## 10. Comportamiento (interacciones)

- **¿Qué?** Todo lo que se mueve o responde al clic.
- **¿Cómo?**
  1. Scroll suave global (`scroll-behavior: smooth`) y `scroll-mt-24` en
     cada sección con ancla (para que el header fijo no tape el título).
  2. Estado compartido con React Context (`lib/quote-form-context.tsx`):
     `openConsult(productId?)` abre el modal de consulta y preselecciona el
     producto; `isConsultOpen`/`closeConsult()` lo controlan. Un único
     `QuoteFormProvider` vive en `app/layout.tsx` — las páginas no crean
     uno propio (evita que el modal y una sección fija queden desconectados
     en distintos contextos).
  3. Los pop-ups de Recursos (`ConsultModal`, `LeadCaptureModal`) son el
     mismo patrón: montados siempre, cambian de opacidad para animar
     entrada/salida, cierran con Escape, clic en el overlay o el botón ✕,
     bloquean el scroll del body mientras están abiertos.
  4. Los formularios validan con HTML (`required`) y llaman a
     `POST /api/leads`. Menú móvil se cierra al navegar.
  5. El fondo del hero es una sola imagen estática (`HeroBackdrop.tsx`,
     sin JS): no hay animación que pausar ni preferencia de movimiento
     que respetar.
- **¿Por qué?** Cada fricción (un salto brusco, un menú que no cierra, un
  select vacío) pierde clientes.
- **¿Cuándo?** En cada interacción. Nada recarga la página.
- **¿Cuánto?** Cero librerías de animación ni de modales. Solo CSS,
  Context y `fetch`.

---

## 11. Móvil

- **¿Qué?** El sitio funciona primero en el teléfono.
- **¿Cómo?** Breakpoints Tailwind: base = móvil, `sm` 640, `md` 768,
  `lg` 1024 (aquí aparece el nav completo del header). El video del hero es
  full-bleed en todos los tamaños, pero el panel sólido que ancla el texto
  es más grande en móvil que en escritorio (ver 9.3): probar cualquier
  cambio ahí en 375-390px, no solo en escritorio.
  Grillas: 1 columna → 2 → 3/4/6.
- **¿Por qué?** La mayoría del tráfico de anuncios llega por teléfono.
- **¿Cuándo?** Diseña cada componente en 375px primero; luego escala.
- **¿Cuánto?** Botones de mínimo 44px de alto al tacto. `tel:` y
  WhatsApp (`wa.me/17879225558`) deben abrir las apps nativas.

---

## 12. Accesibilidad

- **¿Qué?** El sitio se puede usar con lector de pantalla y teclado.
- **¿Cómo?** Toda imagen `<Image>` lleva `alt`. Todo div con
  `background-image` lleva `role="img"` + `aria-label`. Inputs con
  `<label>` (aunque sea `sr-only`). Acordeones y dropdowns con
  `aria-expanded`. Focus visible (`focus-visible:ring-2`).
- **¿Por qué?** Es lo correcto, y además el checklist del framework lo
  exige.
- **¿Cuándo?** Al crear cada elemento, no al final.
- **¿Cuánto?** Contraste mínimo AA: texto blanco sobre navy pasa; texto
  teal sobre blanco solo para acentos grandes, no para párrafos.

---

## 13. Reglas de oro: NO INVENTAR

- **¿Qué?** Datos que NO existen todavía y NO se pueden inventar.
- **¿Cómo?** Si el dato no está en `lib/constants.ts` o `lib/content.ts`,
  déjalo vacío y anótalo en `PENDIENTES.md`. El código ya oculta los
  campos vacíos solo.
- **¿Por qué?** Un número de licencia inventado, una reseña falsa o una
  aseguradora que no es aliada real puede costar una multa o la
  reputación.
- **¿Cuándo?** Siempre. Ante la duda, pendiente.
- **¿Cuánto?** La lista completa vive en `PENDIENTES.md`. Resumen:
  - Nombre legal, licencia, jurisdicción, dirección, horario → `LEGAL` en
    `lib/constants.ts` (vacíos).
  - Testimonios reales con permiso.
  - Política de privacidad y términos (revisión legal).
  - Lista real de aseguradoras y patrocinadores.
  - Envío real del formulario, analítica, CRM (pospuesto a propósito).
  - Contenido de recursos, blog y proceso de reclamaciones.

---

## 14. Cómo saber que terminaste (checklist)

- **¿Qué?** La prueba final antes de entregar.
- **¿Cómo?** Corre y verifica, en este orden:
  1. `npm run lint` → cero errores, cero warnings.
  2. `npm run build` → compila sin errores ni warnings.
  3. Abre el sitio en un navegador real: consola limpia (sin errores ni
     warnings).
  4. Prueba el flujo completo: barra de anuncio → abre el modal de
     consulta; "CONSULTA Y ORIENTACIÓN" de Hogar → abre el modal con
     "hogar" preseleccionado; llena nombre y teléfono → envía → aparece
     "Gracias"; el modal cierra con Escape, el overlay o ✕.
  5. En 375px: hamburguesa abre, tocar "FAQ" navega Y cierra el menú; el
     logo aparece a la derecha del header en todo momento.
  6. En un quiz de Recursos: contesta todas las preguntas, el resultado
     sale difuminado con un color de nivel; el pop-up de correo lo
     desbloquea. En una guía: el pop-up de correo aparece solo tras 45s o
     60% de scroll, una vez por sesión.
  7. Toma captura de página completa en escritorio y móvil y compárala
     con la sección 9: ¿están las secciones en orden, con el formulario
     como penúltimo bloque?
- **¿Por qué?** "Se ve bien en mi editor" no es terminado. Terminado es
  verificado en el navegador.
- **¿Cuándo?** Después de CADA cambio, no solo al final. Es un ciclo:
  cambiar → verificar → corregir → repetir hasta cero errores.
- **¿Cuánto?** El ciclo completo toma minutos. Un bug en producción cuesta
  clientes. Repite el ciclo las veces que haga falta.

---

## Stack técnico (referencia rápida)

- Next.js 16 (App Router, Turbopack) + TypeScript + Tailwind CSS v4.
- Iconos: lucide-react. Imágenes: componente `next/image` o
  `background-image` con `role="img"`.
- Fuentes: `next/font/google` (Merriweather, Open Sans, Dancing Script).
- Estructura: `app/` (page, layout, globals), `components/layout/`,
  `components/sections/`, `components/ui/`, `lib/` (content, constants,
  contexto), `public/images/` (equipo/, lifestyle/).
- Todo el contenido editable vive en `lib/content.ts` y
  `lib/constants.ts`. Los componentes solo pintan. Para cambiar un texto,
  NO toques el componente: toca el contenido.
- ANTES de escribir código, lee la guía de la versión de Next en
  `node_modules/next/dist/docs/` — esta versión tiene cambios que rompen
  con lo que conoces.
