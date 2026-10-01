import Image from "next/image";
import { TalentWhatsAppButton } from "@/components/ui/TalentWhatsAppButton";
import { talentContent } from "@/lib/content";

// Encabezado de /oportunidades: texto centrado y la foto del equipo a todo el
// ancho. En escritorio la foto se recorta a 16:9 desde abajo (solo pierde el
// techo, no a las personas); en móvil se ve completa (4:3).
export function TalentHero() {
  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal">
            {talentContent.kicker}
          </p>
          <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-unity-navy md:text-5xl">
            {talentContent.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-unity-gray-mid md:text-xl">
            {talentContent.lead}
          </p>
          <p className="mt-4 text-lg font-semibold leading-relaxed text-unity-navy md:text-xl">
            {talentContent.welcome}
          </p>
          <div className="mt-8 flex justify-center">
            <TalentWhatsAppButton />
          </div>
        </div>

        <div className="relative mt-12 aspect-[4/3] overflow-hidden rounded-2xl shadow-lg lg:mt-16 lg:aspect-[16/9]">
          <Image
            src={talentContent.photo.src}
            alt={talentContent.photo.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 1216px"
            className="object-cover object-bottom"
            preload
          />
        </div>
      </div>
    </section>
  );
}
