"use client";

import { MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";

export function MobileActionBar() {
  const { openConsult } = useQuoteForm();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-unity-navy/10 bg-white shadow-[0_-2px_8px_rgba(11,31,58,0.08)] lg:hidden">
      <a
        href={CONTACT.phoneHref}
        className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-bold uppercase tracking-wide text-unity-navy"
      >
        <Phone className="h-5 w-5" aria-hidden />
        Llamar
      </a>
      <a
        href={CONTACT.whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-0.5 border-x border-unity-navy/10 py-2.5 text-xs font-bold uppercase tracking-wide text-unity-navy"
      >
        <MessageCircle className="h-5 w-5" aria-hidden />
        WhatsApp
      </a>
      <button
        type="button"
        onClick={() => openConsult()}
        className="flex flex-col items-center justify-center gap-0.5 bg-unity-teal py-2.5 text-xs font-bold uppercase tracking-wide text-white"
      >
        Consulta
      </button>
    </div>
  );
}
