'use server'

import { generateText, Output } from 'ai'
import { model, modelFull } from '@/lib/ai'
import { ExtractedDataSchema, PitchStrategySchema } from '@/lib/schemas'
import { createClient } from '@/utils/supabase/server'
import type { Json } from '@/types/supabase'

export type ProcessLeadResult =
  | { success: true; leadId: string }
  | { success: false; error: string }

async function scrapeUrl(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Sniper/1.0)' },
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  const html = await res.text()
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
    .slice(0, 8000)
}

export async function processLead(rawText: string): Promise<ProcessLeadResult> {
  try {
    const urlMatch = rawText.match(/https?:\/\/[^\s]+/)
    let content = rawText
    let sourceUrl: string | null = null

    if (urlMatch) {
      sourceUrl = urlMatch[0]
      try {
        const scraped = await scrapeUrl(sourceUrl)
        content = `[Scraped from ${sourceUrl}]\n\n${scraped}\n\n[Original message]\n${rawText}`
      } catch {
        content = rawText
      }
    }

    // ── Step 1: The Parser ──────────────────────────────────────────────────
    const { experimental_output: extractedData } = await generateText({
      model,
      experimental_output: Output.object({ schema: ExtractedDataSchema }),
      system: `You are an elite business analyst for a high-end creative studio.
Your job is to extract structured intelligence from raw freelance lead descriptions.
Read between the lines. The "hiddenPainPoint" is the most important field — it's
the real anxiety or business problem driving this request, never stated explicitly.
Be concise but specific. If information is missing, make a smart inference based on context.`,
      prompt: `Extract structured data from this lead:\n\n${content}`,
    })

    if (sourceUrl) {
      extractedData.sourceUrl = sourceUrl
    }

    // ── Step 2: The Strategist ──────────────────────────────────────────────
    const { experimental_output: pitchStrategy } = await generateText({
      model: modelFull,
      experimental_output: Output.object({ schema: PitchStrategySchema }),
      system: `You are the lead strategist at an elite creative studio that works with
category-defining brands. You craft surgical pitches that make prospects feel
deeply understood before a single proposal is sent.

Every value proposition must connect directly to the client's industry dynamics
and their hidden pain point — never generic. The pitch outline should flow like
a story that builds conviction. Tone: confident, specific, never salesy.`,
      prompt: `Generate a Sniper pitch strategy for this lead:

CLIENT: ${extractedData.clientName}
INDUSTRY: ${extractedData.industry}
BUDGET: ${extractedData.budget}
SCOPE: ${extractedData.projectScope}
TIMELINE: ${extractedData.timeline}
HIDDEN PAIN POINT: ${extractedData.hiddenPainPoint}

Create 3 value propositions and a 5-section pitch outline tailored specifically
to their industry and this pain point.`,
    })

    // ── Save to Supabase ────────────────────────────────────────────────────
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('leads')
      .insert({
        raw_text: rawText,
        extracted_data: extractedData as unknown as Json,
        pitch_strategy: pitchStrategy as unknown as Json,
        status: 'new' as const,
      })
      .select('id')
      .single()

    if (error) throw new Error(`DB insert failed: ${error.message}`)

    return { success: true, leadId: data.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return { success: false, error: message }
  }
}
