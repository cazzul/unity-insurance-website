import { Clock, Mail, MessageCircle, Phone } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CONTACT, LEGAL } from "@/lib/constants";
import { cn } from "@/lib/utils";

const channels = [
  {
    title: "Llámanos",
    value: CONTACT.phone,
    href: CONTACT.phoneHref,
    icon: Phone,
    external: false,
  },
  {
    title: "WhatsApp",
    value: "Escríbenos ahora",
    href: CONTACT.whatsappHref,
    icon: MessageCircle,
    external: true,
  },
  {
    title: "Correo",
    value: CONTACT.email,
    href: CONTACT.emailHref,
    icon: Mail,
    external: false,
  },
];

// Contacto directo: teléfono, WhatsApp, correo y horario.
export function ContactSection() {
  return (
    <section id="contacto" className="scroll-mt-24 lg:scroll-mt-[150px] bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <SectionHeading title="Contacto directo" />

        <ul className="grid gap-6 md:grid-cols-3">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <li key={channel.title}>
                <a
                  href={channel.href}
                  target={channel.external ? "_blank" : undefined}
                  rel={channel.external ? "noopener noreferrer" : undefined}
                  className="flex h-full flex-col items-center rounded-2xl border border-unity-navy/10 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-md"
                >
                  <span
                    className={cn(
                      "flex h-14 w-14 items-center justify-center rounded-full text-white",
                      index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal",
                    )}
                  >
                    <Icon className="h-7 w-7" strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="mt-4 font-heading text-base font-bold text-unity-navy">
                    {channel.title}
                  </span>
                  <span className="mt-1 break-all text-unity-teal">{channel.value}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {LEGAL.horario && (
          <p className="mt-8 flex items-center justify-center gap-2 text-unity-gray-mid">
            <Clock className="h-5 w-5 text-unity-teal" strokeWidth={1.75} aria-hidden />
            Horario: {LEGAL.horario}
          </p>
        )}
      </div>
    </section>
  );
}
