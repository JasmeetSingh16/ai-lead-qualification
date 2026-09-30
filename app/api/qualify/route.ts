import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { gateReport } from "../../../lib/report-gate";
import type { Result } from "../../lead-samples";
import { inputOf, previewOf, summaryOf } from "../../report-gate";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const qualificationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fit: {
      type: "number",
      minimum: 0,
      maximum: 25,
    },
    need: {
      type: "number",
      minimum: 0,
      maximum: 20,
    },
    budget: {
      type: "number",
      minimum: 0,
      maximum: 20,
    },
    timeline: {
      type: "number",
      minimum: 0,
      maximum: 15,
    },
    authority: {
      type: "number",
      minimum: 0,
      maximum: 10,
    },
    intent: {
      type: "number",
      minimum: 0,
      maximum: 10,
    },

    summary: {
      type: "string",
    },

    buying_signals: {
      type: "array",
      items: {
        type: "string",
      },
    },

    concerns: {
      type: "array",
      items: {
        type: "string",
      },
    },

    recommended_action: {
      type: "string",
    },

    next_best_action: {
      type: "string",
    },

    sales_brief: {
      type: "string",
    },

    suggested_response: {
      type: "string",
    },

    fit_evidence: {
      type: "string",
    },

    need_evidence: {
      type: "string",
    },

    budget_evidence: {
      type: "string",
    },

    timeline_evidence: {
      type: "string",
    },

    authority_evidence: {
      type: "string",
    },

    intent_evidence: {
      type: "string",
    },
  },

  required: [
    "fit",
    "need",
    "budget",
    "timeline",
    "authority",
    "intent",
    "summary",
    "buying_signals",
    "concerns",
    "recommended_action",
    "next_best_action",
    "sales_brief",
    "suggested_response",
    "fit_evidence",
    "need_evidence",
    "budget_evidence",
    "timeline_evidence",
    "authority_evidence",
    "intent_evidence",
  ],
};

/**
 * Calculate the final score using our application rules.
 *
 * Maximum:
 * Fit       = 25
 * Need      = 20
 * Budget    = 20
 * Timeline  = 15
 * Authority = 10
 * Intent    = 10
 *
 * Total     = 100
 */
function calculateScore(result: {
  fit: number;
  need: number;
  budget: number;
  timeline: number;
  authority: number;
  intent: number;
}) {
  const fit = Math.max(
    0,
    Math.min(25, Number(result.fit) || 0)
  );

  const need = Math.max(
    0,
    Math.min(20, Number(result.need) || 0)
  );

  const budget = Math.max(
    0,
    Math.min(20, Number(result.budget) || 0)
  );

  const timeline = Math.max(
    0,
    Math.min(15, Number(result.timeline) || 0)
  );

  const authority = Math.max(
    0,
    Math.min(10, Number(result.authority) || 0)
  );

  const intent = Math.max(
    0,
    Math.min(10, Number(result.intent) || 0)
  );

  return {
    fit,
    need,
    budget,
    timeline,
    authority,
    intent,
    score:
      fit +
      need +
      budget +
      timeline +
      authority +
      intent,
  };
}

/**
 * Convert score into a qualification.
 */
function getQualification(score: number) {
  if (score >= 80) {
    return "Hot Lead";
  }

  if (score >= 60) {
    return "Qualified Lead";
  }

  if (score >= 40) {
    return "Needs Nurturing";
  }

  return "Low Priority";
}

/**
 * Convert score into sales priority.
 */
function getPriority(score: number) {
  if (score >= 80) {
    return "High";
  }

  if (score >= 40) {
    return "Medium";
  }

  return "Low";
}

/**
 * Convert score into a simple sales status.
 */
function getStatus(score: number) {
  if (score >= 80) {
    return "Sales Qualified Lead";
  }

  if (score >= 60) {
    return "Marketing Qualified Lead";
  }

  if (score >= 40) {
    return "Needs Nurturing";
  }

  return "Low Priority";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      company,
      jobTitle,
      industry,
      companySize,
      budget,
      timeline,
      need,
      leadSource,
      notes,
    } = body;

    /**
     * Basic validation.
     */
    if (!need?.trim()) {
      return NextResponse.json(
        {
          error:
            "Please provide the lead's need or problem.",
        },
        { status: 400 }
      );
    }

    /**
     * Build the lead information sent to AI.
     */
    const leadInformation = `
Lead Name: ${name || "Not provided"}
Company: ${company || "Not provided"}
Job Title: ${jobTitle || "Not provided"}
Industry: ${industry || "Not provided"}
Company Size: ${companySize || "Not provided"}
Budget: ${budget || "Not provided"}
Buying Timeline: ${timeline || "Not provided"}
Need / Problem: ${need}
Lead Source: ${leadSource || "Not provided"}
Additional Notes: ${notes || "Not provided"}
`;

    const prompt = `
You are an expert B2B sales qualification analyst.

Your job is to evaluate the lead using ONLY the information provided.

Do not invent facts.

Do not assume missing information.

Do not claim that a lead will definitely purchase.

Your job is to estimate qualification based on the evidence available.

━━━━━━━━━━━━━━━━━━━━
QUALIFICATION FRAMEWORK
━━━━━━━━━━━━━━━━━━━━

FIT — maximum 25 points

Evaluate whether the lead appears to fit a typical target customer based on:
- Industry
- Company size
- Job role
- Business context
- Stated use case

NEED — maximum 20 points

Evaluate:
- How clearly the problem is described
- How important the problem appears
- Whether the product/service could reasonably address the stated problem

BUDGET — maximum 20 points

Evaluate:
- Whether a budget was provided
- Whether the budget appears appropriate
- Whether budget approval is known

If budget information is missing, do NOT assume there is no budget.

TIMELINE — maximum 15 points

Evaluate:
- Whether there is a specific buying timeline
- How soon the lead wants to act
- Whether there is urgency supported by the information

AUTHORITY — maximum 10 points

Evaluate:
- Job title
- Decision-making responsibility
- Whether purchasing authority is known

Do not assume that a senior title automatically means the person has final purchasing authority.

INTENT — maximum 10 points

Evaluate:
- Active evaluation
- Request for information
- Stated implementation plans
- Specific business need
- Other explicit buying signals

━━━━━━━━━━━━━━━━━━━━
SCORING RULES
━━━━━━━━━━━━━━━━━━━━

Fit: 0-25
Need: 0-20
Budget: 0-20
Timeline: 0-15
Authority: 0-10
Intent: 0-10

The final score will be calculated by the application.

You should provide ONLY the six component scores.

━━━━━━━━━━━━━━━━━━━━
EVIDENCE RULES
━━━━━━━━━━━━━━━━━━━━

For every qualification category, provide evidence explaining WHY you assigned that score.

Evidence must refer directly to information supplied about the lead.

Good example:

"The lead reports an active B2B lead-generation problem and is currently evaluating solutions."

Bad example:

"The company is definitely ready to purchase."

If information is missing, explicitly say so.

Example:

"Decision-making authority was not provided, so the authority score is conservative."

━━━━━━━━━━━━━━━━━━━━
BUYING SIGNALS
━━━━━━━━━━━━━━━━━━━━

List only signals supported by the supplied information.

Examples:

- Evaluating multiple solutions
- Specific implementation timeline
- Clear business problem
- Explicit request for help
- Budget provided

Do not invent signals.

━━━━━━━━━━━━━━━━━━━━
CONCERNS
━━━━━━━━━━━━━━━━━━━━

Identify important qualification gaps or risks.

Examples:

- Budget approval is unknown
- Decision-maker is unclear
- Technical requirements are unknown
- Timeline may need validation

Do not manufacture concerns if there is no evidence for them.

━━━━━━━━━━━━━━━━━━━━
SALES RECOMMENDATION
━━━━━━━━━━━━━━━━━━━━

Provide:

1. Recommended action
2. Next best action
3. Sales brief
4. Suggested response

The recommended action should tell a salesperson what to do next.

The next best action should be a specific practical step.

The sales brief should summarize the lead for a salesperson.

The suggested response should be professional, concise and natural.

Do not make unsupported promises.

━━━━━━━━━━━━━━━━━━━━
LEAD INFORMATION
━━━━━━━━━━━━━━━━━━━━

${leadInformation}
`;

    /**
     * Ask Groq for structured qualification data.
     */
    const completion =
      await groq.chat.completions.create({
        model: "openai/gpt-oss-20b",
        temperature: 0.1,

        messages: [
          {
            role: "system",
            content:
              "You are a precise B2B lead qualification analyst. Return only valid JSON matching the supplied schema. Never invent information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        response_format: {
          type: "json_schema",
          json_schema: {
            name: "lead_qualification",
            strict: true,
            schema: qualificationSchema,
          },
        },
      });

    const content =
      completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error(
        "The AI returned an empty response."
      );
    }

    const result = JSON.parse(content);

    /**
     * Calculate score ourselves.
     *
     * This prevents the AI from deciding the final
     * score and classification independently.
     */
    const calculated = calculateScore(result);

    result.fit = calculated.fit;
    result.need = calculated.need;
    result.budget = calculated.budget;
    result.timeline = calculated.timeline;
    result.authority = calculated.authority;
    result.intent = calculated.intent;
    result.score = calculated.score;

    /**
     * Classification is also controlled by our
     * application rules.
     */
    result.qualification = getQualification(
      calculated.score
    );

    result.priority = getPriority(
      calculated.score
    );

    result.status = getStatus(
      calculated.score
    );

    /**
     * Make sure arrays always exist.
     */
    result.buying_signals = Array.isArray(
      result.buying_signals
    )
      ? result.buying_signals
      : [];

    result.concerns = Array.isArray(result.concerns)
      ? result.concerns
      : [];

    /**
     * Return a preview plus the sealed full report (see lib/report-gate.ts).
     */
    return NextResponse.json(
      gateReport({
        agent: "lead-qualification",
        input: inputOf(body),
        summary: summaryOf(result as Result),
        full: result as Result,
        preview: previewOf(result as Result),
      })
    );
  } catch (error) {
    console.error(
      "Lead qualification error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to qualify this lead right now. Please try again.",
      },
      { status: 500 }
    );
  }
}