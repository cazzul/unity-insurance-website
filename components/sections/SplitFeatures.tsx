"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { splitFeatures } from "@/lib/content";
import { CONTACT } from "@/lib/constants";
import { useQuoteForm } from "@/lib/quote-form-context";
import { cn } from "@/lib/utils";

export function SplitFeatures() {
  const { scrollToQuoteForm } = useQuoteForm();

  return (
    <section className="bg-unity-light py-20 lg:py-28">
      <div className="mx-auto max-w-7xl space-y-16 px-4 lg:px-8">
        {splitFeatures.map((feature) => (
          <div
            key={feature.title}
            className={cn(
              "grid items-center gap-10 lg:grid-cols-2",
              feature.imagePosition === "right" && "lg:[&>*:first-child]:order-2",
            )}
          >
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl shadow-lg">
              <Image
                src={feature.image}
                alt={feature.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-unity-navy md:text-3xl">
                {feature.title}
              </h3>
              <p className="mt-4 text-unity-gray">{feature.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="primary" onClick={() => scrollToQuoteForm()}>
                  {feature.ctaPrimary}
                </Button>
                <Button variant="outline" href={CONTACT.phoneHref}>
                  {feature.ctaSecondary}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
