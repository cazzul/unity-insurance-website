import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

// PENDIENTE: sustituir por reseñas reales de clientes, con su permiso
// por escrito (ver PENDIENTES.md). No publicar citas inventadas.
const placeholders = [1, 2, 3];

export function Testimonials() {
  return (
    <section id="testimonios" className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading
          title="Lo que dicen nuestros clientes"
          subtitle="Muy pronto: reseñas reales de clientes de Unity, publicadas con su permiso."
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {placeholders.map((n) => (
            <article
              key={n}
              className="relative rounded-2xl border border-dashed border-unity-navy/20 bg-white p-6"
            >
              <span className="absolute right-4 top-4 rounded-full bg-unity-teal/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-unity-teal-dark">
                Próximamente
              </span>
              <Quote className="h-8 w-8 text-unity-navy/20" aria-hidden />
              <div className="mt-4 space-y-2" aria-hidden>
                <div className="h-3 w-full rounded-full bg-unity-navy/5" />
                <div className="h-3 w-5/6 rounded-full bg-unity-navy/5" />
                <div className="h-3 w-2/3 rounded-full bg-unity-navy/5" />
              </div>
              <div className="mt-6 flex items-center gap-3" aria-hidden>
                <div className="h-10 w-10 rounded-full bg-unity-navy/10" />
                <div className="space-y-1">
                  <div className="h-3 w-24 rounded-full bg-unity-navy/10" />
                  <div className="h-2 w-16 rounded-full bg-unity-navy/5" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
