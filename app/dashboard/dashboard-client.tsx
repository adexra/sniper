'use client'

import { useState, useOptimistic, useTransition, useCallback, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Lead, LeadStatus } from '@/types/supabase'
import type { ExtractedData } from '@/lib/schemas'
import { updateLeadStatus } from './actions'
import { IngestionZone } from './ingestion-zone'

const STATUSES: { key: LeadStatus; label: string; accent: string; dot: string }[] = [
  { key: 'new',       label: 'Incoming',   accent: '#e8ff4d', dot: 'bg-[#e8ff4d]' },
  { key: 'pitched',   label: 'Pitched',    accent: '#60a5fa', dot: 'bg-blue-400' },
  { key: 'follow_up', label: 'Follow-Up',  accent: '#f97316', dot: 'bg-orange-400' },
  { key: 'closed',    label: 'Closed',     accent: '#34d399', dot: 'bg-emerald-400' },
  { key: 'lost',      label: 'Lost',       accent: '#71717a', dot: 'bg-zinc-500' },
]

function getClientName(lead: Lead): string {
  const d = lead.extracted_data as unknown as ExtractedData | null
  return d?.clientName ?? 'Unknown Client'
}

function getCoreProblem(lead: Lead): string {
  const d = lead.extracted_data as unknown as ExtractedData | null
  return d?.hiddenPainPoint ?? d?.projectScope ?? 'Brief not yet parsed'
}

function getIndustry(lead: Lead): string {
  const d = lead.extracted_data as unknown as ExtractedData | null
  return d?.industry ?? ''
}

function getBudget(lead: Lead): string {
  const d = lead.extracted_data as unknown as ExtractedData | null
  return d?.budget ?? ''
}

function formatDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// ── Editorial Card ─────────────────────────────────────────────────────────
function LeadCard({
  lead,
  accentColor,
  onStatusChange,
}: {
  lead: Lead
  accentColor: string
  onStatusChange: (id: string, status: LeadStatus) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const clientName  = getClientName(lead)
  const coreProblem = getCoreProblem(lead)
  const industry    = getIndustry(lead)
  const budget      = getBudget(lead)
  const initials    = clientName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <motion.div
      layout
      layoutId={lead.id}
      initial={{ opacity: 0, y: 16, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, y: -8 }}
      transition={{ type: 'spring', stiffness: 340, damping: 30 }}
      className="group relative rounded-xl border border-zinc-800/60 bg-[#0e0e0e] overflow-hidden hover:border-zinc-700 transition-colors"
      style={{ '--accent': accentColor } as React.CSSProperties}
    >
      {/* Left accent stripe */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-60 group-hover:opacity-100 transition-opacity"
        style={{ background: accentColor }}
      />

      <div className="pl-5 pr-4 pt-4 pb-4 space-y-3">
        {/* Top row: avatar + name + date */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-bold tracking-wider shrink-0"
              style={{ background: `${accentColor}18`, color: accentColor }}
            >
              {initials || '?'}
            </div>
            <div className="min-w-0">
              <Link
                href={`/leads/${lead.id}`}
                className="text-[13px] font-semibold text-zinc-100 hover:text-white truncate block leading-tight"
              >
                {clientName}
              </Link>
              {industry && (
                <p className="text-[10px] text-zinc-600 truncate leading-tight mt-0.5">
                  {industry}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {budget && (
              <span
                className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
                style={{ background: `${accentColor}12`, color: accentColor }}
              >
                {budget}
              </span>
            )}
            <span className="text-[10px] text-zinc-700 font-mono">
              {formatDate(lead.created_at)}
            </span>
          </div>
        </div>

        {/* Core problem — the headline */}
        <p className="text-[12px] leading-[1.55] text-zinc-400 line-clamp-2 font-medium">
          {coreProblem}
        </p>

        {/* Footer: status chip + action menu */}
        <div className="flex items-center justify-between pt-1">
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v) }}
              className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-widest text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: accentColor }}
              />
              {STATUSES.find(s => s.key === lead.status)?.label ?? lead.status}
              <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" className="opacity-40 mt-px">
                <path d="M1 2.5l3 3 3-3" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              </svg>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.12 }}
                  className="absolute bottom-full left-0 mb-2 z-50 min-w-[140px] rounded-xl border border-zinc-800 bg-[#141414] shadow-2xl overflow-hidden"
                >
                  {STATUSES.map(s => (
                    <button
                      key={s.key}
                      onClick={(e) => {
                        e.stopPropagation()
                        setMenuOpen(false)
                        if (s.key !== lead.status) onStatusChange(lead.id, s.key)
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-[11px] transition-colors ${
                        s.key === lead.status
                          ? 'text-zinc-100 bg-zinc-800/60'
                          : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800/40'
                      }`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: s.accent }}
                      />
                      {s.label}
                      {s.key === lead.status && (
                        <svg className="ml-auto" width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2.5 2.5L8 3" stroke={s.accent} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href={`/leads/${lead.id}`}
            className="text-[10px] font-medium text-zinc-700 hover:text-zinc-400 transition-colors uppercase tracking-wider"
          >
            Open →
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

// ── Column ─────────────────────────────────────────────────────────────────
function PipelineColumn({
  status,
  leads,
  onStatusChange,
}: {
  status: typeof STATUSES[number]
  leads: Lead[]
  onStatusChange: (id: string, s: LeadStatus) => void
}) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: status.accent }}
          />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            {status.label}
          </span>
        </div>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded-md"
          style={{ background: `${status.accent}12`, color: status.accent }}
        >
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="space-y-2.5">
        <AnimatePresence mode="popLayout">
          {leads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-xl border border-dashed border-zinc-800/60 py-8 flex items-center justify-center"
            >
              <span className="text-[11px] text-zinc-800">No leads</span>
            </motion.div>
          ) : (
            leads.map(lead => (
              <LeadCard
                key={lead.id}
                lead={lead}
                accentColor={status.accent}
                onStatusChange={onStatusChange}
              />
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
export function DashboardClient({ initialLeads }: { initialLeads: Lead[] }) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  const [optimisticLeads, updateOptimisticLeads] = useOptimistic(
    initialLeads,
    (prev: Lead[], { id, status }: { id: string; status: LeadStatus }) =>
      prev.map(l => l.id === id ? { ...l, status } : l)
  )

  const handleStatusChange = useCallback((id: string, status: LeadStatus) => {
    startTransition(async () => {
      updateOptimisticLeads({ id, status })
      await updateLeadStatus(id, status)
      router.refresh()
    })
  }, [router, updateOptimisticLeads])

  const handleLeadCreated = useCallback(() => {
    router.refresh()
  }, [router])

  const totalLeads = optimisticLeads.length
  const activeLeads = optimisticLeads.filter(l => l.status === 'new' || l.status === 'pitched' || l.status === 'follow_up').length

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-8 space-y-8">
        {/* Top bar */}
        <motion.header
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium uppercase tracking-[0.2em] text-zinc-600">
                  sniper.adexra.com
                </span>
                <span className="w-px h-3 bg-zinc-800" />
                <span className="text-[10px] font-mono text-zinc-700">v2</span>
              </div>
              <h1 className="text-xl font-semibold tracking-tight text-white mt-0.5">
                Lead Pipeline
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-5">
              <div className="text-right">
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Total</p>
                <p className="text-lg font-semibold font-mono leading-none text-zinc-300">{totalLeads}</p>
              </div>
              <div className="w-px h-8 bg-zinc-800" />
              <div className="text-right">
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest">Active</p>
                <p className="text-lg font-semibold font-mono leading-none text-[#e8ff4d]">{activeLeads}</p>
              </div>
            </div>

            <Link
              href="/"
              className="flex items-center gap-1.5 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors border border-zinc-800 hover:border-zinc-700 px-3 py-1.5 rounded-lg"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M5 2H2a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V8M8 1h3m0 0v3m0-3L5.5 6.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Intake
            </Link>
          </div>
        </motion.header>

        {/* Ingestion Zone */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <IngestionZone onLeadCreated={handleLeadCreated} />
        </motion.div>

        {/* Pipeline Board */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.16 }}
        >
          <LayoutGroup>
            <div className="grid grid-cols-5 gap-4">
              {STATUSES.map(status => (
                <PipelineColumn
                  key={status.key}
                  status={status}
                  leads={optimisticLeads.filter(l => l.status === status.key)}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          </LayoutGroup>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {totalLeads === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
            >
              <p className="text-zinc-800 text-sm">
                No leads yet — drop a brief above to begin.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
