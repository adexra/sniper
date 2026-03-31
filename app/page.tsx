import { LeadIntakeForm } from '@/components/lead-intake-form'

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-4 py-16">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            sniper.adexra.com
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Lead Intelligence Engine
          </h1>
          <p className="text-sm text-zinc-400">
            Drop a raw lead — Sniper extracts the brief, identifies the real pain
            point, and builds a precision pitch strategy in seconds.
          </p>
        </div>

        {/* Intake form */}
        <LeadIntakeForm />

        {/* Footer hint */}
        <p className="text-center text-xs text-zinc-700">
          Supports raw text, emails, job posts, or a direct URL to a project brief.
        </p>
      </div>
    </main>
  )
}
