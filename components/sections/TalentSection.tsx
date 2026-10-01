import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { TalentWhatsAppButton } from "@/components/ui/TalentWhatsAppButton";
import { talentContent } from "@/lib/content";

// Invitación a agentes: última sección del home, después del formulario de
// clientes (no compite con él). La página completa vive en /oportunidades.
// Foto real del equipo, completa (4:3) para no cortar a nadie.
export function TalentSection() {
  return (
    <section
      id="oportunidades"
      className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal">
              {talentContent.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-unity-navy md:text-4xl">
              {talentContent.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-unity-gray-mid">
              {talentContent.lead}
            </p>
            <p className="mt-4 text-lg font-semibold leading-relaxed text-unity-navy">
              {talentContent.welcome}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TalentWhatsAppButton />
              <Button
                variant="outline"
                href={talentContent.moreHref}
                className="w-full sm:w-auto"
              >
                {talentContent.moreLabel}
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md">
            <Image
              src={talentContent.photo.src}
              alt={talentContent.photo.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
