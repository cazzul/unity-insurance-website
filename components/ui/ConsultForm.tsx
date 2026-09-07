"use client";

import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { ContactAlternatives } from "@/components/ui/ContactAlternatives";
import { productFormOptions } from "@/lib/content";
import { LEGAL } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";

const inputClass =
  "h-14 w-full rounded-[10px] border-[1.5px] border-unity-line bg-white px-4 text-base text-unity-ink transition-colors focus:border-unity-teal focus:outline-none";

interface ConsultFormProps {
  onSuccess?: () => void;
}

// Formulario de consulta y orientación. Se usa tanto en la sección fija del
// final de la página (ConsultSection) como dentro del modal (ConsultModal).
// Agente A: marcado, estilos y textos. Agente B: handleSubmit, estados de
// carga y error, y el fetch a /api/leads.
export function ConsultForm({ onSuccess }: ConsultFormProps) {
  const { selectedProduct, setSelectedProduct } = useQuoteForm();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [consent, setConsent] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    email: "",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (
      !formData.nombre.trim() ||
      !formData.telefono.trim() ||
      !selectedProduct ||
      !consent
    ) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: formData.nombre.trim(),
          telefono: formData.telefono.trim(),
          email: formData.email.trim(),
          producto: selectedProduct,
          // HANDOFF: Agente A añadió la casilla de consentimiento del sistema
          // de diseño. La ruta hoy ignora este campo; queda por si el CRM lo usa.
          consentimiento: true,
        }),
      });

      if (!res.ok) throw new Error("Error al enviar");
      setSubmitted(true);
      onSuccess?.();
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col gap-6 py-4">
        <div className="flex flex-col items-center gap-3 pt-4 text-center">
          <CheckCircle2 className="h-12 w-12 text-unity-teal" />
          <p className="font-semibold text-unity-navy">
            Recibimos tus datos. Te llamamos en horario de oficina: {LEGAL.horario}.
          </p>
        </div>
        <ContactAlternatives heading="¿Necesitas ayuda ahora mismo?" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="nombre"
          className="mb-1 block text-sm font-semibold text-unity-navy"
        >
          Nombre
        </label>
        <input
          id="nombre"
          type="text"
          required
          autoComplete="name"
          value={formData.nombre}
          onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
          className={inputClass}
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label
            htmlFor="telefono"
            className="mb-1 block text-sm font-semibold text-unity-navy"
          >
            Teléfono
          </label>
          <input
            id="telefono"
            type="tel"
            required
            inputMode="tel"
            autoComplete="tel"
            pattern="[\d\s+\-\(\)]{7,}"
            title="Escribe un número de teléfono válido, por ejemplo 787-555-1234"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label
            htmlFor="producto"
            className="mb-1 block text-sm font-semibold text-unity-navy"
          >
            Seguro que te interesa
          </label>
          <select
            id="producto"
            required
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className={inputClass}
          >
            <option value="">Elige uno</option>
            {productFormOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-semibold text-unity-navy"
        >
          Correo electrónico{" "}
          <span className="font-normal text-unity-gray">(opcional)</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className={inputClass}
        />
      </div>

      <label className="flex items-start gap-3 text-sm text-unity-gray-mid">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0 accent-unity-teal"
        />
        <span>
          Acepto que Unity me contacte por teléfono o WhatsApp sobre esta
          consulta.
        </span>
      </label>

      {hasError && (
        <div
          role="alert"
          className="flex items-center gap-2 rounded-[10px] bg-[#F6E3E3] px-4 py-3 text-sm text-[#8A2B2B]"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>
            Hubo un error al enviar. Intenta de nuevo o contáctanos
            directamente.
          </span>
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full py-3"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enviando...
          </span>
        ) : (
          "Agenda tu consulta y orientación"
        )}
      </Button>
      <p className="text-center text-xs text-unity-gray">
        Usamos tus datos solo para contactarte. Toda cotización está sujeta a
        elegibilidad y aprobación de la aseguradora.
      </p>
      <ContactAlternatives heading="¿Prefieres llamar?" />
    </form>
  );
}
