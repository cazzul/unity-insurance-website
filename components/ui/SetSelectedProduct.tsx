"use client";

import { useEffect } from "react";
import { useQuoteForm } from "@/lib/quote-form-context";

// Fija el producto seleccionado del contexto global al montar una página de
// producto, sin crear un QuoteFormProvider anidado (el modal de consulta
// vive una sola vez en el layout raíz y lee del contexto de más arriba).
export function SetSelectedProduct({ productId }: { productId: string }) {
  const { setSelectedProduct } = useQuoteForm();
  useEffect(() => {
    setSelectedProduct(productId);
  }, [productId, setSelectedProduct]);
  return null;
}
