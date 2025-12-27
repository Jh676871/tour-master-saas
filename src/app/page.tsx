import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Globe, ShieldCheck, Zap, ArrowRight, UserCheck } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'TourMaster SaaS - 專為資深領隊打造的數位神器',
  description: '一鍵開團、免登入點名、自動記帳，讓帶團變得優雅輕鬆。專為現代領隊設計的數位化管理平台。',
  keywords: ['領隊工具', '帶團App', '旅遊SaaS', '團控系統', 'TourMaster', '行程管理', '旅客名單'],
}

export default async function LandingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-[#1E293B]">
      {/* Navbar (Simple) */}
      <nav className="w-full py-6 px-6 sm:px-12 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="bg-[#4F46E5] p-2 rounded-lg">
            <Globe className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">TourMaster</span>
        </div>
        <Link 
          href="/login" 
          className="text-sm font-medium text-slate-600 hover:text-[#4F46E5] transition-colors"
        >
          領隊登入
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center pb-20 pt-10 sm:pt-20">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 mb-8 animate-fade-in-up">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4F46E5]"></span>
          </span>
          <span className="text-xs font-semibold text-[#4F46E5] uppercase tracking-wide">
            2025 全新發布
          </span>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#1E293B] mb-6 max-w-4xl leading-tight">
          專為資深領隊打造的 <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] to-[#6366f1]">
            數位神器
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-slate-500 mb-10 max-w-2xl leading-relaxed">
          一鍵開團、免登入點名、自動記帳。<br className="sm:hidden" />
          告別繁瑣紙本，讓帶團變得優雅輕鬆。
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4">
          <Link
            href="/register"
            className="group flex items-center justify-center gap-2 bg-[#4F46E5] hover:bg-[#4338ca] text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            立即開始 / 註冊帳號
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-[#4F46E5] text-slate-700 hover:text-[#4F46E5] px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:shadow-md active:scale-95"
          >
            領隊登入
          </Link>
        </div>

        {/* Features Grid (Mobile Friendly) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 max-w-5xl w-full px-4">
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-[#4F46E5]" />}
            title="極速開團"
            description="30秒建立行程，自動生成精美旅客網頁，支援 LINE 一鍵分享。"
          />
          <FeatureCard 
            icon={<UserCheck className="w-6 h-6 text-[#4F46E5]" />}
            title="免登入點名"
            description="獨家 Zero-Login 技術，旅客掃碼即入團，即時掌握全員位置。"
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-6 h-6 text-[#4F46E5]" />}
            title="安全合規"
            description="銀行級資料加密，符合個資法規範，讓您的團務資料高枕無憂。"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100 bg-white">
        <p>© 2025 TourMaster SaaS. All rights reserved.</p>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <div className="bg-blue-50 p-3 rounded-xl mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-[#1E293B] mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
