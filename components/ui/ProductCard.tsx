"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Product } from "@/lib/content";
import { useQuoteForm } from "@/lib/quote-form-context";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ProductCardProps {
  product: Product;
  index: number;
}

export function ProductCard({ product, index }: ProductCardProps) {
  const { openConsult } = useQuoteForm();
  const Icon = product.icon;
  // Iconografía Unity: círculo lleno, alternando navy y teal para dar ritmo a la fila.
  const circle = index % 2 === 0 ? "bg-unity-navy" : "bg-unity-teal";

  return (
    <article className="flex flex-col rounded-2xl bg-white p-8 text-center shadow-[0_2px_14px_rgba(11,37,73,0.07)] transition-[transform,box-shadow] duration-200 hover:-translate-y-[3px] hover:shadow-[0_10px_28px_rgba(11,37,73,0.12)]">
      <span className="mx-auto rounded-full bg-unity-teal-tint px-4 py-1.5 font-heading text-[11px] font-bold uppercase tracking-[0.12em] text-unity-teal-dark">
        {product.badge}
      </span>
      <div
        className={cn(
          "mx-auto mt-6 flex h-16 w-16 items-center justify-center rounded-full text-white",
          circle,
        )}
      >
        <Icon className="h-[30px] w-[30px]" strokeWidth={1.75} aria-hidden />
      </div>
      <h3 className="mt-5 text-[22px] font-bold leading-tight text-unity-navy">
        {product.title}
      </h3>
      <p className="mt-3 flex-1 text-base leading-relaxed text-unity-gray-mid">
        {product.description}
      </p>
      <Button
        variant="primary"
        className="mt-6 w-full"
        onClick={() => openConsult(product.id)}
      >
        Consulta y orientación
      </Button>
      <Link
        href={`/seguros/${product.id}`}
        className="mt-4 inline-flex items-center justify-center gap-1 text-sm font-semibold text-unity-teal hover:text-unity-teal-dark"
      >
        Ver qué cubre
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </article>
  );
}
