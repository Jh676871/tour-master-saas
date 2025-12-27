'use client'

import { motion } from 'framer-motion'
import { MapPin, BedDouble, ChevronRight, Car, Clock, Coffee, Bus } from 'lucide-react'
import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'

interface HomeViewProps {
  roomNumber?: string
  hotelName?: string
  hotelAddress?: string
  todaysAttractions: any[]
  onSwitchTab: (tab: string) => void
  memberName: string | null
  morningCall?: string
  meetingTime?: string
  meetingLocation?: string
  hotelImage?: string
  todayDate?: string
  tomorrowDate?: string
  tomorrowMorningCall?: string
  tomorrowMeetingTime?: string
}

export function HomeView({ 
  roomNumber, 
  hotelName, 
  hotelAddress, 
  todaysAttractions, 
  onSwitchTab, 
  memberName,
  morningCall,
  meetingTime,
  meetingLocation,
  hotelImage,
  todayDate,
  tomorrowDate,
  tomorrowMorningCall,
  tomorrowMeetingTime
}: HomeViewProps) {
  
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    return format(new Date(dateStr), 'M/d (EEE)', { locale: zhTW })
  }

  const openTaxiMap = () => {
    if (hotelAddress) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotelAddress)}`, '_blank')
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 py-6 min-h-screen bg-slate-50">
      
      {/* 1. Next Action Card (Top Layer) */}
      <div className="w-full bg-indigo-600 rounded-[2rem] p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
         <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16" />
         <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
         
         <div className="relative z-10">
           <div className="flex items-center gap-2 mb-6 opacity-80">
             <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
             <span className="text-sm font-bold tracking-widest uppercase">
               今日 {formatDate(todayDate)}
             </span>
           </div>

           <div>
             <div className="flex items-center gap-2 text-indigo-200 text-sm font-bold uppercase mb-2">
               <Clock className="w-4 h-4" />
               下一個集合
             </div>
             <div className="text-6xl font-black tracking-tight leading-none mb-4">
               {meetingTime || '--:--'}
             </div>
             
             {meetingLocation && (
               <div className="flex items-center gap-2 text-lg font-bold text-white/90">
                 <MapPin className="w-5 h-5 text-indigo-300" />
                 {meetingLocation}
               </div>
             )}
           </div>
         </div>
      </div>

      {/* 2. Tonight's Stay (Middle Layer) */}
      <div className="w-full relative group overflow-hidden rounded-[2rem] bg-white border border-slate-100 shadow-lg min-h-[200px]">
        {hotelImage ? (
          <div className="absolute inset-0">
            <img src={hotelImage} alt="Hotel Background" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/90 to-white/70" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100" />
        )}
        
        <div className="relative p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between mb-4">
                 <span className="text-xs font-bold tracking-widest uppercase text-slate-400">今晚入住</span>
                 <BedDouble className="w-6 h-6 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold leading-tight text-slate-900 mb-1">
                {hotelName || '尚未安排飯店'}
              </h2>
              {hotelAddress && (
                <p className="text-sm text-slate-500 line-clamp-1">{hotelAddress}</p>
              )}
            </div>

            <div className="mt-6">
              {roomNumber ? (
                <div className="flex items-baseline gap-3">
                   <span className="text-7xl font-black text-slate-900 tracking-tighter">
                     {roomNumber}
                   </span>
                   <span className="text-xl font-bold text-slate-400">號房</span>
                </div>
              ) : (
                <div className="flex items-center gap-3 py-2">
                   <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                   <span className="text-lg font-bold text-slate-400">分房確認中...</span>
                </div>
              )}
            </div>
        </div>
      </div>

      {/* 3. Tomorrow's Briefing (Bottom Layer) */}
      <div className="w-full bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
           <span className="text-sm font-bold tracking-widest uppercase text-slate-500">
             明天 {formatDate(tomorrowDate)}
           </span>
        </div>

        <div className="space-y-4">
          {/* Morning Call */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                 <Clock className="w-5 h-5" />
               </div>
               <span className="font-bold text-slate-700">晨喚 Morning Call</span>
             </div>
             <span className="text-xl font-black text-slate-900">{tomorrowMorningCall || '--:--'}</span>
          </div>

          {/* Departure */}
          <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl">
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                 <Bus className="w-5 h-5" />
               </div>
               <span className="font-bold text-slate-700">出發 Departure</span>
             </div>
             <span className="text-xl font-black text-slate-900">{tomorrowMeetingTime || '--:--'}</span>
          </div>
        </div>
      </div>

      {/* 4. Taxi / Map Action */}
      {hotelAddress && (
         <button 
           onClick={openTaxiMap}
           className="w-full bg-white border border-slate-200 text-slate-900 font-bold py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-sm active:scale-[0.98] transition-all"
         >
           <Car className="w-5 h-5 text-yellow-500" />
           開啟地圖 / 叫車
         </button>
      )}

    </div>
  )
}
