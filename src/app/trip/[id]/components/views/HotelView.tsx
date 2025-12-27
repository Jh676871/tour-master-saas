'use client'

import { Car, Wifi, MapPin, Phone, Copy, Check, BedDouble, ImageIcon } from 'lucide-react'
import { useState } from 'react'

interface HotelViewProps {
  hotelName?: string
  hotelAddress?: string
  hotelMapUrl?: string
  hotelImage?: string
  roomNumber?: string
  hotelPhone?: string
  wifiSsid?: string
  wifiPassword?: string
  images?: string[]
}

export function HotelView({ 
  hotelName, 
  hotelAddress, 
  hotelMapUrl, 
  hotelImage, 
  roomNumber, 
  hotelPhone,
  wifiSsid,
  wifiPassword,
  images
}: HotelViewProps) {
  const [copiedWifi, setCopiedWifi] = useState(false)
  const [taxiMode, setTaxiMode] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleCopyWifiPassword = () => {
    if (wifiPassword) {
      navigator.clipboard.writeText(wifiPassword)
      setCopiedWifi(true)
      setTimeout(() => setCopiedWifi(false), 2000)
    }
  }

  const handleCall = () => {
    if (hotelPhone) {
        window.location.href = `tel:${hotelPhone}`
    } else {
        alert('未提供飯店電話')
    }
  }

  // Combine primary image with additional images
  const allImages = [
    ...(hotelImage ? [hotelImage] : []),
    ...(images || [])
  ].filter(Boolean)

  const displayImage = selectedImage || allImages[0]

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
          {displayImage ? (
            <img src={displayImage} alt={hotelName} className="w-full h-full object-cover transition-opacity duration-300" />
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
                onClick={() => setTaxiMode(true)}
                className="flex items-center justify-center gap-2 py-4 hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
                <Car className="w-5 h-5 text-[#4F46E5]" />
                <span className="font-bold text-slate-600 text-sm">計程車卡</span>
            </button>
        </div>
      </div>

      {/* Image Gallery */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-1 px-1">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img)}
              className={`relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all ${
                displayImage === img ? 'border-[#4F46E5] ring-2 ring-[#4F46E5]/20' : 'border-transparent'
              }`}
            >
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* WiFi Card */}
      {(wifiSsid || wifiPassword) && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Wifi className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">飯店 WiFi</h3>
              <p className="text-sm text-slate-500">點擊複製密碼</p>
            </div>
          </div>
          
          <div className="space-y-3">
            {wifiSsid && (
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">SSID</span>
                <span className="font-medium text-slate-900">{wifiSsid}</span>
              </div>
            )}
            
            {wifiPassword && (
              <button 
                onClick={handleCopyWifiPassword}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl transition-colors relative overflow-hidden group"
              >
                <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Password</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold font-mono text-lg">{wifiPassword}</span>
                  {copiedWifi ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                  )}
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Room Info */}
      {roomNumber && (
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <BedDouble className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">你的房號</h3>
              <p className="text-sm text-slate-500">Room Number</p>
            </div>
          </div>
          <span className="text-3xl font-black text-slate-900 tracking-tight">{roomNumber}</span>
        </div>
      )}
    </div>
  )
}
