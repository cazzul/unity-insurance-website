import { BookOpen, CarFront, ClipboardCheck, HousePlus } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { FaqItem } from "./content";

// Recursos gratis de Unity. Contenido escrito a partir del material técnico
// de auto y hogar (2026-08-29), verídico pero de prueba: no es todavía el
// texto final aprobado por el dueño (ver PENDIENTES.md). Se leen completos
// en /recursos/[slug], sin puerta previa. Sin precios.
//
// Captura de datos: los quizzes muestran el resultado difuminado con un
// pop-up para desbloquearlo (ResultsGate); las guías piden el correo por
// tiempo en página o scroll, después de que ya se pudo leer todo
// (ScrollLeadCapture).

export interface QuizQuestion {
  question: string;
  why: string;
}

export type ResultLevel = "good" | "mid" | "bad";

export interface QuizResult {
  // Número máximo de respuestas "no" para mostrar este resultado.
  maxNo: number;
  level: ResultLevel;
  title: string;
  text: string;
}

export interface ComparisonRow {
  label: string;
  compulsorio: string;
  fullCover: string;
}

export interface MistakeItem {
  title: string;
  why: string;
  fix: string;
}

export interface Resource {
  slug: string;
  kind: "quiz" | "guide";
  title: string;
  description: string;
  icon: LucideIcon;
  intro: string;
  // Contenido de prueba: verídico, pero no el texto final aprobado.
  pending?: boolean;
  quiz?: QuizQuestion[];
  quizResults?: QuizResult[];
  comparison?: ComparisonRow[];
  mistakes?: MistakeItem[];
  faqs?: FaqItem[];
  closing: string;
}

export const resources: Resource[] = [
  {
    slug: "quiz-huracan",
    kind: "quiz",
    title: "Quiz: ¿Tu casa está lista para un huracán?",
    description: "Contesta 5 preguntas y descubre si te falta protección.",
    icon: HousePlus,
    intro:
      "Cinco preguntas de sí o no. Contesta con la póliza a mano si puedes. Al final te decimos dónde están los huecos.",
    pending: true,
    quiz: [
      {
        question: "¿Tienes una póliza de inundación aparte de tu seguro de casa?",
        why: "El seguro de casa casi nunca cubre inundación, marejada ni oleaje. Se compra aparte.",
      },
      {
        question:
          "¿Sabes cuánto costaría reconstruir tu casa hoy y tu póliza cubre al menos el 80 % de ese valor?",
        why: "Si estás por debajo del 80 %, la aseguradora puede aplicar coaseguro y pagarte menos.",
      },
      {
        question: "¿Sabes cuánto es tu deducible de huracán en dólares?",
        why: "Suele ser un porcentaje del valor asegurado, de 2 % a 10 %. En una casa de $200,000 con 5 %, son $10,000 de tu bolsillo.",
      },
      {
        question: "¿Tu póliza incluye el endoso de terremoto?",
        why: "Muchas pólizas lo excluyen si no se contrata aparte.",
      },
      {
        question: "¿Revisaste los límites de tu póliza en los últimos 12 meses?",
        why: "Materiales y mano de obra suben cada año. Una póliza sin actualizar se queda corta.",
      },
    ],
    quizResults: [
      {
        maxNo: 0,
        level: "good",
        title: "Tu casa está bien preparada",
        text: "Confírmalo con una revisión antes de junio. Con gusto la hacemos contigo.",
      },
      {
        maxNo: 2,
        level: "mid",
        title: "Tienes huecos que se pueden cerrar rápido",
        text: "Cada 'no' es una exposición concreta. Te orientamos sin costo para cerrarlas.",
      },
      {
        maxNo: 5,
        level: "bad",
        title: "Tu casa está expuesta",
        text: "Agenda una consulta antes de la próxima tormenta. Revisamos tu póliza contigo, sin compromiso.",
      },
    ],
    closing: "¿Quieres que revisemos tu póliza contigo?",
  },
  {
    slug: "checklist-seguro-de-casa",
    kind: "quiz",
    title: "Quiz: ¿Tu seguro de casa está listo para renovarse?",
    description: "10 preguntas que debes hacer antes de firmar.",
    icon: ClipboardCheck,
    intro:
      "Diez preguntas de sí o no para hacerle a tu agente (o a nosotros) antes de renovar. Al final te decimos qué tan lista está tu renovación.",
    pending: true,
    quiz: [
      {
        question: "¿La suma asegurada cubre el costo de reconstruir hoy, no lo que pagaste?",
        why: "El valor de reemplazo cambia cada año. El precio de compra y el terreno no cuentan.",
      },
      {
        question: "¿Está al menos al 80 % del valor de reemplazo?",
        why: "Por debajo de ese porcentaje puede aplicar coaseguro y la aseguradora paga menos.",
      },
      {
        question: "¿Sabes cuánto es tu deducible de huracán en dólares?",
        why: "Es un porcentaje del valor asegurado. Conviértelo a dólares para saber cuánto pagas tú primero.",
      },
      {
        question: "¿Tienes póliza de inundación aparte?",
        why: "La inundación, la marejada y el oleaje están excluidos de casi todas las pólizas de hogar.",
      },
      {
        question: "¿Incluye el endoso de terremoto?",
        why: "Sin el endoso, un terremoto no está cubierto.",
      },
      {
        question: "¿El contenido está cubierto y sabes por cuánto?",
        why: "Muebles, equipos y pertenencias tienen su propio límite.",
      },
      {
        question: "¿Cubre otras estructuras: garaje, marquesina, verja?",
        why: "No todas las pólizas las incluyen por defecto.",
      },
      {
        question: "¿Incluye gastos de vivienda alternativa?",
        why: "Si la casa queda inhabitable, esta cubierta paga dónde vivir mientras se repara.",
      },
      {
        question: "¿Tienes responsabilidad civil por accidentes de terceros?",
        why: "Una visita que se cae en tu propiedad puede convertirse en una reclamación contra ti.",
      },
      {
        question: "¿Cumple lo que exige tu banco o tu arrendador?",
        why: "Con hipoteca, el banco pide una cubierta mínima de fuego y viento huracanado.",
      },
    ],
    quizResults: [
      {
        maxNo: 2,
        level: "good",
        title: "Tu renovación está casi lista",
        text: "Solo faltan un par de detalles. Los repasamos contigo en una llamada corta.",
      },
      {
        maxNo: 5,
        level: "mid",
        title: "Hay preguntas sin contestar",
        text: "Antes de firmar la renovación, conviene revisar esto con calma. Te orientamos sin costo.",
      },
      {
        maxNo: 10,
        level: "bad",
        title: "No renueves todavía",
        text: "Hay huecos importantes. Agenda una consulta antes de firmar: revisamos tu póliza contigo.",
      },
    ],
    closing: "¿Tienes dudas en alguna de las diez? Te las contestamos en una consulta.",
  },
  {
    slug: "guia-compulsorio-vs-full-cover",
    kind: "guide",
    title: "Guía: compulsorio vs. full cover",
    description: "Qué protege cada uno, en palabras simples.",
    icon: BookOpen,
    intro:
      "El compulsorio es lo mínimo que exige la ley. Full cover es un paquete de cubiertas. Esta tabla te dice qué protege cada uno.",
    pending: true,
    comparison: [
      {
        label: "Qué es",
        compulsorio: "Seguro de responsabilidad que exige la ley para renovar el marbete.",
        fullCover: "Paquete con responsabilidad, colisión y cubierta comprensiva.",
      },
      {
        label: "A quién protege",
        compulsorio: "Al otro conductor: paga los daños que causes a su vehículo.",
        fullCover: "A ti, a tu auto y a terceros.",
      },
      {
        label: "Límite típico",
        compulsorio: "Alrededor de $4,000 a $4,500 por accidente, según la aseguradora.",
        fullCover: "Según el valor del auto y la cubierta que contrates.",
      },
      {
        label: "Daños a tu auto",
        compulsorio: "No.",
        fullCover: "Sí, menos el deducible.",
      },
      {
        label: "Robo, vandalismo, incendio",
        compulsorio: "No.",
        fullCover: "Sí.",
      },
      {
        label: "Huracán e inundación",
        compulsorio: "No.",
        fullCover: "Sí, con el endoso de fenómenos naturales.",
      },
      {
        label: "Lesiones corporales",
        compulsorio: "No.",
        fullCover: "Sí, según la póliza.",
      },
      {
        label: "Cuándo basta",
        compulsorio: "Auto de poco valor que puedes reponer de tu bolsillo.",
        fullCover: "Auto financiado, nuevo o que no puedes reemplazar sin ayuda.",
      },
    ],
    faqs: [
      {
        question: "¿Es obligatorio tener full cover?",
        answer:
          "No. Lo único obligatorio es el seguro de responsabilidad (compulsorio). Full cover protege tu propio auto y tu patrimonio.",
      },
      {
        question: "Si solo tengo compulsorio, ¿me arreglan mi carro si me chocan?",
        answer:
          "Depende de quién sea responsable. Si eres tú, el compulsorio no cubre tu auto. Si el otro conductor es responsable, su seguro cubre tu vehículo hasta su límite.",
      },
      {
        question: "¿Por qué le dicen full cover si tiene exclusiones?",
        answer:
          "Porque combina varias cubiertas principales en una. Aun así excluye robo simulado, negligencia extrema y eventos que no contrataste.",
      },
    ],
    closing: "¿Quieres saber cuál te conviene? Te orientamos sin costo.",
  },
  {
    slug: "5-errores-seguro-auto",
    kind: "guide",
    title: "5 errores que cometen los puertorriqueños con su seguro de auto",
    description: "Los más comunes, y cómo evitarlos antes de que te cuesten.",
    icon: CarFront,
    intro:
      "Cinco errores que vemos una y otra vez al revisar pólizas de auto en Puerto Rico. Revisa cuáles cometes tú.",
    pending: true,
    mistakes: [
      {
        title: "Creer que el compulsorio cubre tu propio auto",
        why: "El compulsorio paga los daños que le causas a otro. No paga tu carro, aunque el accidente sea tuyo.",
        fix: "Si no puedes reponer tu auto de tu bolsillo, revisa una cubierta de colisión aparte.",
      },
      {
        title: "Pensar que full cover lo cubre todo",
        why: "Full cover combina varias cubiertas, pero sigue teniendo exclusiones: robo simulado, negligencia extrema, uso que no declaraste.",
        fix: "Lee qué excluye tu póliza, no solo qué incluye.",
      },
      {
        title: "No contratar el endoso de fenómenos naturales",
        why: "Un huracán o una inundación pueden no estar cubiertos en full cover si no pediste ese endoso.",
        fix: "Pregunta específicamente por fenómenos naturales antes de firmar.",
      },
      {
        title: "Usar el auto para trabajo sin declararlo",
        why: "Entregas, transporte de pasajeros o uso comercial no declarado pueden anular una reclamación.",
        fix: "Dile a tu agente para qué usas el auto en realidad.",
      },
      {
        title: "Renovar sin comparar",
        why: "El precio y la cubierta cambian de un año a otro entre aseguradoras.",
        fix: "Compara antes de renovar. Toma unos minutos y puede ahorrarte cientos de dólares.",
      },
    ],
    closing: "¿Quieres que revisemos tu póliza de auto contigo?",
  },
];

export function getResource(slug: string) {
  return resources.find((r) => r.slug === slug);
}
