import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";

export const metadata: Metadata = {
  title: {
    default: "NodeDrops.xyz — Blockchain Node Education, Discovery & Tooling",
    template: "%s | NodeDrops.xyz",
  },
  description:
    "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive production-grade blockchain node documentation, hardware checkers, command builders, and validator guides.",
  keywords: [
    "blockchain nodes",
    "validator guide",
    "testnet node",
    "ethereum geth lighthouse",
    "celestia light node",
    "solana validator",
    "node hardware checker",
    "web3 infrastructure",
  ],
  metadataBase: new URL("https://nodedrops.xyz"),
  openGraph: {
    title: "NodeDrops.xyz — Run Nodes. Learn Web3. Explore Opportunities.",
    description:
      "Production-oriented blockchain node education, hardware compatibility evaluation, and technical guides.",
    url: "https://nodedrops.xyz",
    siteName: "NodeDrops.xyz",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NodeDrops.xyz — Blockchain Node Platform",
    description:
      "Run Nodes. Learn Web3. Explore Opportunities. Comprehensive node guides and tools.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-background text-text-primary antialiased selection:bg-brand-purple/40 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
