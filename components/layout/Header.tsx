"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropdownNav } from "@/components/ui/DropdownNav";
import { navItems, type NavItem } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";

// En escritorio, "Servicios" se despliega en sus 6 enlaces sueltos (Hogar,
// Comercial, Auto...) directo en la franja, en vez de un dropdown — mismos
// destinos que hoy, solo cambia la presentación. El menú móvil sigue
// usando `navItems` tal cual (con "Servicios" como acordeón): ahí sí
// conviene agrupar, hay menos espacio.
const desktopNavItems: NavItem[] = navItems.flatMap((item) =>
  item.children ? item.children.map((child): NavItem => child) : [item],
);

// Header en dos niveles: fila blanca con el logo a la izquierda, y debajo
// una franja navy de ancho completo con el menú, el teléfono y el CTA
// (solo en escritorio). En móvil, el logo y el CTA quedan en la fila
// superior, con el menú de siempre en un panel desplegable.
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openConsult } = useQuoteForm();

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="border-b border-unity-line lg:border-b-0">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/images/brand/unity-logo-notag.png"
              alt="Unity Insurance Group"
              width={881}
              height={288}
              className="h-9 max-h-[44px] w-auto object-contain md:h-11"
              style={{ width: "auto" }}
              priority
            />
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <Button
              variant="primary"
              className="px-4 py-2 text-xs"
              onClick={() => openConsult()}
            >
              Consulta
            </Button>
            <button
              type="button"
              className="rounded-2xl p-2 text-unity-navy"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Franja de navegación: ancho completo, navy, solo escritorio. Contenedor
          más ancho que el resto del sitio (no max-w-7xl): con 11 enlaces
          sueltos más grandes, hace falta el espacio extra para que nada
          parta en dos líneas. `whitespace-nowrap` es la red de seguridad
          en cualquier ancho más angosto. */}
      <div className="hidden bg-unity-navy lg:block">
        <div className="mx-auto flex max-w-[1680px] items-center justify-between px-2 lg:px-6">
          <nav className="flex shrink-0 items-center">
            {desktopNavItems.map((item) => (
              <div
                key={item.label}
                className="whitespace-nowrap px-2.5 py-3.5 transition-colors hover:bg-unity-navy-mid"
              >
                <DropdownNav item={item} dark size="base" />
              </div>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-4 py-2.5 pl-4">
            <a
              href={CONTACT.phoneHref}
              className="flex items-center gap-2 whitespace-nowrap text-base font-medium text-white/90 transition-colors hover:text-white"
            >
              <Phone className="h-5 w-5" />
              {CONTACT.phone}
            </a>
            <Button
              variant="primary"
              className="!whitespace-nowrap !px-8 !py-3.5 !text-base"
              onClick={() => openConsult()}
            >
              Consulta y orientación
            </Button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-unity-line bg-white px-4 py-4 lg:hidden">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <DropdownNav
                key={item.label}
                item={item}
                mobile
                onNavigate={() => setMobileOpen(false)}
              />
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <Button variant="outline" href={CONTACT.phoneHref} className="w-full gap-2">
              <Phone className="h-4 w-4" />
              Llama ahora
            </Button>
            <Button
              variant="primary"
              className="w-full"
              onClick={() => {
                openConsult();
                setMobileOpen(false);
              }}
            >
              Consulta y orientación
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
