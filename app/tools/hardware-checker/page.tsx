"use client";

import * as React from "react";
import Link from "next/link";
import {
  Cpu,
  Server,
  HardDrive,
  Wifi,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  HelpCircle,
  Layers,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { evaluateHardware } from "@/lib/services/data-service";

export default function HardwareCheckerPage() {
  const [networkSlug, setNetworkSlug] = React.useState("ethereum-sepolia");
  const [nodeType, setNodeType] = React.useState("Full Node");
  const [cpuCores, setCpuCores] = React.useState(4);
  const [ramGb, setRamGb] = React.useState(16);
  const [ssdGb, setSsdGb] = React.useState(500);
  const [bandwidthMbps, setBandwidthMbps] = React.useState(100);
  const [operatingSystem, setOperatingSystem] = React.useState("Ubuntu 24.04 LTS");

  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Awaited<ReturnType<typeof evaluateHardware>> | null>(null);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const evaluation = await evaluateHardware({
        networkSlug,
        nodeType,
        cpuCores: Number(cpuCores),
        ramGb: Number(ramGb),
        ssdGb: Number(ssdGb),
        bandwidthMbps: Number(bandwidthMbps),
        operatingSystem,
      });
      setResult(evaluation);
    } catch (err) {
      console.error("Evaluation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Evaluate on mount
  React.useEffect(() => {
    evaluateHardware({
      networkSlug,
      nodeType,
      cpuCores: Number(cpuCores),
      ramGb: Number(ramGb),
      ssdGb: Number(ssdGb),
      bandwidthMbps: Number(bandwidthMbps),
      operatingSystem,
    }).then(setResult);
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/tools" className="hover:text-text-primary">Tools</Link>
        <span>/</span>
        <span className="text-brand-cyan">Node Hardware Checker</span>
      </nav>

      {/* Header */}
      <div className="space-y-3 mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-purple-light font-mono">
          <Cpu className="w-3.5 h-3.5" />
          <span>SPECIFICATION BENCHMARK ENGINE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Node Hardware Compatibility Checker
        </h1>
        <p className="text-sm text-text-secondary max-w-2xl leading-relaxed">
          Verify whether your proposed hardware configuration (CPU, RAM, NVMe storage, and network)
          meets official validator or full node requirements before provisioning expensive cloud servers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form */}
        <Card className="lg:col-span-1 border-border bg-background-card">
          <CardHeader>
            <CardTitle className="text-lg">Server Configuration</CardTitle>
            <CardDescription className="text-xs">
              Enter your bare-metal or cloud VPS specifications.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEvaluate} className="space-y-4 text-xs font-mono">
              {/* Target Network */}
              <div>
                <label className="block text-text-muted mb-1">Target Network</label>
                <select
                  value={networkSlug}
                  onChange={(e) => setNetworkSlug(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="ethereum-sepolia">Ethereum Sepolia (Testnet)</option>
                  <option value="celestia">Celestia (Mainnet / Mocha)</option>
                  <option value="berachain-bartio">Berachain bArtio (Testnet)</option>
                  <option value="solana">Solana (Mainnet / Testnet)</option>
                  <option value="cosmos-hub">Cosmos Hub (Gaia)</option>
                  <option value="arbitrum-sepolia">Arbitrum Sepolia</option>
                </select>
              </div>

              {/* Node Type */}
              <div>
                <label className="block text-text-muted mb-1">Intended Node Type</label>
                <select
                  value={nodeType}
                  onChange={(e) => setNodeType(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="Full Node">Full Node (Execution + Consensus)</option>
                  <option value="Validator Node">Validator / Consensus Participant</option>
                  <option value="Light Node">Light Client (Sampling / Watcher)</option>
                  <option value="Archive Node">Archive Node (Full Historic State)</option>
                </select>
              </div>

              {/* CPU Cores */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-text-muted">CPU Cores:</label>
                  <span className="text-white font-bold">{cpuCores} Cores</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="64"
                  value={cpuCores}
                  onChange={(e) => setCpuCores(Number(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              {/* RAM */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-text-muted">System RAM:</label>
                  <span className="text-white font-bold">{ramGb} GB</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="256"
                  step="2"
                  value={ramGb}
                  onChange={(e) => setRamGb(Number(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              {/* SSD Storage */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-text-muted">Available SSD (NVMe):</label>
                  <span className="text-white font-bold">{ssdGb} GB</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="4000"
                  step="50"
                  value={ssdGb}
                  onChange={(e) => setSsdGb(Number(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              {/* Bandwidth */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-text-muted">Uplink Bandwidth:</label>
                  <span className="text-white font-bold">{bandwidthMbps} Mbps</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="1000"
                  step="10"
                  value={bandwidthMbps}
                  onChange={(e) => setBandwidthMbps(Number(e.target.value))}
                  className="w-full accent-brand-purple cursor-pointer"
                />
              </div>

              {/* Operating System */}
              <div>
                <label className="block text-text-muted mb-1">Host Operating System</label>
                <select
                  value={operatingSystem}
                  onChange={(e) => setOperatingSystem(e.target.value)}
                  className="w-full h-9 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                >
                  <option value="Ubuntu 24.04 LTS">Ubuntu 24.04 LTS (Recommended)</option>
                  <option value="Ubuntu 22.04 LTS">Ubuntu 22.04 LTS</option>
                  <option value="Debian 12 Bookworm">Debian 12 Bookworm</option>
                  <option value="RHEL / Rocky Linux 9">RHEL / Rocky Linux 9</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                className="w-full mt-2 font-sans"
                isLoading={loading}
              >
                Run Hardware Compatibility Test
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {result && (
            <>
              {/* Verdict Card */}
              <div
                className={`p-6 rounded-2xl border ${
                  result.status === "MEETS_RECOMMENDED"
                    ? "border-status-success/40 bg-status-success/10 text-status-success"
                    : result.status === "MEETS_MINIMUM"
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                    : "border-status-error/40 bg-status-error/10 text-status-error"
                } space-y-3`}
              >
                <div className="flex items-center gap-3">
                  {result.status === "MEETS_RECOMMENDED" ? (
                    <CheckCircle2 className="w-6 h-6 shrink-0" />
                  ) : result.status === "MEETS_MINIMUM" ? (
                    <AlertCircle className="w-6 h-6 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 shrink-0" />
                  )}
                  <div>
                    <span className="text-xs uppercase font-mono tracking-wider font-bold">
                      Compatibility Verdict
                    </span>
                    <h3 className="text-xl font-bold text-white">
                      {result.status === "MEETS_RECOMMENDED"
                        ? "Exceeds Recommended Specifications"
                        : result.status === "MEETS_MINIMUM"
                        ? "Meets Minimum Baseline Requirements"
                        : "Below Minimum Requirements"}
                    </h3>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-slate-200">
                  {result.message}
                </p>
              </div>

              {/* Detailed Breakdown Table */}
              <Card className="border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Component Breakdown vs Profile</CardTitle>
                </CardHeader>
                <CardContent className="overflow-x-auto">
                  <table className="w-full text-xs font-mono text-left">
                    <thead>
                      <tr className="border-b border-border/80 text-text-muted">
                        <th className="py-2 pr-4 font-normal">Component</th>
                        <th className="py-2 px-4 font-normal">Your Input</th>
                        <th className="py-2 px-4 font-normal">Minimum</th>
                        <th className="py-2 px-4 font-normal">Recommended</th>
                        <th className="py-2 pl-4 font-normal text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {result.details.map((check) => (
                        <tr key={check.component}>
                          <td className="py-2.5 pr-4 text-white font-medium">{check.component}</td>
                          <td className="py-2.5 px-4 text-slate-200">
                            {check.provided} {check.unit}
                          </td>
                          <td className="py-2.5 px-4 text-text-muted">
                            {check.min} {check.unit}
                          </td>
                          <td className="py-2.5 px-4 text-brand-purple-light">
                            {check.recommended} {check.unit}
                          </td>
                          <td className="py-2.5 pl-4 text-right">
                            {check.meetsRecommended ? (
                              <span className="text-status-success font-semibold">Recommended</span>
                            ) : check.meetsMin ? (
                              <span className="text-amber-400 font-semibold">Minimum</span>
                            ) : (
                              <span className="text-status-error font-semibold">Deficient</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>

              {/* Technical Architecture Notes & Source Link */}
              <div className="p-4 rounded-xl border border-border bg-background-secondary text-xs text-text-secondary space-y-2">
                <strong className="text-white block font-mono">Official Profile Notes:</strong>
                <p className="leading-relaxed">{result.notes}</p>
                <div className="pt-2 flex items-center justify-between border-t border-border/40 text-[11px]">
                  <span>Source: {result.networkName} Official Hardware Guidance</span>
                  <a
                    href={result.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-cyan hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    <span>View Official Specs</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
