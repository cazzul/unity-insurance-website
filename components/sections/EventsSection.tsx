import { Camera } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { eventImages, sponsors } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function EventsSection() {
  return (
    <section id="eventos" className="scroll-mt-24 lg:scroll-mt-[150px] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Eventos y patrocinios"
          subtitle="Participamos en eventos y actividades de la industria en Puerto Rico."
        />

        {sponsors.length > 0 && (
          <div className="mb-10 flex flex-wrap items-center justify-center gap-6">
            {sponsors.map((name) => (
              <div
                key={name}
                className="flex h-14 w-36 items-center justify-center rounded-2xl border border-unity-navy/10 bg-unity-light text-xs font-semibold text-unity-gray"
              >
                {name}
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {eventImages.map((img) => (
            <div
              key={img.src}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-sm transition-transform hover:scale-[1.02]"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className={cn(
                  "object-cover",
                  img.position === "top" ? "object-top" : "object-center",
                )}
              />
            </div>
          ))}

          {/* Sexta celda: cierre del grid con enlace a Instagram. */}
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex aspect-[4/3] flex-col items-center justify-center gap-3 rounded-2xl bg-unity-navy p-6 text-center text-white shadow-sm transition-colors hover:bg-unity-navy-mid"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-unity-teal">
              <Camera className="h-7 w-7" strokeWidth={1.75} aria-hidden />
            </span>
            <span className="font-heading text-sm font-bold uppercase tracking-[0.12em]">
              Ver más en Instagram
            </span>
            <span className="text-sm text-white/75">{CONTACT.instagramHandle}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
