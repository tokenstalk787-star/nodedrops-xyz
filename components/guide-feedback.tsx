"use client";

import * as React from "react";
import { ThumbsUp, ThumbsDown, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface GuideFeedbackProps {
  guideId: string;
}

export function GuideFeedback({ guideId }: GuideFeedbackProps) {
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [selectedHelpful, setSelectedHelpful] = React.useState<boolean | null>(null);

  const handleSubmit = async (helpful: boolean) => {
    setSelectedHelpful(helpful);
    setLoading(true);
    try {
      await fetch("/api/guide-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guideId,
          helpful,
          message: message.trim() || undefined,
        }),
      });
      setSubmitted(true);
    } catch (e) {
      console.error("Feedback submission error:", e);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl border border-status-success/30 bg-status-success/10 flex items-center gap-3 text-xs text-status-success">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        <span>Thank you for your feedback! Your review helps keep our documentation accurate.</span>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl border border-border bg-background-card/80 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-semibold text-white">Was this guide helpful?</h4>
          <p className="text-xs text-text-muted mt-0.5">
            Let us know if you encountered any command errors or out-of-date instructions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => handleSubmit(true)}
            className="gap-1.5 text-xs hover:border-status-success hover:text-status-success"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>Yes, helpful</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={() => handleSubmit(false)}
            className="gap-1.5 text-xs hover:border-status-error hover:text-status-error"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>Needs fix</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
