import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BRAND } from "@/lib/constants";
import { resources } from "@/lib/resources";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `Recursos gratis | ${BRAND.name}`,
  description: "Quizzes y guías para entender tu póliza antes de firmar o renovar.",
};

// Bóveda de recursos: todos los quizzes y guías en un solo lugar. El home
// solo muestra los 3 más recientes (RecentResources); aquí está el resto
// cuando crezca la lista.
export default function RecursosPage() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-unity-navy py-16 text-white lg:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Recursos gratis
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85">
              Quizzes y guías para entender tu póliza, sin jerga y sin costo.
            </p>
          </div>
        </section>

        <section className="bg-unity-light py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <SectionHeading title="Todos los recursos" centered={false} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource, index) => {
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
                    <span className="font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-unity-teal">
                      {resource.kind === "quiz" ? "Quiz" : "Guía"}
                    </span>
                    <h2 className="mt-1 font-bold text-unity-navy">{resource.title}</h2>
                    <p className="mt-2 flex-1 text-sm text-unity-gray">{resource.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-unity-teal group-hover:text-unity-teal-dark">
                      {resource.kind === "quiz" ? "Hacer el quiz" : "Leer la guía"}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
