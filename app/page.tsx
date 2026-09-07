import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { ConsultSection } from "@/components/sections/ConsultSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { FAQ } from "@/components/sections/FAQ";
import { Hero } from "@/components/sections/Hero";
import { InsurersMarquee } from "@/components/sections/InsurersMarquee";
import { ProductGrid } from "@/components/sections/ProductGrid";
import { RecentResources } from "@/components/sections/RecentResources";
import { StorySection } from "@/components/sections/StorySection";
import { SubHero } from "@/components/sections/SubHero";
import { WhyUnity } from "@/components/sections/WhyUnity";

// Marca primero (2026-08-30): el visitante lee y entiende a Unity antes de
// que se le pida dejar sus datos. El formulario es la conclusión natural,
// penúltima sección antes del footer; el modal (ConsultModal, en el layout)
// es la vía rápida desde cualquier botón con intención de contacto.
export default function Home() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main>
        <Hero />
        <SubHero />
        <StorySection />
        <ProductGrid />
        <WhyUnity />
        <InsurersMarquee />
        <RecentResources />
        <FAQ />
        <ContactSection />
        <ConsultSection />
      </main>
      <Footer />
      <MobileActionBar />
    </>
  );
}
