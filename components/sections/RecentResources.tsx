import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { resources } from "@/lib/resources";
import { cn } from "@/lib/utils";

// Recursos más recientes: se leen completos en su propia página, sin
// formulario de por medio. La captura de correo ocurre después de leer
// (ver ResultsGate y ScrollLeadCapture en /recursos/[slug]).
export function RecentResources() {
  const recent = resources.slice(0, 3);

  return (
    <section id="recursos" className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Recursos más recientes"
          subtitle="Guías cortas para entender tu póliza antes de firmar o renovar."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {recent.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.slug}
                href={`/recursos/${resource.slug}`}
                className="group relative flex flex-col rounded-2xl border border-unity-navy/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                {resource.pending && (
                  <span className="absolute right-4 top-4 rounded-full bg-unity-teal-tint px-3 py-1 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-unity-teal-dark">
                    De prueba
                  </span>
                )}
                <div
                  className={cn(
                    "mb-4 flex h-12 w-12 items-center justify-center rounded-full text-white",
                    index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                  )}
                >
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </div>
                <h3 className="font-bold text-unity-navy">{resource.title}</h3>
                <p className="mt-2 flex-1 text-sm text-unity-gray">{resource.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-unity-teal group-hover:text-unity-teal-dark">
                  {resource.kind === "quiz" ? "Hacer el quiz" : "Leer la guía"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/recursos"
            className="inline-flex items-center gap-2 font-semibold text-unity-teal hover:text-unity-teal-dark"
          >
            Ver todos los recursos
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
