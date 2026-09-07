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

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
