// Utilidades de animación puras (sin three.js): easing tipo CSS
// cubic-bezier y una pequeña línea de tiempo de entrada por elemento.

// Resuelve y(t) de un cubic-bezier(x1,y1,x2,y2) para x = progreso lineal
// [0,1], igual que hace el navegador con transition-timing-function.
// Newton-Raphson, 6 iteraciones (suficiente para esta curva).
export function cubicBezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(t: number) {
    return ((ax * t + bx) * t + cx) * t;
  }
  function sampleCurveY(t: number) {
    return ((ay * t + by) * t + cy) * t;
  }
  function sampleCurveDerivativeX(t: number) {
    return (3 * ax * t + 2 * bx) * t + cx;
  }

  function solveCurveX(x: number) {
    let t = x;
    for (let i = 0; i < 6; i++) {
      const x2t = sampleCurveX(t) - x;
      const d = sampleCurveDerivativeX(t);
      if (Math.abs(d) < 1e-6) break;
      t -= x2t / d;
    }
    return t;
  }

  return (x: number) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    return sampleCurveY(solveCurveX(x));
  };
}

// Suavizado independiente del framerate (equivalente a un lerp exponencial).
export function damp(current: number, target: number, lambda: number, dt: number) {
  return target + (current - target) * Math.exp(-lambda * dt);
}

export function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

interface EntryStep {
  id: string;
  delayMs: number;
  durationMs: number;
}

// Progreso [0,1] por elemento, con retardo y easing tipo
// cubic-bezier(.22,.68,0,1.2) (mismo patrón que unity_video_final.html).
export class EntryTimeline {
  private steps: Map<string, EntryStep> = new Map();
  private ease = cubicBezier(0.22, 0.68, 0, 1.2);
  private startedAt: number | null = null;

  constructor(steps: EntryStep[]) {
    for (const s of steps) this.steps.set(s.id, s);
  }

  start(nowMs: number) {
    this.startedAt = nowMs;
  }

  // 0 = no iniciado o antes del delay; 1 = terminado. Puede superar
  // levemente 1 momentáneamente por el overshoot de la curva (se usa tal
  // cual: el overshoot es el "asentamiento" visual buscado).
  progress(id: string, nowMs: number): number {
    if (this.startedAt === null) return 0;
    const step = this.steps.get(id);
    if (!step) return 1;
    const elapsed = nowMs - this.startedAt - step.delayMs;
    if (elapsed <= 0) return 0;
    if (elapsed >= step.durationMs) return 1;
    return this.ease(elapsed / step.durationMs);
  }

  isComplete(nowMs: number): boolean {
    if (this.startedAt === null) return false;
    for (const step of this.steps.values()) {
      if (nowMs - this.startedAt - step.delayMs < step.durationMs) return false;
    }
    return true;
  }
}
