import { Accordion } from "@/components/ui/Accordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { faqItems } from "@/lib/content";

export function FAQ() {
  return (
    <section id="faq" className="scroll-mt-24 lg:scroll-mt-[150px] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <SectionHeading
          title="Preguntas frecuentes"
          subtitle="Respuestas claras para que tomes decisiones con tranquilidad."
        />
        <Accordion items={faqItems} />
      </div>
    </section>
  );
}
