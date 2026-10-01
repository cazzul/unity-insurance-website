"use client";

import { ProductCard } from "@/components/ui/ProductCard";
import { products } from "@/lib/content";

export function ProductGrid() {
  return (
    <section id="servicios" className="scroll-mt-24 lg:scroll-mt-[150px] bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-unity-navy md:text-4xl">
            Protección <span className="text-unity-teal">para lo que importa</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-unity-gray">
            Elige lo que quieres proteger.
          </p>
        </div>

        {/* flex-wrap centrado: la última tarjeta queda al centro cuando sobra una. */}
        <div className="flex flex-wrap justify-center gap-6">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="flex w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] [&>article]:flex-1"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
