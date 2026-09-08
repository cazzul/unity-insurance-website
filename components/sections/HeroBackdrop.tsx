import Image from "next/image";

// Fondo de pantalla completa del hero: degradado de marca (navy a teal,
// mismo `bg-brand-gradient` de globals.css) con el escudo de Unity (SVG
// vectorial, unity-shield.svg — nítido a cualquier tamaño, sin el
// granulado del WebP rasterizado que usaba antes) como elemento gráfico
// estático, ancorado a la derecha. Sin video ni escena 3D: una sola
// imagen, sin JS de por medio. Un degradado inferior (`.hero-scrim`)
// ancla el texto y los botones sobre el fondo.
export function HeroBackdrop() {
  return (
    <div aria-hidden className="bg-brand-gradient absolute inset-0 overflow-hidden">
      <div className="absolute -right-10 top-10 h-[42%] w-[65%] opacity-80 sm:top-12 sm:h-[48%] sm:w-[55%] lg:right-0 lg:top-1/2 lg:h-[90%] lg:w-[55%] lg:max-w-[720px] lg:-translate-y-1/2 lg:opacity-90">
        <Image
          src="/images/brand/unity-shield.svg"
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 55vw, 65vw"
          className="object-contain object-right"
        />
      </div>

      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
