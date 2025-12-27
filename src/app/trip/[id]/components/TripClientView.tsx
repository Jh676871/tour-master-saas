'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Volume2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { TravelerTopBar } from './TravelerTopBar'
import { TravelerBottomNav } from './TravelerBottomNav'
import { HomeView } from './views/HomeView'
import { ItineraryView } from './views/ItineraryView'
import { HotelView } from './views/HotelView'
import { EmergencyView } from './views/EmergencyView'
import { JoinModal } from './JoinModal'

interface TripClientViewProps {
  tripId: string
  tripTitle: string
  days: any[]
  latestBroadcast: any
  roomNumber?: string
  roommates: string[]
  assignments: any[]
  memberName: string | null
}

export function TripClientView({
  tripId,
  tripTitle,
  days,
  latestBroadcast: initialBroadcast,
  roomNumber,
  roommates,
  assignments,
  memberName
}: TripClientViewProps) {
  const [currentTab, setCurrentTab] = useState('home')
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  
  // Broadcast State
  const [latestBroadcast, setLatestBroadcast] = useState(initialBroadcast)
  const [showBroadcast, setShowBroadcast] = useState(!!initialBroadcast)

  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ))

  useEffect(() => {
    // Request Notification Permission on mount
    /* 
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'default') {
      try {
        Notification.requestPermission()
      } catch (e) {
        console.error('Notification permission request failed:', e)
      }
    }
    */

    // Subscribe to broadcasts
    /*
    const channel = supabase
      .channel(`trip_broadcasts_${tripId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'broadcasts',
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          const newBroadcast = payload.new as { message: string, created_at: string }
          setLatestBroadcast(newBroadcast)
          setShowBroadcast(true)
          
          // Trigger System Notification
          if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
            try {
              new Notification('領隊廣播', {
                body: newBroadcast.message,
                icon: '/icons/icon-192x192.png',
                // vibrate: [200, 100, 200]
              })
            } catch (e) {
               console.error("Notification trigger failed:", e)
            }
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [tripId, supabase])

  // Auto-scroll logic for "Next Meeting"
  const activeDay = days[activeDayIndex]
  const hotelName = activeDay?.hotels?.name
  const hotelAddress = activeDay?.hotels?.address
  const hotelMapUrl = activeDay?.hotels?.map_url
  const hotelImage = activeDay?.hotels?.image_url
  const hotelPhone = activeDay?.hotels?.phone

  // Find next attraction
  const nextAttraction = activeDay?.trip_day_attractions?.[0]?.attractions ? {
    name: activeDay.trip_day_attractions[0].attractions.name,
    time: activeDay.trip_day_attractions[0].visit_time?.slice(0, 5),
    image_url: activeDay.trip_day_attractions[0].attractions.image_url
  } : undefined

  // Time of day logic
  const [isMorning, setIsMorning] = useState(true)

  useEffect(() => {
    setIsMorning(new Date().getHours() < 12)
  }, [])
  
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 font-sans text-[#1E293B] selection:bg-[#4F46E5] selection:text-white">
      {/* 1. Identity Check Modal */}
      {!memberName && (
        <JoinModal tripId={tripId} tripTitle={tripTitle} />
      )}

      {/* 2. Sticky Header */}
      <TravelerTopBar memberName={memberName} tripTitle={tripTitle} />

      {/* Broadcast Banner */}
      <AnimatePresence>
        {showBroadcast && latestBroadcast && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="sticky top-[72px] z-30 px-4 mt-2"
          >
            <div className="bg-red-500 text-white p-4 shadow-lg shadow-red-500/20 rounded-3xl backdrop-blur-md">
              <div className="flex items-start gap-3">
                <Volume2 className="h-5 w-5 mt-0.5 animate-pulse flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-bold text-sm mb-1">領隊緊急廣播</p>
                  <p className="text-sm leading-relaxed font-medium">{latestBroadcast.message}</p>
                  <p className="text-[10px] opacity-80 mt-1">
                    {new Date(latestBroadcast.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
                <button 
                  onClick={() => setShowBroadcast(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Main Content Area */}
      <main className="w-full max-w-md mx-auto pt-2">
        {currentTab === 'home' && (
          <HomeView 
            nextAttraction={nextAttraction}
            roomNumber={roomNumber}
            hotelName={hotelName}
            onSwitchTab={setCurrentTab}
            isMorning={isMorning}
            memberName={memberName}
          />
        )}

        {currentTab === 'itinerary' && (
          <ItineraryView days={days} />
        )}

        {currentTab === 'hotel' && (
          <HotelView 
            hotelName={hotelName}
            hotelAddress={hotelAddress}
            hotelMapUrl={hotelMapUrl}
            hotelImage={hotelImage}
            roomNumber={roomNumber}
            hotelPhone={hotelPhone}
          />
        )}

        {currentTab === 'emergency' && (
          <EmergencyView />
        )}
      </main>

      {/* 4. Fixed Bottom Nav */}
      <TravelerBottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
