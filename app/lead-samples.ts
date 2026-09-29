/* ------------------------------------------------------------------ */
/* Sample leads for "Try sample data", plus the example report shown   */
/* in the hero and in the empty state before the first run.           */
/* All people and companies here are fictional.                       */
/* ------------------------------------------------------------------ */

export type LeadForm = {
  name: string;
  company: string;
  jobTitle: string;
  industry: string;
  companySize: string;
  budget: string;
  timeline: string;
  need: string;
  leadSource: string;
  notes: string;
};

export type Result = {
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

export const emptyForm: LeadForm = {
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
};

export const sampleLeads: { label: string; lead: LeadForm }[] = [
  {
    label: "Multi-clinic dental group",
    lead: {
      name: "Priya Mehta",
      company: "Northwind Dental Group",
      jobTitle: "Director of Operations",
      industry: "Healthcare — multi-location dental clinics",
      companySize: "120 staff across 6 clinics",
      budget: "₹5–6 lakh per year, approved",
      timeline: "Live before 1 December",
      leadSource: "Demo request from the pricing page",
      need: "We get about 400 appointment enquiries a month through web forms and WhatsApp. Front-desk staff take 6–24 hours to reply and we lose patients to clinics that answer faster. We want an assistant that answers common questions, checks which treatment they're interested in and books them into our calendar.",
      notes: "Already comparing two other vendors. Our CFO signs off anything above ₹5 lakh and has seen the proposal. Asked for a call this week.",
    },
  },
  {
    label: "Small accounting firm",
    lead: {
      name: "Tom Becker",
      company: "Becker & Co. Accountants",
      jobTitle: "Partner",
      industry: "Accounting services",
      companySize: "12 employees",
      budget: "Not sure yet",
      timeline: "Maybe next quarter",
      leadSource: "Downloaded the AI automation guide",
      need: "Curious whether AI could help us chase clients for missing documents during tax season. Mostly exploring options for now.",
      notes: "Replied to our newsletter asking roughly what this costs.",
    },
  },
  {
    label: "Student project",
    lead: {
      name: "Alex",
      company: "",
      jobTitle: "Student",
      industry: "",
      companySize: "",
      budget: "",
      timeline: "",
      leadSource: "Contact form",
      need: "Doing a college project on AI chatbots and wanted to know which tools you use.",
      notes: "",
    },
  },
];

/** Illustrative output — used for the hero card and the empty state. */
export const exampleResult: Result = {
  score: 86,
  qualification: "Hot Lead",
  status: "Sales Qualified Lead",
  priority: "High",
  summary:
    "A six-clinic dental group with an approved budget, a clear deadline and a well-defined problem: slow replies are costing them patients. The buyer is actively comparing vendors.",
  fit: 23,
  need: 18,
  budget: 17,
  timeline: 13,
  authority: 7,
  intent: 8,
  fit_evidence: "Multi-location healthcare business with high enquiry volume — a strong match for an AI booking assistant.",
  need_evidence: "Reply times of 6–24 hours are directly linked to lost patients.",
  budget_evidence: "₹5–6 lakh per year is stated as approved.",
  timeline_evidence: "Wants to be live before 1 December.",
  authority_evidence: "Director of Operations; the CFO signs off and has seen the proposal.",
  intent_evidence: "Requested a demo and a call this week while comparing two vendors.",
  buying_signals: [
    "Budget approved for this financial year",
    "Specific go-live date",
    "Comparing vendors right now",
  ],
  concerns: ["Two competing vendors in the evaluation", "Calendar integration details still unknown"],
  recommended_action: "Book a discovery call this week and bring a clinic-specific demo.",
  next_best_action: "Send two call slots today and ask which calendar system the clinics use.",
  sales_brief:
    "Operations lead at a six-clinic dental group. Losing patients to slow replies; budget approved; wants to go live before December and is comparing two vendors.",
  suggested_response:
    "Hi Priya, thanks for the details. Replying within minutes instead of hours is exactly what we set this up to do. Could we do 30 minutes on Thursday or Friday? It would help to know which calendar system your clinics use.",
};
