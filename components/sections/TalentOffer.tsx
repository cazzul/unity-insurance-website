import { SectionHeading } from "@/components/ui/SectionHeading";
import { TalentWhatsAppButton } from "@/components/ui/TalentWhatsAppButton";
import { talentContent } from "@/lib/content";
import { cn } from "@/lib/utils";

// Lo que se ofrece (lo que enumera la frase principal) y un cierre con el
// mismo botón de WhatsApp. Las tarjetas llevan solo el título: no hay más
// datos confirmados por el dueño.
export function TalentOffer() {
  return (
    <section className="bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title={talentContent.offerTitle} />

        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {talentContent.pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <li
                key={pillar.title}
                className="flex flex-col items-center rounded-2xl border border-unity-navy/10 bg-white p-8 text-center shadow-sm"
              >
                <span
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full text-white",
                    index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                  )}
                >
                  <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                </span>
                <span className="mt-4 font-heading text-lg font-bold text-unity-navy">
                  {pillar.title}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-14 text-center">
          <p className="font-heading text-xl font-bold text-unity-navy">
            {talentContent.closing}
          </p>
          <div className="mt-6 flex justify-center">
            <TalentWhatsAppButton />
          </div>
        </div>
      </div>
    </section>
  );
}
