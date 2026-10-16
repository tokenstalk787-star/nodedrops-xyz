"use client";

import React, { useState } from "react";
import { Check, Copy, Terminal as TerminalIcon } from "lucide-react";

interface SnippetTab {
  id: string;
  filename: string;
  command: string;
  output: string;
  tag: string;
}

const SNIPPET_TABS: SnippetTab[] = [
  {
    id: "celestia",
    filename: "celestia-light-node.sh",
    tag: "Modular DAS",
    command: `# Initialize and start Celestia Light Node on Mocha-4
celestia light init --p2p.network mocha
celestia light start --core.ip rpc-mocha.celestia.net --p2p.network mocha`,
    output: `[INFO] header/sync: sync complete to head block: 1,842,910
[INFO] das: sampling data availability across 64 shares: SUCCESS (100%)
[INFO] p2p: connected to 48 active consensus peers`,
  },
  {
    id: "ethereum",
    filename: "verify-engine-api.sh",
    tag: "Execution & PoS",
    command: `# Query Geth sync status via local IPC JSON-RPC
curl -s -X POST -H "Content-Type: application/json" \\
  --data '{"jsonrpc":"2.0","method":"eth_syncing","params":[],"id":1}' \\
  http://127.0.0.1:8545`,
    output: `{"jsonrpc":"2.0","id":1,"result":false}
# => false indicates node is 100% synchronized with Sepolia head`,
  },
  {
    id: "systemd",
    filename: "validator.service",
    tag: "Systemd Recipe",
    command: `[Unit]
Description=Blockchain Node Daemon
After=network-online.target
[Service]
User=nodeoperator
ExecStart=/usr/local/bin/nodectl start --home /var/lib/node
Restart=always
RestartSec=5
LimitNOFILE=65535`,
    output: `● validator.service - Blockchain Node Daemon
   Loaded: loaded (/etc/systemd/system/validator.service; enabled)
   Active: active (running) since Fri 2026-10-16 04:00:12 UTC`,
  },
];

export function GuidesHeroTerminal() {
  const [activeTab, setActiveTab] = useState(SNIPPET_TABS[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(activeTab.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-xl rounded-xl border border-dark-card-border bg-[#070a14] shadow-2xl overflow-hidden font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-[#0b1020] px-4 py-2.5 border-b border-dark-card-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] text-text-muted font-sans ml-2 flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-brand-cyan" />
            <span>node-runner-terminal</span>
          </span>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1">
          {SNIPPET_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-2.5 py-1 rounded text-[10px] font-sans font-medium transition-colors ${
                activeTab.id === tab.id
                  ? "bg-dark-card text-brand-cyan border border-brand-cyan/30"
                  : "text-text-muted hover:text-text-primary"
              }`}
            >
              {tab.tag}
            </button>
          ))}
        </div>
      </div>

      {/* Code Body */}
      <div className="p-4 space-y-3 relative group">
        <div className="flex items-center justify-between text-[11px] text-text-muted pb-1 border-b border-dark-card-border/60">
          <span className="text-brand-purple">{activeTab.filename}</span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] font-sans px-2 py-0.5 rounded bg-dark-card hover:bg-dark-card-hover border border-dark-card-border text-text-secondary hover:text-white transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Snippet</span>
              </>
            )}
          </button>
        </div>

        <pre className="text-emerald-400 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-brand-purple/40">
          <code>{activeTab.command}</code>
        </pre>

        {/* Terminal Output */}
        <div className="pt-2 border-t border-dark-card-border/60">
          <div className="text-[10px] uppercase tracking-wider text-text-muted mb-1 font-sans">
            Terminal stdout:
          </div>
          <pre className="text-[11px] text-text-secondary font-mono leading-relaxed bg-[#04060c] p-2.5 rounded border border-dark-card-border/40 overflow-x-auto">
            <code>{activeTab.output}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
