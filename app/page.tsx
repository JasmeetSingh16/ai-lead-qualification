import {
  ClipboardList,
  Clock,
  Gauge,
  Handshake,
  Inbox,
  ListChecks,
  MessageSquareText,
  Send,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import { AgentHero, AgentPage, HowItWorks, RelatedAgents, UseCases } from "../components/agent/AgentTemplate";
import LeadPreview from "./LeadPreview";
import LeadQualifier from "./LeadQualifier";

const SLUG = "lead-qualification";

export default function Home() {
  return (
    <AgentPage slug={SLUG}>
      <AgentHero
        slug={SLUG}
        headline={
          <>
            Know which leads will buy{"\u00a0"}— <em>in seconds.</em>
          </>
        }
        lede="Paste in what you know about a lead. The agent scores fit, need, budget, timeline, authority and intent out of 100, shows the evidence for every point, and drafts your first reply."
        chips={[
          { icon: Clock, label: "Scores in under 10 seconds" },
          { icon: ListChecks, label: "Evidence for every point" },
          { icon: ShieldCheck, label: "Never invents missing facts" },
        ]}
        preview={<LeadPreview />}
      />

      <LeadQualifier />

      <HowItWorks
        title={
          <>
            From a raw enquiry to a <em>scored, explained</em> lead.
          </>
        }
        text="The same framework runs on every lead, so two people looking at the same enquiry get the same answer."
        steps={[
          {
            icon: ClipboardList,
            title: "Add what you know",
            text: "Paste details from your form, inbox or CRM. Only the need is required — anything missing is scored conservatively instead of guessed.",
          },
          {
            icon: Gauge,
            title: "It's scored on six criteria",
            text: "Fit (25), need (20), budget (20), timeline (15), authority (10) and intent (10). The model rates each one and the app adds them up, so the total always follows the same rules.",
          },
          {
            icon: Send,
            title: "You get a plan, not just a number",
            text: "A priority, the next best action, a short brief for sales and a reply you can edit and send.",
          },
        ]}
      />

      <UseCases
        title="Where teams put it to work"
        text="Useful on its own today; more useful when it runs on every lead automatically."
        items={[
          {
            icon: Inbox,
            title: "Triage inbound enquiries",
            text: "Run every form fill and demo request through the agent and work the hot ones first. Low-priority leads go to nurture instead of onto your calendar.",
            who: "For sales teams with more leads than time",
          },
          {
            icon: MessageSquareText,
            title: "Prep for a discovery call",
            text: "Read the brief, see what's missing — budget, authority, timeline — and walk in with the right questions.",
            who: "For SDRs and founders",
          },
          {
            icon: Handshake,
            title: "Score partner referrals",
            text: "Judge leads passed on by partners with the same rules as your own, so referral quality is visible.",
            who: "For agencies and partner programmes",
          },
          {
            icon: Workflow,
            title: "Score leads inside your CRM",
            text: "We connect the agent to HubSpot, Zoho or GoHighLevel so each new contact arrives scored, tagged and routed — using your own qualification rules.",
            who: "Built by Jaseir for your stack",
          },
        ]}
      />

      <RelatedAgents slug={SLUG} zone={{ kind: "agent", slug: SLUG }} />
    </AgentPage>
  );
}
