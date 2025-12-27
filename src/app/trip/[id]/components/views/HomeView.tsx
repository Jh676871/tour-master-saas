'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, BedDouble, ChevronRight, CloudSun, Check } from 'lucide-react'

interface HomeViewProps {
  nextAttraction?: {
    name: string
    time: string
    image_url?: string
  }
  roomNumber?: string
  hotelName?: string
  onSwitchTab: (tab: string) => void
  isMorning: boolean
  memberName: string | null
}

export function HomeView({ nextAttraction, roomNumber, hotelName, onSwitchTab, isMorning, memberName }: HomeViewProps) {
  return (
    <div className="px-6 py-6 space-y-8">
      {/* Context-Aware Hero Card */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-br from-[#4F46E5]/20 to-slate-100 rounded-[2.2rem] blur-xl opacity-50 group-hover:opacity-70 transition duration-1000" />
        
        <div className="relative bg-white rounded-[2rem] p-8 shadow-sm ring-1 ring-[#F1F5F9] overflow-hidden">
          {/* Background Decorative Blob */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#4F46E5]/5 rounded-full blur-3xl -mr-10 -mt-10 opacity-60" />

          {isMorning ? (
            // Morning View: Departure Time
            <>
              <div className="flex items-start justify-between mb-10 relative z-10">
                <div>
                  <p className="text-sm font-bold text-slate-400 tracking-wide uppercase mb-2">今日出發</p>
                  <h2 className="text-5xl font-black text-[#1E293B] tracking-tight">
                    {nextAttraction?.time || '待定'}
                  </h2>
                </div>
                <div className="bg-[#F8FAFC] text-[#4F46E5] px-4 py-2.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-sm border border-[#F1F5F9]">
                  <CloudSun className="w-5 h-5" />
                  <span>24°C</span>
                </div>
              </div>
              
              <div className="space-y-6 relative z-10">
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-1.5 uppercase tracking-wide">前往目的地</p>
                  <p className="text-2xl font-bold text-[#1E293B] line-clamp-1">
                    {nextAttraction?.name || '自由活動'}
                  </p>
                </div>

                <button 
                  onClick={() => onSwitchTab('itinerary')}
                  className="w-full bg-[#F8FAFC] hover:bg-slate-100 text-[#1E293B] font-bold py-5 rounded-[1.5rem] flex items-center justify-center gap-2 transition-all active:scale-[0.98] border border-[#F1F5F9] shadow-sm"
                >
                  查看今日行程
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            // Evening View: Hotel & Room
            <>
              <div className="flex items-start justify-between mb-8 relative z-10">
                <div>
                  <p className="text-sm font-bold text-slate-400 tracking-wide uppercase mb-2">今晚入住</p>
                  <h2 className="text-3xl font-black text-[#1E293B] tracking-tight leading-tight line-clamp-2 max-w-[200px]">
                    {hotelName || '尚未安排'}
                  </h2>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-[#F8FAFC] flex items-center justify-center text-[#4F46E5] shadow-sm border border-[#F1F5F9]">
                  <BedDouble className="w-7 h-7" />
                </div>
              </div>

              <div className="mb-10 relative z-10">
                <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">我的房號</p>
                <p className="text-7xl font-black text-[#4F46E5] tracking-tighter">
                  {roomNumber || '--'}
                </p>
              </div>

              <button 
                onClick={() => onSwitchTab('hotel')}
                className="w-full bg-[#1E293B] text-white font-bold py-5 rounded-[1.5rem] shadow-lg shadow-[#1E293B]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-all relative z-10"
              >
                開啟房卡模式
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Action / Status Button */}
      <div className="w-full group relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-500" />
        <div className="relative bg-white border border-indigo-100 p-2 pr-6 rounded-full flex items-center gap-4 shadow-sm group-active:scale-[0.98] transition-all duration-200">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
            <Check className="w-6 h-6" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-bold text-slate-900">我已報到</p>
            <p className="text-[10px] font-medium text-slate-500">點擊確認您的狀態</p>
          </div>
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
        </div>
      </div>
    </div>
  )
}
