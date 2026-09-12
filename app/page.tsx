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
import { BRAND, CONTACT, LEGAL } from "@/lib/constants";

// Marca primero (2026-08-30): el visitante lee y entiende a Unity antes de
// que se le pida dejar sus datos. El formulario es la conclusión natural,
// penúltima sección antes del footer; el modal (ConsultModal, en el layout)
// es la vía rápida desde cualquier botón con intención de contacto.
const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://unityinsurancepr.com/#organization",
      name: BRAND.name,
      url: "https://unityinsurancepr.com",
      logo: {
        "@type": "ImageObject",
        url: "https://unityinsurancepr.com/images/brand/unity-lockup.webp",
      },
      contactPoint: {
        "@type": "ContactPoint",
        telephone: CONTACT.phone,
        email: CONTACT.email,
        contactType: "customer service",
        areaServed: "PR",
        availableLanguage: "Spanish",
      },
      sameAs: [CONTACT.instagram, CONTACT.facebook],
    },
    {
      "@type": "LocalBusiness",
      "@id": "https://unityinsurancepr.com/#localbusiness",
      name: BRAND.name,
      url: "https://unityinsurancepr.com",
      telephone: CONTACT.phone,
      email: CONTACT.email,
      ...(LEGAL.horario ? { openingHours: "Mo-Fr 08:00-17:00" } : {}),
      priceRange: "$$",
      areaServed: {
        "@type": "State",
        name: "Puerto Rico",
      },
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <AnnouncementBar />
      <Header />
      <main id="main-content">
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
