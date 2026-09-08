"use client";

import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { markLeadCaptured } from "@/lib/lead-capture";
import { cn } from "@/lib/utils";

const inputClass =
  "h-12 w-full rounded-[10px] border-[1.5px] border-unity-line bg-white px-4 text-base text-unity-ink transition-colors focus:border-unity-teal focus:outline-none";

interface LeadCaptureModalProps {
  open: boolean;
  onClose: () => void;
  heading: string;
  description: string;
  ctaLabel: string;
  /** Qué se guarda en el campo Notas del lead (ej. "Lead magnet: Quiz huracán"). */
  note: string;
  onSuccess?: () => void;
  /** Si se da, navega aquí al enviar en vez de mostrar el mensaje de gracias. */
  redirectTo?: string;
}

// Pop-up de captura de correo para Recursos: desbloquea el resultado de un
// quiz o pide el correo tras leer una guía. Solo nombre y correo (sin
// teléfono): es una oferta de contenido, no una solicitud de consulta.
export function LeadCaptureModal({
  open,
  onClose,
  heading,
  description,
  ctaLabel,
  note,
  onSuccess,
  redirectTo,
}: LeadCaptureModalProps) {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeButtonRef.current?.focus();
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !email.trim()) return;

    setIsLoading(true);
    setHasError(false);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          notas: note,
        }),
      });
      if (!res.ok) throw new Error("Error al enviar");
      markLeadCaptured();
      onSuccess?.();
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        setSubmitted(true);
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={cn(
        "fixed inset-0 z-[999] flex items-center justify-center p-4 transition-opacity duration-300",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label={heading}
    >
      <button
        type="button"
        aria-label="Cerrar"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 bg-unity-navy/60"
      />

      <div
        className={cn(
          "relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300",
          open ? "translate-y-0" : "translate-y-4",
        )}
      >
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          tabIndex={open ? 0 : -1}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-unity-gray transition-colors hover:bg-unity-light hover:text-unity-navy"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="flex flex-col items-center gap-3 py-4 text-center">
            <CheckCircle2 className="h-12 w-12 text-unity-teal" />
            <p className="font-semibold text-unity-navy">¡Gracias, {nombre.split(" ")[0]}!</p>
            <p className="text-sm text-unity-gray">Te escribiremos a {email}.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 pr-8">
              <h2 className="text-xl font-bold tracking-tight text-unity-navy">{heading}</h2>
              <p className="mt-2 text-sm text-unity-gray">{description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label htmlFor="lc-nombre" className="mb-1 block text-sm font-semibold text-unity-navy">
                  Nombre
                </label>
                <input
                  id="lc-nombre"
                  type="text"
                  required
                  autoComplete="name"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="lc-email" className="mb-1 block text-sm font-semibold text-unity-navy">
                  Correo electrónico
                </label>
                <input
                  id="lc-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>

              {hasError && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-[10px] bg-[#F6E3E3] px-4 py-3 text-sm text-[#8A2B2B]"
                >
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Hubo un error al enviar. Intenta de nuevo.</span>
                </div>
              )}

              <Button type="submit" variant="primary" className="w-full py-3" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Enviando...
                  </span>
                ) : (
                  ctaLabel
                )}
              </Button>
              <p className="text-center text-xs text-unity-gray">
                También recibirás consejos de Unity. Puedes darte de baja cuando quieras.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
