// Tipos compartidos de la escena 3D del hero. Sin dependencias de three.js
// aquí (evita jalar el paquete completo a componentes que no lo necesitan).

export interface LogoPoint2D {
  0: number;
  1: number;
}

export interface LogoContour {
  points: [number, number][];
}

export interface LogoShapeData {
  outer: { start: [number, number]; points: [number, number][] };
  holes: LogoContour[];
}

export interface LogoElementData {
  id: "shield" | "unity" | "insurance-group" | "tagline";
  shapes: LogoShapeData[];
}

export interface LogoModel {
  version: number;
  unitsPerPx: number;
  center: [number, number];
  lockup: { center: [number, number]; width: number; height: number };
  shield: { center: [number, number]; width: number; height: number };
  texture: { rect: { x: number; y: number; w: number; h: number } };
  elements: LogoElementData[];
}

export type HeroSceneSupport = "ok" | "no-webgl" | "low-end" | "save-data";
export type HeroSceneQuality = "high" | "low";

export interface HeroSceneOptions {
  canvas: HTMLCanvasElement;
  textureUrl: string;
  quality: HeroSceneQuality;
  onReady?: () => void;
  onFatal?: () => void;
}

export interface HeroSceneHandle {
  dispose: () => void;
  setCaptureMode: (on: boolean) => void;
  getScreenRect: (id: "shield" | "lockup") => { x: number; y: number; width: number; height: number } | null;
  isRunning: () => boolean;
}
