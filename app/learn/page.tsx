import Link from "next/link";
import {
  GraduationCap,
  Server,
  Key,
  Shield,
  Layers,
  Cpu,
  Terminal,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Beginner Node Operator Learning Path",
  description: "Comprehensive step-by-step curriculum for learning Linux server management, blockchain node architecture, and validator operations.",
};

export default function LearnPage() {
  const modules = [
    {
      step: "01",
      title: "VPS Provisioning & Cloud Hosting",
      icon: Server,
      desc: "Learn how to select reliable cloud infrastructure (Hetzner, OVH, AWS, DigitalOcean) with dedicated NVMe drives and unmetered gigabit bandwidth.",
    },
    {
      step: "02",
      title: "Linux Security & SSH Key Hardening",
      icon: Key,
      desc: "Configure Ed25519 cryptographic key pairs, disable root password login, and enforce UFW firewall rules without locking yourself out.",
    },
    {
      step: "03",
      title: "Consensus vs Execution Client Architecture",
      icon: Layers,
      desc: "Understand how modern Proof of Stake networks split node duties between execution engines (Geth, Nethermind) and beacon consensus clients (Lighthouse, Prysm).",
    },
    {
      step: "04",
      title: "Systemd Services & Process Automation",
      icon: Terminal,
      desc: "Create production background daemons that restart automatically on failure, manage log rotations with journalctl, and limit memory leakage.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
          <GraduationCap className="w-3.5 h-3.5 text-brand-cyan" />
          <span>ZERO-TO-HERO INFRASTRUCTURE CURRICULUM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Learn How to Run Blockchain Nodes
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Master the fundamentals of Web3 decentralized infrastructure. Designed for developers,
          enthusiasts, and aspiring validators starting with zero DevOps experience.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {modules.map((m) => {
          const Icon = m.icon;
          return (
            <Card key={m.step} className="border-border bg-background-card hover:border-border-glow transition-all">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-2xl font-black text-brand-purple-light">
                    {m.step}
                  </span>
                  <div className="p-2 rounded-lg bg-background-secondary border border-border text-brand-cyan">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <CardTitle className="text-lg">{m.title}</CardTitle>
                <CardDescription className="text-xs leading-relaxed mt-2">
                  {m.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {/* Action CTA */}
      <div className="p-8 rounded-2xl border border-brand-purple/40 bg-gradient-to-r from-background-card via-[#11162b] to-background-card text-center space-y-4">
        <h3 className="text-2xl font-bold text-white">Ready for your first deployment?</h3>
        <p className="text-xs text-text-secondary max-w-md mx-auto">
          Jump right into our tested, step-by-step setup walkthroughs starting with lightweight nodes.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link href="/guides">
            <Button variant="primary" size="md" className="gap-2 text-xs">
              <BookOpen className="w-4 h-4" />
              <span>Browse Technical Guides</span>
            </Button>
          </Link>
          <Link href="/tools/checklist">
            <Button variant="outline" size="md" className="gap-2 text-xs">
              <span>Open Setup Checklist</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
