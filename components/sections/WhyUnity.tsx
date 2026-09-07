import { insurers, whyUnityPoints } from "@/lib/content";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

// Por qué Unity: tres puntos de diferenciación con icono en círculo
// (alternando navy y teal, trazo 1.75). El eslogan reaparece aquí, discreto,
// como segundo punto de énfasis (el primero fue el hero).
export function WhyUnity() {
  const n = String(insurers.length);

  return (
    <section id="por-que-unity" className="scroll-mt-24 lg:scroll-mt-[150px] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <p className="font-heading text-[13px] font-bold uppercase tracking-[0.08em] text-unity-teal">
            {BRAND.tagline}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-unity-navy md:text-4xl">
            Lo que cambia cuando trabajas con Unity
          </h2>
        </div>

        <ul className="grid gap-6 md:grid-cols-3">
          {whyUnityPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <li
                key={point.title}
                className="flex flex-col rounded-2xl bg-unity-light p-8"
              >
                <span
                  className={cn(
                    "flex h-16 w-16 items-center justify-center rounded-full text-white",
                    index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                  )}
                >
                  <Icon className="h-[30px] w-[30px]" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-6 text-[22px] font-bold leading-tight text-unity-navy">
                  {point.title.replace("{n}", n)}
                </h3>
                <p className="mt-3 text-base leading-relaxed text-unity-gray-mid">
                  {point.description.replaceAll("{n}", n)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
