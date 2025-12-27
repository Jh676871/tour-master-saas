'use client'

import { Car, Wifi, MapPin, Phone, Copy, Check, BedDouble } from 'lucide-react'
import { useState } from 'react'

interface HotelViewProps {
  hotelName?: string
  hotelAddress?: string
  hotelMapUrl?: string
  hotelImage?: string
  roomNumber?: string
  hotelPhone?: string
}

export function HotelView({ hotelName, hotelAddress, hotelMapUrl, hotelImage, roomNumber, hotelPhone }: HotelViewProps) {
  const [copied, setCopied] = useState(false)
  const [taxiMode, setTaxiMode] = useState(false)

  const handleCopyWifi = () => {
    // Mock wifi copy
    navigator.clipboard.writeText('Hotel_Guest_WiFi')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCall = () => {
    if (hotelPhone) {
        window.location.href = `tel:${hotelPhone}`
    } else {
        alert('未提供飯店電話')
    }
  }


  // Immersive Taxi Mode Overlay
  if (taxiMode) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center">
        <button 
          onClick={() => setTaxiMode(false)}
          className="absolute top-8 right-8 p-4 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
        >
          <span className="sr-only">Close</span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="space-y-8 animate-in fade-in zoom-in duration-300">
          <div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Destination</p>
            <h1 className="text-5xl font-black leading-tight mb-4">{hotelName}</h1>
            <p className="text-2xl font-medium text-slate-300 max-w-xs mx-auto leading-relaxed">{hotelAddress}</p>
          </div>
          
          <button 
            onClick={() => hotelAddress && navigator.clipboard.writeText(hotelAddress)}
            className="bg-white text-slate-900 font-bold py-4 px-8 rounded-full text-lg shadow-xl active:scale-95 transition-transform flex items-center gap-2 mx-auto"
          >
            <Copy className="w-5 h-5" />
            複製地址
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Hotel Info Header */}
      <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg shadow-slate-200/50 relative group">
        <div className="h-64 bg-slate-200 relative">
          {hotelImage ? (
            <img src={hotelImage} alt={hotelName} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
              <BedDouble className="w-16 h-16" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h2 className="text-3xl font-black mb-2 leading-tight">{hotelName || '未指定飯店'}</h2>
            <p className="text-base text-slate-300 font-medium flex items-start gap-1.5 leading-snug">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              {hotelAddress || '無地址資訊'}
            </p>
          </div>
        </div>
        
        {/* Quick Actions Bar */}
        <div className="grid grid-cols-2 divide-x divide-slate-100 border-t border-slate-100">
            <button 
                onClick={handleCall}
                className="flex items-center justify-center gap-2 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
                <Phone className="w-5 h-5 text-[#4F46E5]" />
                <span className="font-bold text-slate-600 text-sm">撥打電話</span>
            </button>
            <button 
                onClick={handleCopyWifi}
                className="flex items-center justify-center gap-2 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
                <Wifi className="w-5 h-5 text-[#4F46E5]" />
                <span className="font-bold text-slate-600 text-sm">{copied ? '已複製' : '複製 WiFi'}</span>
            </button>
        </div>
      </div>

      {/* Room Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
         <div>
           <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">我的房號</p>
           <p className="text-4xl font-black text-indigo-600 tracking-tighter">{roomNumber || '--'}</p>
         </div>
         <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <BedDouble className="w-6 h-6" />
         </div>
      </div>

      {/* Taxi Mode Trigger */}
      <button 
        onClick={() => setTaxiMode(true)}
        className="w-full bg-yellow-400 hover:bg-yellow-300 text-yellow-950 font-black py-5 rounded-[2rem] shadow-lg shadow-yellow-400/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all"
      >
        <div className="w-8 h-8 bg-black/10 rounded-full flex items-center justify-center">
          <Car className="w-4 h-4" />
        </div>
        <span className="text-lg">開啟計程車助手 (全螢幕)</span>
      </button>

      {/* WiFi Card */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
            <Wifi className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">飯店 WiFi</h3>
        </div>
        
        <div className="space-y-3">
          <button 
            onClick={handleCopyWifi}
            className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 active:bg-indigo-50 active:border-indigo-100 transition-all group"
          >
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wi-Fi Name</p>
              <p className="font-mono font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">Hotel_Guest</p>
            </div>
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />}
          </button>
          
          <button 
            onClick={() => {}}
            className="w-full flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100 active:bg-indigo-50 active:border-indigo-100 transition-all group"
          >
            <div className="text-left">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Password</p>
              <p className="font-mono font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors">guest1234</p>
            </div>
            <Copy className="w-5 h-5 text-slate-300 group-hover:text-indigo-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
