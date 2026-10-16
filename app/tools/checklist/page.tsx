"use client";

import * as React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Square,
  RotateCcw,
  ShieldCheck,
  Server,
  Key,
  Shield,
  Activity,
  Archive,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  commandSnippet?: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "step-ssh-key",
    category: "1. Server Hardening",
    title: "Generate and configure Ed25519 SSH Keys",
    description: "Disable root password login in /etc/ssh/sshd_config and enforce public key authentication.",
    commandSnippet: "ssh-keygen -t ed25519 -C 'node-operator'",
  },
  {
    id: "step-ufw-firewall",
    category: "1. Server Hardening",
    title: "Configure Uncomplicated Firewall (UFW)",
    description: "Default deny incoming. Allow only SSH and specific P2P ports (e.g. 30303, 9000, 26656). Keep RPC ports closed.",
    commandSnippet: "sudo ufw default deny incoming && sudo ufw allow 22/tcp && sudo ufw enable",
  },
  {
    id: "step-swap-file",
    category: "2. Operating System Optimization",
    title: "Provision Swap File & Swappiness",
    description: "Prevent Out-Of-Memory (OOM) killer from terminating the node process during heavy block gossip bursts.",
    commandSnippet: "sudo fallocate -l 8G /swapfile && sudo chmod 600 /swapfile && sudo mkswap /swapfile && sudo swapon /swapfile",
  },
  {
    id: "step-time-sync",
    category: "2. Operating System Optimization",
    title: "Synchronize System Clock with NTP / Chrony",
    description: "Consensus engines require precision timestamps. Severe clock drift leads to rejected blocks.",
    commandSnippet: "sudo timedatectl set-ntp true && timedatectl status",
  },
  {
    id: "step-service-user",
    category: "3. Node Daemon Setup",
    title: "Create Dedicated Non-Root System User",
    description: "Run node daemons under a dedicated daemon user (e.g. 'ethereum' or 'celestia') without sudo permissions.",
    commandSnippet: "sudo useradd -r -s /usr/sbin/nologin -d /var/lib/node nodeuser",
  },
  {
    id: "step-jwt-auth",
    category: "3. Node Daemon Setup",
    title: "Generate Engine API Authentication JWT",
    description: "For PoS paired clients (Execution & Consensus), generate a 32-byte secret with 600 permissions.",
    commandSnippet: "openssl rand -hex 32 | sudo tee /var/lib/node/jwt.hex > /dev/null",
  },
  {
    id: "step-systemd-service",
    category: "4. Automation & Health",
    title: "Create & Enable Systemd Service Unit",
    description: "Ensure the node daemon restarts automatically upon failure and boots with the operating system.",
    commandSnippet: "sudo systemctl daemon-reload && sudo systemctl enable --now node.service",
  },
  {
    id: "step-backup-keys",
    category: "4. Automation & Health",
    title: "Offline Backup of Validator Keys & Seed Phrases",
    description: "Safely copy key stores or mnemonic phrases to encrypted offline physical storage. Never store in plaintext on the VPS.",
  },
];

export default function ChecklistPage() {
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({});
  const [mounted, setMounted] = React.useState(false);

  // Load from browser localStorage
  React.useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("nodedrops_checklist");
      if (stored) {
        setCompleted(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not read localStorage:", e);
    }
  }, []);

  const toggleItem = (id: string) => {
    const updated = { ...completed, [id]: !completed[id] };
    setCompleted(updated);
    try {
      localStorage.setItem("nodedrops_checklist", JSON.stringify(updated));
    } catch (e) {
      console.warn("Could not write to localStorage:", e);
    }
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset your local checklist progress?")) {
      setCompleted({});
      try {
        localStorage.removeItem("nodedrops_checklist");
      } catch (e) {}
    }
  };

  const totalTasks = CHECKLIST_ITEMS.length;
  const completedCount = Object.values(completed).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-text-primary">Tools</Link>
        <span>/</span>
        <span className="text-brand-cyan">Node Setup Checklist</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-status-success font-mono">
          <CheckSquare className="w-3.5 h-3.5" />
          <span>BROWSER-PERSISTED PROGRESS TRACKER</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Node Operator Setup Checklist
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Systematically step through essential server hardening, swap allocation, daemon isolation,
          and validator key safety. Progress is saved locally in your browser with zero server data storage.
        </p>
      </div>

      {/* Local Storage Privacy Notice */}
      <div className="p-4 rounded-xl border border-border bg-[#070b14] text-xs text-text-secondary flex items-start gap-3 mb-8">
        <ShieldCheck className="w-4 h-4 text-brand-cyan shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Privacy Guaranteed:</strong> Your progress is stored strictly inside your browser's <code className="text-brand-cyan">localStorage</code>. We never track your IP, server monikers, or checklist states on our servers.
        </div>
      </div>

      {/* Progress Bar Card */}
      <Card className="border-border bg-background-card mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-white font-semibold">
              Deployment Readiness: {completedCount} / {totalTasks} Completed
            </span>
            <span className="text-brand-cyan font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-background-secondary overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-purple to-brand-cyan transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-end pt-3">
            <button
              onClick={handleReset}
              className="text-xs text-text-muted hover:text-status-error flex items-center gap-1 font-mono transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Checklist</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Groups */}
      <div className="space-y-4">
        {CHECKLIST_ITEMS.map((item) => {
          const isDone = mounted && !!completed[item.id];
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                isDone
                  ? "border-status-success/30 bg-status-success/5"
                  : "border-border bg-background-card hover:border-border-glow"
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  type="button"
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                  className="mt-0.5 shrink-0 text-text-muted hover:text-white"
                >
                  {isDone ? (
                    <CheckSquare className="w-5 h-5 text-status-success" />
                  ) : (
                    <Square className="w-5 h-5 text-text-muted" />
                  )}
                </button>
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-brand-purple-light uppercase">
                      {item.category}
                    </span>
                  </div>
                  <h3 className={`text-base font-semibold ${isDone ? "text-slate-300 line-through" : "text-white"}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                  {item.commandSnippet && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="mt-2 p-2.5 rounded-lg bg-[#05070c] border border-border/60 text-xs font-mono text-slate-300 overflow-x-auto"
                    >
                      <code>{item.commandSnippet}</code>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
