import {
  Camera,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { footerLinks } from "@/lib/content";
import { BRAND, CONTACT, LEGAL } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-unity-navy pb-16 text-white lg:pb-0">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Image
              src="/images/brand/unity-lockup.webp"
              alt="Unity Insurance Group"
              width={2757}
              height={1540}
              className="mb-4 h-12 w-auto brightness-0 invert"
              style={{ width: "auto" }}
            />
            <p className="mt-4 text-sm text-white/70">
              Seguros para individuos, familias y negocios en Puerto Rico. Más
              de {BRAND.yearsExperience} años de experiencia combinada.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a
                  href={CONTACT.phoneHref}
                  className="flex items-center gap-2 hover:text-unity-teal"
                >
                  <Phone className="h-4 w-4" />
                  {CONTACT.phone}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.emailHref}
                  className="flex items-center gap-2 hover:text-unity-teal"
                >
                  <Mail className="h-4 w-4" />
                  {CONTACT.email}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-unity-teal"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-unity-teal"
                >
                  <Camera className="h-4 w-4" />
                  {CONTACT.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={CONTACT.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-unity-teal"
                >
                  <Share2 className="h-4 w-4" />
                  Facebook
                </a>
              </li>
              {LEGAL.direccion && (
                <li className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {LEGAL.direccion}
                </li>
              )}
              {LEGAL.horario && (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  {LEGAL.horario}
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Servicios</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {footerLinks.servicios.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-unity-teal">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-bold">Más</h3>
            <ul className="space-y-2 text-sm text-white/80">
              {footerLinks.recursos.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-unity-teal">
                    {link.label}
                  </a>
                </li>
              ))}
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.href ? (
                    <a href={link.href} className="hover:text-unity-teal">
                      {link.label}
                    </a>
                  ) : (
                    <span className="text-white/50">{link.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 space-y-3 border-t border-white/10 pt-8 text-center text-sm text-white/60">
          <p>{LEGAL.disclaimer}</p>
          {LEGAL.numeroLicencia && (
            <p>
              Licencia de productor {LEGAL.numeroLicencia}
              {LEGAL.jurisdiccion && `, ${LEGAL.jurisdiccion}`}.
            </p>
          )}
          <p>
            © {new Date().getFullYear()} {LEGAL.nombreLegal || BRAND.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
