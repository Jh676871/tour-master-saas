'use client'

import { Phone, Siren, User, MessageCircle } from 'lucide-react'

export function EmergencyView() {
  return (
    <div className="px-5 py-6 space-y-6">
      {/* Emergency Header */}
      <div className="bg-red-500 rounded-[2rem] p-8 text-white shadow-xl shadow-red-500/30 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        
        <div className="flex items-center gap-5 mb-8 relative z-10">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-[pulse_3s_infinite] shadow-inner border border-white/10">
            <Siren className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight leading-none mb-1">緊急求助</h2>
            <p className="text-red-100 font-medium text-sm">遇到緊急狀況請立即聯繫</p>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.href = 'tel:119'}
          className="w-full bg-white text-red-600 font-black py-5 rounded-2xl shadow-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-3 relative z-10"
        >
          <Phone className="w-5 h-5 fill-current" />
          撥打 119 (救護/火警)
        </button>
      </div>

      {/* Leader Contact Card */}
      <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-slate-100 relative overflow-hidden">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">領隊聯繫</h3>
        
        <div className="flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center shadow-inner">
            <User className="w-7 h-7 text-slate-400" />
          </div>
          <div>
            <p className="font-black text-2xl text-slate-900 leading-none mb-2">王大明 (領隊)</p>
            <p className="text-slate-500 font-medium">台灣手機: 0912-345-678</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => window.location.href = 'tel:0912345678'}
            className="bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] shadow-lg shadow-green-500/20 hover:bg-green-600 transition-colors"
          >
            <Phone className="w-5 h-5 fill-current" />
            撥打電話
          </button>
          <button 
            className="bg-slate-50 text-slate-700 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            LINE 訊息
          </button>
        </div>
      </div>
    </div>
  )
}
