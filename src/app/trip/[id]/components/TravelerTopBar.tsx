'use client'

import { useState, useEffect } from 'react'
import { CloudSun, Menu } from 'lucide-react'

interface TravelerTopBarProps {
  memberName: string | null
  tripTitle: string
}

export function TravelerTopBar({ memberName, tripTitle }: TravelerTopBarProps) {
  // Use state to avoid hydration mismatch for date/time
  const [dateInfo, setDateInfo] = useState({
    dateStr: '',
    weekDay: '',
    greeting: '你好'
  })

  useEffect(() => {
    const today = new Date()
    const dateStr = `${today.getMonth() + 1}/${today.getDate()}`
    const weekDay = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][today.getDay()]
    
    const hour = today.getHours()
    let greeting = '你好'
    if (hour < 12) greeting = '早安'
    else if (hour < 18) greeting = '午安'
    else greeting = '晚安'
    
    setDateInfo({ dateStr, weekDay, greeting })
  }, [])

  if (!dateInfo.dateStr) return null // Or a skeleton

  return (
    <div className="sticky top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 px-6 py-4 border-b border-[#F1F5F9]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold tracking-wide uppercase mb-1">
            <span>{dateInfo.dateStr} {dateInfo.weekDay}</span>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <div className="flex items-center gap-1 text-[#4F46E5]">
              <CloudSun className="w-3.5 h-3.5" />
              <span>24°C</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1E293B] truncate max-w-[240px] leading-tight tracking-tight">
            {memberName ? `${dateInfo.greeting}，${memberName}` : tripTitle}
          </h1>
        </div>

        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm border border-[#F1F5F9]">
          <div className="w-2.5 h-2.5 bg-[#4F46E5] rounded-full animate-pulse shadow-[0_0_8px_rgba(79,70,229,0.6)]" />
        </div>
      </div>
    </div>
  )
}
