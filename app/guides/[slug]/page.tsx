import { notFound } from "next/navigation";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  Calendar,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Terminal,
  HelpCircle,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import { getGuideBySlug } from "@/lib/services/data-service";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/ui/code-block";
import { GuideFeedback } from "@/components/guide-feedback";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return { title: "Guide Not Found" };
  return {
    title: guide.title,
    description: guide.excerpt,
  };
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-text-muted mb-6 font-mono">
        <Link href="/" className="hover:text-text-primary">Home</Link>
        <span>/</span>
        <Link href="/guides" className="hover:text-text-primary">Guides</Link>
        <span>/</span>
        <span className="text-brand-cyan truncate max-w-xs">{guide.title}</span>
      </nav>

      {/* Header */}
      <div className="space-y-4 pb-8 border-b border-border/80">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={guide.difficulty.toLowerCase() as "beginner" | "intermediate" | "advanced"}>
            {guide.difficulty}
          </Badge>
          <span className="text-xs font-mono text-brand-cyan">{guide.category}</span>
          <span className="text-xs text-text-muted">•</span>
          <span className="flex items-center gap-1 text-xs text-text-muted font-mono">
            <Clock className="w-3.5 h-3.5" />
            {guide.estimatedMinutes} minutes estimated
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
          {guide.title}
        </h1>

        <p className="text-base text-text-secondary leading-relaxed">
          {guide.excerpt}
        </p>

        {/* Verification and Attribution Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/40 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-4 text-text-muted">
            <span>Author: <strong className="text-white">{guide.authorName}</strong></span>
            {guide.reviewerName && (
              <span className="flex items-center gap-1 text-status-success font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified by {guide.reviewerName}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 text-text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-text-secondary" />
              Verified: {new Date(guide.lastVerifiedAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Table of Contents Sticky Sidebar */}
        <aside className="lg:col-span-1 order-2 lg:order-1">
          <div className="sticky top-24 space-y-4 p-4 rounded-xl border border-border bg-background-card/60 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono">
              Table of Contents
            </h4>
            <nav className="space-y-1.5">
              <a href="#overview" className="block text-text-secondary hover:text-brand-cyan transition-colors">
                1. Overview & Architecture
              </a>
              {guide.steps.map((step, idx) => (
                <a
                  key={step.orderIndex}
                  href={`#step-${idx + 1}`}
                  className="block text-text-secondary hover:text-brand-cyan transition-colors line-clamp-1"
                >
                  {idx + 2}. {step.title}
                </a>
              ))}
              <a href="#feedback" className="block text-text-secondary hover:text-brand-cyan transition-colors">
                Feedback & Troubleshooting
              </a>
            </nav>

            <div className="pt-3 border-t border-border/60">
              <Link
                href="/troubleshooting"
                className="flex items-center gap-1.5 text-xs text-brand-purple-light hover:underline"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Troubleshooting Hub</span>
              </Link>
            </div>
          </div>
        </aside>

        {/* Main Content & Steps */}
        <article className="lg:col-span-3 order-1 lg:order-2 space-y-8">
          {/* Overview text */}
          <section id="overview" className="prose prose-invert max-w-none text-sm text-text-secondary leading-relaxed space-y-4">
            <h2 className="text-xl font-bold text-white border-b border-border/60 pb-2">
              Overview & Architecture
            </h2>
            <div className="whitespace-pre-line font-sans">
              {guide.content}
            </div>
          </section>

          {/* Steps */}
          <section className="space-y-8 pt-4">
            <h2 className="text-xl font-bold text-white border-b border-border/60 pb-2">
              Step-by-Step Instructions
            </h2>

            {guide.steps.map((step, idx) => (
              <div
                key={step.orderIndex}
                id={`step-${idx + 1}`}
                className="rounded-xl border border-border bg-background-card p-6 space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-brand-purple/20 border border-brand-purple/40 text-brand-purple-light font-mono font-bold text-xs flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-lg font-bold text-white">{step.title}</h3>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed">
                  {step.explanation}
                </p>

                {/* Command if provided */}
                {step.command && (
                  <CodeBlock code={step.command} language="bash" />
                )}

                {/* Expected Output */}
                {step.expectedOutput && (
                  <div className="rounded-lg bg-[#060810] border border-border/60 p-3.5 text-xs font-mono space-y-1.5">
                    <span className="text-[10px] text-text-muted uppercase tracking-wider block">
                      Expected Output:
                    </span>
                    <pre className="text-slate-300 overflow-x-auto whitespace-pre-wrap">
                      {step.expectedOutput}
                    </pre>
                  </div>
                )}

                {/* Safety Warning */}
                {step.warning && (
                  <div className="rounded-lg bg-status-warning/10 border border-status-warning/30 p-3.5 flex items-start gap-3 text-xs text-status-warning">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="leading-relaxed">
                      <strong>Security Note:</strong> {step.warning}
                    </div>
                  </div>
                )}

                {/* Verification instructions */}
                {step.verificationInstructions && (
                  <div className="rounded-lg bg-background-secondary border border-border/60 p-3 flex items-start gap-2.5 text-xs text-text-secondary">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white">Verification Check:</strong>{" "}
                      {step.verificationInstructions}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </section>

          {/* Feedback Section */}
          <section id="feedback" className="pt-6">
            <GuideFeedback guideId={guide.id} />
          </section>
        </article>
      </div>
    </div>
  );
}
