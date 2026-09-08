import type { Metadata } from "next";
import Image from "next/image";
import {
  Activity,
  Briefcase,
  Car,
  Heart,
  Home,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { BRAND, CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Fundamentos de marca | Unity Insurance Group",
  description:
    "Color, tipografía, logo, formas e iconografía del sistema de diseño de Unity Insurance Group.",
  robots: { index: false, follow: false },
};

const colors = [
  { name: "Navy Unity", hex: "#0B2549", rgb: "R11 G37 B73", use: "Fondos, titulares, barras", swatch: "bg-unity-navy" },
  { name: "Navy medio", hex: "#143A6B", rgb: "R20 G58 B107", use: "Degradados, capas", swatch: "bg-unity-navy-mid" },
  { name: "Teal Unity", hex: "#0E7C9B", rgb: "R14 G124 B155", use: "Acento, palabra clave, iconos", swatch: "bg-unity-teal" },
  { name: "Teal claro", hex: "#1B9AB8", rgb: "R27 G154 B184", use: "Botones activos, subrayados", swatch: "bg-unity-teal-light" },
  { name: "Fondo claro", hex: "#F2F5F9", rgb: "R242 G245 B249", use: "Base de piezas claras", swatch: "bg-unity-light border border-unity-line border-b-0" },
];

const neutrals = [
  { name: "Tinta", hex: "#16223A", use: "cuerpo de texto", swatch: "bg-unity-ink" },
  { name: "Gris", hex: "#5A6B82", use: "apoyo, pies de foto", swatch: "bg-unity-gray" },
  { name: "Gris claro", hex: "#C9D3E0", use: "líneas divisorias", swatch: "bg-unity-line" },
];

const typeScale = [
  { sample: "Unidos para protegerte", spec: "Display\n76/74 · 800 · -0.025em", className: "font-heading text-5xl font-extrabold leading-none tracking-[-0.025em] text-unity-navy md:text-[76px]" },
  { sample: "Nuestros servicios", spec: "Título de sección\n46/50 · 800", className: "font-heading text-4xl font-extrabold leading-[1.08] tracking-[-0.015em] text-unity-navy md:text-[46px]" },
  { sample: "Seguro de hogar", spec: "Subtítulo\n26/31 · 700", className: "font-heading text-[26px] font-bold leading-tight text-unity-navy" },
  { sample: "Protección comercial", spec: "Etiqueta\n15 · 700 · 0.22em · caja alta", className: "font-heading text-[15px] font-bold uppercase tracking-[0.22em] text-unity-teal" },
  { sample: `Agenda tu consulta en una llamada. Comparamos con ${15} aseguradoras y te decimos qué cubre cada una.`, spec: "Entradilla\n22/34 · 400", className: "max-w-3xl text-[22px] leading-[1.55] text-unity-gray-mid" },
  { sample: "Unity es una oficina de servicios de seguros en Puerto Rico. Trabajamos con familias y con negocios: hogar, comercial, auto, cáncer, viajero y escolar.", spec: "Cuerpo\n17/28 · 400", className: "max-w-3xl text-[17px] leading-[1.65] text-unity-ink" },
];

const logoRules = [
  { title: "No deformar", text: "Escalar siempre proporcional. Sin estirar ni comprimir." },
  { title: "No recolorear", text: "Solo la versión a color, la blanca y la navy plana." },
  { title: "No sobre foto sucia", text: "Si la foto tiene detalle, va sobre una placa navy o blanca." },
  { title: "No añadir efectos", text: "Sin sombras, contornos, brillos ni bordes extra." },
];

const icons: { label: string; icon: LucideIcon }[] = [
  { label: "Hogar", icon: Home },
  { label: "Auto", icon: Car },
  { label: "Vida", icon: Heart },
  { label: "Salud", icon: Activity },
  { label: "Comercial", icon: Briefcase },
  { label: "Protección", icon: ShieldCheck },
];

const voices = [
  { title: "Familias", tone: "Cercano", text: "Cotidiano y directo. Se habla de la casa, del carro, de los nenes. Sin tecnicismos: \"cubre\" antes que \"indemniza\"." },
  { title: "Negocios", tone: "Sobrio", text: "Concreto y con números. Riesgo, continuidad, cumplimiento. Se nombra la cobertura por su nombre." },
  { title: "Institucional", tone: "Formal", text: "Presentaciones, aliados, aseguradoras. Primera persona del plural, sin adornos, con datos comprobables." },
];

const writeLikeThis = [
  "\"Llama al 787-922-5558 y te decimos qué cubre cada aseguradora.\"",
  "\"Comparamos 15 aseguradoras. Tú escoges.\"",
  "\"¿Abriste negocio este año? Hay coberturas que necesitas antes de firmar el arrendamiento.\"",
];

const avoid = [
  "Guiones largos. Se sustituyen por coma, punto, paréntesis o dos puntos.",
  "La construcción \"no es X, es Y\". Se dice Y y se acabó.",
  "Aperturas de relleno: \"En el mundo actual\", \"Hoy más que nunca\".",
  "Superlativos sin prueba: \"la mejor\", \"revolucionario\", \"único en la isla\".",
  "Porcentajes y plazos inventados para sonar preciso.",
  "Emoji y viñetas que arrancan en negrita.",
];

function Kicker({ children, light = false }: { children: string; light?: boolean }) {
  return (
    <div
      className={`font-heading text-[13px] font-bold uppercase tracking-[0.2em] ${light ? "text-unity-teal-pale" : "text-unity-teal"}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ number, title, intro }: { number: string; title: string; intro: string }) {
  return (
    <>
      <div className="flex items-baseline gap-6">
        <span className="font-heading text-[15px] font-bold tracking-[0.22em] text-unity-teal">{number}</span>
        <h2 className="text-4xl font-extrabold tracking-[-0.015em] text-unity-navy md:text-[46px]">{title}</h2>
      </div>
      <p className="mt-4 mb-12 max-w-2xl text-lg leading-[1.55] text-unity-gray-mid md:text-[19px]">{intro}</p>
    </>
  );
}

function Bullet({ children, muted = false }: { children: string; muted?: boolean }) {
  return (
    <div className="flex gap-3.5">
      <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${muted ? "bg-unity-line" : "bg-unity-teal"}`} />
      <span>{children}</span>
    </div>
  );
}

export default function MarcaPage() {
  return (
    <main className="bg-unity-light text-unity-ink">
      {/* Portada */}
      <section className="relative overflow-hidden bg-brand-gradient">
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 hidden w-[62%] bg-unity-light arc-right lg:block" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1fr_1fr] lg:px-12 lg:py-28">
          <div className="rounded-2xl bg-unity-light p-8 lg:bg-transparent lg:p-0">
            <Image src="/images/brand/unity-lockup.webp" alt="Unity Insurance Group" width={2757} height={1540} className="h-20 w-auto md:h-24" priority />
            <div className="mt-10 font-heading text-[15px] font-bold uppercase tracking-[0.22em] text-unity-teal">Sistema de diseño</div>
            <h1 className="mt-5 text-5xl font-extrabold leading-none tracking-[-0.02em] text-unity-navy md:text-[62px]">
              Fundamentos
              <br />
              de marca
            </h1>
            <div className="mt-6 h-[5px] w-24 bg-unity-teal" />
            <p className="mt-6 max-w-md text-xl leading-[1.55] text-unity-gray-mid">
              Color, tipografía, logo, formas e iconografía. Todo lo que se necesita para armar una pieza de Unity sin volver a decidir desde cero.
            </p>
            <div className="mt-10 flex flex-wrap gap-9 text-sm tracking-[0.04em] text-unity-gray">
              <span>Versión 1.0</span>
              <span>Puerto Rico</span>
              <span>unityinsurancepr.com</span>
            </div>
          </div>
          <div className="flex items-end justify-end text-right font-heading text-white">
            <div>
              <div className="text-3xl font-extrabold tracking-[-0.01em] md:text-[34px]">{BRAND.tagline}</div>
              <div className="mt-2.5 text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Tagline oficial</div>
            </div>
          </div>
        </div>
      </section>

      {/* 01 Color */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <SectionTitle number="01" title="Color" intro="Dos azules cargan la identidad. El navy manda en fondos y titulares, el teal marca lo que el ojo debe encontrar primero. Los grises solo sostienen texto." />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {colors.map((c) => (
            <div key={c.hex} className="flex flex-col overflow-hidden rounded-2xl">
              <div className={`h-40 ${c.swatch}`} />
              <div className="bg-white px-5 py-5">
                <div className="font-heading text-base font-bold text-unity-navy">{c.name}</div>
                <div className="mt-2 font-mono text-[13px] leading-[1.7] text-unity-gray">{c.hex}<br />{c.rgb}</div>
                <div className="mt-2.5 text-sm leading-snug text-unity-gray">{c.use}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 grid gap-7 lg:grid-cols-[1.15fr_1fr]">
          <div className="rounded-2xl bg-white p-9">
            <Kicker>Degradado del escudo</Kicker>
            <div className="mt-5 h-24 rounded-xl bg-brand-gradient" />
            <p className="mt-5 text-base leading-[1.6] text-unity-gray-mid">135°, navy a teal. Se usa en fondos completos y en el escudo. Nunca detrás de texto largo: si hay párrafo encima, va sobre navy plano.</p>
            <div className="mt-4 font-mono text-[13px] text-unity-gray">linear-gradient(135deg, #0B2549, #143A6B 48%, #0E7C9B)</div>
          </div>
          <div className="rounded-2xl bg-white p-9">
            <Kicker>Neutrales de texto</Kicker>
            <div className="mt-5 flex flex-col gap-3.5">
              {neutrals.map((n) => (
                <div key={n.hex} className="flex items-center gap-4">
                  <div className={`h-11 w-14 rounded-lg ${n.swatch}`} />
                  <div>
                    <div className="text-base font-semibold text-unity-navy">{n.name}</div>
                    <div className="font-mono text-[13px] text-unity-gray">{n.hex} · {n.use}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-7 md:grid-cols-2">
          <div className="rounded-2xl border-t-4 border-unity-teal bg-white px-8 py-7">
            <div className="font-heading text-[17px] font-bold text-unity-navy">Sí</div>
            <p className="mt-3 text-base leading-[1.65] text-unity-gray-mid">Máximo dos fondos por pieza. El teal aparece en una palabra del titular, en los iconos y en un botón. Nada más.</p>
          </div>
          <div className="rounded-2xl border-t-4 border-unity-line bg-white px-8 py-7">
            <div className="font-heading text-[17px] font-bold text-unity-navy">No</div>
            <p className="mt-3 text-base leading-[1.65] text-unity-gray-mid">Colores fuera de la paleta, degradados de tres tonos distintos, teal sobre navy en texto pequeño (no pasa contraste).</p>
          </div>
        </div>
      </section>

      {/* 02 Tipografía */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <SectionTitle number="02" title="Tipografía" intro="Montserrat para todo lo que se lee de lejos. Source Sans 3 para todo lo que se lee de cerca. Dos familias, sin excepciones." />
          <div className="mb-16 grid gap-16 md:grid-cols-2">
            <div>
              <Kicker>Titulares · Montserrat</Kicker>
              <div className="mt-4 font-heading text-8xl font-extrabold leading-none tracking-[-0.03em] text-unity-navy">Aa</div>
              <div className="mt-4 font-heading text-[22px] font-semibold leading-normal text-unity-gray-mid">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br />abcdefghijklmnñopqrstuvwxyz<br />0123456789 ¿? ¡! áéíóú</div>
              <p className="mt-5 text-base leading-[1.6] text-unity-gray">Pesos 700 y 800. En versalitas siempre con tracking de 0.2em.</p>
            </div>
            <div>
              <Kicker>Texto · Source Sans 3</Kicker>
              <div className="mt-4 text-8xl font-semibold leading-none tracking-[-0.02em] text-unity-navy">Aa</div>
              <div className="mt-4 text-[22px] leading-normal text-unity-gray-mid">ABCDEFGHIJKLMNÑOPQRSTUVWXYZ<br />abcdefghijklmnñopqrstuvwxyz<br />0123456789 ¿? ¡! áéíóú</div>
              <p className="mt-5 text-base leading-[1.6] text-unity-gray">Pesos 400 y 600. Cursiva solo para citas de clientes.</p>
            </div>
          </div>
          <div className="border-t border-unity-line">
            {typeScale.map((t) => (
              <div key={t.spec} className="flex flex-col gap-4 border-b border-unity-line py-7 md:flex-row md:items-end md:justify-between md:gap-10">
                <div className={t.className}>{t.sample}</div>
                <div className="shrink-0 whitespace-pre-line font-mono text-[13px] leading-[1.7] text-unity-gray md:text-right">{t.spec}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 Logo */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <SectionTitle number="03" title="Logo" intro="El escudo con la U es el activo principal. Va siempre con aire alrededor y nunca por debajo de 120 px de ancho en digital." />
        <div className="mb-7 grid gap-7 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-2xl bg-white p-10">
            <Kicker>Versión principal</Kicker>
            <div className="relative mt-16 ml-11 inline-block">
              <div aria-hidden className="absolute -inset-11 rounded-lg border border-dashed border-unity-teal-light" />
              <Image src="/images/brand/unity-lockup.webp" alt="Unity Insurance Group" width={2757} height={1540} className="block h-[88px] w-auto" />
            </div>
            <p className="mt-16 max-w-lg text-base leading-[1.65] text-unity-gray-mid">El área de respiro equivale a la altura del escudo dividida entre dos. Ningún elemento entra en esa zona, ni fotos, ni curvas, ni texto.</p>
          </div>
          <div className="flex flex-col gap-7">
            <div className="flex min-h-[180px] flex-col justify-between rounded-2xl bg-brand-gradient p-9">
              <Kicker light>Sobre fondo oscuro</Kicker>
              <Image src="/images/brand/unity-lockup.webp" alt="Unity Insurance Group en blanco" width={2757} height={1540} className="mt-6 h-14 w-auto brightness-0 invert" />
            </div>
            <div className="rounded-2xl bg-white p-9">
              <Kicker>Isotipo solo</Kicker>
              <div className="mt-5 flex items-end gap-6">
                <div className="h-[88px] w-[88px] rounded-full bg-brand-gradient" />
                <div className="h-14 w-14 rounded-full bg-brand-gradient" />
                <div className="h-9 w-9 rounded-full bg-brand-gradient" />
              </div>
              <p className="mt-5 text-[15px] leading-[1.6] text-unity-gray">Perfil de redes, favicon y marcas de agua. Nunca acompañado de otro texto.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {logoRules.map((r) => (
            <div key={r.title} className="rounded-2xl bg-white px-7 py-6">
              <div className="font-heading text-[15px] font-bold text-unity-navy">{r.title}</div>
              <p className="mt-2.5 text-[15px] leading-[1.6] text-unity-gray">{r.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 04 Formas */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <SectionTitle number="04" title="Formas y composición" intro="El arco es la firma visual. Separa el bloque de texto de la fotografía y se repite en piezas de cualquier formato." />
          <div className="mb-11 grid gap-6 md:grid-cols-3">
            <div>
              <div className="relative h-72 overflow-hidden rounded-2xl bg-unity-navy">
                <div className="absolute inset-y-0 left-0 right-[34%] bg-unity-light arc-right" />
                <div className="absolute left-8 top-8 font-heading text-xl font-extrabold leading-tight text-unity-navy">Arco<br />vertical</div>
              </div>
              <p className="mt-4 text-base leading-[1.6] text-unity-gray-mid">Formato horizontal. Texto a la izquierda, foto a la derecha. Es la base de presentaciones y banners.</p>
            </div>
            <div>
              <div className="relative h-72 overflow-hidden rounded-2xl bg-unity-navy">
                <div className="absolute -left-[10%] -right-[10%] -top-[40%] h-[110%] bg-unity-light arc-bottom" />
                <div className="absolute bottom-8 left-8 font-heading text-xl font-extrabold leading-tight text-white">Arco<br />horizontal</div>
              </div>
              <p className="mt-4 text-base leading-[1.6] text-unity-gray-mid">Formato cuadrado y vertical. Foto arriba, mensaje abajo sobre navy. Para Instagram y stories.</p>
            </div>
            <div>
              <div className="relative h-72 overflow-hidden rounded-2xl bg-unity-light">
                <div className="absolute -left-36 -top-36 h-72 w-72 rounded-br-full bg-unity-navy" />
                <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-tl-full bg-unity-teal" />
                <div className="absolute left-8 top-40 font-heading text-xl font-extrabold leading-tight text-unity-navy">Esquinas<br />marcadas</div>
              </div>
              <p className="mt-4 text-base leading-[1.6] text-unity-gray-mid">Numeración de página arriba a la izquierda, remate de color abajo a la derecha. Cierra la composición.</p>
            </div>
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-2xl bg-unity-light p-9">
              <Kicker>Reglas del arco</Kicker>
              <div className="mt-5 flex flex-col gap-3.5 text-base leading-[1.6] text-unity-gray-mid">
                <Bullet>Un solo arco por pieza. Dos curvas compitiendo ensucian la lectura.</Bullet>
                <Bullet>El texto vive del lado plano, nunca cruzando la curva.</Bullet>
                <Bullet>Filete teal de 2 px sobre el borde del arco cuando separa foto de texto.</Bullet>
              </div>
            </div>
            <div className="rounded-2xl bg-unity-light p-9">
              <Kicker>Rejilla y márgenes</Kicker>
              <div className="mt-5 flex flex-col gap-3.5 text-base leading-[1.6] text-unity-gray-mid">
                <Bullet>Margen exterior: 6% del lado corto. En 1080 px son 64 px.</Bullet>
                <Bullet>Espaciado en múltiplos de 8. Nada de valores sueltos.</Bullet>
                <Bullet>Radio de esquina: 16 px en tarjetas, 999 px en botones y chips.</Bullet>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 05 Iconografía */}
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
        <SectionTitle number="05" title="Iconografía" intro="Iconos lineales dentro de un círculo lleno. Trazo de 1.75, esquinas redondeadas, sin relleno. Los círculos alternan navy y teal para dar ritmo a las filas." />
        <div className="rounded-2xl bg-white p-8 md:p-12">
          <div className="grid grid-cols-3 gap-8 md:grid-cols-6">
            {icons.map(({ label, icon: Icon }, i) => (
              <div key={label} className="flex flex-col items-center gap-3.5 text-center">
                <div className={`flex h-24 w-24 items-center justify-center rounded-full ${i % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal"}`}>
                  <Icon className="h-11 w-11 text-white" strokeWidth={1.75} aria-hidden />
                </div>
                <div className="font-heading text-[13px] font-bold uppercase tracking-[0.1em] text-unity-navy">{label}</div>
              </div>
            ))}
          </div>
          <div className="mt-10 grid gap-8 border-t border-unity-line pt-8 text-base leading-[1.65] text-unity-gray-mid md:grid-cols-3 md:gap-14">
            <div><strong className="font-heading text-unity-navy">Tamaños</strong><br />96 px en piezas grandes, 64 px en tarjetas, 40 px en línea con texto. El icono ocupa el 46% del círculo.</div>
            <div><strong className="font-heading text-unity-navy">Set base</strong><br />Lucide, trazo 1.75, remates redondos. Si falta un icono, se dibuja siguiendo esa métrica.</div>
            <div><strong className="font-heading text-unity-navy">Prohibido</strong><br />Iconos rellenos, con degradado, con sombra o de otro set. Nada de emoji.</div>
          </div>
        </div>
      </section>

      {/* 06 Voz */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-12">
          <SectionTitle number="06" title="Voz y tono" intro="Hablamos de tú. Frases cortas, verbos concretos, cero jerga de seguros sin explicar. El tono cambia según la pieza, la voz no." />
          <div className="mb-10 grid gap-6 md:grid-cols-3">
            {voices.map((v) => (
              <div key={v.title} className="rounded-2xl bg-unity-light px-8 py-8">
                <div className="font-heading text-[19px] font-bold text-unity-navy">{v.title}</div>
                <div className="mt-2 text-[13px] font-semibold uppercase tracking-[0.14em] text-unity-teal">{v.tone}</div>
                <p className="mt-4 text-base leading-[1.65] text-unity-gray-mid">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-7 md:grid-cols-2">
            <div className="rounded-2xl bg-unity-light p-9">
              <Kicker>Escribe así</Kicker>
              <div className="mt-5 flex flex-col gap-5">
                {writeLikeThis.map((q) => (
                  <div key={q} className="border-l-[3px] border-unity-teal pl-4 text-lg leading-[1.55] text-unity-ink">{q}</div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-unity-light p-9">
              <div className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-gray">Evita</div>
              <div className="mt-5 flex flex-col gap-4 text-base leading-[1.6] text-unity-gray">
                {avoid.map((a) => (
                  <Bullet key={a} muted>{a}</Bullet>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-8 rounded-2xl bg-unity-navy p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div>
              <Kicker light>Frases de marca</Kicker>
              <div className="mt-3.5 font-heading text-3xl font-extrabold leading-[1.25] text-white md:text-[34px]">
                {BRAND.tagline}
                <br />
                <span className="text-unity-teal-light">Protegemos lo que más importa</span>
              </div>
            </div>
            <p className="max-w-sm shrink-0 text-base leading-[1.7] text-white/70">El tagline va completo o no va. No se recorta, no se traduce y no se mezcla con otro remate en la misma pieza.</p>
          </div>
        </div>
      </section>

      {/* Contacto */}
      <section className="relative overflow-hidden bg-brand-gradient">
        <div aria-hidden className="absolute -right-32 -top-40 h-[420px] w-[420px] rounded-full border border-white/20" />
        <div className="relative mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-12 px-6 py-16 lg:px-12">
          <Image src="/images/brand/unity-lockup.webp" alt="Unity Insurance Group" width={2757} height={1540} className="h-12 w-auto brightness-0 invert" />
          <div className="flex flex-wrap gap-10 text-[17px] text-white">
            {[
              ["Teléfono", CONTACT.phone],
              ["Web", "unityinsurancepr.com"],
              ["Instagram", CONTACT.instagramHandle],
              ["Facebook", BRAND.name],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-1.5 text-xs uppercase tracking-[0.18em] text-white/60">{label}</div>
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
