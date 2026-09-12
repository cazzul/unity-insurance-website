import type { Metadata } from "next";
import { Montserrat, Source_Sans_3 } from "next/font/google";
import { ConsultModal } from "@/components/ui/ConsultModal";
import { QuoteFormProvider } from "@/lib/quote-form-context";
import { insurers } from "@/lib/content";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://unityinsurancepr.com"),
  title: "Unity Insurance Group | Seguros en Puerto Rico",
  description: `Seguros de hogar, auto, comercial, cáncer, viajero y escolar en Puerto Rico. Comparamos ${insurers.length} aseguradoras y te explicamos tu póliza antes de firmar. Consulta y orientación gratis.`,
  openGraph: {
    locale: "es_PR",
    title: "Unity Insurance Group | Seguros en Puerto Rico",
    description: `Seguros de hogar, auto, comercial, cáncer, viajero y escolar en Puerto Rico. Comparamos ${insurers.length} aseguradoras y te explicamos tu póliza antes de firmar. Consulta y orientación gratis.`,
    images: ["/logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unity Insurance Group | Seguros en Puerto Rico",
    description: `Seguros de hogar, auto, comercial, cáncer, viajero y escolar en Puerto Rico. Comparamos ${insurers.length} aseguradoras y te explicamos tu póliza antes de firmar.`,
    images: ["/logo.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${sourceSans.variable} ${montserrat.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-unity-navy focus:text-white focus:rounded-lg focus:text-sm focus:font-semibold"
        >
          Ir al contenido principal
        </a>
        <QuoteFormProvider>
          {children}
          <ConsultModal />
        </QuoteFormProvider>
      </body>
    </html>
  );
}
