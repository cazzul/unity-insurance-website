import type { FaqItem } from "./content";

// Contenido técnico por producto. Fuente: material entregado por el dueño el
// 2026-08-29 (pólizas de MAPFRE, Chubb, Redbridge, guías de la OCS y
// comparadores locales), reescrito con las reglas de copy del sitio.
// Sin precios: los rangos se publican solo cuando las aseguradoras los
// aprueben (PENDIENTES.md). Los límites de cubierta se presentan como
// ejemplos "según el plan". Los casos son ilustrativos.

export interface ProductDetail {
  slug: string;
  intro: string;
  covers?: string[];
  excludes?: string[];
  whoCanApply: string[];
  faqs?: FaqItem[];
  caseStudy?: { title: string; paragraphs: string[]; lesson: string };
  // Solo comercial: líneas de la lámina 08 de la presentación de marca.
  commercialLines?: { name: string; benefit: string }[];
  // Aviso cuando el contenido técnico está pendiente.
  pending?: string;
}

export const productDetails: Record<string, ProductDetail> = {
  viajero: {
    slug: "viajero",
    intro:
      "Viajas fuera de Puerto Rico y algo sale mal: una enfermedad, un vuelo cancelado, una maleta que no llega. El seguro de viajero cubre gastos que tu plan médico no paga fuera de la isla.",
    covers: [
      "Gastos médicos por accidente o enfermedad durante el viaje. Los límites varían según el plan, por ejemplo de $15,000 a $50,000.",
      "Emergencia médica: traslado, evacuación, estadía de un acompañante y repatriación.",
      "Cancelación o interrupción del viaje por fallecimiento, accidente o enfermedad, hasta el límite del plan. Es común ver entre $500 y $1,500, y se puede ampliar con prima adicional.",
      "Pérdida o retraso de equipaje, con un límite por póliza (por ejemplo, de $500 a $1,000).",
      "Muerte accidental y desmembramiento en transporte público, con sumas que dependen de la aseguradora.",
    ],
    excludes: [
      "Atención médica dentro de Puerto Rico. Muchas pólizas cubren solo fuera de la isla.",
      "Condiciones preexistentes. Algunos planes las cubren con sublímites pequeños.",
      "Deportes extremos y actividades de riesgo: paracaidismo, deportes aéreos, andinismo.",
      "Actos intencionales o ilegales, guerra, terrorismo, motines y viajes que tu médico desaconsejó.",
      "Dinero, tarjetas, documentos, cámaras, equipo deportivo o de trabajo dentro del equipaje.",
    ],
    whoCanApply: [
      "Residentes de Puerto Rico que viajan temporalmente fuera de la isla.",
      "Se contrata antes de salir. Para cubrir cancelación, algunas pólizas piden comprarla con hasta 75 días de anticipación.",
      "Cubre solo las fechas del viaje que declares en la póliza.",
      "Estudiantes matriculados fuera de Puerto Rico suelen quedar fuera de estos planes.",
    ],
    faqs: [
      {
        question:
          "¿Me cubre si me enfermo en el viaje aunque tenga plan médico en Puerto Rico?",
        answer:
          "Sí. Cubre gastos médicos durante el viaje. No reemplaza tu plan médico y, en muchas pólizas, no paga tratamientos dentro de Puerto Rico.",
      },
      {
        question: "¿Me cubre si cancelo porque cambié de idea o por miedo a un huracán?",
        answer:
          "No. La cancelación cubre causas específicas: muerte, accidente, enfermedad y algunos eventos definidos en la póliza. El miedo general o una orden del gobierno no suelen estar cubiertos, salvo condiciones especiales.",
      },
      {
        question: "¿Me pagan la maleta perdida y todo lo que había adentro?",
        answer:
          "Solo hasta el límite de equipaje de tu plan, y varios artículos quedan excluidos (dinero, equipos, documentos). La compensación real puede ser menor de lo que imaginas.",
      },
    ],
    caseStudy: {
      title: "Una apendicitis tres días antes del crucero",
      paragraphs: [
        "Una pareja de Gurabo compra un crucero y boletos aéreos por $4,000. Contratan un seguro de viajero con cancelación e interrupción hasta $1,500 cada una y $50,000 en gastos médicos.",
        "Tres días antes de salir, uno de los dos sufre una apendicitis. La póliza les reembolsa penalidades y gastos hasta el límite de cancelación. No cubre el valor completo del viaje ni el tratamiento en Puerto Rico. Los gastos médicos aplicarían solo si el evento ocurre durante el viaje.",
      ],
      lesson:
        "Compara el límite de cancelación con el costo real de tu viaje. Se puede ampliar antes de salir.",
    },
  },

  cancer: {
    slug: "cancer",
    intro:
      "Un diagnóstico trae gastos que el plan médico no paga: deducibles, transporte, días sin trabajar. El seguro de cáncer te entrega dinero en efectivo para usarlo como necesites.",
    covers: [
      "Pago único por primer diagnóstico de cáncer. Según el plan, las sumas van desde $5,000 hasta $30,000.",
      "Beneficio diario por hospitalización, con límites por día y por mes según el plan.",
      "Tratamientos: quimioterapia, radioterapia, braquiterapia, isótopos radiactivos y otros tratamientos oncológicos, hasta los límites de la póliza.",
      "Beneficios adicionales en algunos planes: muerte accidental y desmembramiento, incapacidad total y permanente, pruebas de prevención y segundas opiniones quirúrgicas.",
    ],
    excludes: [
      "Cáncer o enfermedades graves diagnosticadas antes de contratar. Además aplica un periodo de espera, por ejemplo de 90 días.",
      "Algunos tipos de cáncer: melanoma no invasivo, cáncer de piel no maligno, carcinoma in situ, sarcoma de Kaposi y cánceres relacionados con el SIDA.",
      "Lesiones por guerra, suicidio, actos ilegales, deportes extremos, conducir bajo los efectos del alcohol o aviación privada.",
      "Gastos ya cubiertos por el Fondo del Seguro del Estado o por tu plan médico, dispositivos ortopédicos, trasplantes y tratamientos cosméticos.",
    ],
    whoCanApply: [
      "Residentes de Puerto Rico mayores de 18 años.",
      "Se evalúa la edad, el estado de salud y que no exista un diagnóstico previo de cáncer o de enfermedad grave.",
      "La prima depende de la edad y de la suma asegurada que elijas.",
    ],
    faqs: [
      {
        question: "Si ya tuve cáncer, ¿puedo comprar esta póliza?",
        answer:
          "Normalmente no. Los diagnósticos previos quedan excluidos o reciben una cubierta muy limitada, y aplican periodos de espera.",
      },
      {
        question: "¿Reemplaza mi plan médico?",
        answer:
          "No. Paga sumas fijas en efectivo por diagnóstico, hospitalización y tratamiento para cubrir lo que el plan médico no paga: deducibles, transporte, ingresos que dejas de recibir.",
      },
      {
        question: "¿Tengo que usar el dinero en hospitales específicos?",
        answer:
          "No. El beneficio se te entrega a ti y lo usas como necesites. Un plan médico, en cambio, paga directamente a los proveedores.",
      },
    ],
    caseStudy: {
      title: "Un diagnóstico a los 38 años",
      paragraphs: [
        "Un hombre de 35 años en Caguas contrata un plan de cáncer con $20,000 por primer diagnóstico, beneficio diario de hospitalización y cubierta de tratamientos.",
        "Tres años después recibe un diagnóstico de cáncer de colon. La póliza le paga los $20,000 en un solo desembolso, más los beneficios de hospitalización y tratamiento. Con ese dinero cubre deducibles del plan médico, transporte a las citas, parte del salario que deja de recibir y deudas de la familia.",
      ],
      lesson: "La cubierta se compra antes del diagnóstico. Después ya no es posible.",
    },
  },

  auto: {
    slug: "auto",
    intro:
      "El compulsorio es lo mínimo que exige la ley y solo protege a los demás. Full cover protege tu auto. Aquí te explicamos la diferencia antes de que renueves el marbete.",
    covers: [
      "Compulsorio: daños al vehículo de otra persona cuando tú eres responsable, hasta el límite legal (alrededor de $4,000 a $4,500 por accidente según la aseguradora). Incluye remolque del vehículo asegurado.",
      "Full cover: responsabilidad pública ampliada, colisión y cubierta comprensiva en una sola póliza.",
      "Con full cover: daños a tu propio auto cuando eres responsable, daños a terceros y lesiones corporales.",
      "Con full cover: robo, vandalismo, incendio y, si contratas el endoso, huracán e inundación.",
    ],
    excludes: [
      "Compulsorio: daños a tu propio auto y tus lesiones. Tampoco cubre daños intencionales ni carreras.",
      "Full cover: desgaste normal y fallas mecánicas.",
      "Uso comercial no declarado, carreras, actos intencionales y robo simulado.",
      "Fenómenos naturales si no contrataste el endoso correcto. Full cover no significa todo.",
    ],
    whoCanApply: [
      "Todo vehículo registrado en Puerto Rico necesita el seguro obligatorio de responsabilidad para renovar el marbete.",
      "Cualquier conductor con licencia vigente puede contratar full cover. La aseguradora evalúa edad, historial de manejo y tipo de vehículo.",
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
          "Porque combina varias cubiertas principales en una. Aun así excluye cosas como robo simulado, negligencia extrema y eventos que no contrataste. Revisamos la póliza contigo antes de firmar.",
      },
    ],
    caseStudy: {
      title: "Un sedán de $25,000 y una inundación",
      paragraphs: [
        "Una conductora compra un sedán en $25,000 y escoge solo el seguro obligatorio.",
        "Un huracán provoca una inundación que destruye el vehículo. El compulsorio no cubre daños al propio auto ni fenómenos naturales. Pierde casi todo el valor del carro.",
        "Con una póliza full cover con endoso de fenómenos naturales, la aseguradora habría cubierto gran parte de la pérdida, menos el deducible.",
      ],
      lesson:
        "Si no puedes reponer tu auto de tu bolsillo, el compulsorio no es suficiente.",
    },
  },

  hogar: {
    slug: "hogar",
    intro:
      "Tu casa es probablemente lo más valioso que tienes. La póliza de hogar la protege contra fuego, viento y huracán. La inundación se compra aparte. Te explicamos lo que suele cubrir y lo que no.",
    covers: [
      "La estructura principal (paredes, techo, pisos) contra fuego, rayo, explosión, tormenta de viento y huracán, vandalismo y humo.",
      "Otras estructuras: garaje, marquesina, verja, según la póliza.",
      "Contenido: muebles, electrodomésticos y pertenencias.",
      "Gastos de vivienda alternativa si la casa queda inhabitable.",
      "Responsabilidad civil y gastos médicos a terceros por accidentes en tu propiedad.",
    ],
    excludes: [
      "Inundación, marejada, oleaje y marea. Se cubren con una póliza de inundación aparte (NFIP) o un endoso específico.",
      "Agua subterránea, retroceso de alcantarillado y desbordes de drenaje.",
      "Terremoto, hundimiento o desplazamiento de tierra, salvo que contrates el endoso.",
      "Actos intencionales, negligencia grave, guerra y confiscación por el gobierno.",
    ],
    whoCanApply: [
      "Propietarios de casas y apartamentos en Puerto Rico.",
      "Si tienes hipoteca, el banco exige una cubierta mínima de fuego y viento huracanado.",
      "Si tu casa está paga, no es obligatorio, pero quedas expuesto a la pérdida total.",
      "La suma asegurada debe basarse en el costo de reconstruir hoy (valor de reemplazo), no en lo que pagaste.",
    ],
    faqs: [
      {
        question: "¿Mi seguro de casa cubre inundación por marejada o por un río?",
        answer:
          "En la mayoría de los casos no. La inundación está excluida y se compra aparte, o viene con un sublímite muy pequeño en algunos paquetes.",
      },
      {
        question: "¿Por cuánto aseguro mi casa: por lo que la compré o por lo que vale ahora?",
        answer:
          "Por el costo de reconstruirla hoy, y al menos al 80 % de ese valor. Ni el precio de compra ni el valor del terreno sirven de referencia.",
      },
      {
        question: "¿Qué es el deducible de huracán y por qué es tan alto?",
        answer:
          "Es un porcentaje del valor asegurado, normalmente entre 2 % y 5 %, a veces 10 %. Si aseguras la casa en $200,000 con deducible de 5 %, pagas los primeros $10,000 de daños antes de que la póliza responda.",
      },
    ],
    caseStudy: {
      title: "Una familia subasegurada",
      paragraphs: [
        "Una familia compra su casa en $150,000 en 2016 y la asegura por ese monto, con deducible de huracán de 5 % ($7,500).",
        "Diez años después, reconstruirla cuesta $200,000 por el aumento de materiales y mano de obra. La póliza sigue en $150,000: la casa está asegurada al 75 % de su valor real.",
        "Un huracán causa $80,000 en daños. La aseguradora aplica el deducible y puede aplicar la regla de coaseguro por estar por debajo del 80 %. La familia recibe bastante menos de lo que necesita para reparar.",
      ],
      lesson: "Revisa la suma asegurada cada año, antes de junio.",
    },
  },

  comercial: {
    slug: "comercial",
    intro:
      "Invertiste años en construir tu negocio. Un incendio, una demanda o un robo pueden ponerlo en riesgo. Estas son las líneas comerciales con las que trabajamos.",
    commercialLines: [
      {
        name: "Propiedad y contingencia",
        benefit:
          "Protege tu local, tu equipo y tu inventario, y cubre los ingresos que dejas de recibir mientras reabres.",
      },
      {
        name: "Responsabilidad pública",
        benefit:
          "Te respalda si alguien sufre daños en tu negocio o por tu operación y te responsabilizan.",
      },
      {
        name: "Seguros para comercios",
        benefit:
          "Propiedad y responsabilidad en una sola póliza para tiendas, oficinas y negocios de servicio.",
      },
      {
        name: "Riesgos comerciales",
        benefit:
          "Cubiertas para lo específico de tu operación: maquinaria, equipo, mercancía en tránsito.",
      },
      {
        name: "Fianzas (bonds)",
        benefit:
          "Garantizan a un tercero que cumplirás un contrato o una obligación. Muchos contratos y licencias las exigen.",
      },
    ],
    whoCanApply: [
      "Negocios de todos los tamaños en Puerto Rico: local, inventario, equipo y empleados.",
      "Cada negocio se evalúa aparte. Te orientamos según tu industria, tu local y tus contratos.",
    ],
    faqs: [
      {
        question: "¿Qué seguros me pide un arrendador o un banco?",
        answer:
          "Normalmente propiedad y responsabilidad pública. Lo revisamos contigo con el contrato en la mano para que compres lo que te exigen y nada de más.",
      },
    ],
    pending:
      "Estamos preparando la guía completa de este seguro. Mientras tanto, agenda una consulta y te orientamos según tu negocio.",
  },

  escolar: {
    slug: "escolar",
    intro:
      "Los accidentes pueden ocurrir en cualquier momento. El seguro escolar protege a tus hijos dentro y fuera de la escuela, en actividades y eventos.",
    whoCanApply: [
      "Estudiantes de escuelas y colegios en Puerto Rico. La cubierta depende de la institución y del plan.",
    ],
    pending:
      "Estamos preparando la guía completa de este seguro. Mientras tanto, agenda una consulta y te orientamos según tu escuela.",
  },
};
