import type { FaqItem } from "./content";

// Contenido técnico por producto. Fuente primaria: unity-seguros-db (2026-09),
// base de conocimiento de aseguradoras MAPFRE, Universal, Seguros Múltiples.
// Sin primas exactas: los rangos se publican solo cuando las aseguradoras los
// aprueben. Los límites de cubierta son ejemplos "según el plan". Los casos son
// ilustrativos. Cumple con las reglas de compliance de 00-LEEME-INDICE.md.

export interface ProductDetail {
  slug: string;
  intro: string;
  covers?: string[];
  excludes?: string[];
  whoCanApply: string[];
  faqs?: FaqItem[];
  caseStudy?: { title: string; paragraphs: string[]; lesson: string };
  // Solo comercial: líneas de negocio principales.
  commercialLines?: { name: string; benefit: string }[];
  // Aviso cuando el contenido técnico está pendiente.
  pending?: string;
}

export const productDetails: Record<string, ProductDetail> = {
  viajero: {
    slug: "viajero",
    intro:
      "Viajas fuera de Puerto Rico y algo sale mal: una emergencia médica, un vuelo cancelado, la maleta que no llega. Tu plan médico local generalmente no responde fuera de la isla. El seguro de viajero cubre lo que nadie más cubre cuando más lo necesitas.",
    covers: [
      "Asistencia médica de emergencia: gastos médicos por accidente o enfermedad durante el viaje, desde $15,000 hasta $50,000 según el plan (Platinum/Gold/Plus de MAPFRE). Tu plan médico de Puerto Rico normalmente no paga fuera de EE.UU.",
      "Evacuación y repatriación sanitaria: traslado médico a un centro adecuado o de regreso a Puerto Rico. En un evento real, un avión medicalizado puede costar $50,000 o más — es la cobertura que justifica elegir el plan alto en vez del básico.",
      "Cancelación de viaje: reembolso de gastos prepagados no reembolsables cuando cancelas por causa cubierta (muerte, accidente, enfermedad del asegurado o familiar cercano). Desde $500 hasta $1,500 según el plan. El límite debe ser igual o mayor a lo que tienes prepagado sin posibilidad de devolución.",
      "Interrupción de viaje: cubre el regreso anticipado y la porción no usada del viaje cuando debes regresar por causa cubierta.",
      "Equipaje: pérdida o robo hasta el límite del plan, con sublímites por artículo. Retraso de equipaje: compra de necesidades básicas mientras llega.",
      "Retraso de viaje: gastos razonables de hotel y alimentación durante retrasos prolongados, según el umbral de horas de cada plan.",
      "Servicios dentales de emergencia: desde $100 hasta $300 según el plan.",
      "Traslado de restos en caso de fallecimiento durante el viaje.",
    ],
    excludes: [
      "Huracanes, inundaciones, terremotos, erupciones volcánicas y otros desastres naturales — el formulario estándar de MAPFRE PR excluye estos eventos. Si cancelas un viaje por un huracán, puede que no estés cubierto. Confirmamos el formulario vigente antes de emitir.",
      "Atención médica dentro de Puerto Rico. Estas pólizas cubren solo fuera de la isla.",
      "Condiciones médicas preexistentes, salvo que compres la póliza dentro de los primeros días de tu primer pago del viaje (waiver de preexistentes). Después de ese plazo, las condiciones crónicas pueden quedar excluidas.",
      "Deportes extremos sin endoso: paracaidismo, escalada en alta montaña, buceo en aguas profundas, motora todoterreno, esquí alpino.",
      "Cancelación por cambio de opinión o miedo general. Para eso existe CFAR (Cancel For Any Reason), un endoso separado no incluido en todos los planes.",
      "Estudiantes matriculados en instituciones educativas extranjeras.",
      "Viajeros mayores de 84 años.",
      "Actos intencionales, guerra, terrorismo y daños por radiación nuclear.",
    ],
    whoCanApply: [
      "Residentes de Puerto Rico que viajan temporalmente fuera de la isla, menores de 84 años.",
      "Para cubrir cancelación, algunas pólizas requieren comprarla hasta 75 días antes del viaje.",
      "Si viajas 3 o más veces al año, el plan anual de prima fija generalmente resulta más económico que comprar una póliza por cada viaje, y además incluye asistencia en carretera local.",
      "Estudiantes matriculados en instituciones educativas extranjeras generalmente no aplican para estos planes.",
    ],
    faqs: [
      {
        question: "¿Mi plan médico de Puerto Rico me cubre si me enfermo en Europa o Latinoamérica?",
        answer:
          "Generalmente no. La mayoría de los planes médicos locales responden solo dentro de Puerto Rico o EE.UU. continental. Por eso la emergencia médica es la cobertura más importante del seguro de viajero: si te hospitalizan en el extranjero, esos gastos corren por tu cuenta a menos que tengas una póliza activa.",
      },
      {
        question: "¿Cuál es la diferencia real entre el plan Plus, Gold y Platinum?",
        answer:
          "Los tres tienen las mismas cubiertas básicas, pero varían en los límites. La diferencia más crítica no está en la consulta médica — está en quién paga el traslado médico si hay que traerte de regreso. Platinum cubre hasta ilimitado en evacuación; Plus tiene un límite más bajo. Para viajes largos o a países con salud cara (Europa, Japón), el plan alto vale la diferencia.",
      },
      {
        question: "¿La cancelación por huracán está cubierta?",
        answer:
          "Depende del formulario. El formulario estándar de MAPFRE PR excluye eventos derivados de huracanes y desastres naturales. Si un huracán es la razón por la que cancelas, puede que no estés cubierto bajo ese formulario. Siempre verificamos el formulario vigente antes de emitir la póliza.",
      },
      {
        question: "¿Vale la pena el plan anual o mejor compro por cada viaje?",
        answer:
          "Si viajas 3 o más veces al año, el plan anual de prima fija generalmente sale más económico que comprar pólizas individuales. Además, el plan anual incluye asistencia en carretera local todo el año — grúa, batería, cambio de goma — que es el beneficio que más se usa en el día a día.",
      },
      {
        question: "Tengo una condición médica crónica. ¿Estoy cubierto si me da un episodio en el viaje?",
        answer:
          "Depende de cuándo compres la póliza. Algunos formularios incluyen un waiver de preexistentes si contratas dentro de cierto número de días de tu primer pago del viaje. Después de ese plazo, la condición puede quedar excluida. Si alguien del grupo tiene diabetes, hipertensión u otra condición, lo revisamos antes de emitir.",
      },
      {
        question: "¿Qué pasa si mi maleta llega dos días tarde?",
        answer:
          "El retraso de equipaje cubre la compra de artículos de primera necesidad (ropa, artículos de higiene) mientras esperas. Hay un umbral de horas que define cuándo aplica. La pérdida total o el robo se cubren hasta el límite del plan, con sublímites por artículo. Recuerda: dinero en efectivo, tarjetas y documentos no se cubren bajo equipaje.",
      },
      {
        question: "¿Cuándo debo comprar el seguro: antes de pagar los boletos o antes de salir?",
        answer:
          "Cuanto antes, mejor. Para activar la cobertura de cancelación y el waiver de preexistentes, muchos planes exigen que compres la póliza dentro de 10 a 15 días de hacer tu primer pago del viaje. Si esperas hasta la semana antes de salir, esas coberturas pueden no estar disponibles.",
      },
    ],
    caseStudy: {
      title: "Una apendicitis a mitad del Mediterráneo",
      paragraphs: [
        "Una pareja de San Juan planifica un crucero de 14 días por el Mediterráneo: vuelos, camarote y excursiones suman $6,200, en su mayoría sin posibilidad de devolución. Contratan un plan Platinum con $50,000 en asistencia médica, evacuación ilimitada y cancelación hasta $1,500.",
        "Al quinto día del crucero, ella presenta una apendicitis aguda que requiere cirugía en un hospital de Roma. Los gastos médicos alcanzan los $28,000. La póliza cubre la totalidad de la cirugía y hospitalización, más el vuelo médico de regreso a Puerto Rico cuando estuvo estable. Sin la póliza, esos $28,000 más el transporte hubieran salido de su bolsillo.",
        "El límite de cancelación de $1,500 no cubrió todo el valor del viaje — por eso se recomienda siempre comparar ese límite contra el costo total prepagado y ampliarlo si es posible.",
      ],
      lesson:
        "El plan no se compra por lo que es probable; se compra por lo que es caro. Un avión medicalizado puede costar más que el viaje entero.",
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
      "Cáncer o enfermedades graves diagnosticadas antes de contratar. Aplica un período de espera, por ejemplo de 90 días.",
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
          "Normalmente no. Los diagnósticos previos quedan excluidos o reciben una cubierta muy limitada, y aplican períodos de espera.",
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
      "El seguro compulsorio es lo que exige la ley para renovar el marbete, y cubre solo $4,500 en daños al vehículo ajeno. Nada de tu carro, nada de lesiones, nada de abogado. La póliza anual completa es lo que protege tu patrimonio cuando el compulsorio no alcanza.",
    covers: [
      "Compulsorio (responsabilidad obligatoria): daños al vehículo de otra persona cuando eres responsable, hasta $4,500 por accidente. Incluye asistencia de grúa hasta lugar seguro con algunas aseguradoras. Se contrata anualmente con el marbete.",
      "Colisión: daños a tu propio vehículo por impacto contra otro auto, un objeto fijo o por volcadura. Sujeto al deducible que selecciones ($250, $500 o $1,000 típicamente).",
      "Comprensiva (Other Than Collision): robo del vehículo, incendio, vandalismo, inundación, huracán, caída de árboles u objetos, impacto con animales, cristales y disturbios civiles.",
      "Responsabilidad Pública (RP): cubre lesiones corporales y daños a la propiedad de terceros cuando eres responsable, incluyendo tu defensa legal pagada por la aseguradora. El estándar de mercado en Puerto Rico es 100/300/50: hasta $100,000 por persona lesionada, $300,000 por accidente, y $50,000 en daños a propiedad.",
      "Gastos médicos (Medical Payments): cubre gastos médicos tuyos y de tus pasajeros sin importar quién causó el accidente, coordinados con ACAA.",
      "Asistencia en carretera: grúa, cambio de goma, combustible, cerrajería y arranque de batería — incluida en muchos planes o disponible como endoso adicional.",
    ],
    excludes: [
      "Uso comercial no declarado: deliveries, Uber, transporte de pasajeros por paga, mandados del negocio. Es una de las causas más comunes de reclamaciones negadas.",
      "Conductor específicamente excluido en la póliza — si esa persona maneja y hay un accidente, no hay cobertura.",
      "Conducir sin licencia válida o bajo efectos de alcohol o drogas.",
      "Carreras, competencias o track days.",
      "Desgaste normal del vehículo y fallas mecánicas — la póliza no es una garantía del auto.",
      "Accesorios no declarados: aros personalizados, sistemas de sonido, modificaciones al vehículo. Lo no declarado, no está cubierto.",
      "Propiedad personal dentro del vehículo: ropa, laptop, cámara. Eso va bajo la póliza de hogar o renters.",
      "Actos intencionales y robo simulado.",
    ],
    whoCanApply: [
      "Todo vehículo registrado en Puerto Rico necesita el compulsorio para renovar el marbete. Si ya tienes una póliza anual con responsabilidad pública, aplica un crédito de ~$99 al momento del marbete — no pagas los dos.",
      "Cualquier conductor con licencia vigente puede contratar la póliza anual. La aseguradora evalúa edad, historial de manejo, tipo de vehículo y los conductores que usarán el auto.",
      "Si el vehículo está financiado, el banco generalmente exige colisión, comprensiva y responsabilidad pública como condición del préstamo.",
      "Conductores que usan el vehículo para trabajar (deliveries, negocios, transporte) necesitan declararlo — hay aseguradoras que lo permiten con un endoso especial.",
    ],
    faqs: [
      {
        question: "¿Qué cubre exactamente el seguro compulsorio?",
        answer:
          "El compulsorio cubre daños al vehículo de otra persona hasta $4,500 por accidente cuando tú eres responsable. No cubre tu propio auto, no cubre lesiones de nadie (eso es ACAA, que se paga aparte), no cubre postes, verjas ni ninguna propiedad que no sea un vehículo de motor, y no incluye defensa legal si te demandan.",
      },
      {
        question: "Si solo tengo compulsorio y causo un accidente con $12,000 en daños, ¿qué pasa?",
        answer:
          "El compulsorio paga $4,500 y los $7,500 restantes te los reclaman a ti personalmente. Si además el otro conductor sufre lesiones, la exposición puede ser de decenas de miles. ACAA puede cubrir parte de los gastos médicos, pero lo que exceda sus límites también te lo cobran a ti. Sin responsabilidad pública, tu patrimonio queda expuesto.",
      },
      {
        question: "¿Qué es ACAA y cómo se relaciona con mi seguro de auto?",
        answer:
          "ACAA es el sistema público de compensación por lesiones en accidentes de tránsito, financiado por la cuota que pagas con el marbete ($35, $50 o $70 según el plan). Cubre servicios médicos por hasta 2 años y el 50% del salario si no puedes trabajar. Pero ACAA tiene exclusiones importantes: si conduces con el marbete vencido, sin licencia válida o bajo efectos de sustancias, te pueden denegar los beneficios médicos completos.",
      },
      {
        question: "Si ya tengo póliza anual con RP, ¿por qué tengo que pagar el compulsorio también?",
        answer:
          "No tienes que pagar los dos. Si tu póliza anual incluye responsabilidad pública, aplica un crédito de aproximadamente $99 al renovar el marbete — porque ya tienes cobertura igual o mayor a la del compulsorio. Mucha gente paga los dos sin darse cuenta.",
      },
      {
        question: "¿Cuál es el límite de responsabilidad pública recomendado?",
        answer:
          "El estándar de mercado en Puerto Rico es 100/300/50: hasta $100,000 por persona lesionada, $300,000 por accidente y $50,000 en daños a propiedad. Ese es el piso, no el techo. Si tienes casa, ahorros, un negocio o un vehículo de valor, subir los límites cuesta menos de lo que la mayoría imagina.",
      },
      {
        question: "¿Puedo usar el carro para hacer deliveries y seguir cubierto?",
        answer:
          "El uso comercial no declarado es una de las exclusiones estándar en prácticamente todas las aseguradoras. Si usas el vehículo para deliveries, Uber, mandados del negocio o transporte de pasajeros sin declararlo, una reclamación puede ser negada aunque pagues la prima al día. Hay que declararlo y verificar si tu aseguradora lo permite con un endoso.",
      },
      {
        question: "¿Qué es el doble interés y por qué no protege mi patrimonio?",
        answer:
          "El doble interés es una póliza que cubre solo el vehículo (colisión y comprensiva) sin responsabilidad pública, típicamente contratada cuando el banco financia el auto. Protege el préstamo del banco, pero no te protege a ti si causas daños o lesiones a un tercero. No es lo mismo que tener responsabilidad pública.",
      },
      {
        question: "¿Qué pasa si el marbete está vencido el día del accidente?",
        answer:
          "ACAA puede denegar los beneficios médicos a quien conducía con marbete vencido. No es solo una multa de tránsito — es quedarte sin cobertura médica si resultas lesionado en ese accidente. Verificar el marbete antes de salir es parte de estar protegido.",
      },
    ],
    caseStudy: {
      title: "El accidente que el compulsorio no alcanza a cubrir",
      paragraphs: [
        "Un conductor en Bayamón tiene solo el seguro compulsorio. En la PR-22, pierde el control en la lluvia y choca el vehículo de adelante: $12,000 en daños al otro auto y el conductor sufre una fractura que genera $80,000 en gastos médicos, rehabilitación y pérdida de ingresos.",
        "El compulsorio paga los $4,500 del límite legal. Los $7,500 restantes de daño al vehículo, más todo lo que ACAA no cubre de los gastos médicos, se los cobran directamente al conductor responsable. Con una póliza anual de responsabilidad pública 100/300/50, la aseguradora habría cubierto los daños al vehículo hasta $50,000, las lesiones hasta $100,000 por persona, y pagado el abogado sin costo adicional.",
        "La diferencia entre el compulsorio y la RP 100/300/50 en prima anual suele ser menor de lo que la gente imagina. La diferencia en exposición es de decenas de miles.",
      ],
      lesson:
        "El compulsorio te mantiene legal. La responsabilidad pública te mantiene fuera de la corte.",
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
      "Tu negocio puede enfrentar una demanda, un incendio o un robo en cualquier momento. Un solo evento sin cobertura puede costar más que años de operación. Estas son las líneas comerciales con las que trabajamos.",
    covers: [
      "Responsabilidad Pública Comercial (CGL): protege tu negocio si alguien sufre lesiones o daños en tus predios, por tus operaciones, tus productos o tus empleados. Incluye defensa legal pagada por la aseguradora — aunque ganes el caso, defenderte puede costar decenas de miles.",
      "Propiedad comercial: tu local, equipo e inventario contra incendio, huracán, vandalismo, robo y otros riesgos. Cubre el edificio y el contenido según lo que declares.",
      "Interrupción de negocio: ingresos que dejas de percibir mientras el local está cerrado o en reparación por un evento cubierto.",
      "BOP (Business Owner Policy): paquete que combina propiedad y responsabilidad pública en una sola póliza, diseñado para pequeños y medianos negocios.",
      "Maquinaria y equipo especial: averías mecánicas y daños accidentales a equipos especializados no cubiertos por la póliza de propiedad estándar.",
      "Fianzas (surety bonds): garantizan a un tercero — cliente, entidad gubernamental o arrendador — que cumplirás una obligación contractual o de licencia.",
    ],
    excludes: [
      "Errores profesionales: el CGL no cubre consejos equivocados, diseños incorrectos, diagnósticos errados ni ningún error en el ejercicio de tu profesión. Eso requiere una póliza de Errors & Omissions (E&O) o de mala práctica por separado.",
      "Lesiones a empleados en el trabajo: eso cae bajo el Fondo del Seguro del Estado (CFSE), no bajo el CGL.",
      "Daños a tu propio inventario o equipo (eso lo cubre la póliza de propiedad; el CGL es para daños a terceros).",
      "Responsabilidad por ciberataques, pérdida de datos o brechas de información — requiere póliza de cyber separada.",
      "Límite agregado agotado: si hay múltiples reclamaciones en un año, el total pagado no puede superar el agregado de la póliza. Un negocio con varias demandas puede quedarse sin cobertura antes de que termine la vigencia.",
      "Actos intencionales, fraude y responsabilidades asumidas por contrato (salvo endoso específico).",
    ],
    commercialLines: [
      {
        name: "Responsabilidad Pública (CGL)",
        benefit:
          "Protege tu negocio si alguien resulta lesionado en tus predios o reclama daños por tus operaciones. Incluye defensa legal sin costo adicional.",
      },
      {
        name: "Propiedad y contingencia",
        benefit:
          "Protege tu local, tu equipo y tu inventario, y cubre los ingresos que dejas de recibir mientras reabres después de un evento cubierto.",
      },
      {
        name: "BOP (Business Owner Policy)",
        benefit:
          "Propiedad y responsabilidad en una sola póliza para tiendas, oficinas y negocios de servicio. Más económico que comprar las coberturas por separado.",
      },
      {
        name: "Riesgos comerciales especiales",
        benefit:
          "Cubiertas para lo específico de tu operación: maquinaria, equipo especializado, mercancía en tránsito y riesgos de tu industria.",
      },
      {
        name: "Fianzas (surety bonds)",
        benefit:
          "Garantizan a un tercero que cumplirás un contrato, una licencia o una obligación. Muchos contratos gubernamentales y de arrendamiento las exigen.",
      },
    ],
    whoCanApply: [
      "Negocios de todos los tamaños con operaciones en Puerto Rico: comercios, oficinas, restaurantes, contratistas, profesionales independientes.",
      "Muchos contratos de arrendamiento comercial exigen CGL con límites específicos — comúnmente $1,000,000 por ocurrencia y $2,000,000 de agregado. Revisamos tu contrato antes de emitir para que cumplas con lo que te exigen.",
      "Si tienes contratos con clientes corporativos o agencias gubernamentales, generalmente te exigen un certificado de seguro con límites específicos. Te ayudamos a entender qué comprar para cumplir.",
      "Si trabajas desde casa como profesional independiente, tu póliza de hogar no cubre la actividad comercial. Necesitas CGL aunque el negocio sea pequeño.",
    ],
    faqs: [
      {
        question: "¿Mi seguro de hogar cubre si alguien se cae en mi negocio?",
        answer:
          "No. La póliza de hogar cubre responsabilidad personal en tu residencia. Para un negocio — incluso uno que operas desde tu casa — la actividad comercial generalmente queda excluida. Necesitas CGL.",
      },
      {
        question: "¿Mi póliza de responsabilidad comercial cubre los errores que cometo en mi trabajo?",
        answer:
          "No. El CGL cubre que un cliente se resbale en tu oficina o que tus empleados dañen la propiedad de alguien. Los errores profesionales — dar un consejo equivocado, un diseño incorrecto, un diagnóstico errado — requieren una póliza de Errors & Omissions (E&O) o de mala práctica por separado.",
      },
      {
        question: "¿Qué límite de responsabilidad comercial necesito?",
        answer:
          "Depende de tus contratos. Los arrendamientos comerciales y los contratos con clientes corporativos suelen exigir $1,000,000 por ocurrencia y $2,000,000 de agregado. Revisamos tus contratos y te decimos exactamente qué límite necesitas para cumplir — ni más, ni menos.",
      },
      {
        question: "¿Qué es una fianza y cuándo la necesito?",
        answer:
          "Una fianza (surety bond) garantiza a un tercero — un cliente, una entidad gubernamental o un arrendador — que cumplirás tu obligación. Algunos contratos de servicios, licencias de contratistas y licitaciones gubernamentales las requieren como condición. No es un seguro de daños; es una garantía de cumplimiento.",
      },
      {
        question: "¿Qué pasa si tengo varias reclamaciones en el mismo año?",
        answer:
          "El límite agregado de la póliza es el máximo total que paga la aseguradora en toda la vigencia. Si tienes tres reclamaciones en un año y en conjunto superan el agregado, la póliza no paga más. Por eso es importante que el agregado sea suficiente para el nivel de riesgo de tu operación.",
      },
    ],
    caseStudy: {
      title: "Un resbalón que no estaba en el presupuesto",
      paragraphs: [
        "Un restaurante en Ponce lleva cinco años operando sin incidentes de responsabilidad. Un martes, un cliente resbala con el piso mojado cerca de la barra, se fractura la cadera y demanda al negocio por $250,000 — gastos médicos, rehabilitación y lucro cesante.",
        "Sin CGL, el dueño enfrenta la demanda con su patrimonio personal: su auto, sus ahorros, su cuenta del negocio, y potencialmente su casa si la tiene. Con una póliza de responsabilidad pública de $1,000,000 por ocurrencia, la aseguradora paga el abogado desde el primer día y cubre la sentencia hasta el límite contratado.",
        "La defensa legal sola — preparar argumentos, comparecer en corte, peritos médicos — puede costar $40,000 aunque el caso se resuelva a favor del negocio.",
      ],
      lesson:
        "El CGL no es un gasto del negocio. Es el costo de no tener que vender el negocio para pagar un abogado.",
    },
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
