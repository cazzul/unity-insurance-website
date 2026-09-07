import { useSyncExternalStore } from "react";

// Estado de captura de leads en Recursos, en sessionStorage (por pestaña,
// no persiste entre sesiones). Una vez capturado en cualquier recurso, se
// desbloquean los resultados de los quizzes en el resto de la sesión.

const LEAD_KEY = "unity_lead_captured";
const PROMPT_PREFIX = "unity_prompted_";

function read(key: string): boolean {
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function write(key: string) {
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // sessionStorage puede fallar en privado/incógnito: se pide de nuevo, sin romper la página.
  }
}

export function hasLeadCaptured(): boolean {
  return read(LEAD_KEY);
}

export function markLeadCaptured(): void {
  write(LEAD_KEY);
}

// Para disparadores automáticos (scroll/tiempo): que aparezcan una sola vez
// por sesión, sin importar si el visitante completó el formulario o lo cerró.
export function wasPrompted(triggerKey: string): boolean {
  return read(PROMPT_PREFIX + triggerKey);
}

export function markPrompted(triggerKey: string): void {
  write(PROMPT_PREFIX + triggerKey);
}

// No hace falta reaccionar a cambios después de montar: el propio
// `onSuccess` del formulario actualiza el estado local del componente que
// desbloquea. `useSyncExternalStore` solo se usa para leer sessionStorage
// una vez, de forma segura en servidor (getServerSnapshot) e hidratación.
const noSubscription = () => () => {};

export function useLeadCaptured(): boolean {
  return useSyncExternalStore(noSubscription, hasLeadCaptured, () => false);
}
