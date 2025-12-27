'use client'

import { use, useState } from 'react'
import { joinTrip } from '../actions'
import { motion } from 'framer-motion'
import { UserCircle } from 'lucide-react'

export default function JoinTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    setError('')
    try {
      await joinTrip(id, formData)
    } catch (err: any) {
      setError(err.message || '無法加入，請重試')
      setLoading(false)
    }
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
