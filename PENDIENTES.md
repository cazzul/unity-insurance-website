# PENDIENTES — Unity Insurance Group

Lista de todo lo que el sitio necesita y que NO se puede crear sin información
o decisión del dueño. Nada de esto se inventa. Cuando tengas el dato, se
completa y se activa.

## 1. Datos legales y de confianza (bloquean el checklist de confianza)

Se completan en [lib/constants.ts](lib/constants.ts), objeto `LEGAL`. Cada
campo vacío se oculta solo; al llenarlo, aparece en el footer sin tocar código.

- [ ] **Nombre legal de la agencia** (¿"Unity Insurance Group, LLC"? ¿Corp?)
- [ ] **Número de licencia de productor** y jurisdicción (OCS Puerto Rico)
- [ ] **Dirección física** de la oficina
- [x] **Horario de atención**: "Lunes a viernes, 8:00 a.m. a 5:00 p.m."
      (confirmado por el dueño el 2026-08-29; en `LEGAL.horario`)
- [ ] **Política de privacidad**: texto real revisado por un profesional
      legal. El enlace del footer apunta a `#` hasta entonces.
- [ ] **Términos de uso** (si aplica)
- [ ] Revisión de todos los textos legales por un profesional regulatorio

## 2. Testimonios (sección construida, hoy desmontada)

La sección "Lo que dicen nuestros clientes" existe en
`components/sections/Testimonials.tsx` pero **no se monta en el home** desde
el 2026-08-29 (decisión del dueño: nada de placeholders en la estructura
nueva). Para volver a montarla con contenido real:

- [ ] 3 a 6 reseñas reales de clientes
- [ ] Permiso por escrito de cada cliente para publicar su nombre y reseña
- [ ] (Opcional) foto del cliente o inicial

Se editan en [components/sections/Testimonials.tsx](components/sections/Testimonials.tsx).
**No publicar citas inventadas.**

## 3. Conexiones y automatizaciones (pospuesto por decisión del dueño)

- [x] Envío real del formulario: **conectado a Airtable y WhatsApp**
      (2026-09-08). `POST /api/leads` crea el registro en la tabla Leads de
      "Unity Insurance CRM" y avisa al grupo "Leads Unity" vía Make + Green
      API. Detalle en `docs/superpowers/specs/2026-09-08-leads-airtable-whatsapp-design.md`.
- [ ] Analítica y conversiones (GA4, Meta Pixel, medir llamadas y WhatsApp
      como conversiones)
- [x] Notificación al agente en tiempo real: cada lead llega al grupo de
      WhatsApp "Leads Unity" con enlace al registro de Airtable (2026-09-08).
      Falta definir el proceso interno de seguimiento (quién toma el lead,
      cuándo pasa a "Contactado"). Dato clave del research: llamar a un lead
      en 5 minutos vs. 30 aumenta 100x la probabilidad de contactarlo
      (estudio MIT/InsideSales).
- [ ] Rotar el token de Green API en console.green-api.com: sigue en texto
      plano dentro del módulo HTTP del escenario de Make (funciona, pero es
      un pendiente de higiene de secretos). Migrar el escenario a la
      conexión oficial GREEN-API y al módulo `green-api:SendMessage`
      (diferido a pedido del dueño el 2026-09-08; ver Task 7 de
      `docs/superpowers/plans/2026-09-08-leads-airtable-whatsapp.md`).
- [ ] Antispam del formulario (honeypot o Turnstile) si empiezan a llegar
      leads basura al grupo de WhatsApp.

## 3b. Promesas que dependen de una decisión del negocio (research CRO)

- [ ] **Tiempo de respuesta visible** ("te contactamos en menos de X
      minutos/horas en horario laboral"): sube conversión (Unbounce/HBR),
      pero es una promesa operativa. El sistema de diseño propone "Te
      llamamos el mismo día laborable"; no se publica hasta que el dueño lo
      confirme. Se agregaría al formulario y al mensaje de éxito.
- [ ] **Rangos de precio** ("desde $X/mes" por producto): NN/g recomienda
      mostrar precio o rangos; ocultarlo se percibe como evasivo. Necesito
      rangos reales aprobados por las aseguradoras para publicarlos. El
      material técnico del 2026-08-29 trae rangos de fuentes públicas
      (MAPFRE, comparadores); **no se publicaron** por esta regla. Están en
      el material original si el dueño decide otra cosa.
- [ ] **Número de licencia junto al formulario**: señal de confianza que
      sube conversión en seguros (Unbounce/CXL). Se activa al llenar
      `LEGAL.numeroLicencia`.

## 4. Contenido que requiere información del negocio

- [x] **Aseguradoras reales**: lista de 15 provista por el dueño y cargada en
      [lib/content.ts](lib/content.ts) (`insurers`, con nombre y URL).
- [x] **Logos de aseguradoras**: los 15 cargados desde
      `FOTOS/LOGOS ASEGURADORAS`, procesados a PNG de 120px de alto con fondo
      transparente en `public/images/insurers/`. MAPFRE y AIG venían en
      blanco sobre transparente y se invirtieron a oscuro para verse en
      tarjeta blanca. Si se quieren sus versiones a color, hacen falta esos
      archivos.
- [ ] Confirmar con cada aseguradora la autorización de uso de marca.
- [x] **Líneas adicionales confirmadas** por la presentación oficial de marca
      (láminas 07 y 08 en `../FOTOS/`): Vida, Salud, Condominio,
      Responsabilidad, Botes, Cáncer, Accidentes personales, Viaje,
      Incapacidad, Propiedad y contingencia, Responsabilidad pública,
      Riesgos comerciales y Fianzas (bonds). **Decisión del dueño
      (2026-08-25): el grid sigue con las 6 tarjetas actuales.** Si quiere
      mostrar la lista completa, el contenido ya está en las láminas.
- [ ] **Evento de las fotos nuevas** (`public/images/eventos/`): nombre del
      evento, fecha y lugar para el pie de foto. Confirmar que las personas
      fotografiadas autorizan su uso en el sitio.
- [x] **Fotos generadas con Google Flow, retiradas del landing page**
      (2026-08-30): decisión del dueño de no usar imágenes de IA en la
      página principal. Las tres imágenes de `public/images/lifestyle/*.webp`
      ya no aparecen en el Hero (ver video de marca, abajo). `mayor-con-agente.webp`
      sigue en el `BannerCTA` de `/nosotros` (fuera del landing) y
      `pareja-poliza.jpg`/`casa-interior-pr.webp` quedan sin usar en
      `splitFeatures` (sección que no se monta). Si se quiere retirarlas de
      ahí también, avisar. La sección "Nuestra historia" del home ahora usa
      una foto real de `public/images/eventos/` (ver más abajo).
- [x] **Fondo del hero: imagen estática de marca** (2026-09-08): tras
      pasar por un video de marca (2026-08-30) y una escena 3D nativa
      interactiva con Three.js (2026-08-31), el dueño pidió volver a un
      fondo fijo. Hoy es un degradado de marca (navy a teal,
      `bg-brand-gradient`) con el escudo de Unity como elemento gráfico
      ancorado a la derecha, sin animación ni JS. El video (v1 abstracto y
      v2 del showroom) sigue archivado en `../FOTOS/FOTOS_GENERADAS/video/`
      y el pipeline de la geometría 3D (vectorización del lockup trazado
      del dueño) sigue documentado en el historial de `HANDOFF.md` por si
      se retoma más adelante; ninguno de los dos se usa en el sitio hoy.
- [x] **Pop-up de captura por tiempo/scroll, solo en guías** (2026-08-31):
      a pedido del dueño, se quitó del home (`ScrollLeadCapture` ya no se
      monta en `app/page.tsx`). Sigue apareciendo solo dentro de una guía
      de `/recursos/[slug]` (45s o 60% de scroll de esa página).
- [x] **Auditoría de copywriting con `BRANDING/COPYWRITING.MD`**
      (2026-08-31): se revisó el tono de todo el sitio contra esa guía
      (beneficios antes que pólizas, voz local, un CTA claro por bloque),
      manteniendo las prohibiciones del sistema de diseño (sin guiones
      largos, sin "no es X, es Y", sin cifras inventadas). Cambios: nuevo
      subtítulo de beneficio en el hero, título de "Por qué Unity", dos FAQ
      de objeciones nuevas, cinta de aseguradoras también en el home
      (prueba social), h1 propio por página de producto (`product.headline`),
      líneas comerciales con su beneficio (`commercialLines` en
      `lib/product-details.ts`), y "Patrocinador 1-4" oculto hasta tener
      nombres reales (`sponsors` vacío en `lib/content.ts`).
- [ ] **3 videos de marketing con Flow (Veo)**: prompts listos en la guía de
      estilo (familia en el balcón, agente llegando en carro, plaza de
      pueblo). Se disparan a mano en Flow cuando se quieran (consumen
      créditos de video).
- [ ] **Mención de Jayuya**: la tarjeta "Somos un comercio jayuyano" se
      retiró junto con la sección "Por qué elegir Unity" porque no aparece en
      ninguna fuente oficial. Si la agencia está en Jayuya, confirmarlo y va
      en `LEGAL.direccion` y en la sección Nosotros.
- [ ] **Patrocinadores reales**: la sección de eventos muestra "Patrocinador
      1-4" como placeholder en [components/sections/EventsSection.tsx](components/sections/EventsSection.tsx).
- [ ] **Proceso de reclamaciones**: "Reclamaciones" salió del menú el
      2026-08-29 porque no hay proceso definido. Falta definir el proceso
      real (pasos, teléfonos por aseguradora) para crear su página.
- [~] **Recursos**: 4 publicados — 2026-08-29: quiz de huracanes y guía
      compulsorio vs. full cover; 2026-08-30: el checklist de renovación se
      convirtió en quiz (mismo mecanismo, resultado bueno/regular/malo) y se
      sumó "5 errores con tu seguro de auto". **Contenido de prueba**:
      verídico pero no el texto final que apruebe el dueño — chip "De
      prueba" visible mientras tanto. Ya NO piden datos antes de leer: los
      quizzes muestran el resultado difuminado con un pop-up para
      desbloquearlo, las guías piden el correo por tiempo/scroll después de
      poder leerlas completas (ver HANDOFF.md). Contenido en
      [lib/resources.ts](lib/resources.ts); páginas en `/recursos/[slug]` y
      bóveda en `/recursos`. Para editar un texto, cambia el dato, no el
      componente. Falta: aprobar el contenido final y quitar "De prueba".
- [ ] **Contenido técnico de Comercial y Escolar**: las páginas
      `/seguros/comercial` y `/seguros/escolar` llevan aviso de "guía en
      preparación". Falta el mismo material que se entregó para Viajero,
      Cáncer, Auto y Hogar (qué cubre, qué no, quién aplica, preguntas, caso).
      El texto de beneficio de cada línea comercial (`commercialLines` en
      `lib/product-details.ts`, agregado 2026-08-31) es redacción nuestra
      sobre las 5 líneas ya confirmadas; falta que el dueño lo apruebe.
- [ ] **FAQ del equipo**: la FAQ general del home tiene 9 preguntas escritas
      por nosotros (2 nuevas de objeciones, 2026-08-31). Falta la lista de
      preguntas reales que recibe el equipo.
- [ ] **Blog**: `BlogPreview` existe pero no se monta (sin artículos).
- [x] **Redbridge** confirmada como aseguradora aliada (está en la lista de
      15); aparece en la cinta de aseguradoras.

## 5. Fase 2 del sitio (decisión de alcance)

- [x] Página individual por cada seguro: `/seguros/[slug]` desde el
      2026-08-29 (qué cubre, qué no, quién aplica, preguntas, caso
      ilustrativo, formulario). Contenido en [lib/product-details.ts](lib/product-details.ts).
- [~] Página "Sobre la agencia": existe `/nosotros` (historia, visión,
      pilares, valores, aseguradoras, eventos, Instagram). Falta equipo
      (nombres, roles, retratos) y licencias. Desde 2026-08-30, el home
      también trae un adelanto ("Nuestra historia", entre SubHero y
      Servicios) con los mismos dos párrafos de origen y un enlace a
      `/nosotros`; ver `storyContent` en [lib/content.ts](lib/content.ts).
- [x] Dominio confirmado por el flyer oficial: www.unityinsurancepr.com
      (coincide con el `metadataBase` en [app/layout.tsx](app/layout.tsx)).
- [~] Hosting y despliegue: producción en Vercel
      (`unity-insurance-website.vercel.app`, proyecto
      `unity-insurance-website`, deploy automático desde `main`). Falta
      apuntar `unityinsurancepr.com` a Vercel: hoy responde desde un servidor
      de parking (verificado 2026-09-08).
- [ ] Prueba con 5-10 usuarios reales intentando cotizar (fase "Entregar y
      probar" del framework)
