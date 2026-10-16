"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck, X, Sparkles, Cpu, Bell } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: "What is an airdrop / incentivized testnet?",
    answer:
      "Before deploying to mainnet, Layer 1 and Layer 2 blockchains launch incentivized testnets to test peer discovery, state sync, data availability, and Byzantine fault tolerance under real-world loads. Node operators who maintain uptime, produce blocks, and report telemetry are frequently rewarded with native token grants, retroactive airdrops, or priority validator set allocations.",
  },
  {
    question: "What does the reward type 'Potential' and 'Confirmed' mean and what is the difference between them?",
    answer:
      "On NodeDrops.xyz, 'Confirmed' indicates that the blockchain foundation or core development team has published official documentation or a blog confirming dedicated token allocations for testnet node operators. 'Potential' means the project tracks testnet points or leaderboards without an explicit legal guarantee. 'Public Spec' denotes public testing networks (like Ethereum Sepolia) operated purely for developer tooling.",
  },
  {
    question: "How to do these activities and begin running?",
    answer:
      "Start by reviewing the hardware prerequisites in our free Hardware Checker. Lease an Ubuntu 22.04 LTS VPS from an infrastructure provider (e.g., Hetzner, Contabo, AWS). Follow our verified step-by-step setup guides to install dependencies, initialize client daemons, configure systemd automation, and submit your node peer ID or validator address.",
  },
  {
    question: "What is an unexpected airdrop and snapshot?",
    answer:
      "An unexpected airdrop occurs when a protocol distributes governance tokens to past infrastructure participants without prior announcement. A 'snapshot' is an on-chain record of block heights capturing which node operators or delegators were actively syncing and producing blocks at that exact moment.",
  },
  {
    question: "What does 'Participate' mean?",
    answer:
      "Participating means configuring and actively executing node client software on your server. For Light Nodes (like Celestia), participation involves sampling data availability blocks. For Validators (like Berachain or Babylon), it requires maintaining 99%+ uptime and participating in PoS consensus round voting.",
  },
  {
    question: "What are the criteria and what is the difference between them?",
    answer:
      "Criteria vary across projects: some evaluate total uptime percentage (e.g. >98%), others check block proposal counts, governance votes, low peer latency, or bug reports submitted during stress testing phases.",
  },
  {
    question: "How to build a technical portfolio to get an airdrop?",
    answer:
      "Operators build reputational credibility by maintaining continuous uptime across multiple testnets, keeping detailed GitHub telemetry logs, hosting public RPC endpoints, and participating in early devnet phases before campaigns reach mainstream saturation.",
  },
  {
    question: "How to avoid scams and protect your wallet and nodes?",
    answer:
      "NodeDrops.xyz strictly maintains a Zero-Wallet Requirement policy. Never share your mnemonic seed phrase or private keys. Never connect browser wallets to unverified third-party websites claiming to grant testnet node access. Always audit shell scripts before executing with sudo permissions.",
  },
];

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0); // First open by default
  const [showPromoBanner, setShowPromoBanner] = React.useState(true);

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <section className="py-12 border-b border-dark-card-border/80 bg-[#070a14]" id="faq">
      <div className="container mx-auto px-4 max-w-5xl space-y-10">
        {/* FAQ Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-dark-card-border">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              FAQ
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary font-sans">
              Frequently asked questions regarding incentivized testnets, token airdrops, and node operations.
            </p>
          </div>

          <Link
            href="/troubleshooting"
            className="text-xs font-mono text-brand-cyan hover:underline flex items-center gap-1 shrink-0"
          >
            <span>Troubleshooting Hub</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Accordion List (CryptoRank Style Clean Expanders) */}
        <div className="space-y-2.5">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-brand-purple/40 bg-[#0b1020] shadow-lg"
                    : "border-dark-card-border bg-[#0b1020]/60 hover:border-slate-600"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full py-4 px-5 sm:px-6 flex items-center justify-between gap-4 text-left transition-colors"
                >
                  <span className="font-sans font-bold text-sm sm:text-base text-white">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border transition-transform duration-200 ${
                      isOpen
                        ? "bg-brand-purple/20 border-brand-purple/40 text-brand-purple-light rotate-180"
                        : "bg-[#070b16] border-dark-card-border text-text-muted"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans border-t border-dark-card-border/60">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* PROMOTIONAL BANNER (Exact Reference Image Style) */}
        {showPromoBanner && (
          <div className="relative rounded-2xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-900 border border-blue-400/30 shadow-2xl">
            {/* Background glowing particles effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)] pointer-events-none" />

            {/* Dismiss Button */}
            <button
              onClick={() => setShowPromoBanner(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition-colors"
              title="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 max-w-xl space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-200 font-bold">
                Automated Node Telemetry & Tooling
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Track Algorithmic Deployments & Operator Telemetry
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                Automated real-time monitoring, hardware benchmarks, and verified testnet notifications to keep your nodes synchronized 24/7.
              </p>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  href="/tools/hardware-checker"
                  className="px-5 py-2.5 rounded-full bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs font-sans transition-all shadow-lg inline-flex items-center gap-1.5"
                >
                  <span>Start Running A Node</span>
                  <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
                </Link>
                <Link
                  href="/guides"
                  className="px-4 py-2.5 rounded-full bg-blue-900/40 hover:bg-blue-900/60 text-white text-xs font-mono border border-blue-400/40 transition-colors"
                >
                  View All Runbooks
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
