"use client";

import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { ConsultForm } from "@/components/ui/ConsultForm";
import { useQuoteForm } from "@/lib/quote-form-context";
import { cn } from "@/lib/utils";

// Modal de consulta y orientación. Se monta una vez en el layout raíz y se
// abre desde cualquier botón con intención de contacto (openConsult del
// contexto). Permanece montado y solo cambia de opacidad para poder animar
// la salida; cuando está cerrado no es interactivo ni visible a lectores
// de pantalla.
export function ConsultModal() {
  const { isConsultOpen, closeConsult } = useQuoteForm();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isConsultOpen) return;
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeConsult();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isConsultOpen, closeConsult]);

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center p-4 transition-opacity duration-300",
        isConsultOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!isConsultOpen}
      aria-label="Agenda tu consulta y orientación"
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={closeConsult}
        className="absolute inset-0 bg-unity-navy/60"
      />

      <div
        className={cn(
          "relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300 md:p-8",
          "max-h-[90vh] overflow-y-auto",
          isConsultOpen ? "translate-y-0" : "translate-y-4",
        )}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeConsult}
          aria-label="Cerrar"
          tabIndex={isConsultOpen ? 0 : -1}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-unity-gray transition-colors hover:bg-unity-light hover:text-unity-navy"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6 pr-8">
          <h2 className="text-2xl font-bold tracking-tight text-unity-navy md:text-3xl">
            Agenda tu consulta y orientación
          </h2>
          <p className="mt-2 text-unity-gray">Déjanos tres datos y te llamamos.</p>
        </div>

        <ConsultForm />
      </div>
    </div>
  );
}
