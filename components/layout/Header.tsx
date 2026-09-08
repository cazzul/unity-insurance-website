"use client";

import { Menu, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { DropdownNav } from "@/components/ui/DropdownNav";
import { navItems } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";

// Header compacto de una sola franja blanca (logo a color a la izquierda,
// nav + botones a la derecha). El lockup a color (unity-lockup.svg) lleva
// el texto "Unity Insurance Group" en navy/gris — solo se lee bien sobre
// fondo claro, por eso el header es blanco y no navy. En móvil el logo y
// el botón de consulta quedan en la barra, con el menú de siempre en un
// panel desplegable.
export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openConsult } = useQuoteForm();

  return (
    <header className="sticky top-0 z-50 border-b border-unity-line bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/images/brand/unity-lockup.svg"
            alt="Unity Insurance Group"
            width={2752}
            height={1538}
            className="h-9 max-h-[44px] w-auto object-contain md:h-10"
            style={{ width: "auto" }}
            priority
          />
        </Link>

        <nav className="hidden items-center lg:flex">
          {navItems.map((item) => (
            <div key={item.label} className="whitespace-nowrap px-2.5 py-2 xl:px-3">
              <DropdownNav item={item} size="sm" />
            </div>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex xl:gap-3">
          <Button
            variant="outline"
            href={CONTACT.phoneHref}
            className="!px-5 !py-3 !text-xs gap-2 whitespace-nowrap xl:!px-7 xl:!py-3.5 xl:!text-[15px]"
          >
            <Phone className="h-4 w-4" />
            Llámanos
          </Button>
          <Button
            variant="primary"
            className="!px-5 !py-3 !text-xs whitespace-nowrap xl:!px-7 xl:!py-3.5 xl:!text-[15px]"
            onClick={() => openConsult()}
          >
            Consulta y orientación
          </Button>
        </div>

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
              Llámanos
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
