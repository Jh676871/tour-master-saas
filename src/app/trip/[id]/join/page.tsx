'use client'

import { use, useState, useEffect } from 'react'
import { joinTrip, restoreSession } from '../actions'
import { motion } from 'framer-motion'
import { UserCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function JoinTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  // 1. Auto-Identification Check
  useEffect(() => {
    const checkExistingSession = async () => {
      if (typeof window === 'undefined') return

      const savedMemberId = localStorage.getItem(`traveler_id_${id}`)
      if (savedMemberId) {
        setLoading(true)
        try {
          // Verify ID with backend and restore cookie
          const result = await restoreSession(id, savedMemberId)
          if (result.success) {
            router.push(`/trip/${id}`)
            return
          } else {
            // Invalid ID (maybe deleted from DB), clear it
            localStorage.removeItem(`traveler_id_${id}`)
          }
        } catch (err) {
          console.error('Session restore failed', err)
        } finally {
          setLoading(false)
        }
      }
      setCheckingAuth(false)
    }

    checkExistingSession()
  }, [id, router])

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      const result = await joinTrip(id, formData)
      if (result && result.success && result.memberId) {
        // 2. Store in LocalStorage
        localStorage.setItem(`traveler_id_${id}`, result.memberId)
        
        // 3. Redirect
        router.push(`/trip/${id}`)
      } else {
        throw new Error('加入失敗')
      }
    } catch (err: unknown) {
      setError((err as Error).message || '無法加入，請重試')
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">正在確認身分...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8 rounded-2xl bg-white p-8 shadow-xl"
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
            <UserCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-black text-gray-900">
            歡迎加入行程
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            請確認您的姓名以開始使用
          </p>
        </div>
        
        <form action={handleSubmit} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <label htmlFor="name" className="sr-only">姓名</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="relative block w-full rounded-lg border-0 py-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-primary text-lg text-center font-bold"
                placeholder="請輸入您的姓名"
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-500 text-center bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full justify-center rounded-xl bg-primary px-3 py-4 text-lg font-bold text-white hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-70 transition-all active:scale-95 shadow-lg shadow-primary/30"
          >
            {loading ? '處理中...' : '確認加入'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
