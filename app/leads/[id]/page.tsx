import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { ExtractedData } from '@/lib/schemas'
import type { PitchStrategy } from '@/lib/schemas'

interface LeadPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadPage({ params }: LeadPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lead) notFound()

  const extracted = lead.extracted_data as unknown as ExtractedData
  const strategy = lead.pitch_strategy as unknown as PitchStrategy

  return (
    <main className="min-h-screen bg-black px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Lead Intelligence
          </p>
          <h1 className="text-3xl font-semibold text-white">
            {extracted?.clientName ?? 'Unknown Client'}
          </h1>
          <p className="text-sm text-zinc-400">{extracted?.industry}</p>
        </div>

        {/* Extracted Data */}
        <section className="space-y-4 rounded-2xl border border-white/10 bg-zinc-900 p-6">
          <h2 className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Parsed Brief
          </h2>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Budget', value: extracted?.budget },
              { label: 'Timeline', value: extracted?.timeline },
              { label: 'Scope', value: extracted?.projectScope },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-zinc-500">{label}</dt>
                <dd className="mt-0.5 text-sm text-zinc-100">{value}</dd>
              </div>
            ))}
            <div className="col-span-2">
              <dt className="text-xs text-zinc-500">Hidden Pain Point</dt>
              <dd className="mt-0.5 text-sm font-medium text-amber-400">
                {extracted?.hiddenPainPoint}
              </dd>
            </div>
          </dl>
        </section>

        {/* Strategy */}
        {strategy && (
          <section className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Positioning
              </p>
              <p className="mt-2 text-base text-zinc-100">{strategy.positioningStatement}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Value Propositions
              </p>
              {strategy.valuePropositions?.map((vp, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm font-semibold text-white">{vp.headline}</p>
                  <p className="text-sm text-zinc-400">{vp.rationale}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-white/10 bg-zinc-900 p-6 space-y-4">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Pitch Outline
              </p>
              {strategy.pitchOutline?.map((section, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-sm font-semibold text-white">
                    {i + 1}. {section.title}
                  </p>
                  <p className="text-sm text-zinc-400">{section.content}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5 space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-amber-600">
                Urgency Hook
              </p>
              <p className="text-sm font-medium text-amber-300">{strategy.urgencyHook}</p>
            </div>
          </section>
        )}

        <Link
          href="/"
          className="inline-block rounded-xl border border-white/10 px-5 py-2.5 text-sm text-zinc-400 transition hover:border-white/30 hover:text-zinc-100"
        >
          ← New lead
        </Link>
      </div>
    </main>
  )
}
