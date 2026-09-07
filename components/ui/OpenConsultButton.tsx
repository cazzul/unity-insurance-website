"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { useQuoteForm } from "@/lib/quote-form-context";

interface OpenConsultButtonProps {
  productId?: string;
  variant?: "primary" | "navy" | "outline" | "ghost" | "white" | "link";
  className?: string;
  children: ReactNode;
}

// Abre el modal de consulta y orientación. Reemplaza los enlaces `href="#consulta"`
// en páginas servidor (páginas de producto y de recursos) que no pueden usar
// useQuoteForm directamente.
export function OpenConsultButton({
  productId,
  variant = "primary",
  className,
  children,
}: OpenConsultButtonProps) {
  const { openConsult } = useQuoteForm();
  return (
    <Button variant={variant} className={className} onClick={() => openConsult(productId)}>
      {children}
    </Button>
  );
}
