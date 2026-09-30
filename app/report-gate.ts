/* ------------------------------------------------------------------ */
/* What the free preview shows before the "Get your full report" form. */
/* Used by the API route (to build the preview it sends) and the page  */
/* (when the report isn't sealed and is only blurred).                 */
/* ------------------------------------------------------------------ */

import type { LeadForm, Result } from "./lead-samples";

/** Score, diagnosis and actions, plus the first two signals and first concern. */
export function previewOf(result: Result): Result {
  return {
    ...result,
    buying_signals: result.buying_signals.slice(0, 2),
    concerns: result.concerns.slice(0, 1),
    fit_evidence: "",
    need_evidence: "",
    budget_evidence: "",
    timeline_evidence: "",
    authority_evidence: "",
    intent_evidence: "",
    sales_brief: "",
    suggested_response: "",
  };
}

/** What the visitor entered, for the lead record. */
export function inputOf(form: Partial<LeadForm>): string {
  const parts = [
    form.company && `Company: ${form.company}`,
    form.industry && `Industry: ${form.industry}`,
    form.budget && `Budget: ${form.budget}`,
    form.timeline && `Timeline: ${form.timeline}`,
    `Need: ${form.need ?? ""}`,
  ];
  return parts.filter(Boolean).join(" · ");
}

export function summaryOf(result: Result): string {
  return `Score ${Math.round(result.score)}/100 · ${result.qualification} · ${result.priority} priority`;
}
