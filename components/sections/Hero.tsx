"use client";

import { Button } from "@/components/ui/Button";
import { heroContent, insurers } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";
import { HeroBackdrop } from "./HeroBackdrop";

// Marca primero: una escena 3D del logo de Unity cubre todo el hero
// (HeroBackdrop, capa absoluta) y el nombre, el eslogan y la acción se
// anclan abajo, sobre un degradado, para no pisar el logo.
export function Hero() {
  const { openConsult } = useQuoteForm();

  return (
    <section id="inicio" className="relative isolate overflow-hidden">
      <HeroBackdrop
        poster={heroContent.poster}
        posterMobile={heroContent.posterMobile}
        textureUrl={heroContent.scene.texture}
      />

      <div className="relative z-10 mx-auto flex min-h-[680px] max-w-7xl flex-col justify-end px-4 pb-10 pt-24 sm:min-h-[700px] md:min-h-[720px] lg:min-h-[760px] lg:px-8 lg:pb-16 lg:pt-40 xl:min-h-[820px]">
        <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-6xl">
          {heroContent.headline}
        </h1>
        <p className="mt-4 max-w-md font-sans text-xl italic leading-snug text-unity-teal-pale md:text-2xl">
          {heroContent.tagline}
        </p>
        <p className="mt-3 max-w-xl text-lg text-white/85">
          {heroContent.subtitle.replace("{n}", String(insurers.length))}
        </p>
        <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row">
          <Button
            variant="primary"
            className="px-10 py-4 text-base shadow-lg shadow-unity-teal/30"
            onClick={() => openConsult()}
          >
            {heroContent.cta}
          </Button>
          <Button variant="ghost" href={CONTACT.phoneHref} className="px-8 py-4 text-base">
            {heroContent.ctaSecondary}
          </Button>
        </div>
      </div>
    </section>
  );
}
