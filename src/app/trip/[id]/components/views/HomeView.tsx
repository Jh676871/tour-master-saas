'use client'

import { motion } from 'framer-motion'
import { MapPin, BedDouble, ChevronRight, Car, Clock } from 'lucide-react'

interface HomeViewProps {
  roomNumber?: string
  hotelName?: string
  hotelAddress?: string
  todaysAttractions: any[]
  onSwitchTab: (tab: string) => void
  memberName: string | null
}

export function HomeView({ roomNumber, hotelName, hotelAddress, todaysAttractions, onSwitchTab, memberName }: HomeViewProps) {
  const openTaxiMap = () => {
    if (hotelAddress) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelAddress)}`, '_blank')
    }
  }

  return (
    <div className="px-6 py-6 space-y-6">
      
      {/* 1. Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1E293B]">
          Hi, {memberName || '旅客'} 👋
        </h1>
        <p className="text-slate-500 text-sm">歡迎參加今天的旅程</p>
      </div>

      {/* 2. Room Card (Dynamic) */}
      <div className="relative group overflow-hidden rounded-[2rem] shadow-lg transition-all hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4F46E5] to-[#6366F1]" />
        
        {/* Decorative Circles */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-xl" />

        <div className="relative p-8 text-white">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="text-xs font-bold tracking-widest uppercase opacity-80 mb-1">今晚入住</p>
                <h2 className="text-xl font-bold leading-tight line-clamp-2 max-w-[200px]">
                  {hotelName || '尚未安排飯店'}
                </h2>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                <BedDouble className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-4">
              {roomNumber ? (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                >
                   <p className="text-xs font-bold uppercase opacity-80 mb-1">您的房號</p>
                   <div className="flex items-baseline gap-2">
                     <span className="text-6xl font-black tracking-tighter drop-shadow-md">
                       {roomNumber}
                     </span>
                     <span className="text-xl font-medium opacity-80">號房</span>
                   </div>
                   <div className="mt-2 inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs backdrop-blur-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      已分配完成
                   </div>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-3 py-2">
                  <div className="flex items-center gap-3">
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <p className="font-medium text-lg">領隊正在分房中...</p>
                  </div>
                  <p className="text-sm opacity-70 pl-8">請稍候，分房完成後將自動顯示房號</p>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* 3. Taxi Button */}
      {hotelAddress && (
         <button 
           onClick={openTaxiMap}
           className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-[#1E293B] font-bold py-4 rounded-[1.5rem] flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-all group"
         >
           <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-black group-hover:rotate-12 transition-transform">
             <Car className="w-5 h-5" />
           </div>
           <div className="text-left">
             <div className="text-sm text-slate-500 font-medium">需要搭車回飯店？</div>
             <div className="text-lg text-slate-900">開啟計程車模式</div>
           </div>
           <ChevronRight className="w-5 h-5 text-slate-300 ml-auto" />
         </button>
      )}

      {/* 4. Vertical Timeline */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-lg font-bold text-[#1E293B] flex items-center gap-2">
             <Clock className="w-5 h-5 text-[#4F46E5]" />
             今日行程
           </h3>
           <button 
             onClick={() => onSwitchTab('itinerary')}
             className="text-xs font-bold text-[#4F46E5] bg-[#4F46E5]/10 px-3 py-1.5 rounded-full hover:bg-[#4F46E5]/20 transition-colors"
           >
             查看詳情
           </button>
        </div>

        <div className="relative pl-4 space-y-8">
           {/* Vertical Line */}
           <div className="absolute left-[23px] top-2 bottom-4 w-[2px] bg-slate-200" />

           {todaysAttractions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                今日無特定行程安排
              </div>
           ) : (
             todaysAttractions.map((attraction, index) => (
               <div key={index} className="relative flex gap-4 group">
                 {/* Dot */}
                 <div className="relative z-10 flex-shrink-0 mt-1">
                    <div className="w-5 h-5 rounded-full bg-white border-4 border-[#4F46E5] shadow-sm group-hover:scale-110 transition-transform" />
                 </div>
                 
                 {/* Content */}
                 <div className="flex-1 pb-2">
                    <div className="text-xs font-bold text-slate-400 mb-0.5 font-mono">
                      {attraction.visit_time?.slice(0, 5) || '待定'}
                    </div>
                    <h4 className="text-base font-bold text-[#1E293B] mb-1">
                      {attraction.name}
                    </h4>
                    {attraction.address && (
                       <div className="flex items-center text-xs text-slate-500 gap-1">
                         <MapPin className="w-3 h-3" />
                         <span className="line-clamp-1">{attraction.address}</span>
                       </div>
                    )}
                 </div>
               </div>
             ))
           )}
        </div>
      </div>
    </div>
  )
}
