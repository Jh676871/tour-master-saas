'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { motion, AnimatePresence } from 'framer-motion'
import { TravelerTopBar } from './TravelerTopBar'
import { TravelerBottomNav } from './TravelerBottomNav'
import { HomeView } from './views/HomeView'
import { ItineraryView } from './views/ItineraryView'
import { HotelView } from './views/HotelView'
import { EmergencyView } from './views/EmergencyView'
import { JoinModal } from './JoinModal'

interface Attraction {
  name: string
  image_url?: string
  location_url?: string
  address?: string
}

interface TripDayAttraction {
  attractions: Attraction
  visit_time: string
}

interface Hotel {
  name: string
  address: string
  map_url?: string
  image_url?: string
  phone?: string
}

interface TripDay {
  trip_day_attractions: TripDayAttraction[]
  hotels: Hotel
}

interface Broadcast {
  message: string
  created_at: string
}

interface TripClientViewProps {
  tripId: string
  tripTitle: string
  days: TripDay[]
  latestBroadcast: Broadcast | null
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
  roommates: _roommates,
  assignments: _assignments,
  memberName
}: TripClientViewProps) {
  const [currentTab, setCurrentTab] = useState('home')
  const [activeDayIndex] = useState(0)
  
  // Broadcast State
  const [latestBroadcast] = useState(initialBroadcast)
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
          // setLatestBroadcast(newBroadcast)
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
  const todaysAttractions = activeDay?.trip_day_attractions?.map((tda) => ({
    ...tda.attractions,
    visit_time: tda.visit_time
  })) || []
  const hotelAddress = activeDay?.hotels?.address
  
  // Find next attraction
  /*
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const nextAttraction = todaysAttractions.find((attr: any) => {
      if (!attr.visit_time) return false
      const [h, m] = attr.visit_time.split(':').map(Number)
      return (h * 60 + m) > currentTime
  })
  */

  return (
    <div className="flex h-[100dvh] flex-col bg-[#F8FAFC]">
      {/* 1. Identity Check Modal */}
      {!memberName && (
        <JoinModal tripId={tripId} tripTitle={tripTitle} />
      )}

      <TravelerTopBar 
        tripTitle={tripTitle} 
        memberName={memberName}
        onOpenBroadcast={() => setShowBroadcast(true)}
        hasNewBroadcast={!!latestBroadcast && !showBroadcast}
      />

      <div className="flex-1 overflow-y-auto pb-24">
        <AnimatePresence mode="wait">
          {currentTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <HomeView 
                roomNumber={roomNumber}
                hotelName={activeDay?.hotels?.name}
                hotelAddress={hotelAddress}
                todaysAttractions={todaysAttractions}
                onSwitchTab={setCurrentTab}
                memberName={memberName}
              />
            </motion.div>
          )}

          {currentTab === 'itinerary' && (
            <ItineraryView days={days} />
          )}

          {currentTab === 'hotel' && (
            <HotelView 
              hotelName={activeDay?.hotels?.name}
              hotelAddress={hotelAddress}
              hotelMapUrl={activeDay?.hotels?.map_url}
              hotelImage={activeDay?.hotels?.image_url}
              roomNumber={roomNumber}
              hotelPhone={activeDay?.hotels?.phone}
            />
          )}

          {currentTab === 'emergency' && (
            <EmergencyView />
          )}
        </AnimatePresence>
      </div>

      {/* 4. Fixed Bottom Nav */}
      <TravelerBottomNav currentTab={currentTab} onTabChange={setCurrentTab} />
    </div>
  )
}
