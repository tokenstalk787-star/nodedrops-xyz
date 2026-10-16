export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions of use for NodeDrops.xyz platform.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Terms of Service</h1>
        <p className="text-xs text-text-muted font-mono">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">1. Agreement to Terms</h2>
          <p>
            By accessing or using NodeDrops.xyz, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not use the platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">2. Permitted Use</h2>
          <p>
            The educational guides, configuration snippets, and tools are provided for individual learning and infrastructure engineering. You agree not to use NodeDrops.xyz for unlawful activities, distributed denial-of-service attacks, port exploitation scans, or abusive high-volume automated requests.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">3. Intellectual Property & Attribution</h2>
          <p>
            All original technical documentation, software tools, and design assets are protected under applicable copyright and intellectual property laws. Referenced open-source blockchain software (e.g. Go-Ethereum, Lighthouse, CometBFT) remain the property of their respective creators and licenses.
          </p>
        </section>
      </div>
    </div>
  );
}
