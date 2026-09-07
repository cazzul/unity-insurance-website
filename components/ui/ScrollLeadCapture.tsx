"use client";

import { useEffect, useState } from "react";
import { LeadCaptureModal } from "@/components/ui/LeadCaptureModal";
import { hasLeadCaptured, markPrompted, wasPrompted } from "@/lib/lead-capture";

const TRIGGER_KEY = "scroll-time";
const TIME_MS = 45000;
const SCROLL_PCT = 60;

interface ScrollLeadCaptureProps {
  heading: string;
  description: string;
  ctaLabel?: string;
  note: string;
  redirectTo?: string;
}

// Pop-up de captura por tiempo en página o por scroll: aparece a los 45s o
// al 60% de scroll (lo que ocurra primero), una sola vez por sesión. El
// contenido de la página se lee completo, sin puerta previa.
export function ScrollLeadCapture({
  heading,
  description,
  ctaLabel = "Quiero recibirla",
  note,
  redirectTo,
}: ScrollLeadCaptureProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (hasLeadCaptured() || wasPrompted(TRIGGER_KEY)) return;
    let fired = false;

    function fire() {
      if (fired) return;
      fired = true;
      markPrompted(TRIGGER_KEY);
      setOpen(true);
      cleanup();
    }

    function onScroll() {
      const scrollable = document.body.scrollHeight - window.innerHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 100;
      if (pct >= SCROLL_PCT) fire();
    }

    const timer = window.setTimeout(fire, TIME_MS);
    window.addEventListener("scroll", onScroll, { passive: true });

    function cleanup() {
      window.clearTimeout(timer);
      window.removeEventListener("scroll", onScroll);
    }
    return cleanup;
  }, []);

  return (
    <LeadCaptureModal
      open={open}
      onClose={() => setOpen(false)}
      heading={heading}
      description={description}
      ctaLabel={ctaLabel}
      note={note}
      redirectTo={redirectTo}
      onSuccess={() => setOpen(false)}
    />
  );
}
