import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";
import { talentContent } from "@/lib/content";

// Botón de reclutamiento: enlace directo a WhatsApp con el mensaje ya escrito
// (sin formulario). Abre en pestaña nueva.
export function TalentWhatsAppButton() {
  return (
    <Button
      variant="primary"
      href={CONTACT.whatsappTalentHref}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full gap-2 sm:w-auto"
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      {talentContent.cta}
    </Button>
  );
}
