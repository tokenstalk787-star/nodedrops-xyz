"use client";

import * as React from "react";
import { Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [message, setMessage] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to submit message");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="space-y-3 mb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-purple/40 bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
          <Mail className="w-3.5 h-3.5 text-brand-cyan" />
          <span>DIRECT INQUIRIES & TECHNICAL FEEDBACK</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Contact NodeDrops Support
        </h1>
        <p className="text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
          Questions about node documentation, partnership proposals, or security disclosures?
          Send us a message and our team will get back to you.
        </p>
      </div>

      <Card className="border-border bg-background-card">
        <CardHeader>
          <CardTitle className="text-lg">Submit Message</CardTitle>
          <CardDescription className="text-xs">
            All fields are required. Submissions are protected by rate limiting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="p-6 rounded-xl border border-status-success/30 bg-status-success/10 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-status-success mx-auto" />
              <h3 className="text-base font-bold text-white">Message Dispatched Successfully</h3>
              <p className="text-xs text-text-secondary max-w-sm mx-auto">
                Thank you for contacting NodeDrops.xyz. An infrastructure specialist will review your inquiry shortly.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSuccess(false)}
                className="mt-2 text-xs"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-lg border border-status-error/40 bg-status-error/10 text-xs text-status-error flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Your Name</label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Vance"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-text-muted mb-1">Email Address</label>
                  <Input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operator@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Subject</label>
                <Input
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry regarding Sepolia validator guide"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-text-muted mb-1">Message</label>
                <Textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Detail your question, error logs, or feedback..."
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={loading}
                className="w-full gap-2 text-xs font-semibold"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
