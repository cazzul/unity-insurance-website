"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { HeroScene } from "./HeroScene";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(callback: () => void) {
  const mql = window.matchMedia(REDUCED_MOTION_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Lee la preferencia del sistema de forma segura en servidor (la escena 3D
// no se monta hasta confirmar en cliente que el usuario no la pidió).
function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

interface HeroBackdropProps {
  poster: string;
  posterMobile: string;
  textureUrl: string;
}

// Fondo de pantalla completa del hero: el poster (next/image) siempre
// debajo, y encima la escena 3D del logo (WebGL, HeroScene) con fundido de
// entrada cuando está lista. Sin logo flotante ni fotos: la escena ya es
// la pieza de marca. Un degradado inferior ancla el texto y los botones.
export function HeroBackdrop({ poster, posterMobile, textureUrl }: HeroBackdropProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-unity-navy">
      <div className="relative hidden h-full w-full md:block">
        <Image src={poster} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="relative block h-full w-full md:hidden">
        <Image src={posterMobile} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>

      {!prefersReducedMotion && <HeroScene textureUrl={textureUrl} />}

      <div className="hero-scrim absolute inset-0" />
    </div>
  );
}
