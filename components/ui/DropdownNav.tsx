"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { NavItem } from "@/lib/content";
import { cn } from "@/lib/utils";

interface DropdownNavProps {
  item: NavItem;
  mobile?: boolean;
  dark?: boolean;
  /** Tamaño del texto del disparador de escritorio. "sm" (por defecto) o "base" para franjas de navegación más grandes. */
  size?: "sm" | "base";
  onNavigate?: () => void;
}

export function DropdownNav({
  item,
  mobile = false,
  dark = false,
  size = "sm",
  onNavigate,
}: DropdownNavProps) {
  const [open, setOpen] = useState(false);

  const linkColor = dark
    ? "text-white hover:text-unity-teal"
    : "text-unity-navy hover:text-unity-teal";
  const triggerSize = size === "base" ? "text-base" : "text-sm";

  if (!item.children) {
    return (
      <a
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "font-medium transition-colors",
          mobile ? "text-sm" : triggerSize,
          linkColor,
          mobile && "block py-2",
        )}
      >
        {item.label}
      </a>
    );
  }

  if (mobile) {
    return (
      <div>
        <button
          type="button"
          className={cn(
            "flex w-full items-center justify-between py-2 text-sm font-medium",
            dark ? "text-white" : "text-unity-navy",
          )}
          onClick={() => setOpen(!open)}
        >
          {item.label}
          <ChevronDown
            className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
          />
        </button>
        {open && (
          <div
            className={cn(
              "ml-4 space-y-1 border-l pl-4",
              dark ? "border-white/20" : "border-unity-navy/10",
            )}
          >
            {item.children.map((child) => (
              <a
                key={child.label}
                href={child.href}
                onClick={onNavigate}
                className={cn(
                  "block py-1.5 text-sm hover:text-unity-teal",
                  dark ? "text-white/70" : "text-unity-gray",
                )}
              >
                {child.label}
              </a>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className={cn(
          "flex items-center gap-1 font-medium transition-colors",
          triggerSize,
          linkColor,
        )}
        aria-expanded={open}
      >
        {item.label}
        <ChevronDown className="h-4 w-4" />
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 min-w-[220px] rounded-2xl border border-unity-navy/10 bg-white py-2 shadow-lg">
          {item.children.map((child) => (
            <a
              key={child.label}
              href={child.href}
              className="block px-4 py-2 text-sm text-unity-navy hover:bg-unity-light hover:text-unity-teal"
            >
              {child.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
