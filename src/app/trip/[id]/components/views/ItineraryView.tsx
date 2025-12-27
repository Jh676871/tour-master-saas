'use client'

import { useState } from 'react'
import { MapPin, Clock, ChevronRight, Navigation } from 'lucide-react'

interface ItineraryViewProps {
  days: any[]
}

export function ItineraryView({ days }: ItineraryViewProps) {
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const activeDay = days[activeDayIndex]

  // Auto-highlight logic
  // Calculate the active index for "Next/Current"
  // We want to find the first 'current' or 'future' event
  let activeItemIndex = -1
  if (activeDay) {
     const now = new Date()
     const dayDate = new Date(activeDay.day_date)
     const isToday = dayDate.getDate() === now.getDate() && 
                     dayDate.getMonth() === now.getMonth() && 
                     dayDate.getFullYear() === now.getFullYear()
     
     if (isToday) {
        activeItemIndex = activeDay.trip_day_attractions?.findIndex((tda: any) => {
            if (!tda.visit_time) return false
            const [h, m] = tda.visit_time.split(':').map(Number)
            const eventTime = new Date(activeDay.day_date)
            eventTime.setHours(h, m, 0, 0)
            // Return true if this event is in the future or started less than 1 hour ago
            return eventTime.getTime() > now.getTime() - 60 * 60 * 1000
        })
        if (activeItemIndex === -1) {
            // All passed, maybe highlight none or last?
            // If all passed today, maybe no highlight.
        }
     } else if (dayDate > now) {
         // Future day, first item is active
         activeItemIndex = 0
     }
  }

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] min-h-[calc(100vh-140px)]">
      {/* Day Tabs */}
      <div className="bg-white/80 backdrop-blur-md sticky top-[72px] z-20 pb-4 pt-2 border-b border-[#F1F5F9]">
        <div className="flex overflow-x-auto no-scrollbar px-6 gap-3">
          {days.map((day, index) => {
            const isActive = activeDayIndex === index
            const date = new Date(day.day_date)
            return (
              <button
                key={day.id}
                onClick={() => setActiveDayIndex(index)}
                className={`flex-shrink-0 relative px-6 py-3 rounded-[1.5rem] transition-all duration-300 ${
                  isActive 
                    ? 'bg-[#1E293B] text-white shadow-lg shadow-[#1E293B]/20 scale-105' 
                    : 'bg-white text-slate-400 border border-[#F1F5F9]'
                }`}
              >
                <div className="flex flex-col items-center">
                  <span className={`text-[10px] font-black uppercase tracking-wider mb-0.5 ${isActive ? 'text-slate-400' : 'text-slate-300'}`}>
                    Day {day.day_number}
                  </span>
                  <span className="text-lg font-black leading-none">
                    {date.getDate()}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Itinerary Timeline */}
      <div className="flex-1 px-6 py-8 pb-32">
        <div>
          {activeDay?.trip_day_attractions?.map((tda: any, idx: number) => {
              const attraction = tda.attractions
              const time = tda.visit_time ? tda.visit_time.slice(0, 5) : '--:--'
              const isLast = idx === activeDay.trip_day_attractions.length - 1
              
              const isHighlighted = idx === activeItemIndex
              const isPast = idx < activeItemIndex && activeItemIndex !== -1

              return (
                <div key={tda.id} className={`relative pl-6 pb-12 last:pb-0 animate-in fade-in slide-in-from-right-4 duration-500 fill-mode-backwards ${isPast ? 'opacity-50 grayscale' : 'opacity-100'}`} style={{ animationDelay: `${idx * 100}ms` }}>
                  {/* Vertical Timeline Line */}
                  {!isLast && (
                    <div className="absolute left-[7px] top-4 bottom-0 w-0.5 bg-slate-200" />
                  )}
                  
                  {/* Dot */}
                  <div className={`absolute left-0 top-3 w-4 h-4 rounded-full border-[3px] shadow-sm z-10 transition-all duration-500 ${isHighlighted ? 'bg-white border-[#4F46E5] scale-125 shadow-[0_0_0_4px_rgba(79,70,229,0.2)]' : 'bg-white border-slate-300'}`} />

                  {/* Content Card */}
                  <div className={`bg-white rounded-[2rem] p-6 shadow-sm border ml-4 hover:shadow-md transition-all active:scale-[0.99] duration-200 ${isHighlighted ? 'border-[#4F46E5] ring-1 ring-[#4F46E5]/10 shadow-[#4F46E5]/10' : 'border-[#F1F5F9]'}`}>
                    <div className="flex items-start justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${isHighlighted ? 'bg-[#4F46E5] text-white' : 'bg-slate-100 text-slate-600'}`}>
                        {time}
                      </span>
                      {attraction.duration && (
                         <span className="text-xs text-slate-400 font-medium">停留 {attraction.duration} 分鐘</span>
                      )}
                    </div>

                    <div className="flex gap-5">
                      {attraction.image_url && (
                        <div className="w-24 h-24 rounded-[1.2rem] bg-slate-100 flex-shrink-0 overflow-hidden shadow-inner">
                          <img 
                            src={attraction.image_url} 
                            alt={attraction.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h3 className="text-xl font-black text-[#1E293B] leading-tight mb-1.5">
                          {attraction.name}
                        </h3>
                        {attraction.address && (
                          <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{attraction.address}</span>
                          </p>
                        )}
                        
                        <button className="mt-4 w-fit bg-[#F8FAFC] text-[#4F46E5] hover:bg-indigo-50 px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-[#F1F5F9]">
                          <Navigation className="w-3 h-3" />
                          導航前往
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
            
            {(!activeDay?.trip_day_attractions || activeDay.trip_day_attractions.length === 0) && (
              <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-slate-400 font-medium">今日無行程安排</p>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}
