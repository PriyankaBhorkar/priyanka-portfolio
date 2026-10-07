import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces";
import "@fontsource-variable/hanken-grotesk";
import "./globals.css";
import { person } from "@/data/profile";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { siteUrl } from "@/lib/utils";

const title = `${person.name} | SAP HANA & BI/BW Developer, Web Engineering`;
const description =
  "Portfolio of Priyanka Nitin Bhorkar: over 4 years as an SAP HANA Developer and SAP BI/BW Consultant at Deloitte and Accenture, now an M.Sc. Web Engineering student at TU Chemnitz.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  keywords: ["Priyanka Nitin Bhorkar", "SAP HANA", "SAP BW", "SAP BI", "Data modelling", "BI reporting", "Web Engineering", "Werkstudent", "FastAPI", "PostgreSQL"],
  authors: [{ name: person.name, url: person.links.linkedin }],
  alternates: { canonical: "/" },
  openGraph: { type: "profile", url: "/", title, description, siteName: person.name, locale: "en_US" },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#fffafc", width: "device-width", initialScale: 1 };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  jobTitle: "SAP HANA & BI/BW Developer",
  description,
  url: siteUrl,
  image: `${siteUrl}${person.photo}`,
  email: `mailto:${person.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Chemnitz", addressCountry: "DE" },
  sameAs: [person.links.linkedin, person.links.github],
  alumniOf: education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.school })),
  worksFor: experience.map((r) => ({ "@type": "Organization", name: r.company })),
  knowsAbout: ["SAP HANA", "SAP BW/BI", "Data modelling", "BI reporting", "ETL", "FastAPI", "PostgreSQL"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
