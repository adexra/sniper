'use client'

import { useActionState, useRef } from 'react'
import { processLead, type ProcessLeadResult } from '@/app/actions/process-lead'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type FormState =
  | { status: 'idle' }
  | { status: 'success'; leadId: string }
  | { status: 'error'; message: string }

const THINKING_STEPS = [
  { label: 'Parsing brief', icon: '🔍' },
  { label: 'Identifying hidden pain points', icon: '🧠' },
  { label: 'Generating value propositions', icon: '⚡' },
  { label: 'Crafting pitch strategy', icon: '🎯' },
  { label: 'Saving to CRM', icon: '💾' },
]

function GhostState() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-zinc-900 p-8">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Sniper Pipeline
          </p>
          <h2 className="text-xl font-semibold text-white">Analyzing lead...</h2>
        </div>

        <div className="space-y-3">
          {THINKING_STEPS.map((step, i) => (
            <div
              key={step.label}
              className="flex items-center gap-3 text-sm"
              style={{ animationDelay: `${i * 0.6}s` }}
            >
              <span className="text-base">{step.icon}</span>
              <span className="text-zinc-400">{step.label}</span>
              <span className="ml-auto animate-pulse text-zinc-600">...</span>
            </div>
          ))}
        </div>

        {/* Animated bar */}
        <div className="h-0.5 w-full overflow-hidden rounded-full bg-zinc-800">
          <div className="h-full animate-[shimmer_2s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-zinc-400 to-transparent" />
        </div>

        <p className="text-center text-xs text-zinc-600">
          This typically takes 10–20 seconds
        </p>
      </div>
    </div>
  )
}

async function formAction(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const rawText = formData.get('rawText') as string
  if (!rawText?.trim()) return { status: 'error', message: 'Lead text is required.' }

  const result: ProcessLeadResult = await processLead(rawText.trim())

  if (result.success) return { status: 'success', leadId: result.leadId }
  return { status: 'error', message: result.error }
}

export function LeadIntakeForm() {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const [state, action, isPending] = useActionState(formAction, { status: 'idle' })

  useEffect(() => {
    if (state.status === 'success') {
      router.push(`/leads/${state.leadId}`)
    }
  }, [state, router])

  return (
    <>
      {isPending && <GhostState />}

      <form ref={formRef} action={action} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="rawText" className="block text-sm font-medium text-zinc-300">
            Paste the lead brief
          </label>
          <textarea
            id="rawText"
            name="rawText"
            rows={8}
            disabled={isPending}
            placeholder={`Paste raw lead text here — job posting, email, Upwork description, or a URL to a project brief.\n\nExample: "Looking for a studio to redesign our SaaS dashboard. We have $15k budget, need it done in 6 weeks. Our biggest issue is users dropping off during onboarding..."`}
            className="w-full resize-none rounded-xl border border-white/10 bg-zinc-900 px-4 py-3 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-white/30 focus:ring-0 disabled:opacity-50"
          />
        </div>

        {state.status === 'error' && (
          <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm text-red-400">
            {state.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPending ? 'Processing...' : 'Run Sniper →'}
        </button>
      </form>
    </>
  )
}
