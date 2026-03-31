'use client'

import { useState } from 'react'
import { signInWithPassword } from './actions'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPending(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await signInWithPassword(fd)
    if (result?.error) {
      setError(result.error)
      setPending(false)
    }
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-600">
            sniper.adexra.com
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-white">Sign in</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#e8ff4d] py-3 text-sm font-semibold text-black hover:bg-[#f0ff70] transition-colors disabled:opacity-50"
          >
            {pending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </main>
  )
}
