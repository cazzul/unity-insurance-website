import type { HeroSceneQuality, HeroSceneSupport } from "./types";

// Sin importar three: se evalúa antes de decidir si vale la pena cargar el
// chunk completo de la librería.
export function detectHeroSceneSupport(): HeroSceneSupport {
  if (typeof window === "undefined") return "no-webgl";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };

  if (nav.connection?.saveData) return "save-data";

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ??
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!gl) return "no-webgl";
  } catch {
    return "no-webgl";
  }

  const cores = nav.hardwareConcurrency ?? 4;
  const memory = nav.deviceMemory ?? 4;
  if (cores <= 2 || memory <= 2) return "low-end";

  return "ok";
}

export function qualityTier(width: number): HeroSceneQuality {
  const cores = navigator.hardwareConcurrency ?? 4;
  if (cores <= 4 || width < 768) return "low";
  return "high";
}
