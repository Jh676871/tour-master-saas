export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 pb-24 font-sans">
      {/* Skeleton Header */}
      <div className="sticky top-0 left-0 right-0 bg-slate-50/80 backdrop-blur-xl z-40 px-5 py-4 border-b border-white/20">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <div className="h-4 w-32 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-8 w-48 bg-slate-200 rounded-full animate-pulse" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <main className="w-full max-w-md mx-auto pt-2 px-5 py-4 space-y-6">
        {/* Hero Card Skeleton */}
        <div className="relative bg-white rounded-[2rem] p-7 shadow-sm ring-1 ring-black/5 h-[300px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-50 to-transparent w-full h-full -translate-x-full animate-[shimmer_1.5s_infinite]" />
          
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-3">
              <div className="h-4 w-20 bg-slate-100 rounded-full" />
              <div className="h-10 w-32 bg-slate-100 rounded-full" />
            </div>
            <div className="h-8 w-20 bg-slate-100 rounded-2xl" />
          </div>
          
          <div className="space-y-4 mt-12">
            <div className="h-4 w-24 bg-slate-100 rounded-full" />
            <div className="h-8 w-48 bg-slate-100 rounded-full" />
            <div className="h-14 w-full bg-slate-100 rounded-2xl mt-6" />
          </div>
        </div>

        {/* Quick Action Button Skeleton */}
        <div className="h-20 w-full bg-white rounded-full shadow-sm border border-indigo-100/50 p-2 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-slate-100" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-slate-100 rounded-full" />
            <div className="h-3 w-32 bg-slate-50 rounded-full" />
          </div>
        </div>
      </main>

      {/* Bottom Nav Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6 pt-2 pointer-events-none">
        <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl border border-white/40 h-[72px] flex items-center justify-around px-2">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="w-12 h-12 rounded-2xl bg-slate-100/50" />
           ))}
        </div>
      </div>
    </div>
  )
}
