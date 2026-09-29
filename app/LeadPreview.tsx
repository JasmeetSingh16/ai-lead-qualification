import { Check } from "lucide-react";
import { ScoreBar, ScoreGauge } from "../components/agent/AgentUi";
import { exampleResult as r } from "./lead-samples";

/** Hero illustration: a compact version of a real report. */
export default function LeadPreview() {
  return (
    <div className="lq-hero-card" aria-hidden="true">
      <div className="jk-card overflow-hidden">
        <div className="flex items-center gap-3 border-b border-[var(--jk-line)] px-5 py-4">
          <span className="lq-avatar">PM</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--jk-ink)]">Priya Mehta</p>
            <p className="truncate text-[13px] text-[var(--jk-muted)]">Director of Operations · Northwind Dental</p>
          </div>
          <span className="lq-pill ml-auto">{r.qualification}</span>
        </div>

        <div className="grid items-center gap-5 px-5 py-6 sm:grid-cols-[auto_1fr]">
          <div className="mx-auto">
            <ScoreGauge value={r.score} label="out of 100" size={164} />
          </div>
          <div className="grid gap-4">
            <ScoreBar label="Fit" value={r.fit} max={25} />
            <ScoreBar label="Need" value={r.need} max={20} />
            <ScoreBar label="Budget" value={r.budget} max={20} />
          </div>
        </div>

        <div className="border-t border-[var(--jk-line)] bg-[var(--jk-surface-2)] px-5 py-4">
          <p className="jk-label-sm">Next best action</p>
          <p className="mt-1 text-[14.5px] font-medium leading-6 text-[var(--jk-ink)]">{r.next_best_action}</p>
        </div>
      </div>

      <p className="lq-float">
        <Check size={15} strokeWidth={2.6} />
        Reply drafted
      </p>
    </div>
  );
}
