import { CircleCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { Accordion } from "@/components/ui/Accordion";
import { OpenConsultButton } from "@/components/ui/OpenConsultButton";
import { ResourceQuiz } from "@/components/ui/ResourceQuiz";
import { ScrollLeadCapture } from "@/components/ui/ScrollLeadCapture";
import { BRAND } from "@/lib/constants";
import { getResource, resources } from "@/lib/resources";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) return {};
  return {
    title: `${resource.title} | ${BRAND.name}`,
    description: resource.description,
  };
}

export default async function ResourcePage({ params }: Props) {
  const { slug } = await params;
  const resource = getResource(slug);
  if (!resource) notFound();

  const Icon = resource.icon;

  return (
    <>
      <Header />
      <main id="main-content">
        <section className="bg-unity-navy py-14 text-white lg:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-unity-teal">
              <Icon className="h-[30px] w-[30px]" strokeWidth={1.75} aria-hidden />
            </span>
            <p className="mt-6 font-heading text-[13px] font-bold uppercase tracking-[0.2em] text-unity-teal-pale">
              Recurso gratis{resource.pending ? " · De prueba" : ""}
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight md:text-4xl">
              {resource.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
              {resource.intro}
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            {resource.kind === "quiz" && resource.quiz && resource.quizResults && (
              <ResourceQuiz
                resourceTitle={resource.title}
                questions={resource.quiz}
                results={resource.quizResults}
                productId="hogar"
              />
            )}

            {resource.kind === "guide" && resource.comparison && (
              <div className="overflow-x-auto rounded-2xl border border-unity-navy/10">
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-unity-navy text-white">
                      <th scope="col" className="px-4 py-3 font-heading text-[12px] uppercase tracking-[0.12em]">
                        Cubierta
                      </th>
                      <th scope="col" className="px-4 py-3 font-heading text-[12px] uppercase tracking-[0.12em]">
                        Compulsorio
                      </th>
                      <th scope="col" className="px-4 py-3 font-heading text-[12px] uppercase tracking-[0.12em] text-unity-teal-pale">
                        Full cover
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resource.comparison.map((row, i) => (
                      <tr key={row.label} className={i % 2 === 0 ? "bg-white" : "bg-unity-light"}>
                        <th scope="row" className="px-4 py-3 align-top font-semibold text-unity-navy">
                          {row.label}
                        </th>
                        <td className="px-4 py-3 align-top text-unity-gray-mid">{row.compulsorio}</td>
                        <td className="px-4 py-3 align-top text-unity-gray-mid">
                          <span className="flex gap-2">
                            {row.fullCover.startsWith("Sí") && (
                              <CircleCheck className="mt-0.5 h-4 w-4 shrink-0 text-unity-teal" aria-hidden />
                            )}
                            {row.fullCover}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {resource.kind === "guide" && resource.mistakes && (
              <ol className="space-y-4">
                {resource.mistakes.map((item, i) => (
                  <li
                    key={item.title}
                    className="rounded-2xl border border-unity-navy/10 bg-white p-5"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-unity-navy font-heading text-sm font-bold text-white">
                        {i + 1}
                      </span>
                      <p className="pt-1 font-bold text-unity-navy">{item.title}</p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-unity-gray-mid">{item.why}</p>
                    <p className="mt-2 text-sm leading-relaxed text-unity-teal-dark">
                      <span className="font-semibold">Qué hacer: </span>
                      {item.fix}
                    </p>
                  </li>
                ))}
              </ol>
            )}

            {resource.faqs && (
              <div className="mt-10">
                <h2 className="text-2xl font-bold tracking-tight text-unity-navy">
                  Preguntas frecuentes
                </h2>
                <div className="mt-5">
                  <Accordion items={resource.faqs} />
                </div>
              </div>
            )}

            <div className="mt-12 rounded-2xl bg-unity-light p-8 text-center">
              <p className="text-lg font-semibold text-unity-navy">{resource.closing}</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <OpenConsultButton>Agenda tu consulta y orientación</OpenConsultButton>
              </div>
            </div>

            <div className="mt-8 text-center print:hidden">
              <Link
                href="/recursos"
                className="inline-flex items-center gap-2 font-semibold text-unity-teal hover:text-unity-teal-dark"
              >
                Ver todos los recursos
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileActionBar />

      {resource.kind === "guide" && (
        <ScrollLeadCapture
          heading="Recibe las próximas guías de Unity"
          description="Te avisamos cuando publiquemos una guía nueva como esta."
          ctaLabel="Quiero recibirlas"
          note={`Newsletter: próximas guías (leyendo "${resource.title}")`}
        />
      )}
    </>
  );
}
