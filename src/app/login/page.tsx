'use client'

import { login } from '../auth/actions'
import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

const initialState = {
  error: '',
}

export default function LoginPage() {
  // Explicitly cast login to any to avoid TS mismatch with useActionState in Next.js 16
  const [state, formAction, isPending] = useActionState(login as any, initialState)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-border bg-card p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary">TourMaster SaaS</h2>
          <p className="mt-2 text-sm text-muted-foreground">登入您的領隊帳號</p>
        </div>
        
        <form action={formAction} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">Email</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="電子郵件地址"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密碼</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="relative block w-full rounded-md border border-input bg-background px-3 py-2 text-foreground placeholder-muted-foreground focus:z-10 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                placeholder="密碼"
              />
            </div>
          </div>

          {state?.error && (
            <div className="text-center text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isPending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              登入
            </button>
          </div>
        </form>
        
        <div className="text-center text-sm">
          <Link href="/register" className="font-medium text-primary hover:text-primary/80">
            還沒有帳號？立即註冊
          </Link>
        </div>
      </div>
    </div>
  )
}
