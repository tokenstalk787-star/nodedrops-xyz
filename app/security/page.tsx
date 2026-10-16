import { ShieldCheck, AlertTriangle, Key, Terminal, Lock } from "lucide-react";

export const metadata = {
  title: "Security & Scam Awareness",
  description: "Mandatory security standards for blockchain node operators and scam prevention checklist.",
};

export default function SecurityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs text-brand-cyan font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SECURITY PROTOCOL & ADVISORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Security & Scam Awareness
        </h1>
        <p className="text-sm text-text-secondary leading-relaxed">
          Running infrastructure connected to peer-to-peer networks requires uncompromising operational security.
          Follow these guidelines to safeguard your nodes, server credentials, and validator keys.
        </p>
      </div>

      <div className="space-y-6 text-xs text-text-secondary leading-relaxed">
        {/* Cardinal Rules */}
        <div className="p-6 rounded-2xl border border-status-warning/40 bg-status-warning/10 space-y-3">
          <div className="flex items-center gap-2 text-status-warning font-bold text-sm">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>The Cardinal Security Rules of Node Operation</span>
          </div>
          <ul className="space-y-2 list-disc list-inside text-slate-200">
            <li>
              <strong>Never disclose your 12/24-word recovery seed phrase or validator private keys</strong> to anyone, including node support groups, Discord bots, or website administrators.
            </li>
            <li>
              <strong>NodeDrops.xyz never requires wallet connections</strong> for reading guides, evaluating hardware, or running commands. Any website pretending to be NodeDrops and prompting for a wallet approval is an imposter.
            </li>
            <li>
              <strong>Never pipe remote scripts directly into bash</strong> (<code className="text-status-warning">curl https://example.com/install.sh | bash</code>) without downloading and reading the shell code first.
            </li>
            <li>
              <strong>Never expose RPC ports (8545, 8551, 26657, 9090) to public 0.0.0.0</strong> without authenticated reverse proxies or VPN isolation. Unprotected RPC endpoints can allow external attackers to drain funds or cause denial of service.
            </li>
          </ul>
        </div>

        {/* Server Hardening Checklist */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-brand-purple-light" />
            <span>Server Hardening Standards</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-2">
              <strong className="text-white block">1. Ed25519 Key-Only SSH</strong>
              <p>Disable password authentication in <code className="text-brand-cyan">/etc/ssh/sshd_config</code>. Set <code className="text-brand-cyan">PasswordAuthentication no</code> and reload sshd.</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-2">
              <strong className="text-white block">2. Strict Firewall (UFW)</strong>
              <p>Block all incoming ports by default. Explicitly allow only your custom SSH port and verified P2P ports (e.g. 30303 for Geth).</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-2">
              <strong className="text-white block">3. Fail2ban Protection</strong>
              <p>Deploy Fail2ban to automatically blacklist IP addresses scanning for open SSH or port exploits.</p>
            </div>
            <div className="p-4 rounded-xl border border-border bg-background-card space-y-2">
              <strong className="text-white block">4. Isolated Service Accounts</strong>
              <p>Run node client software under unprivileged dedicated system users with locked login shells (<code className="text-brand-cyan">/usr/sbin/nologin</code>).</p>
            </div>
          </div>
        </div>

        {/* Reporting Security Vulnerabilities */}
        <div className="p-5 rounded-xl border border-border bg-background-secondary space-y-2">
          <strong className="text-white block">Reporting Security Issues:</strong>
          <p>
            If you discover a technical vulnerability or outdated/insecure command in our documentation, please report it immediately to our security response team at <a href="mailto:security@nodedrops.xyz" className="text-brand-cyan underline">security@nodedrops.xyz</a>.
          </p>
        </div>
      </div>
    </div>
  );
}
