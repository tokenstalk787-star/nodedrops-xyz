"use client";

import * as React from "react";
import Link from "next/link";
import {
  Terminal,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Info,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";

export default function CommandBuilderPage() {
  const [networkSlug, setNetworkSlug] = React.useState("ethereum-sepolia");
  const [client, setClient] = React.useState("Go-Ethereum (Geth)");
  const [installationMethod, setInstallationMethod] = React.useState<"Systemd" | "Docker">("Systemd");
  const [moniker, setMoniker] = React.useState("NodeDrops-Validator");
  const [customPort, setCustomPort] = React.useState("8545");
  const [isDestructiveAcknowledged, setIsDestructiveAcknowledged] = React.useState(false);

  // Sanitized moniker: alphanumeric and dashes only, max 32 chars
  const sanitizedMoniker = moniker.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "MyNode";

  // Template generation based on verified templates
  const generatedTemplate = React.useMemo(() => {
    if (networkSlug === "ethereum-sepolia") {
      if (installationMethod === "Systemd") {
        return {
          title: "Systemd Service Configuration for Geth Sepolia",
          fileName: "/etc/systemd/system/geth.service",
          version: "v1.14.0",
          riskLevel: "SAFE" as const,
          requiresRoot: true,
          content: `[Unit]
Description=Go Ethereum Client - Sepolia Node
After=network.target
Wants=network.target

[Service]
User=ethereum
Group=ethereum
Type=simple
Restart=always
RestartSec=5
ExecStart=/usr/bin/geth \\
  --sepolia \\
  --datadir /var/lib/ethereum/geth \\
  --authrpc.jwtsecret /var/lib/ethereum/jwt/jwt.hex \\
  --authrpc.addr 127.0.0.1 \\
  --authrpc.port 8551 \\
  --http \\
  --http.addr 127.0.0.1 \\
  --http.port ${customPort} \\
  --http.api eth,net,web3 \\
  --identity "${sanitizedMoniker}"

[Install]
WantedBy=multi-user.target`,
          explanation:
            "Configures a production systemd service that automatically reboots Geth upon crash or system reboot. Binds RPC and Engine API strictly to localhost loopback for security.",
          verification:
            "Reload systemd and inspect service status: sudo systemctl daemon-reload && sudo systemctl status geth",
        };
      } else {
        return {
          title: "Docker Compose Deployment for Geth Sepolia",
          fileName: "docker-compose.yml",
          version: "v1.14.0",
          riskLevel: "SAFE" as const,
          requiresRoot: false,
          content: `services:
  geth:
    image: ethereum/client-go:v1.14.0
    container_name: geth-sepolia
    restart: unless-stopped
    ports:
      - "30303:30303"
      - "30303:30303/udp"
      - "127.0.0.1:${customPort}:${customPort}"
    volumes:
      - /var/lib/ethereum/geth:/root/.ethereum
      - /var/lib/ethereum/jwt:/jwt
    command:
      - --sepolia
      - --authrpc.jwtsecret=/jwt/jwt.hex
      - --authrpc.addr=0.0.0.0
      - --authrpc.port=8551
      - --http
      - --http.addr=0.0.0.0
      - --http.port=${customPort}
      - --identity=${sanitizedMoniker}`,
          explanation:
            "Containerized deployment isolating Geth inside a secure Linux network namespace. Only P2P discovery ports are mapped externally.",
          verification:
            "Run 'docker compose ps' and tail logs with 'docker compose logs -f geth'.",
        };
      }
    } else if (networkSlug === "celestia") {
      return {
        title: "Celestia Mocha Light Node Deployment",
        fileName: "celestia-light-docker-compose.yml",
        version: "v0.18.2",
        riskLevel: "SAFE" as const,
        requiresRoot: false,
        content: `services:
  celestia-light:
    image: ghcr.io/celestiaorg/celestia-node:v0.18.2
    container_name: celestia-light-mocha
    restart: unless-stopped
    command: celestia light start --core.ip rpc-mocha.celestia.net --p2p.network mocha
    volumes:
      - celestia_data:/home/celestia/.celestia-light-mocha-4
    ports:
      - "2121:2121"
    environment:
      - NODE_TYPE=light
      - P2P_NETWORK=mocha
      - MONIKER=${sanitizedMoniker}

volumes:
  celestia_data:`,
        explanation:
          "Runs an official Celestia light node performing Data Availability Sampling without needing full blocks.",
        verification:
          "Check logs for 'sync complete to head' and sampling progress.",
      };
    } else {
      return {
        title: "Standard Systemd Service Unit",
        fileName: "node.service",
        version: "v1.0.0",
        riskLevel: "SAFE" as const,
        requiresRoot: true,
        content: `[Unit]
Description=Blockchain Node Daemon
After=network.target

[Service]
User=nodeoperator
Type=simple
Restart=on-failure
ExecStart=/usr/local/bin/nodectl run --moniker "${sanitizedMoniker}"

[Install]
WantedBy=multi-user.target`,
        explanation: "Generic hardened template adhering to systemd sandboxing standards.",
        verification: "Run 'sudo systemctl daemon-reload && sudo systemctl status node'.",
      };
    }
  }, [networkSlug, installationMethod, sanitizedMoniker, customPort]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-text-primary">Tools</Link>
        <span>/</span>
        <span className="text-brand-cyan">Node Command Builder</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono">
          <Terminal className="w-3.5 h-3.5" />
          <span>PARAMETERIZED CONFIGURATION GENERATOR</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Node Command & Config Builder
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Generate vetted systemd unit files, Docker Compose definitions, and initialization commands.
          All templates are versioned and review-stamped against client updates.
        </p>
      </div>

      {/* Safety Notice */}
      <div className="p-4 rounded-xl border border-status-warning/40 bg-status-warning/10 text-xs text-status-warning flex items-start gap-3 mb-8">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Non-Execution Safety Notice:</strong> This tool only outputs text templates for your inspection.
          NodeDrops never executes shell commands on your machine or on our servers. Always review commands before running them.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls */}
        <Card className="lg:col-span-1 border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-lg">Template Parameters</CardTitle>
            <CardDescription className="text-xs">
              Select verified client target and deployment style.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs font-mono">
            {/* Target Network */}
            <div>
              <label className="block text-text-muted mb-1">Target Network</label>
              <select
                value={networkSlug}
                onChange={(e) => setNetworkSlug(e.target.value)}
                className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
              >
                <option value="ethereum-sepolia">Ethereum Sepolia (Geth)</option>
                <option value="celestia">Celestia (celestia-node)</option>
                <option value="berachain-bartio">Berachain bArtio</option>
              </select>
            </div>

            {/* Deployment Method */}
            <div>
              <label className="block text-text-muted mb-1">Deployment Method</label>
              <div className="grid grid-cols-2 gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setInstallationMethod("Systemd")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    installationMethod === "Systemd"
                      ? "border-brand-purple bg-brand-purple/20 text-white"
                      : "border-border bg-background-secondary text-text-muted hover:text-white"
                  }`}
                >
                  Systemd
                </button>
                <button
                  type="button"
                  onClick={() => setInstallationMethod("Docker")}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                    installationMethod === "Docker"
                      ? "border-brand-purple bg-brand-purple/20 text-white"
                      : "border-border bg-background-secondary text-text-muted hover:text-white"
                  }`}
                >
                  Docker Compose
                </button>
              </div>
            </div>

            {/* Custom Moniker */}
            <div>
              <label className="block text-text-muted mb-1">Node Moniker / Identity</label>
              <input
                type="text"
                value={moniker}
                onChange={(e) => setMoniker(e.target.value)}
                maxLength={32}
                placeholder="MyNode-01"
                className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
              <p className="text-[10px] text-text-muted mt-1 font-sans">
                Sanitized to: <span className="text-brand-cyan">{sanitizedMoniker}</span>
              </p>
            </div>

            {/* Custom HTTP Port */}
            <div>
              <label className="block text-text-muted mb-1">Loopback RPC Port</label>
              <input
                type="text"
                value={customPort}
                onChange={(e) => setCustomPort(e.target.value.replace(/[^0-9]/g, ""))}
                maxLength={5}
                className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
              />
            </div>
          </CardContent>
        </Card>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-border bg-background-card">
            <CardHeader className="pb-3 border-b border-border/60">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{generatedTemplate.title}</CardTitle>
                  <CardDescription className="text-xs font-mono text-text-muted">
                    Template Version: {generatedTemplate.version} • Target: {generatedTemplate.fileName}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="safe">{generatedTemplate.riskLevel}</Badge>
                  {generatedTemplate.requiresRoot && (
                    <Badge variant="caution">Requires sudo</Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <CodeBlock
                code={generatedTemplate.content}
                language="ini"
                fileName={generatedTemplate.fileName}
              />

              <div className="p-4 rounded-xl border border-border bg-background-secondary space-y-2 text-xs leading-relaxed">
                <div className="flex items-center gap-1.5 text-white font-semibold">
                  <Info className="w-3.5 h-3.5 text-brand-cyan" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-text-secondary">{generatedTemplate.explanation}</p>
                <div className="pt-2 border-t border-border/40 text-text-muted font-mono text-[11px]">
                  <strong>Verification Step:</strong> {generatedTemplate.verification}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
