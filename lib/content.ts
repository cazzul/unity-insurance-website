import {
  BadgeCheck,
  Briefcase,
  Car,
  Flag,
  GraduationCap,
  Handshake,
  Headset,
  Heart,
  HeartHandshake,
  Home,
  MessageSquareText,
  Plane,
  Ribbon,
  Scale,
  ShieldCheck,
  UserRound,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { BRAND } from "./constants";

export interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

export interface Product {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: LucideIcon;
  headline?: string;
}

export interface IconItem {
  title: string;
  description: string;
  icon: LucideIcon;
}

export interface GalleryImage {
  src: string;
  alt: string;
  // Recorte para fotos verticales dentro de celdas 4:3.
  position?: "top" | "center";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const announcement = {
  label: "NUEVO",
  text: "TEMPORADA DE HURACANES: REVISA TU PÓLIZA ANTES DE LA PRÓXIMA TORMENTA",
};

// Seis líneas de seguro (decisión del dueño: mantener estas seis).
export const products: Product[] = [
  {
    id: "hogar",
    title: "Hogar",
    description:
      "Tener un seguro de hogar no es suficiente si no conoces lo que cubre. Revisamos tu póliza contigo antes de la próxima tormenta.",
    badge: "El más pedido",
    icon: Home,
    headline: "Protege tu casa antes de la próxima tormenta",
  },
  {
    id: "comercial",
    title: "Comercial",
    description:
      "Invertiste años en construir tu negocio. Un solo incidente puede ponerlo en riesgo. Protege tu local, tu inventario y tu equipo.",
    badge: "Para tu negocio",
    icon: Briefcase,
    headline: "Protege lo que construiste",
  },
  {
    id: "auto",
    title: "Auto",
    description:
      "El compulsorio no lo cubre todo. Cuenta con protección, asistencia en carretera y respaldo cuando ocurre lo inesperado.",
    badge: "Requerido por ley",
    icon: Car,
    headline: "Protege tu carro, a ti y a los demás",
  },
  {
    id: "cancer",
    title: "Cáncer",
    description:
      "Un diagnóstico trae gastos que tu plan médico no paga. Esta cubierta te da apoyo directo cuando más lo necesitas.",
    badge: "Protección extra",
    icon: Ribbon,
    headline: "Dinero en tu mano cuando llega un diagnóstico",
  },
  {
    id: "viajero",
    title: "Viajero",
    description:
      "Los imprevistos ocurren cuando menos lo esperas. Viaja con asistencia médica de emergencia y protección de equipaje.",
    badge: "Antes de viajar",
    icon: Plane,
    headline: "Viaja con respaldo médico fuera de Puerto Rico",
  },
  {
    id: "escolar",
    title: "Escolar",
    description:
      "Los accidentes pueden ocurrir en cualquier momento. Protege a tus hijos dentro y fuera de la escuela, en actividades y eventos.",
    badge: "Para escuelas",
    icon: GraduationCap,
    headline: "Protege a tus hijos dentro y fuera de la escuela",
  },
];

// Los enlaces con "/#" funcionan desde cualquier página del sitio.
export const navItems: NavItem[] = [
  {
    label: "Servicios",
    children: products.map((p) => ({
      label: p.title,
      href: `/seguros/${p.id}`,
    })),
  },
  { label: "Por qué Unity", href: "/#por-que-unity" },
  { label: "Recursos", href: "/#recursos" },
  { label: "FAQ", href: "/#faq" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Contacto", href: "/#contacto" },
];

export const heroContent = {
  headline: BRAND.name,
  tagline: BRAND.tagline,
  subtitle:
    "Seguros para tu familia y tu negocio en Puerto Rico. Comparamos {n} aseguradoras y te explicamos tu póliza antes de firmar.",
  cta: "Agenda tu consulta y orientación",
  ctaSecondary: "Llámanos",
  // Fondo de pantalla completa: escena 3D nativa (WebGL, Three.js) del
  // logo de Unity en un ambiente tipo showroom, extruida desde el vector
  // del lockup (ver scripts/build-logo-assets.mjs). `poster`/`posterMobile`
  // son fotogramas estáticos: se ven antes de que cargue la escena y si el
  // usuario prefiere menos movimiento (nunca se monta la escena en ese
  // caso). `scene.texture` es la textura del degradado real del escudo.
  poster: "/images/hero/hero-poster.webp",
  posterMobile: "/images/hero/hero-poster-mobile.webp",
  scene: {
    texture: "/images/brand/unity-shield-albedo-1024.webp",
  },
};

// Sub-hero: quiénes somos + cifras. Fuente: láminas 01 y 02 de la presentación
// de marca. El número de aseguradoras se calcula de `insurers`.
export const subHeroContent = {
  intro:
    "Tu tranquilidad empieza por entender lo que compras. Te explicamos cada cubierta en palabras simples, te decimos qué te falta y te acompañamos cuando pasa algo.",
};

export const trustStats: {
  value: string;
  label: string;
  // Si es true, el componente muestra `insurers.length` en lugar de `value`.
  dynamic?: boolean;
}[] = [
  { value: `${BRAND.yearsExperience}+`, label: "años de experiencia combinada" },
  { value: "", label: "aseguradoras locales e internacionales", dynamic: true },
  { value: "1 a 1", label: "servicio personalizado en cada etapa" },
];

// Por qué Unity: tres puntos de diferenciación. Fuentes: _FRAMEWORK_COPY.md
// (diferenciador) y sistema de diseño ("Una llamada. Catorce opciones").
// {n} se reemplaza por el número real de aseguradoras.
export const whyUnityPoints: IconItem[] = [
  {
    title: "Te explicamos antes de firmar",
    description: "Sabes qué cubre, qué no y cuánto pagarías de deducible antes de decidir.",
    icon: MessageSquareText,
  },
  {
    title: "Comparamos {n} aseguradoras",
    description: "Das tus datos una vez y buscamos precio y cubierta en {n} compañías. Tú escoges.",
    icon: Scale,
  },
  {
    title: "Una persona conoce tu caso",
    description:
      "Te atiende la persona que manejará tu póliza, desde la cotización hasta el pago de una reclamación.",
    icon: UserRound,
  },
];

// Sección "Nosotros" (página /nosotros). Textos adaptados de las láminas 02,
// 03, 05 y 06 de la presentación oficial de marca. No inventar datos.
export const aboutContent = {
  kicker: "Nosotros",
  title: "Unidos para protegerte",
  story: [
    "Unity nace de una convicción: el mejor servicio se logra con unión, colaboración y trabajo en equipo.",
    "Nuestro nombre representa la conexión entre clientes, agentes, aseguradoras y aliados. Todos con un mismo propósito: proteger lo que más importa.",
  ],
  pillars: [
    {
      title: "Atención humana",
      description: "Una persona conoce tu caso y te responde.",
      icon: UserRound,
    },
    {
      title: "Confianza y transparencia",
      description: "Te decimos qué cubre tu póliza y qué no.",
      icon: BadgeCheck,
    },
    {
      title: "Compromiso con tu tranquilidad",
      description: "Te acompañamos antes, durante y después.",
      icon: HeartHandshake,
    },
  ] satisfies IconItem[],
  vision:
    "Visualizamos un futuro donde más familias y negocios estén protegidos.",
  values: [
    {
      title: "Integridad",
      description: "Actuamos con honestidad, transparencia y ética en todo lo que hacemos.",
      icon: ShieldCheck,
    },
    {
      title: "Compromiso",
      description: "Nos dedicamos a brindar el mejor servicio y cumplir lo que prometemos.",
      icon: Handshake,
    },
    {
      title: "Servicio",
      description: "Te ponemos en el centro, con atención personalizada y soluciones efectivas.",
      icon: Headset,
    },
    {
      title: "Trabajo en equipo",
      description: "Creemos en el poder de la unión. Colaboramos y nos apoyamos.",
      icon: Users,
    },
    {
      title: "Liderazgo",
      description: "Tomamos la iniciativa para generar un impacto positivo.",
      icon: Flag,
    },
    {
      title: "Empatía",
      description: "Escuchamos y entendemos lo que necesitas.",
      icon: Heart,
    },
  ] satisfies IconItem[],
};

// Adelanto de "nuestra historia" en el home (marca primero: quiénes somos
// antes de qué vendemos). La versión completa, con pilares y valores, vive
// en /nosotros (aboutContent, arriba); aquí solo los párrafos de origen.
export const storyContent = {
  kicker: "Nuestra historia",
  title: "Por qué existe Unity",
  paragraphs: aboutContent.story,
  photo: {
    src: "/images/eventos/equipo-unity.jpg",
    alt: "Cinco integrantes del equipo de Unity en un evento de la agencia",
  },
  cta: "Conoce más sobre nosotros",
  ctaHref: "/nosotros",
};

// Galería de eventos: fotos reales de un evento de Unity (FOTOS/, agosto 2026).
// PENDIENTE: nombre y fecha del evento, y permiso de las personas (PENDIENTES.md).
export const eventImages: GalleryImage[] = [
  {
    src: "/images/eventos/grupo-completo.jpg",
    alt: "Foto de grupo del evento de Unity con equipo, aliados y clientes",
  },
  {
    src: "/images/eventos/presentacion.jpg",
    alt: "Presentación durante un evento de Unity con el equipo y aliados",
  },
  {
    src: "/images/eventos/equipo-unity.jpg",
    alt: "Cinco integrantes del equipo de Unity en un evento de la agencia",
    position: "top",
  },
  {
    src: "/images/eventos/audiencia.jpg",
    alt: "Asistentes escuchando una presentación en un evento de Unity",
  },
  {
    src: "/images/eventos/equipo-aliados.jpg",
    alt: "Equipo de Unity con aliados bajo un arco de ladrillo",
    position: "top",
  },
];

// Patrocinadores de eventos. Se llena con nombres reales cuando el dueño los
// confirme (no inventar).
export const sponsors: string[] = [];

// Capturas de publicaciones de Instagram (414 px). Solo se usan en el grid
// de Instagram, donde el formato cuadrado pequeño es natural.
export const instagramImages: GalleryImage[] = [
  {
    src: "/images/equipo/convencion-equipo.jpg",
    alt: "Equipo de Unity en el booth de una convención de seguros",
  },
  {
    src: "/images/equipo/taller-educativo.jpg",
    alt: "Taller educativo de Unity sobre pólizas",
  },
  {
    src: "/images/equipo/convencion-grupo.jpg",
    alt: "Grupo del equipo de Unity en una convención",
  },
  {
    src: "/images/equipo/evento-grupo.jpg",
    alt: "Equipo de Unity en un almuerzo de la industria",
  },
  {
    src: "/images/equipo/presentacion-evento.jpg",
    alt: "Asesora de Unity orientando a clientes en un evento",
  },
  {
    src: "/images/equipo/equipo-oficina.jpg",
    alt: "Equipo de Unity reunido en la oficina",
  },
];

// Aseguradoras con las que trabaja Unity (lista provista por el dueño).
export interface Insurer {
  name: string;
  url: string;
  // Logos procesados en public/images/insurers (alto fijo de 120px).
  // Sin logo, la cinta muestra el nombre en texto.
  logo?: { src: string; width: number; height: number };
}

export const insurers: Insurer[] = [
  {
    name: "Universal Insurance",
    url: "https://universalpr.com",
    logo: { src: "/images/insurers/universal.png", width: 391, height: 120 },
  },
  {
    name: "MAPFRE",
    url: "https://mapfre.com.pr",
    logo: { src: "/images/insurers/mapfre.png", width: 786, height: 120 },
  },
  {
    name: "Multinational Insurance",
    url: "https://multinationalpr.com",
    logo: { src: "/images/insurers/multinational.png", width: 569, height: 120 },
  },
  {
    name: "Triple-S",
    url: "https://salud.grupotriples.com",
    logo: { src: "/images/insurers/triple-s.png", width: 734, height: 120 },
  },
  {
    name: "Cooperativa de Seguros Múltiples",
    url: "https://segurosmultiples.com",
    logo: { src: "/images/insurers/seguros-multiples.png", width: 1196, height: 120 },
  },
  {
    name: "Chubb",
    url: "https://chubb.com",
    logo: { src: "/images/insurers/chubb.png", width: 1130, height: 120 },
  },
  {
    name: "AIG",
    url: "https://aig.com",
    logo: { src: "/images/insurers/aig.png", width: 218, height: 120 },
  },
  {
    name: "Liberty Mutual",
    url: "https://libertymutualpr.com",
    logo: { src: "/images/insurers/liberty-mutual.png", width: 255, height: 120 },
  },
  {
    name: "Redbridge",
    url: "https://redbridgepuertorico.com",
    logo: { src: "/images/insurers/redbridge.png", width: 650, height: 120 },
  },
  {
    name: "One Alliance Insurance",
    url: "https://oneallianceinsurance.com",
    logo: { src: "/images/insurers/one-alliance.png", width: 340, height: 120 },
  },
  {
    name: "Antilles Insurance",
    url: "https://antillesinsurance.com",
    logo: { src: "/images/insurers/antilles.png", width: 639, height: 120 },
  },
  {
    name: "USIC",
    url: "https://usicgroup.com",
    logo: { src: "/images/insurers/usic.png", width: 196, height: 120 },
  },
  {
    name: "PR Medical Defense",
    url: "https://prmdic.com",
    logo: { src: "/images/insurers/prmd.png", width: 503, height: 120 },
  },
  {
    name: "Guardian",
    url: "https://guardianlife.com",
    logo: { src: "/images/insurers/guardian.png", width: 649, height: 120 },
  },
  {
    name: "United Insurance",
    url: "https://unitedinsuranceco.net",
    logo: { src: "/images/insurers/united.png", width: 64, height: 120 },
  },
];

// Bloques educativos. Hoy no se montan en el home (decisión del dueño,
// 2026-08-29); el componente SplitFeatures se conserva por si vuelven.
export const splitFeatures = [
  {
    title: "Tener un seguro no es suficiente si no conoces lo que cubre",
    description:
      "Con el aumento en los costos de reconstrucción y la temporada de huracanes, este es el momento de revisar tu póliza. La revisamos contigo y te orientamos: qué cubre, qué no, y cuánto pagarías de deducible.",
    ctaPrimary: "Agenda tu consulta",
    ctaSecondary: "Llámanos hoy",
    image: "/images/lifestyle/pareja-poliza.jpg",
    imageAlt: "Pareja revisando su póliza de seguros en la mesa de su casa",
    imagePosition: "left" as const,
  },
  {
    title: "¿Huracán, inundación o terremoto? No es lo mismo",
    description:
      "Tu seguro de casa puede cubrir huracán y no cubrir inundación. La cubierta de inundación se compra aparte. Revisa qué necesitas antes de la próxima tormenta.",
    ctaPrimary: "Agenda tu consulta",
    ctaSecondary: "Llámanos hoy",
    image: "/images/lifestyle/casa-interior-pr.webp",
    imageAlt: "Casa de un nivel con balcón en un pueblo del centro de Puerto Rico",
    imagePosition: "right" as const,
  },
];

// Blog: sin contenido real todavía. BlogPreview no se monta (PENDIENTES.md).
export const blogPosts = [
  {
    title: "¿Tu seguro de casa cubre inundación? No siempre",
    excerpt: "La cubierta de inundación se compra aparte. Aprende cómo funciona.",
    date: "Próximamente",
  },
  {
    title: "5 señales de que tu póliza necesita una revisión",
    excerpt: "Cambios en tu vida pueden dejar huecos en tu protección.",
    date: "Próximamente",
  },
  {
    title: "Qué seguros pide tu banco o tu arrendador",
    excerpt: "Lo que debes comprar antes de firmar una hipoteca o un contrato.",
    date: "Próximamente",
  },
];

// FAQ general del home. PENDIENTE: preguntas reales del equipo (PENDIENTES.md).
// Las preguntas por producto viven en lib/product-details.ts.
export const faqItems: FaqItem[] = [
  {
    question: "¿Cuánto cuesta un seguro?",
    answer:
      "Depende de lo que quieras proteger, del valor y de la aseguradora. Comparamos opciones y te mostramos el precio real antes de decidir.",
  },
  {
    question: "¿Cuánto cuesta la consulta y orientación?",
    answer:
      "Nada. Es gratis. Con gusto revisamos tu póliza contigo y te decimos qué tienes y qué te falta.",
  },
  {
    question: "¿Tengo que comprar algo después de la consulta?",
    answer:
      "No. Revisamos lo que tienes, te decimos qué te falta y tú decides. Si tu póliza actual está bien, también te lo decimos.",
  },
  {
    question: "¿Y si ya tengo seguro?",
    answer:
      "Mejor. Con la póliza a mano revisamos contigo qué cubre, qué no y si pagas de más por algo que no necesitas.",
  },
  {
    question: "¿Mi seguro de casa cubre inundación?",
    answer:
      "Muchas veces no. La cubierta de inundación se compra aparte. Te ayudamos a revisar tu póliza para que lo sepas antes de una tormenta.",
  },
  {
    question: "¿El seguro compulsorio es suficiente para mi auto?",
    answer:
      "El compulsorio cubre daños al auto de otra persona. No cubre tu auto. Si quieres proteger tu carro y a ti, necesitas más cubierta.",
  },
  {
    question: "¿Me ayudan con reclamaciones?",
    answer:
      "Sí. Te acompañamos desde el reporte hasta el pago. No tienes que pelear solo con la aseguradora.",
  },
  {
    question: "¿Qué aseguradoras representan?",
    answer: `Trabajamos con ${insurers.length} aseguradoras locales e internacionales, entre ellas Universal, MAPFRE, Multinational, Triple-S, Cooperativa de Seguros Múltiples, Chubb, AIG y Liberty Mutual. Comparamos opciones y te mostramos qué cubre cada una.`,
  },
  {
    question: "¿Cómo los contacto?",
    answer:
      "Llámanos al 787-922-5558, escríbenos a service@unityinsurancepr.com o por WhatsApp e Instagram.",
  },
];

export const footerLinks = {
  servicios: products.map((p) => ({
    label: p.title,
    href: `/seguros/${p.id}`,
  })),
  recursos: [
    { label: "Recursos gratis", href: "/#recursos" },
    { label: "Preguntas frecuentes", href: "/#faq" },
    { label: "Nosotros", href: "/nosotros" },
    { label: "Contacto", href: "/#contacto" },
  ],
  legal: [
    { label: "Política de privacidad (próximamente)", href: "" },
    { label: "Acerca de Unity", href: "/nosotros" },
  ],
};

export const productFormOptions = products.map((p) => ({
  value: p.id,
  label: p.title,
}));
