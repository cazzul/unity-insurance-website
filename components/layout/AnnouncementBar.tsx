"use client";

import { ArrowRight } from "lucide-react";
import { announcement } from "@/lib/content";
import { useQuoteForm } from "@/lib/quote-form-context";

export function AnnouncementBar() {
  const { openConsult } = useQuoteForm();

  return (
    <button
      type="button"
      onClick={() => openConsult()}
      className="flex w-full items-center justify-center gap-3 bg-unity-teal px-4 py-3 text-center transition-colors hover:bg-unity-teal-dark"
    >
      <span className="hidden rounded-full bg-white px-3 py-0.5 text-xs font-bold text-unity-teal-dark sm:inline">
        {announcement.label}
      </span>
      <span className="text-xs font-bold uppercase tracking-wide text-white sm:text-sm">
        {announcement.text}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-white" />
    </button>
  );
}
