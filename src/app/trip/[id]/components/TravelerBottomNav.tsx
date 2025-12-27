'use client'

import { Home, Calendar, BedDouble, Siren } from 'lucide-react'
import { motion } from 'framer-motion'

interface TravelerBottomNavProps {
  currentTab: string
  onTabChange: (tab: string) => void
}

export function TravelerBottomNav({ currentTab, onTabChange }: TravelerBottomNavProps) {
  const tabs = [
    { id: 'home', label: '首頁', icon: Home },
    { id: 'itinerary', label: '行程', icon: Calendar },
    { id: 'hotel', label: '飯店', icon: BedDouble },
    { id: 'emergency', label: '緊急', icon: Siren },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-[#F1F5F9] pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      <div className="flex justify-around items-center h-20 px-2">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="relative flex flex-col items-center justify-center w-full h-full group active:scale-90 transition-transform duration-200"
            >
              <div className={`relative p-3 rounded-[1.5rem] transition-all duration-300 ${isActive ? 'bg-[#F8FAFC] text-[#4F46E5]' : 'text-slate-400 group-hover:bg-[#F8FAFC]'}`}>
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 rounded-[1.5rem] bg-[#F8FAFC] -z-10"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <tab.icon className={`w-6 h-6 relative z-10 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 transition-colors ${isActive ? 'text-[#4F46E5]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
