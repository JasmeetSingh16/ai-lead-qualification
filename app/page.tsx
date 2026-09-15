"use client";

import { FormEvent, useState } from "react";

type Result = {
  score: number;
  qualification: string;
  status: string;
  priority: string;

  summary: string;

  fit: number;
  need: number;
  budget: number;
  timeline: number;
  authority: number;
  intent: number;

  fit_evidence: string;
  need_evidence: string;
  budget_evidence: string;
  timeline_evidence: string;
  authority_evidence: string;
  intent_evidence: string;

  buying_signals: string[];
  concerns: string[];

  recommended_action: string;
  next_best_action: string;

  sales_brief: string;
  suggested_response: string;
};

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

export default function Home() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    jobTitle: "",
    industry: "",
    companySize: "",
    budget: "",
    timeline: "",
    need: "",
    leadSource: "",
    notes: "",
  });

  const [result, setResult] = useState<Result | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateField(
    name: string,
    value: string
  ) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.need.trim()) {
      setError(
        "Please describe the lead's need or problem."
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/qualify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Something went wrong."
        );
      }

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to qualify this lead."
      );
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setError("");
  }

  if (result) {
    return (
      <ResultDashboard
        result={result}
        leadName={form.name}
        company={form.company}
        onReset={reset}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Background />
      <Header />

      <section className="mx-auto max-w-6xl px-6 pb-8 pt-16 text-center">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
          <span>✦</span>
          Prioritize your best sales opportunities
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-[-0.04em] text-slate-950 sm:text-5xl">
          Know which leads are worth{" "}
          <span className="text-indigo-600">
            your time.
          </span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
          Enter your lead information and let AI
          evaluate fit, need, budget, timeline,
          authority and buying intent.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-20">
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_20px_70px_-25px_rgba(15,23,42,0.18)]"
        >
          <div className="border-b border-slate-200 p-7 sm:p-9">
            <SectionHeader
              step="01"
              title="Lead information"
              description="Add whatever information you have. Missing information will be handled conservatively."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              {fields.map(
                ([name, label, placeholder]) => (
                  <div key={name}>
                    <label
                      htmlFor={name}
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      {label}
                    </label>

                    <input
                      id={name}
                      value={
                        form[
                          name as keyof typeof form
                        ]
                      }
                      onChange={(event) =>
                        updateField(
                          name,
                          event.target.value
                        )
                      }
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-b border-slate-200 p-7 sm:p-9">
            <SectionHeader
              step="02"
              title="What does this lead need?"
              description="This is the most important piece of information for qualification."
            />

            <textarea
              value={form.need}
              onChange={(event) =>
                updateField(
                  "need",
                  event.target.value
                )
              }
              rows={5}
              placeholder="Describe the problem, goal or reason this lead is looking for your product or service..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />
          </div>

          <div className="p-7 sm:p-9">
            <SectionHeader
              step="03"
              title="Additional context"
              description="Optional information that may help the AI understand the opportunity."
              optional
            />

            <textarea
              value={form.notes}
              onChange={(event) =>
                updateField(
                  "notes",
                  event.target.value
                )
              }
              rows={4}
              placeholder="Anything else sales should know about this lead..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            />

            {error && (
              <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-slate-950 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Analyzing lead...
                </>
              ) : (
                <>
                  <span>✦</span>
                  Qualify Lead with AI
                  <span>→</span>
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs text-slate-400">
              AI-generated qualification. Always use
              human judgment before making sales
              decisions.
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}

function ResultDashboard({
  result,
  leadName,
  company,
  onReset,
}: {
  result: Result;
  leadName: string;
  company: string;
  onReset: () => void;
}) {
  const score = Math.round(result.score);

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <Background />
      <Header />

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <button
              onClick={onReset}
              className="mb-3 text-sm font-semibold text-slate-500 transition hover:text-indigo-600"
            >
              ← Analyze another lead
            </button>

            <h1 className="text-3xl font-bold tracking-tight text-slate-950">
              Lead qualification report
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {leadName || "Unnamed lead"}
              {company ? ` · ${company}` : ""}
            </p>
          </div>

          <div className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500">
            AI qualification complete
          </div>
        </div>

        {/* SCORE */}
        <div className="grid gap-6 lg:grid-cols-[330px_1fr]">
          <div className="rounded-3xl bg-slate-950 p-8 text-white shadow-xl shadow-slate-950/10">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Qualification score
            </p>

            <div className="mt-8 flex justify-center">
              <ScoreRing score={score} />
            </div>

            <div className="mt-6 text-center">
              <p className="text-2xl font-bold">
                {result.qualification}
              </p>

              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white">
                <span
                  className={`h-2 w-2 rounded-full ${
                    result.priority === "High"
                      ? "bg-red-400"
                      : result.priority === "Medium"
                      ? "bg-amber-400"
                      : "bg-slate-400"
                  }`}
                />

                {result.priority} priority
              </div>
            </div>
          </div>

          {/* DIAGNOSIS */}
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                  AI diagnosis
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight">
                  {result.status}
                </h2>
              </div>

              <span className="hidden rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 sm:block">
                {score}/100
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-600">
              {result.summary}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <ActionCard
                label="Recommended action"
                value={result.recommended_action}
              />

              <ActionCard
                label="Next best action"
                value={result.next_best_action}
              />
            </div>
          </div>
        </div>

        {/* BREAKDOWN */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
              Qualification breakdown
            </p>

            <h2 className="mt-2 text-xl font-bold tracking-tight">
              Why this lead scored {score}
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <EvidenceScore
              label="Fit"
              score={result.fit}
              max={25}
              evidence={result.fit_evidence}
            />

            <EvidenceScore
              label="Need"
              score={result.need}
              max={20}
              evidence={result.need_evidence}
            />

            <EvidenceScore
              label="Budget"
              score={result.budget}
              max={20}
              evidence={result.budget_evidence}
            />

            <EvidenceScore
              label="Timeline"
              score={result.timeline}
              max={15}
              evidence={result.timeline_evidence}
            />

            <EvidenceScore
              label="Authority"
              score={result.authority}
              max={10}
              evidence={result.authority_evidence}
            />

            <EvidenceScore
              label="Buying intent"
              score={result.intent}
              max={10}
              evidence={result.intent_evidence}
            />
          </div>
        </section>

        {/* SIGNALS */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <ListCard
            title="Buying signals"
            eyebrow="Positive indicators"
            icon="↗"
            items={result.buying_signals}
            empty="No strong buying signals were identified from the available information."
          />

          <ListCard
            title="Concerns & risks"
            eyebrow="Things to investigate"
            icon="!"
            items={result.concerns}
            empty="No significant concerns were identified from the available information."
          />
        </div>

        {/* SALES BRIEF */}
        <section className="mt-6 overflow-hidden rounded-3xl bg-indigo-600 p-7 text-white shadow-xl shadow-indigo-600/10 sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">
            AI sales brief
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            What sales should know
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-indigo-50 sm:text-base">
            {result.sales_brief}
          </p>
        </section>

        {/* RESPONSE */}
        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
                Suggested response
              </p>

              <h2 className="mt-2 text-xl font-bold tracking-tight">
                A starting point for your sales reply
              </h2>
            </div>

            <button
              onClick={() =>
                navigator.clipboard?.writeText(
                  result.suggested_response
                )
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Copy response
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-6 text-sm leading-7 text-slate-700">
            {result.suggested_response}
          </div>
        </section>

        <p className="mx-auto mt-10 max-w-2xl text-center text-xs leading-5 text-slate-400">
          This report is AI-generated based on the information
          provided. It is a sales-assistance tool, not a
          prediction of whether a lead will purchase.
        </p>
      </section>
    </main>
  );
}

function EvidenceScore({
  label,
  score,
  max,
  evidence,
}: {
  label: string;
  score: number;
  max: number;
  evidence: string;
}) {
  const percentage = Math.max(
    0,
    Math.min(100, (score / max) * 100)
  );

  return (
    <div className="rounded-2xl border border-slate-200 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-700">
          {label}
        </span>

        <span className="text-sm font-bold text-slate-900">
          {score}/{max}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-700"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <div className="mt-4 rounded-xl bg-slate-50 p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
          Evidence
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {evidence}
        </p>
      </div>
    </div>
  );
}

function ScoreRing({
  score,
}: {
  score: number;
}) {
  const radius = 70;
  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (score / 100) * circumference;

  return (
    <div className="relative h-44 w-44">
      <svg
        className="h-full w-full -rotate-90"
        viewBox="0 0 180 180"
      >
        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          className="text-white/10"
        />

        <circle
          cx="90"
          cy="90"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-indigo-400 transition-all duration-1000"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold">
          {score}
        </span>

        <span className="mt-1 text-xs text-slate-400">
          out of 100
        </span>
      </div>
    </div>
  );
}

function ActionCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-sm font-semibold leading-6 text-slate-800">
        {value}
      </p>
    </div>
  );
}

function ListCard({
  title,
  eyebrow,
  icon,
  items,
  empty,
}: {
  title: string;
  eyebrow: string;
  icon: string;
  items: string[];
  empty: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
          {icon}
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
            {eyebrow}
          </p>

          <h2 className="mt-1 text-xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {items.length > 0 ? (
        <div className="mt-6 space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600"
            >
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />

              <span>{item}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500">
          {empty}
        </p>
      )}
    </section>
  );
}

function SectionHeader({
  step,
  title,
  description,
  optional,
}: {
  step: string;
  title: string;
  description: string;
  optional?: boolean;
}) {
  return (
    <div className="mb-7">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
        Step {step}
      </p>

      <h2 className="mt-2 text-xl font-bold tracking-tight">
        {title}

        {optional && (
          <span className="ml-2 text-sm font-normal text-slate-400">
            Optional
          </span>
        )}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function Header() {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-sm font-bold text-white">
            AI
          </div>

          <div>
            <p className="text-sm font-bold tracking-tight">
              LeadIQ
            </p>

            <p className="text-[11px] text-slate-500">
              AI Lead Qualification
            </p>
          </div>
        </div>

        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI qualification engine
        </div>
      </div>
    </header>
  );
}

function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />

      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}