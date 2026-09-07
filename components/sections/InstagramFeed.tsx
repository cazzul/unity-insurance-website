import { Camera } from "lucide-react";
import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { instagramImages } from "@/lib/content";
import { CONTACT } from "@/lib/constants";

export function InstagramFeed() {
  return (
    <section id="instagram" className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Síguenos en Instagram"
          subtitle={`Contenido, eventos y consejos en ${CONTACT.instagramHandle}`}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {instagramImages.map((img, i) => (
            <a
              key={img.src}
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Publicación ${i + 1} del Instagram de Unity. Abre ${CONTACT.instagramHandle}`}
              className="group relative aspect-square overflow-hidden rounded-2xl shadow-sm"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 17vw"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-unity-navy/0 transition-colors group-hover:bg-unity-navy/50">
                <Camera className="h-8 w-8 text-white opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-semibold text-unity-teal hover:text-unity-teal-dark"
          >
            <Camera className="h-5 w-5" />
            Ver en Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
