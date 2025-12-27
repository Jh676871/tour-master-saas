import { Calendar, Users, ArrowRight, MapPin, Clock } from 'lucide-react'
import Link from 'next/link'

interface GroupCardProps {
  trip: {
    id: string
    title: string
    code: string | null
    start_date: string | null
    end_date: string | null
    status: string | null
  }
}

export function GroupCard({ trip }: GroupCardProps) {
  // Calculate Progress
  let progressNode = null;
  let isOngoing = false;
  
  if (trip.start_date && trip.end_date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(trip.start_date);
    const end = new Date(trip.end_date);
    
    // Check if ongoing
    if (today >= start && today <= end) {
      isOngoing = true;
      const diffTime = today.getTime() - start.getTime();
      const dayNumber = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
      
      progressNode = (
        <div className="mt-4 rounded-md bg-primary/5 p-3 border border-primary/10">
          <div className="flex items-center justify-between mb-1">
             <span className="text-xs font-bold text-primary uppercase tracking-wider">今日進度</span>
             <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">Day {dayNumber}</span>
          </div>
          <div className="text-sm text-gray-700 font-medium flex items-center">
             <MapPin className="w-3.5 h-3.5 mr-1.5 text-primary/70" />
             {/* Ideally we would show the destination or summary here, but we don't have it in the trip object yet */}
             查看今日行程詳情
          </div>
        </div>
      );
    } else if (today < start) {
       const diffTime = start.getTime() - today.getTime();
       const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
       progressNode = (
         <div className="mt-4 text-xs text-muted-foreground flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            距離出發還有 <span className="font-bold text-foreground mx-1">{daysUntil}</span> 天
         </div>
       )
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/50">
      <div className="mb-3 flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-bold text-lg text-card-foreground leading-tight group-hover:text-primary transition-colors">
            {trip.title}
          </h3>
          <p className="text-xs font-mono text-muted-foreground bg-secondary/50 inline-block px-1.5 py-0.5 rounded">
            {trip.code || 'NO-CODE'}
          </p>
        </div>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide border ${
          trip.status === 'published' 
            ? 'bg-green-50 text-green-700 border-green-200'
            : 'bg-yellow-50 text-yellow-700 border-yellow-200'
        }`}>
          {trip.status === 'published' ? 'Published' : 'Draft'}
        </span>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="mr-2 h-4 w-4 text-gray-400" />
          <span>{trip.start_date || '未定'} ~ {trip.end_date || '未定'}</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Users className="mr-2 h-4 w-4 text-gray-400" />
          <span>旅客管理</span>
        </div>
      </div>

      {progressNode}

      <div className="mt-auto pt-4">
        <Link 
          href={`/dashboard/groups/${trip.id}`} 
          className={`group/btn flex w-full items-center justify-center rounded-lg border px-4 py-2.5 text-sm font-bold transition-all min-h-[48px]
            ${isOngoing 
              ? 'bg-primary text-white border-transparent hover:bg-primary/90 shadow-md shadow-primary/20' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-gray-300'
            }`}
        >
          {isOngoing ? '進入帶團模式' : '管理行程'}
          <ArrowRight className={`ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1 ${isOngoing ? 'text-white' : 'text-gray-400'}`} />
        </Link>
      </div>
    </div>
  )
}
