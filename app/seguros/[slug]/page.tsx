import { ArrowLeft, CircleCheck, CircleX, Quote } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { Accordion } from "@/components/ui/Accordion";
import { OpenConsultButton } from "@/components/ui/OpenConsultButton";
import { SetSelectedProduct } from "@/components/ui/SetSelectedProduct";
import { products } from "@/lib/content";
import { BRAND } from "@/lib/constants";
import { productDetails } from "@/lib/product-details";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  if (!product) return {};
  return {
    title: `Seguro de ${product.title} en Puerto Rico | ${BRAND.name}`,
    description: productDetails[slug]?.intro ?? product.description,
  };
}

function BulletList({
  items,
  icon: Icon,
  iconClass,
}: {
  items: string[];
  icon: typeof CircleCheck;
  iconClass: string;
}) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-base leading-relaxed text-unity-gray-mid">
          <Icon className={`mt-1 h-5 w-5 shrink-0 ${iconClass}`} strokeWidth={1.75} aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function CommercialLinesList({
  items,
}: {
  items: { name: string; benefit: string }[];
}) {
  return (
    <ul className="space-y-5">
      {items.map((item) => (
        <li key={item.name} className="flex gap-3">
          <CircleCheck
            className="mt-1 h-5 w-5 shrink-0 text-unity-teal"
            strokeWidth={1.75}
            aria-hidden
          />
          <div>
            <p className="text-base font-bold text-unity-navy">{item.name}</p>
            <p className="mt-1 text-base leading-relaxed text-unity-gray-mid">{item.benefit}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="py-12 lg:py-16">
      <div className="mx-auto max-w-3xl px-4 lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-unity-navy md:text-3xl">
          {title}
        </h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.id === slug);
  const detail = productDetails[slug];
  if (!product || !detail) notFound();

  const Icon = product.icon;

  const faqSchema =
    detail.faqs && detail.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: detail.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <SetSelectedProduct productId={product.id} />
      <Header />
      <main id="main-content">
        <section className="bg-unity-navy py-16 text-white lg:py-24">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-unity-teal">
              <Icon className="h-[30px] w-[30px]" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="mt-6 font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal-pale">
              Seguro de {product.title}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-5xl">
              {product.headline ?? product.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              {detail.intro}
            </p>
            <div className="mt-8">
              <OpenConsultButton productId={product.id}>
                Agenda tu consulta y orientación
              </OpenConsultButton>
            </div>
          </div>
        </section>

        {detail.pending && (
          <section className="bg-unity-teal-tint py-6">
            <p className="mx-auto max-w-3xl px-4 text-center text-unity-teal-dark lg:px-8">
              {detail.pending}
            </p>
          </section>
        )}

        {detail.commercialLines && (
          <Block title="Líneas comerciales">
            <CommercialLinesList items={detail.commercialLines} />
          </Block>
        )}

        {detail.covers && (
          <Block title="Qué cubre">
            <BulletList items={detail.covers} icon={CircleCheck} iconClass="text-unity-teal" />
          </Block>
        )}

        {detail.excludes && (
          <div className="bg-unity-light">
            <Block title="Qué no cubre">
              <BulletList items={detail.excludes} icon={CircleX} iconClass="text-unity-navy" />
            </Block>
          </div>
        )}

        <Block title="Quién puede aplicar">
          <BulletList
            items={detail.whoCanApply}
            icon={CircleCheck}
            iconClass="text-unity-navy"
          />
        </Block>

        {detail.faqs && (
          <div className="bg-unity-light">
            <Block title="Preguntas frecuentes de este seguro">
              <Accordion items={detail.faqs} />
            </Block>
          </div>
        )}

        {detail.caseStudy && (
          <Block title="Caso ilustrativo">
            <figure className="relative overflow-hidden rounded-2xl bg-unity-navy p-8 text-white lg:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -left-[10%] -right-[10%] -top-24 h-56 bg-unity-teal arc-bottom"
              />
              <div className="relative">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-unity-navy">
                  <Quote className="h-6 w-6" strokeWidth={1.75} aria-hidden />
                </span>
                <h3 className="mt-24 text-2xl font-bold leading-snug">{detail.caseStudy.title}</h3>
                <div className="mt-4 space-y-4 text-white/85">
                  {detail.caseStudy.paragraphs.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                <figcaption className="mt-6 border-l-2 border-unity-teal-pale pl-4 font-semibold text-unity-teal-pale">
                  {detail.caseStudy.lesson}
                </figcaption>
              </div>
            </figure>
            <p className="mt-4 text-sm text-unity-gray">
              Caso ilustrativo. Las cifras son un ejemplo; cada póliza define
              sus límites, deducibles y exclusiones.
            </p>
          </Block>
        )}

        <ConsultSection />

        <div className="bg-white py-10 text-center">
          <Link
            href="/#servicios"
            className="inline-flex items-center gap-2 font-semibold text-unity-teal hover:text-unity-teal-dark"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Ver todos los seguros
          </Link>
        </div>
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
