'use client'

import { useEffect, useRef } from 'react'
import { markAsPitched } from './track'

export function OpenTracker({ leadId }: { leadId: string }) {
  const fired = useRef(false)
  useEffect(() => {
    if (fired.current) return
    fired.current = true
    markAsPitched(leadId)
  }, [leadId])
  return null
}
