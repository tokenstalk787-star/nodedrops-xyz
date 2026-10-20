
import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";
import { TelemetryTracker } from "../components/analytics/telemetry-tracker";
import { getThemeConfig, getSiteSettings } from "@/lib/services/data-service";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#050814",
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();

  return {
    title: {
      default:
        settings.siteTitle ||
        "NodeDrops.xyz — Blockchain Node Education, Discovery & Tooling",
      template: "%s | NodeDrops.xyz",
    },
    description:
      settings.siteDescription ||
      "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive production-grade blockchain node documentation, hardware checkers, command builders, and validator guides.",
    keywords: settings.keywords || [
      "blockchain nodes",
      "validator guide",
      "testnet node",
      "ethereum geth lighthouse",
      "celestia light node",
      "solana validator",
      "web3 infrastructure",
    ],
    metadataBase: new URL("https://nodedrops.xyz"),
    openGraph: {
      title:
        settings.siteTitle ||
        "NodeDrops.xyz — Run Nodes. Learn Web3. Explore Opportunities.",
      description: settings.siteDescription,
      url: "https://nodedrops.xyz",
      siteName: "NodeDrops.xyz",
      type: "website",
      images: [
        {
          url: settings.ogImage || "/brand/logo-horizontal.png",
          width: 1200,
          height: 630,
          alt: "NodeDrops.xyz",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: settings.siteTitle || "NodeDrops.xyz — Blockchain Node Platform",
      description: settings.siteDescription,
      images: [settings.ogImage || "/brand/logo-horizontal.png"],
    },
    robots: {
      index: !settings.robotsDirective?.includes("noindex"),
      follow: !settings.robotsDirective?.includes("nofollow"),
    },
    verification: settings.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = await getThemeConfig();

  const dynamicCss = `
    :root {
      --color-brand-purple: ${theme.primaryColor || "#8B5CF6"};
      --color-brand-purple-light: ${theme.accentCyan || "#06B6D4"};
      --color-brand-cyan: ${theme.accentCyan || "#06B6D4"};
      --color-brand-blue: ${theme.accentBlue || "#3B82F6"};
      --color-background-secondary: ${theme.secondaryColor || "#101525"};
      --color-background-card: ${theme.cardBackground || "#141B2D"};
      --border-radius-base: ${theme.borderRadius || "0.75rem"};
    }
  `;

  return (
    <html lang="en" className="dark overflow-x-hidden">
      <head>
        <style
          id="nodedrops-theme-variables"
          dangerouslySetInnerHTML={{ __html: dynamicCss }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-brand-purple/40 selection:text-white overflow-x-hidden w-full max-w-[100vw]">
        {/* Google tag — replace the placeholder with your real tag ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-0T4QGLB1FF"
          strategy="afterInteractive"
        />
        <Script id="google-tag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            window.gtag = gtag;
            window.gtag('js', new Date());
            window.gtag('config', 'G-0T4QGLB1FF');
          `}
        </Script>

        <TelemetryTracker />
        <Navbar />
        <main className="flex-1 w-full max-w-full overflow-x-hidden">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
