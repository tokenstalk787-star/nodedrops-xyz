"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Save,
  Eye,
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Terminal,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock } from "@/components/ui/code-block";

interface Step {
  title: string;
  explanation: string;
  command: string;
  expectedOutput: string;
  warning: string;
  verificationInstructions: string;
}

export default function NewGuidePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [excerpt, setExcerpt] = React.useState("");
  const [content, setContent] = React.useState("");
  const [difficulty, setDifficulty] = React.useState("BEGINNER");
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(30);
  const [status, setStatus] = React.useState("PUBLISHED");
  const [steps, setSteps] = React.useState<Step[]>([
    {
      title: "Initial System Update & Packages",
      explanation: "Update local repositories and install build dependencies.",
      command: "sudo apt update && sudo apt upgrade -y",
      expectedOutput: "All packages up to date.",
      warning: "Ensure your firewall is active before proceeding.",
      verificationInstructions: "Run apt list --upgradable to confirm zero pending upgrades.",
    },
  ]);

  const [previewTab, setPreviewTab] = React.useState<"edit" | "preview">("edit");
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState<string | null>(null);

  // Auto-generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  const addStep = () => {
    setSteps([
      ...steps,
      {
        title: "",
        explanation: "",
        command: "",
        expectedOutput: "",
        warning: "",
        verificationInstructions: "",
      },
    ]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: keyof Step, val: string) => {
    const updated = [...steps];
    updated[index][field] = val;
    setSteps(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          difficulty,
          estimatedMinutes: Number(estimatedMinutes),
          status,
          steps: steps.map((s, idx) => ({ ...s, orderIndex: idx })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save guide.");
      }

      setMessage("Guide saved successfully!");
      setTimeout(() => {
        router.push("/admin/guides");
      }, 1500);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/guides">
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create New Node Guide</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewTab(previewTab === "edit" ? "preview" : "edit")}
            className="text-xs gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{previewTab === "edit" ? "Live Preview" : "Back to Editor"}</span>
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            size="sm"
            isLoading={loading}
            className="text-xs gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Guide</span>
          </Button>
        </div>
      </div>

      {message && (
        <div className="p-3 rounded-lg border border-brand-purple/40 bg-brand-purple/10 text-xs text-white">
          {message}
        </div>
      )}

      {previewTab === "edit" ? (
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Metadata Section */}
          <Card className="border-border bg-background-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Guide Overview & Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-text-muted mb-1 font-mono">Guide Title</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. How to Run an Ethereum Sepolia Node with Geth"
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1 font-mono">URL Slug</label>
                  <Input
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="run-ethereum-sepolia-node"
                  />
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-mono">Excerpt / Teaser</label>
                <Input
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Concise technical summary for card previews..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
                <div>
                  <label className="block text-text-muted mb-1">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="BEGINNER">BEGINNER</option>
                    <option value="INTERMEDIATE">INTERMEDIATE</option>
                    <option value="ADVANCED">ADVANCED</option>
                  </select>
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Est. Minutes</label>
                  <Input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  />
                </div>
                <div>
                  <label className="block text-text-muted mb-1">Publication Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full h-10 rounded-lg border border-border bg-background-secondary px-3 text-xs text-white focus:outline-none focus:border-brand-purple"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-text-muted mb-1 font-mono">Main Technical Overview (Markdown)</label>
                <Textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Detail prerequisites, architecture diagram explanation, client background..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Step Builder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">Interactive Step-by-Step Instructions</h2>
              <Button type="button" variant="outline" size="sm" onClick={addStep} className="text-xs gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>Add Step</span>
              </Button>
            </div>

            {steps.map((step, idx) => (
              <Card key={idx} className="border-border bg-background-card">
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-brand-purple/20 text-brand-purple-light font-bold flex items-center justify-center text-xs">
                      {idx + 1}
                    </span>
                    <CardTitle className="text-sm">Step {idx + 1}</CardTitle>
                  </div>
                  {steps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeStep(idx)}
                      className="text-text-muted hover:text-status-error text-xs transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </CardHeader>
                <CardContent className="space-y-3 font-mono">
                  <div>
                    <label className="block text-text-muted mb-1">Step Title</label>
                    <Input
                      value={step.title}
                      onChange={(e) => updateStep(idx, "title", e.target.value)}
                      placeholder="e.g. Generate Engine API Authentication JWT"
                    />
                  </div>

                  <div>
                    <label className="block text-text-muted mb-1">Technical Explanation</label>
                    <Input
                      value={step.explanation}
                      onChange={(e) => updateStep(idx, "explanation", e.target.value)}
                      placeholder="Explain why this step is necessary..."
                    />
                  </div>

                  <div>
                    <label className="block text-text-muted mb-1">Shell Command / Config</label>
                    <Textarea
                      rows={3}
                      value={step.command}
                      onChange={(e) => updateStep(idx, "command", e.target.value)}
                      placeholder="sudo mkdir -p /var/lib/..."
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-text-muted mb-1">Expected Output (Optional)</label>
                      <Input
                        value={step.expectedOutput}
                        onChange={(e) => updateStep(idx, "expectedOutput", e.target.value)}
                        placeholder="Log message or confirmation..."
                      />
                    </div>
                    <div>
                      <label className="block text-text-muted mb-1">Security Warning (Optional)</label>
                      <Input
                        value={step.warning}
                        onChange={(e) => updateStep(idx, "warning", e.target.value)}
                        placeholder="Keep permissions at 600..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-text-muted mb-1">Verification Instructions</label>
                    <Input
                      value={step.verificationInstructions}
                      onChange={(e) => updateStep(idx, "verificationInstructions", e.target.value)}
                      placeholder="How does the operator verify success?"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </form>
      ) : (
        /* Live Preview Mode */
        <div className="space-y-6">
          <div className="p-6 rounded-xl border border-border bg-background-card space-y-4">
            <h1 className="text-2xl font-bold text-white">{title || "Untitled Guide Preview"}</h1>
            <p className="text-xs text-text-secondary">{excerpt}</p>
            <div className="prose prose-invert text-xs text-text-secondary whitespace-pre-line border-t border-border/40 pt-4">
              {content}
            </div>
          </div>

          <div className="space-y-4">
            {steps.map((s, idx) => (
              <div key={idx} className="p-5 rounded-xl border border-border bg-background-card space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-brand-purple/20 text-brand-purple-light font-bold flex items-center justify-center text-xs">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white">{s.title || "Step Title"}</h3>
                </div>
                <p className="text-xs text-text-secondary">{s.explanation}</p>
                {s.command && <CodeBlock code={s.command} language="bash" />}
                {s.verificationInstructions && (
                  <div className="p-2.5 rounded bg-background-secondary text-xs text-text-muted">
                    Verification: {s.verificationInstructions}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
