'use client'

import { useState, useTransition, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { processLead } from '@/app/actions/process-lead'

interface IngestionZoneProps {
  onLeadCreated: () => void
}

export function IngestionZone({ onLeadCreated }: IngestionZoneProps) {
  const [text, setText] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const dropped = e.dataTransfer.getData('text')
    if (dropped) {
      setText(dropped)
      setIsExpanded(true)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  const handleZoneClick = () => {
    setIsExpanded(true)
    setTimeout(() => textareaRef.current?.focus(), 50)
  }

  const handleSubmit = () => {
    if (!text.trim() || isPending) return
    setError(null)
    startTransition(async () => {
      const result = await processLead(text.trim())
      if (result.success) {
        setSuccess(true)
        setText('')
        setTimeout(() => {
          setSuccess(false)
          setIsExpanded(false)
          onLeadCreated()
        }, 1800)
      } else {
        setError(result.error)
      }
    })
  }

  const charCount = text.length

  return (
    <div className="relative">
      <motion.div
        layout
        className={`relative rounded-2xl border transition-all duration-300 cursor-text overflow-hidden ${
          isDragging
            ? 'border-[#e8ff4d] shadow-[0_0_60px_rgba(232,255,77,0.25)]'
            : isExpanded
            ? 'border-zinc-700 shadow-[0_0_40px_rgba(232,255,77,0.08)]'
            : 'border-zinc-800 hover:border-zinc-600 hover:shadow-[0_0_30px_rgba(232,255,77,0.06)]'
        } bg-[#0c0c0c]`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!isExpanded ? handleZoneClick : undefined}
      >
        {/* Animated grid lines */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(232,255,77,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(232,255,77,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />

        {/* Glow pulse when dragging */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              className="absolute inset-0 pointer-events-none rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                background: 'radial-gradient(ellipse at center, rgba(232,255,77,0.12) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {!isExpanded ? (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-14 px-8 text-center gap-4"
            >
              <motion.div
                animate={{ scale: isDragging ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="w-14 h-14 rounded-xl border border-zinc-700 bg-zinc-900 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14M5 12l7-7 7 7" stroke="#e8ff4d" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <div>
                <p className="text-sm font-medium text-zinc-200 tracking-tight">
                  {isDragging ? 'Release to ingest' : 'Drop a raw lead here'}
                </p>
                <p className="text-xs text-zinc-600 mt-1">
                  Paste text, email, job post, or URL — Sniper does the rest
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-5 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-zinc-600">
                  Raw Lead Input
                </span>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsExpanded(false); setText('') }}
                  className="text-zinc-700 hover:text-zinc-400 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>

              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the brief, email, RFP, or job post exactly as received..."
                className="w-full min-h-[160px] bg-transparent text-sm text-zinc-200 placeholder:text-zinc-700 resize-none outline-none leading-relaxed font-mono"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit()
                }}
              />

              <div className="flex items-center justify-between pt-1 border-t border-zinc-800">
                <span className="text-[10px] text-zinc-700 font-mono">{charCount} chars</span>
                <div className="flex items-center gap-3">
                  {error && (
                    <span className="text-[10px] text-red-400">{error}</span>
                  )}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!text.trim() || isPending}
                    whileTap={{ scale: 0.97 }}
                    className={`relative flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                      success
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isPending
                        ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                        : 'bg-[#e8ff4d] text-black hover:bg-[#f0ff70] cursor-pointer'
                    }`}
                  >
                    {isPending && (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-3 h-3 border border-current border-t-transparent rounded-full inline-block"
                      />
                    )}
                    {success ? '✓ Captured' : isPending ? 'Processing...' : 'Fire'}
                    {!isPending && !success && (
                      <span className="text-black/40 text-[10px] font-normal">⌘↵</span>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
