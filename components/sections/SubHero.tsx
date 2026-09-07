import { insurers, subHeroContent, trustStats } from "@/lib/content";

// Sub-hero: quiénes somos + tres cifras sobre el degradado del escudo
// (solo fondo completo, textos cortos). El eslogan ya apareció en el hero:
// aquí no se repite.
export function SubHero() {
  return (
    <section className="bg-brand-gradient py-14 text-white lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-5 lg:gap-16 lg:px-8">
        <div className="lg:col-span-2">
          <p className="text-lg leading-relaxed text-white/90">
            {subHeroContent.intro}
          </p>
        </div>

        <dl className="grid gap-6 sm:grid-cols-3 lg:col-span-3">
          {trustStats.map((stat) => (
            <div key={stat.label} className="border-l-2 border-unity-teal-pale/60 pl-4">
              <dt className="font-heading text-4xl font-extrabold leading-none tracking-tight lg:text-5xl">
                {stat.dynamic ? insurers.length : stat.value}
              </dt>
              <dd className="mt-2 text-sm text-white/85 lg:text-base">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
