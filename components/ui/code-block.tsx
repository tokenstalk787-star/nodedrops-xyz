"use client";

import * as React from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  fileName?: string;
}

export function CodeBlock({ code, language = "bash", fileName }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy:", e);
    }
  };

  return (
    <div className="relative my-4 rounded-xl border border-border bg-[#05070d] overflow-hidden text-sm group">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-background-card/50 text-xs text-text-secondary">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-3.5 h-3.5 text-brand-purple-light" />
          <span>{fileName || language}</span>
        </div>
        <button
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-background-secondary hover:bg-background-hover text-text-secondary hover:text-text-primary transition-colors text-xs font-mono"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-status-success" />
              <span className="text-status-success">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-xs font-mono text-slate-200 leading-relaxed scrollbar-thin">
        <pre className="selection:bg-brand-purple/40">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
