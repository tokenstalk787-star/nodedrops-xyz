"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight, ShieldCheck } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string | React.ReactNode;
}

const FAQ_LIST: FAQItem[] = [
  {
    question: "What is an incentivized blockchain node or testnet airdrop?",
    answer:
      "Before deploying to mainnet, Layer 1 and Layer 2 blockchains launch incentivized testnets to test peer discovery, state sync, data availability, and Byzantine fault tolerance under real-world loads. Node operators who maintain uptime, produce blocks, and report telemetry are frequently rewarded with native token grants, retroactive airdrops, or priority validator set allocations.",
  },
  {
    question: "What does the reward status 'Confirmed' vs 'Potential' mean?",
    answer:
      "On NodeDrops.xyz, 'Confirmed' indicates that the blockchain foundation or core development team has published an official blog or documentation confirming a dedicated token allocation for node operators. 'Potential' means the project tracks testnet points or leaderboards without an explicit legal guarantee. 'Public Spec' denotes public testing networks (like Ethereum Sepolia) operated purely for developer tooling.",
  },
  {
    question: "How much does running a testnet node cost in monthly VPS hosting?",
    answer:
      "Costs vary based on hardware specifications: lightweight Data Availability (DAS) nodes like Celestia run smoothly on a $10 - $15/mo VPS (2 vCPU, 4GB RAM). Standard EVM and Cosmos nodes (like Babylon or Berachain) typically cost $25 - $45/mo (4-8 vCPU, 16-32GB RAM). Enterprise high-throughput validators (like Solana) require dedicated bare-metal servers costing $120+/mo. You can verify your exact VPS specs in our free Hardware Checker.",
  },
  {
    question: "Do I need to connect a crypto wallet to use NodeDrops.xyz?",
    answer:
      "Never. NodeDrops.xyz strictly maintains a Zero-Wallet Requirement policy. You will never be asked to connect a browser wallet, sign transactions, or share private keys on our website. All runbooks, hardware calculators, and command builders are 100% free, open, and walletless.",
  },
  {
    question: "What is validator slashing and how do I prevent it?",
    answer:
      "Slashing is an on-chain automated penalty where a portion of a validator's stake is burned due to malicious or erroneous behavior—most commonly double-signing the same block height or prolonged offline downtime. Our technical guides provide systemd sandboxing, UFW firewall isolation, and sentry node architectures to prevent double-signing.",
  },
  {
    question: "How do I choose between a Light Node, Full Node, and Validator?",
    answer:
      "A Light Node (e.g. Celestia DAS) only samples block data without storing chain history—ideal for beginners with low bandwidth. A Full Node downloads, verifies, and stores the full ledger state—ideal for RPC queries and dapp developers. A Validator actively signs blocks and participates in consensus—requiring high availability, static IPs, and security hardening.",
  },
  {
    question: "How are node campaigns verified and maintained on NodeDrops.xyz?",
    answer:
      "Every runbook and opportunity is field-tested on pristine Ubuntu 22.04 / 24.04 LTS servers by our infrastructure team before publication. We verify SHA-256 release checksums, test RPC endpoints, verify port forwarding, and re-audit campaigns weekly for network upgrades and hard forks.",
  },
];

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0); // First open by default

  const toggle = (idx: number) => {
    setOpenIndex((current) => (current === idx ? null : idx));
  };

  return (
    <section className="py-16 border-b border-border/80 bg-[#070a14]" id="faq">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-dark-card-border">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-brand-purple-light uppercase tracking-wider">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Knowledge Base & Operator FAQ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Frequently Asked Questions (FAQ)
            </h2>
            <p className="text-xs sm:text-sm text-text-secondary font-sans max-w-2xl">
              Essential knowledge on node testnets, validator economics, server sizing,
              and security protocols.
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

        {/* Accordion List */}
        <div className="space-y-3">
          {FAQ_LIST.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? "border-brand-purple/40 bg-dark-card shadow-lg"
                    : "border-dark-card-border bg-dark-card/60 hover:border-border"
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
                        : "bg-dark-bg border-dark-card-border text-text-muted"
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

        {/* Bottom Banner */}
        <div className="rounded-2xl border border-brand-blue/30 bg-gradient-to-r from-brand-blue/10 via-brand-purple/10 to-transparent p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">
              Have questions about your server hardware?
            </h3>
            <p className="text-xs text-text-secondary">
              Use our interactive Hardware Checker to benchmark your CPU, RAM, and NVMe disk against node requirements.
            </p>
          </div>
          <Link
            href="/tools/hardware-checker"
            className="px-4 py-2.5 rounded-xl bg-brand-blue hover:bg-brand-blue-light text-white text-xs font-mono font-medium transition-colors shrink-0 shadow-md"
          >
            Launch Hardware Checker
          </Link>
        </div>
      </div>
    </section>
  );
}
