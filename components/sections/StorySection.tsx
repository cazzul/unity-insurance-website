import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { storyContent } from "@/lib/content";

// Adelanto de "nuestra historia" en el home: quiénes somos antes de qué
// vendemos. Foto real de equipo (eventos), nunca generada por IA. La
// versión completa (pilares, visión, valores) vive en /nosotros.
export function StorySection() {
  return (
    <section id="historia" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <p className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal">
              {storyContent.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-unity-navy md:text-4xl">
              {storyContent.title}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-unity-gray-mid">
              {storyContent.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-8">
              <Button variant="outline" href={storyContent.ctaHref}>
                {storyContent.cta}
              </Button>
            </div>
          </div>

          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl shadow-md lg:col-span-2">
            <Image
              src={storyContent.photo.src}
              alt={storyContent.photo.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
