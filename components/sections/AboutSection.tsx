import { Quote } from "lucide-react";
import { aboutContent } from "@/lib/content";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

// "Nosotros": historia, pilares y valores tomados de la presentación oficial
// de marca. Un solo arco por pieza (arc-bottom en la tarjeta de visión).
export function AboutSection() {
  return (
    <section id="nosotros" className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-16">
          <div className="lg:col-span-3">
            <p className="font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal">
              {aboutContent.kicker}
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-unity-navy md:text-4xl">
              {aboutContent.title}
            </h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-unity-gray-mid">
              {aboutContent.story.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <ul className="mt-10 grid gap-6 sm:grid-cols-3">
              {aboutContent.pillars.map((pillar, index) => {
                const Icon = pillar.icon;
                return (
                  <li key={pillar.title} className="flex flex-col">
                    <span
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-full text-white",
                        index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                      )}
                    >
                      <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                    </span>
                    <h3 className="mt-4 font-heading text-base font-bold leading-snug text-unity-navy">
                      {pillar.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-unity-gray">
                      {pillar.description}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>

          <figure className="relative overflow-hidden rounded-2xl bg-unity-navy p-8 text-white shadow-md lg:col-span-2 lg:p-10">
            {/* Arco horizontal del sistema Unity: banda teal con borde curvo,
                misma construcción que la demo de /marca. */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-[10%] -right-[10%] -top-24 h-56 bg-unity-teal arc-bottom"
            />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-unity-navy">
                <Quote className="h-6 w-6" strokeWidth={1.75} aria-hidden />
              </span>
              <p className="mt-24 font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal-pale">
                Nuestra visión
              </p>
              <blockquote className="mt-3 text-2xl font-bold leading-snug">
                {aboutContent.vision}
              </blockquote>
              <figcaption className="mt-8 font-script text-xl text-unity-teal-pale">
                {BRAND.tagline}
              </figcaption>
            </div>
          </figure>
        </div>

        <div className="mt-16">
          <h3 className="text-center font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal">
            Nuestros valores
          </h3>
          <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {aboutContent.values.map((value, index) => {
              const Icon = value.icon;
              return (
                <li
                  key={value.title}
                  className="flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-[0_2px_14px_rgba(11,37,73,0.07)]"
                >
                  <span
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full text-white",
                      index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                    )}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                  </span>
                  <h4 className="mt-4 font-heading text-sm font-bold text-unity-navy">
                    {value.title}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed text-unity-gray">
                    {value.description}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
