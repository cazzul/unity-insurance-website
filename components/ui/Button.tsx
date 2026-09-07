import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "navy" | "outline" | "ghost" | "white" | "link";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

// Sistema Unity (02 Componentes UI): píldora 999px, Montserrat 700,
// primario teal, hover teal oscuro, foco con anillo teal pálido.
const variants: Record<ButtonVariant, string> = {
  primary: "bg-unity-teal text-white hover:bg-unity-teal-dark",
  navy: "bg-unity-navy text-white hover:bg-unity-navy-mid",
  outline:
    "border-2 border-unity-navy text-unity-navy hover:bg-unity-navy hover:text-white",
  ghost: "border-2 border-white/55 text-white hover:border-white",
  white: "bg-white text-unity-navy hover:bg-[#e7ecf3]",
  link: "rounded-none border-b-2 border-transparent px-1 text-unity-teal hover:border-unity-teal",
};

export function Button({
  variant = "primary",
  className,
  children,
  href,
  target,
  rel,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-7 py-3.5 font-heading text-[15px] font-bold uppercase tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-unity-teal-pale focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-unity-line disabled:text-white",
    variants[variant],
    className,
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} className={classes}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
