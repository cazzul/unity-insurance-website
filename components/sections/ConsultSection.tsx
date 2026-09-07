import { ConsultForm } from "@/components/ui/ConsultForm";
import { CONSULT_FORM_ID } from "@/lib/quote-form-context";

// Última sección antes del footer: la conclusión natural de la página, no
// el segundo bloque. El modal (ConsultModal) es la vía rápida desde
// cualquier CTA con intención de contacto en el resto del sitio.
export function ConsultSection() {
  return (
    <section
      id={CONSULT_FORM_ID}
      className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-navy py-20 lg:py-28"
    >
      <div className="mx-auto max-w-xl px-4 lg:px-8">
        <div className="mb-8 text-center text-white">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            Agenda tu consulta y orientación
          </h2>
          <p className="mt-3 text-white/80">Déjanos tres datos y te llamamos.</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
          <ConsultForm />
        </div>
      </div>
    </section>
  );
}
