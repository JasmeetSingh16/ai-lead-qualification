"use client";

import {
  ArrowRight,
  CircleCheck,
  FileText,
  MessageSquareText,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { EmptyPreview, WorkspaceSection } from "../components/agent/AgentTemplate";
import { CopyButton, LoadingSteps, ScoreBar, ScoreGauge } from "../components/agent/AgentUi";
import { emptyForm, exampleResult, sampleLeads, type LeadForm, type Result } from "./lead-samples";

const fields = [
  ["name", "Lead name", "e.g. Sarah Johnson"],
  ["company", "Company", "e.g. Acme Inc."],
  ["jobTitle", "Job title", "e.g. Marketing Director"],
  ["industry", "Industry", "e.g. SaaS"],
  ["companySize", "Company size", "e.g. 50–100 employees"],
  ["budget", "Budget", "e.g. $5,000–$10,000"],
  ["timeline", "Buying timeline", "e.g. Within 30 days"],
  ["leadSource", "Lead source", "e.g. Website form"],
] as const;

const LOADING_STEPS = ["Reading the lead", "Weighing fit & need", "Scoring six criteria", "Drafting the reply"];

export default function LeadQualifier() {
  const [form, setForm] = useState<LeadForm>(emptyForm);

  const [result, setResult] = useState<Result | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sampleIndex, setSampleIndex] = useState(-1);

  const formRef = useRef<HTMLFormElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const needRef = useRef<HTMLTextAreaElement>(null);

  function updateField(name: string, value: string) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function fillSample() {
    const next = (sampleIndex + 1) % sampleLeads.length;
    setSampleIndex(next);
    setForm(sampleLeads[next].lead);
    setError("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.need.trim()) {
      setError("Please describe the lead's need or problem.");
      needRef.current?.focus();
      return;
    }

    setLoading(true);
    setError("");
    outputRef.current?.scrollIntoView({ block: "start" });

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/api/qualify/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to qualify this lead.");
      formRef.current?.scrollIntoView({ block: "start" });
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
    formRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <WorkspaceSection
      title="Qualify a lead"
      text="Fill in what you know — only the need is required. Or load a sample lead to see how scoring changes."
      actions={
        <button type="button" className="jk-btn jk-btn--soft" onClick={fillSample}>
          <Sparkles size={16} aria-hidden="true" />
          {sampleIndex < 0 ? "Try sample data" : "Try another sample"}
        </button>
      }
    >
      <form ref={formRef} onSubmit={handleSubmit} className="jk-card lq-form" noValidate>
        <fieldset className="lq-pane">
          <legend className="lq-legend">
            <span className="lq-step">1</span>
            Lead details
            {sampleIndex >= 0 && <span className="lq-sample-tag">Sample: {sampleLeads[sampleIndex].label}</span>}
          </legend>
          <div className="grid gap-4 sm:grid-cols-2">
            {fields.map(([name, label, placeholder]) => (
              <div key={name} className="jk-field">
                <label htmlFor={name} className="jk-label">
                  {label}
                </label>
                <input
                  id={name}
                  value={form[name]}
                  onChange={(event) => updateField(name, event.target.value)}
                  placeholder={placeholder}
                  className="jk-input"
                />
              </div>
            ))}
          </div>
        </fieldset>

        <fieldset className="lq-pane lq-pane--need">
          <legend className="lq-legend">
            <span className="lq-step">2</span>
            The opportunity
          </legend>

          <div className="jk-field">
            <label htmlFor="need" className="jk-label">
              What does this lead need?
              <small>Required</small>
            </label>
            <textarea
              id="need"
              ref={needRef}
              value={form.need}
              onChange={(event) => updateField("need", event.target.value)}
              rows={6}
              required
              aria-invalid={error && !form.need.trim() ? true : undefined}
              aria-describedby="need-hint"
              placeholder="e.g. We get 400 enquiries a month and reply too slowly. We want an assistant that answers questions and books calls…"
              className="jk-textarea"
            />
            <p id="need-hint" className="jk-hint">
              The most important field. Describe the problem, goal or reason they got in touch.
            </p>
          </div>

          <div className="jk-field">
            <label htmlFor="notes" className="jk-label">
              Additional context
              <small>Optional</small>
            </label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) => updateField("notes", event.target.value)}
              rows={3}
              placeholder="e.g. Comparing two vendors. CFO signs off above ₹5 lakh."
              className="jk-textarea"
            />
          </div>

          {error && (
            <div className="jk-error" role="alert">
              <TriangleAlert size={18} aria-hidden="true" className="mt-px shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="jk-btn jk-btn--primary jk-btn--lg jk-btn--block">
            {loading ? "Qualifying…" : "Qualify this lead"}
            {!loading && <ArrowRight size={18} aria-hidden="true" />}
          </button>

          <p className="jk-fineprint text-center">
            AI-generated qualification. Always use human judgement before making sales decisions.
          </p>
        </fieldset>
      </form>

      <p className="jk-sr" role="status">
        {result && !loading ? "Report ready." : ""}
      </p>

      <div ref={outputRef} className="lq-output">
        {loading ? (
          <div className="jk-card">
            <LoadingSteps steps={LOADING_STEPS} />
          </div>
        ) : result ? (
          <LeadReport result={result} leadName={form.name} company={form.company} onReset={reset} />
        ) : (
          <EmptyPreview
            title="Your report appears here"
            text="A score out of 100, the evidence behind it, and a reply you can send. Here's an example."
          >
            <LeadReport result={exampleResult} leadName="Priya Mehta" company="Northwind Dental Group" />
          </EmptyPreview>
        )}
      </div>
    </WorkspaceSection>
  );
}

/* ------------------------------------------------------------------ */
/* REPORT                                                              */
/* ------------------------------------------------------------------ */

function reportAsText(result: Result, leadName: string, company: string) {
  return [
    `Lead qualification — ${leadName || "Unnamed lead"}${company ? `, ${company}` : ""}`,
    `Score: ${Math.round(result.score)}/100 · ${result.qualification} · ${result.priority} priority`,
    "",
    result.summary,
    "",
    `Recommended action: ${result.recommended_action}`,
    `Next best action: ${result.next_best_action}`,
    "",
    "Buying signals:",
    ...result.buying_signals.map((s) => `- ${s}`),
    "",
    "Concerns:",
    ...result.concerns.map((c) => `- ${c}`),
    "",
    `Sales brief: ${result.sales_brief}`,
  ].join("\n");
}

const priorityClass: Record<string, string> = {
  High: "lq-priority--high",
  Medium: "lq-priority--medium",
  Low: "lq-priority--low",
};

function LeadReport({
  result,
  leadName,
  company,
  onReset,
}: {
  result: Result;
  leadName: string;
  company: string;
  onReset?: () => void;
}) {
  const score = Math.round(result.score);

  const breakdown = [
    ["Fit", result.fit, 25, result.fit_evidence],
    ["Need", result.need, 20, result.need_evidence],
    ["Budget", result.budget, 20, result.budget_evidence],
    ["Timeline", result.timeline, 15, result.timeline_evidence],
    ["Authority", result.authority, 10, result.authority_evidence],
    ["Buying intent", result.intent, 10, result.intent_evidence],
  ] as const;

  return (
    <article className="lq-report" aria-label="Lead qualification report">
      <header className="lq-report-head">
        <div>
          <p className="jk-eyebrow">Qualification report</p>
          <h3 className="lq-report-title">
            {leadName || "Unnamed lead"}
            {company && <span> · {company}</span>}
          </h3>
        </div>
        {onReset && (
          <div className="flex flex-wrap gap-2">
            <CopyButton text={reportAsText(result, leadName, company)} label="Copy report" />
            <button type="button" className="jk-copy" onClick={onReset}>
              <RotateCcw size={15} aria-hidden="true" />
              Qualify another lead
            </button>
          </div>
        )}
      </header>

      {/* Score + diagnosis */}
      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <section className="jk-card jk-card-pad flex flex-col items-center text-center" aria-label="Score">
          <p className="jk-label-sm self-start">Qualification score</p>
          <div className="mt-4">
            <ScoreGauge value={score} label="out of 100" size={196} />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--jk-ink)]">{result.qualification}</p>
          <p className={`lq-priority ${priorityClass[result.priority] ?? "lq-priority--low"}`}>
            <span aria-hidden="true" />
            {result.priority} priority
          </p>
        </section>

        <section className="jk-card jk-card-pad" aria-label="Diagnosis">
          <p className="jk-label-sm">AI diagnosis</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-[var(--jk-ink)]">{result.status}</p>
          <p className="mt-4 max-w-2xl text-[1.0625rem] leading-7 text-[var(--jk-body)]">{result.summary}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <ActionCard icon={Target} label="Recommended action" value={result.recommended_action} />
            <ActionCard icon={ArrowRight} label="Next best action" value={result.next_best_action} />
          </div>
        </section>
      </div>

      {/* Breakdown */}
      <section className="jk-card jk-card-pad mt-4" aria-labelledby="lq-breakdown">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h4 id="lq-breakdown" className="text-xl font-bold tracking-tight text-[var(--jk-ink)]">
            Why this lead scored {score}
          </h4>
          <p className="jk-hint">Six criteria · 100 points</p>
        </div>
        <div className="mt-6 grid gap-x-10 gap-y-7 md:grid-cols-2">
          {breakdown.map(([label, value, max, evidence]) => (
            <ScoreBar key={label} label={label} value={value} max={max}>
              {evidence}
            </ScoreBar>
          ))}
        </div>
      </section>

      {/* Signals + concerns */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <FindingList
          title="Buying signals"
          icon={TrendingUp}
          tone="positive"
          items={result.buying_signals}
          empty="No strong buying signals were identified from the available information."
        />
        <FindingList
          title="Concerns to check"
          icon={TriangleAlert}
          tone="warning"
          items={result.concerns}
          empty="No significant concerns were identified from the available information."
        />
      </div>

      {/* Brief + reply */}
      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        <section className="lq-brief" aria-labelledby="lq-brief-title">
          <div className="flex items-center gap-2">
            <FileText size={18} aria-hidden="true" />
            <h4 id="lq-brief-title" className="lq-brief-label">
              Sales brief
            </h4>
          </div>
          <p className="mt-4 text-[1.0625rem] leading-7">{result.sales_brief}</p>
        </section>

        <section className="jk-card jk-card-pad" aria-labelledby="lq-reply-title">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[var(--jk-ink)]">
              <MessageSquareText size={18} aria-hidden="true" className="text-[var(--agent-accent)]" />
              <h4 id="lq-reply-title" className="text-base font-bold">
                Suggested reply
              </h4>
            </div>
            <CopyButton text={result.suggested_response} label="Copy reply" />
          </div>
          <blockquote className="lq-reply">{result.suggested_response}</blockquote>
        </section>
      </div>

      <p className="jk-fineprint mx-auto mt-6 max-w-2xl text-center">
        This report is AI-generated from the information provided. It is a sales-assistance tool, not a prediction of
        whether a lead will buy.
      </p>
    </article>
  );
}

function ActionCard({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="lq-action">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-[var(--agent-accent-ink)]">
        <Icon size={15} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-2 text-[15px] font-medium leading-6 text-[var(--jk-ink)]">{value}</p>
    </div>
  );
}

function FindingList({
  title,
  icon: Icon,
  tone,
  items,
  empty,
}: {
  title: string;
  icon: typeof Target;
  tone: "positive" | "warning";
  items: string[];
  empty: string;
}) {
  return (
    <section className="jk-card jk-card-pad" aria-label={title}>
      <div className="flex items-center gap-3">
        <span className={`lq-finding-icon lq-finding-icon--${tone}`}>
          <Icon size={18} aria-hidden="true" />
        </span>
        <h4 className="text-lg font-bold tracking-tight text-[var(--jk-ink)]">{title}</h4>
        <span className="ml-auto text-sm font-semibold text-[var(--jk-muted)]">{items.length}</span>
      </div>

      {items.length > 0 ? (
        <ul className="jk-findings mt-5">
          {items.map((item, index) => (
            <li key={index} className="jk-finding">
              {tone === "positive" ? (
                <CircleCheck size={17} aria-hidden="true" className="text-[var(--agent-accent)]" />
              ) : (
                <TriangleAlert size={17} aria-hidden="true" className="text-amber-600" />
              )}
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-5 rounded-xl bg-[var(--jk-surface-2)] p-4 text-sm leading-6 text-[var(--jk-muted)]">{empty}</p>
      )}
    </section>
  );
}
