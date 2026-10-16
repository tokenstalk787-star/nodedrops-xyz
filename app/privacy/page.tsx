export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy and data protection practices of NodeDrops.xyz.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-text-muted font-mono">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
        <p>
          At NodeDrops.xyz, privacy and transparency are fundamental engineering principles. We deliberately design our tools (such as the Node Setup Checklist and Hardware Checker) to run client-side without collecting unnecessary personal data.
        </p>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">1. Information We Do Not Collect</h2>
          <p>
            We do not track blockchain wallet balances, seed phrases, private keys, or server root passwords. We do not require visitors to connect a Web3 wallet or log in merely to read guides or access public tooling.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">2. Information We Collect</h2>
          <p>
            When you submit a message via our Contact form, your name, email address, and message are recorded to allow us to reply. When you submit anonymous guide feedback, your helpfulness rating is aggregated. When registered operators log in, secure HTTP-only session cookies are used for authentication.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">3. Client-Side Browser Storage</h2>
          <p>
            The Node Setup Checklist utilizes your browser&apos;s <code className="text-brand-cyan">localStorage</code> API. This data resides exclusively inside your personal browser profile and is never transmitted to our backend servers.
          </p>
        </section>
      </div>
    </div>
  );
}
