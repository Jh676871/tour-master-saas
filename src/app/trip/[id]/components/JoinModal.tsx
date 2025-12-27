'use client'

import { useState, useEffect } from 'react'
import { joinTrip } from '../actions'

interface JoinModalProps {
  tripId: string
  tripTitle: string
}

export function JoinModal({ tripId, tripTitle }: JoinModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [isAutoJoining, setIsAutoJoining] = useState(true) // Start with auto-join state

  // Check localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem(`traveler_name_${tripId}`)
      if (savedName) {
        setName(savedName)
      } else {
        setIsAutoJoining(false)
      }
    }
  }, [tripId])

  useEffect(() => {
    const autoJoin = async () => {
      // Logic for auto-join only if we have a name
      if (!name) return

      const savedName = localStorage.getItem(`traveler_name_${tripId}`)
      
      // Prevent infinite loops by checking session storage
      const hasAttempted = sessionStorage.getItem(`auto_join_attempted_${tripId}`)
      
      if (savedName && isAutoJoining && !hasAttempted) {
        // Mark as attempted immediately to prevent loop
        sessionStorage.setItem(`auto_join_attempted_${tripId}`, 'true')
        
        setLoading(true)
        try {
          const formData = new FormData()
          formData.append('name', savedName)
          await joinTrip(tripId, formData)
        } catch (error: any) {
           if (error?.digest?.startsWith('NEXT_REDIRECT')) {
             throw error
           }
           console.error("Auto-join failed:", error)
           setIsAutoJoining(false)
           setLoading(false)
           // If failed (not redirect), maybe clear the attempt so they can try again? 
           // Or better, let them manual join.
           sessionStorage.removeItem(`auto_join_attempted_${tripId}`)
        }
      } else if (hasAttempted) {
        setIsAutoJoining(false)
      }
    }
    
    if (isAutoJoining && name) {
      autoJoin()
    }
  }, [tripId, isAutoJoining, name])

  // We'll wrap the server action to handle client state
  const handleSubmit = async (formData: FormData) => {
    setLoading(true)
    try {
      // Save to localStorage
      const inputName = formData.get('name') as string
      if (inputName) {
        localStorage.setItem(`traveler_name_${tripId}`, inputName)
      }
      
      await joinTrip(tripId, formData)
      // The action will redirect or we rely on revalidation
    } catch (error: any) {
      // Allow redirect to propagate
      if (error?.digest?.startsWith('NEXT_REDIRECT')) {
        throw error
      }
      console.error(error)
      setLoading(false)
    }
  }

  if (isAutoJoining) {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[60] flex flex-col">
        {/* Skeleton Header */}
        <div className="bg-slate-50/80 backdrop-blur-xl px-5 py-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
              <div className="h-8 w-48 bg-slate-200 rounded-full animate-pulse" />
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
          </div>
        </div>

        {/* Skeleton Content */}
        <div className="p-5 space-y-6 flex-1 pt-6">
          <div className="relative bg-white rounded-[2rem] p-7 shadow-sm ring-1 ring-black/5 h-[300px] overflow-hidden">
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50 to-transparent w-full h-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
             <div className="flex flex-col h-full justify-between relative z-10">
                <div className="space-y-4">
                  <div className="h-4 w-20 bg-slate-100 rounded-full" />
                  <div className="h-10 w-32 bg-slate-100 rounded-full" />
                </div>
                <div className="flex items-center gap-3">
                   <div className="w-6 h-6 rounded-full bg-slate-100 animate-pulse" />
                   <span className="text-slate-400 font-bold text-sm">正在恢復您的旅程...</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] z-[60] flex flex-col p-8">
      <div className="flex-1 flex flex-col justify-center items-center max-w-sm mx-auto w-full">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-sm shadow-[#4F46E5]/10 flex items-center justify-center mb-10 rotate-3 border border-[#F1F5F9]">
          <span className="text-5xl">👋</span>
        </div>
        
        <h1 className="text-4xl font-black text-[#1E293B] mb-3 text-center tracking-tight">
          歡迎加入
        </h1>
        <p className="text-slate-500 text-center mb-12 font-medium text-lg leading-relaxed">
          {tripTitle}
        </p>

        <form action={handleSubmit} className="w-full space-y-6">
          <div className="space-y-3">
            <label htmlFor="name" className="block text-sm font-bold text-slate-700 ml-1 uppercase tracking-wide">
              請問怎麼稱呼您？
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="輸入您的姓名"
              className="block w-full rounded-[1.5rem] border-0 py-5 px-6 text-[#1E293B] shadow-sm ring-1 ring-inset ring-[#F1F5F9] placeholder:text-slate-300 focus:ring-2 focus:ring-inset focus:ring-[#4F46E5] text-xl font-bold bg-white transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!name || loading}
            className="w-full rounded-[1.5rem] bg-[#4F46E5] py-5 px-6 text-lg font-bold text-white shadow-xl shadow-[#4F46E5]/20 hover:bg-[#4338ca] hover:shadow-2xl hover:shadow-[#4F46E5]/30 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#4F46E5] disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            {loading ? '加入中...' : '開始旅程'}
          </button>
        </form>

        <p className="mt-10 text-center text-xs text-slate-400 max-w-[240px] leading-relaxed">
          點擊開始即表示您同意加入本行程，我們將為您保存專屬的行程資訊。
        </p>
      </div>
    </div>
  )
}
