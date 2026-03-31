import { z } from 'zod'

// Step 1: Parser output — structured extraction from raw lead text
export const ExtractedDataSchema = z.object({
  clientName: z.string().describe('Full name or company name of the potential client'),
  industry: z.string().describe('Industry or vertical the client operates in'),
  budget: z.string().describe('Stated or inferred budget range (e.g. "$5k–$10k", "unknown")'),
  projectScope: z.string().describe('Brief description of what they want built or achieved'),
  timeline: z.string().describe('Desired delivery timeline, or "unspecified"'),
  hiddenPainPoint: z.string().describe(
    'The underlying business pain or anxiety that is NOT explicitly stated but is the real driver behind this request — e.g. "Losing market share to a competitor who ships faster"'
  ),
  sourceUrl: z.string().nullable().describe('Source URL if scraped from a brief page, otherwise null'),
})

export type ExtractedData = z.infer<typeof ExtractedDataSchema>

// Step 2: Strategist output — pitch strategy tailored to extracted data
export const ValuePropositionSchema = z.object({
  headline: z.string().describe('One punchy sentence — the value prop in plain language'),
  rationale: z.string().describe('2–3 sentences connecting this prop directly to the client\'s industry and pain point'),
})

export const PitchSectionSchema = z.object({
  title: z.string().describe('Section title (e.g. "The Problem", "Our Approach")'),
  content: z.string().describe('2–4 sentences of actual pitch copy for this section'),
})

export const PitchStrategySchema = z.object({
  positioningStatement: z.string().describe(
    'One sentence: who we are, who this is for, and the single most important outcome we deliver'
  ),
  valuePropositions: z.array(ValuePropositionSchema).length(3).describe(
    'Exactly 3 unique value propositions tailored to the client\'s industry and hidden pain point'
  ),
  pitchOutline: z.array(PitchSectionSchema).length(5).describe(
    '5-section pitch outline: Problem → Understanding → Approach → Evidence → Next Step'
  ),
  toneGuidance: z.string().describe(
    'One sentence on the communication tone to use with this client (e.g. "Direct and data-driven — avoid fluff")'
  ),
  urgencyHook: z.string().describe(
    'A one-line closing hook that creates urgency without being pushy'
  ),
})

export type PitchStrategy = z.infer<typeof PitchStrategySchema>
