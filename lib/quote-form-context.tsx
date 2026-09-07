"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Ancla del formulario de consulta y orientación al final de la página
// (ConsultSection). El modal (ConsultModal) es la vía principal desde
// cualquier botón con intención de contacto.
export const CONSULT_FORM_ID = "consulta";

interface QuoteFormContextValue {
  selectedProduct: string;
  setSelectedProduct: (id: string) => void;
  /** @deprecated usar openConsult(); se conserva para anclas puntuales (menú, footer). */
  scrollToQuoteForm: (productId?: string) => void;
  isConsultOpen: boolean;
  openConsult: (productId?: string) => void;
  closeConsult: () => void;
}

const QuoteFormContext = createContext<QuoteFormContextValue | null>(null);

export function QuoteFormProvider({
  children,
  initialProduct = "",
}: {
  children: ReactNode;
  // Las páginas de producto envuelven su contenido con el producto fijado.
  initialProduct?: string;
}) {
  const [selectedProduct, setSelectedProduct] = useState(initialProduct);
  const [isConsultOpen, setIsConsultOpen] = useState(false);
  const router = useRouter();

  const openConsult = useCallback((productId?: string) => {
    if (productId) setSelectedProduct(productId);
    setIsConsultOpen(true);
  }, []);

  const closeConsult = useCallback(() => setIsConsultOpen(false), []);

  const scrollToQuoteForm = useCallback(
    (productId?: string) => {
      if (productId) {
        setSelectedProduct(productId);
      }
      const el = document.getElementById(CONSULT_FORM_ID);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        // Páginas sin formulario (por ejemplo /nosotros): ir al del home.
        router.push(`/#${CONSULT_FORM_ID}`);
      }
    },
    [router],
  );

  // El modal bloquea el scroll del body mientras está abierto.
  useEffect(() => {
    if (!isConsultOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isConsultOpen]);

  const value = useMemo(
    () => ({
      selectedProduct,
      setSelectedProduct,
      scrollToQuoteForm,
      isConsultOpen,
      openConsult,
      closeConsult,
    }),
    [selectedProduct, scrollToQuoteForm, isConsultOpen, openConsult, closeConsult],
  );

  return (
    <QuoteFormContext.Provider value={value}>{children}</QuoteFormContext.Provider>
  );
}

export function useQuoteForm() {
  const ctx = useContext(QuoteFormContext);
  if (!ctx) {
    throw new Error("useQuoteForm must be used within QuoteFormProvider");
  }
  return ctx;
}
