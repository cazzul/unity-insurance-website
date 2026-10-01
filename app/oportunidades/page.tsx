import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TalentHero } from "@/components/sections/TalentHero";
import { TalentOffer } from "@/components/sections/TalentOffer";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Oportunidades para agentes | ${BRAND.name}`,
  description:
    "Capacitación, apoyo, herramientas y oportunidades para tu negocio como agente de seguros en Puerto Rico. Agentes nuevos y con experiencia son bienvenidos.",
};

// Sin MobileActionBar a propósito: su WhatsApp es el de clientes ("quiero
// agendar una consulta"); aquí el único WhatsApp es el de reclutamiento.
export default function OportunidadesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <TalentHero />
        <TalentOffer />
      </main>
      <Footer />
    </>
  );
}
