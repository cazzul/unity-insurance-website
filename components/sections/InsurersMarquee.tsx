import Image from "next/image";
import { insurers } from "@/lib/content";

export function InsurersMarquee() {
  const doubled = [...insurers, ...insurers];

  return (
    <section
      id="aseguradoras"
      className="overflow-hidden border-y border-unity-navy/10 bg-unity-light py-8"
    >
      <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-unity-gray">
        Trabajamos con {insurers.length} aseguradoras locales e internacionales
      </p>
      <div className="relative flex overflow-hidden">
        <ul className="animate-marquee flex shrink-0 items-center" aria-label="Aseguradoras">
          {doubled.map((insurer, i) => (
            <li
              key={`${insurer.name}-${i}`}
              aria-hidden={i >= insurers.length}
              className="mx-3 flex h-20 w-48 shrink-0 items-center justify-center rounded-2xl border border-unity-navy/10 bg-white px-5 shadow-sm"
            >
              {insurer.logo ? (
                <Image
                  src={insurer.logo.src}
                  alt={insurer.name}
                  width={insurer.logo.width}
                  height={insurer.logo.height}
                  className="h-10 w-full object-contain"
                />
              ) : (
                <span className="text-center text-sm font-bold leading-tight text-unity-navy/80">
                  {insurer.name}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
