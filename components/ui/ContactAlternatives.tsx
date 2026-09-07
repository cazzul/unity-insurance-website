import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CONTACT } from "@/lib/constants";

// Teléfono y WhatsApp como alternativa a cualquier formulario.
export function ContactAlternatives({ heading }: { heading: string }) {
  return (
    <div className="border-t border-unity-navy/10 pt-4 text-center">
      <p className="text-sm text-unity-gray">{heading}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        <Button
          variant="outline"
          href={CONTACT.phoneHref}
          className="gap-2 whitespace-nowrap px-4 py-2 text-xs"
        >
          <Phone className="h-4 w-4" />
          {CONTACT.phone}
        </Button>
        <Button
          variant="outline"
          href={CONTACT.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="gap-2 whitespace-nowrap px-4 py-2 text-xs"
        >
          <MessageCircle className="h-4 w-4" />
          WhatsApp
        </Button>
      </div>
    </div>
  );
}
