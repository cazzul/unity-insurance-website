import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { AboutSection } from "@/components/sections/AboutSection";
import { BannerCTA } from "@/components/sections/BannerCTA";
import { EventsSection } from "@/components/sections/EventsSection";
import { InstagramFeed } from "@/components/sections/InstagramFeed";
import { InsurersMarquee } from "@/components/sections/InsurersMarquee";
import { BRAND } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Nosotros | ${BRAND.name}`,
  description:
    "Quiénes somos, nuestros valores y las aseguradoras con las que trabajamos en Puerto Rico. Unidos para protegerte.",
};

export default function NosotrosPage() {
  return (
    <>
      <Header />
      <main>
        <AboutSection />
        <InsurersMarquee />
        <EventsSection />
        <InstagramFeed />
        <BannerCTA />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
