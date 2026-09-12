# Critical + Important Fixes — Unity Insurance

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 8 highest-impact issues identified in the 8-dimension site analysis: 2 critical SEO crawlability gaps, 1 accessibility blocker, 1 ARIA fix, 1 social meta fix, 2 JSON-LD schema additions, and 1 motion-sensitivity fix.

**Architecture:** Five independent change groups targeting different files — they can be executed in parallel across isolated git worktrees and merged afterward. No shared state between groups.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS, `app/` directory conventions.

**Spec:** Analysis findings in the published artifact (https://claude.ai/code/artifact/d2811d07-9670-4347-a6da-434aa21de1dd)

## Global Constraints

- Next.js 15 App Router — `app/sitemap.ts` and `app/robots.ts` use the route segment API (export default functions), NOT the `pages/` convention
- TypeScript strict mode — no `any`, no implicit types
- All new code must compile without errors (`npx tsc --noEmit`)
- Do not add `npm` packages — use only what is already installed
- Never modify `app/marca/page.tsx` — it is intentionally noindexed

---

## Task A — SEO Crawlability: sitemap.ts + robots.ts

**Files:**
- Create: `app/sitemap.ts`
- Create: `app/robots.ts`

**Interfaces:**
- Consumes: `lib/content.ts` → `products: Product[]` (each has `id: string`)
- Consumes: `lib/resources.ts` → `resources: Resource[]` (each has `slug: string`)
- Produces: `/sitemap.xml` and `/robots.txt` served by Next.js automatically

**Why these files matter:** Without a sitemap, Google depends entirely on link crawling to discover `/seguros/hogar`, `/seguros/auto`, etc. Without robots.txt, the `/api/*` routes have no crawl signal and Googlebot may index them.

- [ ] **Step 1: Create `app/sitemap.ts`**

```typescript
import type { MetadataRoute } from "next";
import { products } from "@/lib/content";
import { resources } from "@/lib/resources";

const BASE_URL = "https://unityinsurancepr.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/nosotros`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/recursos`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const seguroRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/seguros/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const recursoRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
    url: `${BASE_URL}/recursos/${r.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...seguroRoutes, ...recursoRoutes];
}
```

- [ ] **Step 2: Create `app/robots.ts`**

```typescript
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/marca"],
      },
    ],
    sitemap: "https://unityinsurancepr.com/sitemap.xml",
  };
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
cd "/Users/yadielcasul/Desktop/UNITY SEGUROS/WEBSITE"
npx tsc --noEmit 2>&1 | grep -E "error|sitemap|robots"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/sitemap.ts app/robots.ts
git commit -m "feat(seo): add sitemap.ts and robots.ts

Generates /sitemap.xml with all static + dynamic routes (seguros + recursos).
Blocks /api/* and /marca from indexing via /robots.txt.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task B — Layout meta: skip link + twitter:card + scroll-behavior

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: nothing new — existing `metadata` object and `<html>` element
- Produces: skip link visible to screen readers and on focus; twitter card meta tags; correct scroll-behavior via CSS

**Why these matter:**
- Skip link: WCAG 2.4.1 (A) — required for keyboard users to bypass the sticky header
- twitter:card: without it, X/Twitter shows a plain text preview with no image
- `data-scroll-behavior="smooth"` is not a real HTML attribute; scroll-behavior must be in CSS

- [ ] **Step 1: Read `app/layout.tsx` current state**

Open `app/layout.tsx`. Confirm the current `metadata` object and the `<body>` children structure. The file currently has:
- `data-scroll-behavior="smooth"` on `<html>` (to remove)
- `scroll-smooth` class on `<html>` (Tailwind, keep as-is — it sets `scroll-behavior: smooth` via Tailwind)
- `<QuoteFormProvider>` wrapping children inside `<body>`

- [ ] **Step 2: Update metadata to add twitter:card**

In the `metadata` export, add a `twitter` property after `openGraph`:

```typescript
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
```

- [ ] **Step 3: Remove `data-scroll-behavior` and add skip link**

The `<html>` element already has `className="... scroll-smooth ..."` (Tailwind sets `scroll-behavior: smooth`). Remove only the non-standard `data-scroll-behavior="smooth"` attribute.

Add the skip link as the FIRST child inside `<body>`, before `<QuoteFormProvider>`:

```tsx
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
```

- [ ] **Step 4: Add `id="main-content"` to the main landmark**

The skip link targets `#main-content`. This id must exist on the main landmark of each page. The simplest place is to add it to the `<main>` element in each page template. However, since Unity's pages don't share a `<main>` wrapper in the layout, add the id to the first section of the homepage hero and update each key page template:

In `app/page.tsx`, wrap the existing page content in a `<main id="main-content">` tag, or add `id="main-content"` to the existing outermost wrapper of the page content. Check the current structure — if the page already has a `<main>`, just add the id. If not, wrap:

```tsx
// In app/page.tsx — check if <main> exists, if not:
export default function HomePage() {
  return (
    <main id="main-content">
      {/* existing page sections */}
    </main>
  );
}
```

Do the same for `app/nosotros/page.tsx`, `app/recursos/page.tsx`, `app/recursos/[slug]/page.tsx`, and `app/seguros/[slug]/page.tsx`. Each page's outermost wrapping element (or a new `<main>` wrapper) gets `id="main-content"`.

- [ ] **Step 5: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "error"
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css app/page.tsx app/nosotros/page.tsx app/recursos/page.tsx "app/recursos/[slug]/page.tsx" "app/seguros/[slug]/page.tsx"
git commit -m "feat(a11y,seo): skip link, twitter:card, remove non-standard scroll attr

- Add sr-only skip link targeting #main-content for keyboard/screen reader users
- Add id=main-content to main landmark on all page templates
- Add twitter:card summary_large_image to root metadata
- Remove non-standard data-scroll-behavior attribute (scroll-smooth Tailwind class already handles this)

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task C — ARIA: aria-expanded on mobile menu button

**Files:**
- Modify: `components/layout/Header.tsx` (line 72–79)

**Interfaces:**
- Consumes: existing `mobileOpen` state (boolean)
- Produces: button announces open/closed state to screen readers via `aria-expanded`

**Why this matters:** The ARIA button pattern (APG) requires `aria-expanded` on a disclosure button. Without it, VoiceOver/NVDA announce the button but not whether the menu is currently open.

- [ ] **Step 1: Open `components/layout/Header.tsx` and locate the mobile button**

Find the `<button>` element around line 72–79:
```tsx
<button
  type="button"
  className="rounded-2xl p-2 text-unity-navy"
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
>
```

- [ ] **Step 2: Add `aria-expanded`**

Add `aria-expanded={mobileOpen}` to the button element:

```tsx
<button
  type="button"
  className="rounded-2xl p-2 text-unity-navy"
  onClick={() => setMobileOpen(!mobileOpen)}
  aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={mobileOpen}
>
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "error"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/layout/Header.tsx
git commit -m "fix(a11y): add aria-expanded to mobile menu button

Screen readers (VoiceOver, NVDA) announce the open/closed state of the
menu via aria-expanded, satisfying WCAG 4.1.2 Name Role Value.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task D — JSON-LD Schema: Organization + FAQPage

**Files:**
- Modify: `app/page.tsx` (add Organization + LocalBusiness schema)
- Modify: `app/seguros/[slug]/page.tsx` (add FAQPage schema when product has faqs)

**Interfaces:**
- Consumes: `lib/constants.ts` → `CONTACT`, `BRAND`, `LEGAL`
- Consumes: `lib/product-details.ts` → `ProductDetail.faqs: FaqItem[]` where `FaqItem = { question: string; answer: string }`
- Produces: JSON-LD `<script>` tags parsed by Google for rich results

**Why this matters:** Without Organization schema, Google cannot generate the knowledge panel. Without FAQPage schema on insurance product pages (which all have FAQs), Google can't show FAQ rich results in SERPs — a significant CTR opportunity for insurance queries.

- [ ] **Step 1: Add Organization + LocalBusiness schema to `app/page.tsx`**

Read `app/page.tsx` current content first. Then add a `<script>` tag with JSON-LD inside the page's `<>` fragment, before or after the existing sections (not inside any section component). Add it near the top, after the opening fragment:

```tsx
import { BRAND, CONTACT, LEGAL } from "@/lib/constants";

// Inside the page component's return, as the first child:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
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
          openingHours: LEGAL.horario ? "Mo-Fr 08:00-17:00" : undefined,
          priceRange: "$$",
          areaServed: {
            "@type": "State",
            name: "Puerto Rico",
          },
        },
      ],
    }),
  }}
/>
```

Note: `openingHours` uses ISO 8601 business hours format. The constant `LEGAL.horario = "Lunes a viernes, 8:00 a.m. a 5:00 p.m."` maps to `"Mo-Fr 08:00-17:00"`. Only include `openingHours` when `LEGAL.horario` is truthy (it is currently set).

- [ ] **Step 2: Add FAQPage schema to `app/seguros/[slug]/page.tsx`**

Read `app/seguros/[slug]/page.tsx` current content. The file already imports `productDetails` and finds the detail by slug. Add JSON-LD for FAQPage when `detail.faqs` exists:

```tsx
// Inside the page component, after resolving `detail`, before the return:
const faqSchema = detail.faqs && detail.faqs.length > 0
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

// In the return JSX, as first child:
{faqSchema && (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
  />
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "error"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx "app/seguros/[slug]/page.tsx"
git commit -m "feat(seo): add JSON-LD Organization and FAQPage schema

- Homepage: Organization + LocalBusiness schema with phone, email, area served
- Seguros [slug]: FAQPage schema for all product pages that have FAQ sections
  Enables Google rich results (FAQ rich snippets) for insurance product queries.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```

---

## Task E — Motion: prefers-reduced-motion in InsurersMarquee

**Files:**
- Modify: `components/sections/InsurersMarquee.tsx` (or its companion CSS if animation is in a `.css` file)

**Interfaces:**
- Consumes: existing CSS animation on the marquee element
- Produces: animation paused for users with `prefers-reduced-motion: reduce` OS setting

**Why this matters:** Continuous scrolling animations can cause vestibular disorders symptoms. WCAG 2.3.3 (AAA) and best-practice AA guidance require respecting the OS motion preference.

- [ ] **Step 1: Read `components/sections/InsurersMarquee.tsx`**

Open the file and identify:
- The class name applied to the scrolling element (likely `animate-marquee` or similar)
- Whether the animation is defined in a Tailwind config, a CSS module, or `globals.css`

- [ ] **Step 2: Add prefers-reduced-motion handling**

**If the animation uses a Tailwind custom animation (defined in `tailwind.config.ts`):**

Add inline style override OR add a CSS rule in `app/globals.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .animate-marquee,
  .animate-marquee-reverse {
    animation: none !important;
  }
}
```

Replace `animate-marquee` and `animate-marquee-reverse` with the actual class names found in step 1.

**If the animation is applied via a `<style>` tag inside the component:**

Add the media query inside the same `<style>` block:

```css
@media (prefers-reduced-motion: reduce) {
  .YOUR_CLASS_NAME { animation: none !important; }
}
```

**If the component uses inline styles:**

Replace the inline animation style with a conditional:

```tsx
const prefersReduced = typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Then on the scrolling element:
style={{ animation: prefersReduced ? 'none' : 'marquee 30s linear infinite' }}
```

However, prefer the CSS approach (globals.css media query) as it works server-side and is simpler.

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit 2>&1 | grep "error"
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add components/sections/InsurersMarquee.tsx app/globals.css
git commit -m "fix(a11y): pause marquee animation for prefers-reduced-motion

Users who set 'reduce motion' in their OS settings will see static
logos instead of the scrolling marquee, preventing vestibular symptoms.

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"
```
