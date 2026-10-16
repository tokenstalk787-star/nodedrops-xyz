import { AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Risk Disclaimer & Legal Notice",
  description: "Educational and technical disclaimer for NodeDrops.xyz platform.",
};

export default function DisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Risk Disclaimer</h1>
        <p className="text-xs text-text-muted font-mono">Last updated: April 2026</p>
      </div>

      <div className="prose prose-invert max-w-none text-xs text-text-secondary leading-relaxed space-y-6">
        <div className="p-4 rounded-xl border border-status-warning/30 bg-status-warning/10 text-status-warning flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>
            <strong>Not Financial or Investment Advice:</strong> All materials, guides, hardware calculations, and opportunity listings published on NodeDrops.xyz are provided solely for technical, educational, and research purposes.
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">1. Operational & Slashing Risks</h2>
          <p>
            Operating a blockchain validator or node involves financial, software, and hardware risks. In Proof-of-Stake protocols, validators that experience prolonged downtime, double-signing, or software faults may suffer automated penalties or token slashing. You are solely responsible for managing your hardware reliability, backup power, and anti-slashing safeguards.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">2. No Guarantee of Rewards or Airdrops</h2>
          <p>
            NodeDrops.xyz does not distribute cryptocurrency tokens, conduct token sales, or promise financial returns. Information regarding incentivized testnets or reward programs is gathered from publicly announced official project channels. Project foundations and governing DAOs reserve the right to alter eligibility criteria, KYC requirements, or cancel programs at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-white uppercase font-mono">3. System & Command Execution</h2>
          <p>
            Users execute shell commands, configuration files, and software binaries on their own operating systems at their own discretion. NodeDrops.xyz does not accept liability for data loss, server crashes, cloud billing charges, or compromised servers resulting from commands executed by visitors.
          </p>
        </section>
      </div>
    </div>
  );
}
