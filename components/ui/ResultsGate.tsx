"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { LeadCaptureModal } from "@/components/ui/LeadCaptureModal";
import { useLeadCaptured } from "@/lib/lead-capture";
import { cn } from "@/lib/utils";

interface ResultsGateProps {
  resourceTitle: string;
  children: React.ReactNode;
}

// Envuelve el resultado de un quiz: difuminado y sutil hasta que la persona
// deja su correo. Puede cerrar el pop-up y seguir viendo el difuminado; el
// botón queda para reabrirlo cuando quiera.
export function ResultsGate({ resourceTitle, children }: ResultsGateProps) {
  const alreadyCaptured = useLeadCaptured();
  const [unlockedLocally, setUnlockedLocally] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const unlocked = alreadyCaptured || unlockedLocally;

  return (
    <div className="relative">
      <div
        aria-hidden={!unlocked}
        className={cn(
          "transition-[filter,opacity] duration-500",
          !unlocked && "pointer-events-none select-none blur-[7px] opacity-90",
        )}
      >
        {children}
      </div>

      {!unlocked && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="rounded-2xl bg-white/95 p-6 text-center shadow-xl">
            <p className="font-bold text-unity-navy">Tu resultado está listo</p>
            <p className="mt-1 text-sm text-unity-gray">Déjanos tu nombre y correo para verlo.</p>
            <Button variant="primary" className="mt-4" onClick={() => setModalOpen(true)}>
              Ver mi resultado
            </Button>
          </div>
        </div>
      )}

      <LeadCaptureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        heading="Tu resultado está listo"
        description="Déjanos tu nombre y correo para verlo."
        ctaLabel="Ver mi resultado"
        note={`Lead magnet: ${resourceTitle} (resultado)`}
        onSuccess={() => {
          setUnlockedLocally(true);
          setModalOpen(false);
        }}
      />
    </div>
  );
}
