'use client'

import { useState } from 'react'
import { ItineraryView } from './ItineraryView'
import { MemberManager } from './MemberManager'
import { RoomingTable } from './RoomingTable'
import { Users, Map, BedDouble } from 'lucide-react'

type Tab = 'members' | 'itinerary' | 'rooming'

interface TripDashboardProps {
  tripId: string
  trip: any
  days: any[]
  members: any[]
  assignments: any[]
  hotels: any[]
  attractions: any[]
}

export function TripDashboard({
  tripId,
  trip,
  days,
  members,
  assignments,
  hotels,
  attractions
}: TripDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('members')

  const tabs = [
    { id: 'members', label: '旅客名單', icon: Users },
    { id: 'itinerary', label: '行程管理', icon: Map },
    { id: 'rooming', label: '飯店/房號', icon: BedDouble },
  ] as const

  return (
    <div className="space-y-6">
      {/* Tabs Header */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:border-border hover:text-foreground'
                  }
                `}
              >
                <Icon
                  className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${activeTab === tab.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                  `}
                />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        <div className={activeTab === 'members' ? 'block' : 'hidden'}>
          <MemberManager tripId={tripId} members={members} />
        </div>
        
        <div className={activeTab === 'itinerary' ? 'block' : 'hidden'}>
          <ItineraryView 
            days={days} 
            hotels={hotels} 
            attractions={attractions} 
          />
        </div>

        <div className={activeTab === 'rooming' ? 'block' : 'hidden'}>
          <RoomingTable 
            tripId={tripId}
            days={days}
            members={members}
            assignments={assignments}
          />
        </div>
      </div>
    </div>
  )
}
