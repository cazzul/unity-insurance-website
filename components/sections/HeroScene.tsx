"use client";

import { useEffect, useRef } from "react";
import { detectHeroSceneSupport, qualityTier } from "@/lib/hero-scene/capabilities";
import type { HeroSceneHandle } from "@/lib/hero-scene/types";

declare global {
  interface Window {
    __unityHero?: HeroSceneHandle;
  }
}

function whenIdle(): Promise<void> {
  return new Promise((resolve) => {
    const fire = () => {
      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => void })
        .requestIdleCallback;
      if (ric) ric(() => resolve(), { timeout: 1200 });
      else setTimeout(resolve, 300);
    };
    if (document.readyState === "complete") fire();
    else window.addEventListener("load", fire, { once: true });
  });
}

interface HeroSceneProps {
  textureUrl: string;
}

// Escena 3D del hero (logo de Unity en un ambiente, WebGL): carga en
// diferido tras el evento load + idle, nunca antes del LCP. El poster
// (en HeroBackdrop) sigue debajo hasta que el canvas está listo.
export function HeroScene({ textureUrl }: HeroSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let handle: HeroSceneHandle | undefined;

    async function boot() {
      await whenIdle();
      if (cancelled) return;

      const support = detectHeroSceneSupport();
      if (support !== "ok") return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      try {
        const { createHeroScene } = await import("@/lib/hero-scene/create-hero-scene");
        if (cancelled) return;

        const quality = qualityTier(window.innerWidth);
        handle = await createHeroScene({
          canvas,
          textureUrl,
          quality,
          onReady: () => {
            if (cancelled) return;
            canvas.classList.add("is-ready");
          },
          onFatal: () => {
            canvas.classList.remove("is-ready");
          },
        });

        if (cancelled) {
          handle.dispose();
          return;
        }

        if (process.env.NODE_ENV !== "production") {
          window.__unityHero = handle;
        }
      } catch (err) {
        if (process.env.NODE_ENV !== "production") {
          console.error("[HeroScene] no se pudo iniciar la escena 3D:", err);
        }
        canvas.classList.remove("is-ready");
      }
    }

    boot();

    return () => {
      cancelled = true;
      handle?.dispose();
      if (process.env.NODE_ENV !== "production" && window.__unityHero === handle) {
        window.__unityHero = undefined;
      }
    };
  }, [textureUrl]);

  return <canvas ref={canvasRef} aria-hidden className="hero-scene-canvas absolute inset-0 h-full w-full" />;
}
