import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import type { ExtractedData, PitchStrategy } from '@/lib/schemas'
import { OpenTracker } from './open-tracker'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

interface PitchPageProps {
  params: Promise<{ id: string }>
}

// Map pitch outline index → section identity
const SECTION_META = [
  { tag: 'The Challenge',  label: '01' },
  { tag: 'The Vision',     label: '02' },
  { tag: 'The Roadmap',    label: '03' },
  { tag: 'The Investment', label: '04' },
  { tag: 'Next Step',      label: '05' },
]

export default async function PitchPage({ params }: PitchPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: lead, error } = await supabase
    .from('leads')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !lead) notFound()

  const extracted = lead.extracted_data as unknown as ExtractedData
  const strategy  = lead.pitch_strategy as unknown as PitchStrategy

  if (!extracted || !strategy) notFound()

  const sections = strategy.pitchOutline ?? []

  return (
    <div
      className={`${playfair.variable} ${dmSans.variable} min-h-screen`}
      style={{ background: '#f7f5f0', color: '#1a1a18' }}
    >
      {/* Open tracking — fires on mount, marks lead as 'pitched' */}
      <OpenTracker leadId={id} />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] flex flex-col justify-between px-8 md:px-20 pt-16 pb-12 overflow-hidden">
        {/* Decorative background geometry */}
        <div
          className="absolute right-0 top-0 w-[55vw] h-full pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, #1a1a18 40%)',
            opacity: 0.04,
          }}
        />
        <div
          className="absolute right-16 top-16 w-[1px] h-[60vh] pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #1a1a18 30%, transparent)' }}
        />

        {/* Nav bar */}
        <nav className="flex items-center justify-between">
          <span
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-dm)', color: '#999' }}
          >
            Adexra Studio
          </span>
          <span
            className="text-[11px] font-medium uppercase tracking-[0.22em]"
            style={{ fontFamily: 'var(--font-dm)', color: '#bbb' }}
          >
            Confidential · {new Date().getFullYear()}
          </span>
        </nav>

        {/* Main headline block */}
        <div className="max-w-4xl space-y-8 mt-auto pb-8">
          <p
            className="text-[11px] font-medium uppercase tracking-[0.25em]"
            style={{ fontFamily: 'var(--font-dm)', color: '#999' }}
          >
            Prepared for {extracted.clientName}
          </p>

          <h1
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: '#1a1a18',
            }}
          >
            {strategy.positioningStatement.split(' ').slice(0, 6).join(' ')}&nbsp;
            <em style={{ fontStyle: 'italic', fontWeight: 400, color: '#4a4a42' }}>
              {strategy.positioningStatement.split(' ').slice(6).join(' ')}
            </em>
          </h1>

          <p
            className="max-w-xl text-[15px] leading-[1.75]"
            style={{ fontFamily: 'var(--font-dm)', fontWeight: 300, color: '#6b6b60' }}
          >
            {extracted.projectScope}
          </p>
        </div>

        {/* Bottom metadata strip */}
        <div
          className="flex items-end justify-between border-t pt-6"
          style={{ borderColor: '#e0ddd6' }}
        >
          <div className="flex gap-12">
            {[
              { label: 'Industry',  value: extracted.industry },
              { label: 'Budget',    value: extracted.budget },
              { label: 'Timeline',  value: extracted.timeline },
            ].map(({ label, value }) => (
              <div key={label}>
                <p
                  className="text-[10px] uppercase tracking-[0.18em] mb-1"
                  style={{ fontFamily: 'var(--font-dm)', color: '#aaa' }}
                >
                  {label}
                </p>
                <p
                  className="text-[13px] font-medium"
                  style={{ fontFamily: 'var(--font-dm)', color: '#1a1a18' }}
                >
                  {value ?? 'TBD'}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-[1px]" style={{ background: '#1a1a18' }} />
            <span
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{ fontFamily: 'var(--font-dm)', color: '#999' }}
            >
              Scroll to explore
            </span>
          </div>
        </div>
      </section>

      {/* ── PAIN POINT REVEAL ──────────────────────────────────────────── */}
      <section
        className="px-8 md:px-20 py-28"
        style={{ background: '#1a1a18' }}
      >
        <div className="max-w-3xl mx-auto space-y-10">
          <p
            className="text-[10px] uppercase tracking-[0.28em]"
            style={{ fontFamily: 'var(--font-dm)', color: '#555' }}
          >
            What we heard between the lines
          </p>
          <blockquote
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
              lineHeight: 1.3,
              fontWeight: 400,
              fontStyle: 'italic',
              color: '#f7f5f0',
              borderLeft: '2px solid #e8ff4d',
              paddingLeft: '2rem',
            }}
          >
            &ldquo;{extracted.hiddenPainPoint}&rdquo;
          </blockquote>
          <p
            className="text-[13px] leading-[1.8]"
            style={{ fontFamily: 'var(--font-dm)', fontWeight: 300, color: '#666' }}
          >
            {strategy.toneGuidance}
          </p>
        </div>
      </section>

      {/* ── PITCH SECTIONS ─────────────────────────────────────────────── */}
      {sections.map((section, i) => {
        const meta    = SECTION_META[i] ?? { tag: section.title, label: `0${i + 1}` }
        const isEven  = i % 2 === 0
        const isDark  = i === 2 // Roadmap gets dark treatment

        return (
          <section
            key={i}
            className="relative px-8 md:px-20 py-24 md:py-32"
            style={{ background: isDark ? '#141412' : isEven ? '#f7f5f0' : '#f0ede6' }}
          >
            {/* Section number watermark */}
            <span
              className="absolute right-8 md:right-16 top-8 select-none"
              style={{
                fontFamily: 'var(--font-playfair)',
                fontSize: 'clamp(5rem, 12vw, 11rem)',
                fontWeight: 800,
                color: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)',
                lineHeight: 1,
                letterSpacing: '-0.04em',
                userSelect: 'none',
              }}
            >
              {meta.label}
            </span>

            <div className="max-w-2xl relative z-10 space-y-8">
              {/* Section tag */}
              <div className="flex items-center gap-4">
                <div
                  className="w-8 h-[1px]"
                  style={{ background: isDark ? '#e8ff4d' : '#1a1a18' }}
                />
                <p
                  className="text-[10px] uppercase tracking-[0.25em]"
                  style={{
                    fontFamily: 'var(--font-dm)',
                    color: isDark ? '#e8ff4d' : '#999',
                  }}
                >
                  {meta.tag}
                </p>
              </div>

              {/* Section heading */}
              <h2
                style={{
                  fontFamily: 'var(--font-playfair)',
                  fontSize: 'clamp(1.8rem, 4vw, 3rem)',
                  fontWeight: 600,
                  lineHeight: 1.15,
                  letterSpacing: '-0.015em',
                  color: isDark ? '#f7f5f0' : '#1a1a18',
                }}
              >
                {section.title}
              </h2>

              {/* Body copy */}
              <p
                className="text-[15px] leading-[1.85]"
                style={{
                  fontFamily: 'var(--font-dm)',
                  fontWeight: 300,
                  color: isDark ? '#888' : '#5a5a50',
                  maxWidth: '520px',
                }}
              >
                {section.content}
              </p>

              {/* Value prop callout on sections 0-2 */}
              {strategy.valuePropositions?.[i] && (
                <div
                  className="mt-6 p-6 rounded-sm"
                  style={{
                    background: isDark ? 'rgba(232,255,77,0.06)' : 'rgba(26,26,24,0.04)',
                    borderLeft: `2px solid ${isDark ? '#e8ff4d' : '#1a1a18'}`,
                  }}
                >
                  <p
                    className="text-[14px] font-medium leading-snug"
                    style={{
                      fontFamily: 'var(--font-dm)',
                      color: isDark ? '#e8ff4d' : '#1a1a18',
                    }}
                  >
                    {strategy.valuePropositions[i].headline}
                  </p>
                  <p
                    className="text-[13px] leading-[1.7] mt-2"
                    style={{
                      fontFamily: 'var(--font-dm)',
                      fontWeight: 300,
                      color: isDark ? '#666' : '#888',
                    }}
                  >
                    {strategy.valuePropositions[i].rationale}
                  </p>
                </div>
              )}
            </div>
          </section>
        )
      })}

      {/* ── URGENCY / CLOSING ──────────────────────────────────────────── */}
      <section
        className="px-8 md:px-20 py-32 relative overflow-hidden"
        style={{ background: '#f7f5f0' }}
      >
        {/* Decorative rule */}
        <div
          className="absolute left-0 top-0 w-full h-[1px]"
          style={{ background: 'linear-gradient(to right, transparent, #1a1a18 30%, transparent)' }}
        />

        <div className="max-w-3xl mx-auto space-y-12 text-center">
          <p
            className="text-[10px] uppercase tracking-[0.3em]"
            style={{ fontFamily: 'var(--font-dm)', color: '#bbb' }}
          >
            The closing note
          </p>
          <p
            style={{
              fontFamily: 'var(--font-playfair)',
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              lineHeight: 1.25,
              fontWeight: 500,
              fontStyle: 'italic',
              color: '#1a1a18',
            }}
          >
            {strategy.urgencyHook}
          </p>
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="h-[1px] w-16" style={{ background: '#ddd' }} />
            <span
              className="text-[12px] tracking-[0.15em] uppercase"
              style={{ fontFamily: 'var(--font-dm)', color: '#aaa' }}
            >
              Adexra Studio
            </span>
            <div className="h-[1px] w-16" style={{ background: '#ddd' }} />
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────────── */}
      <footer
        className="px-8 md:px-20 py-10 flex items-center justify-between border-t"
        style={{ borderColor: '#e0ddd6', background: '#f7f5f0' }}
      >
        <span
          className="text-[11px] uppercase tracking-[0.2em]"
          style={{ fontFamily: 'var(--font-dm)', color: '#ccc' }}
        >
          sniper.adexra.com
        </span>
        <span
          className="text-[11px]"
          style={{ fontFamily: 'var(--font-dm)', color: '#ccc' }}
        >
          Prepared {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </span>
      </footer>
    </div>
  )
}
