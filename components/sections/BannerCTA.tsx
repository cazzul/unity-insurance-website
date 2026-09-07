"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useQuoteForm } from "@/lib/quote-form-context";

// Composición "arco vertical" del sistema Unity: texto del lado plano,
// foto del lado de la curva, filete teal sobre el borde del arco.
export function BannerCTA() {
  const { openConsult } = useQuoteForm();

  return (
    <section className="relative overflow-hidden bg-brand-gradient">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[59%] bg-unity-teal arc-right lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 hidden w-[calc(59%-3px)] bg-unity-light arc-right lg:block"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div className="rounded-2xl bg-unity-light p-8 lg:bg-transparent lg:p-0 lg:pr-20">
          <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-unity-navy md:text-4xl">
            Agenda tu consulta y orientación hoy
          </h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-unity-gray-mid">
            Revisamos tu póliza contigo antes de que llegue una emergencia.
          </p>
          <div className="mt-8">
            <Button variant="primary" onClick={() => openConsult()}>
              Agenda tu consulta y orientación
            </Button>
          </div>
        </div>

        <div className="relative h-64 overflow-hidden rounded-2xl shadow-2xl lg:h-80">
          <Image
            src="/images/lifestyle/mayor-con-agente.webp"
            alt="Señora conversando con un agente joven en el balcón de su casa"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
