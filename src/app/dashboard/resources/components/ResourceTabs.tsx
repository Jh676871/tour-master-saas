'use client'

import { useState } from 'react'
import { Building2, MapPin } from 'lucide-react'

export function ResourceTabs({ 
  hotels, 
  attractions,
  createHotelBtn,
  createAttractionBtn
}: { 
  hotels: any[], 
  attractions: any[],
  createHotelBtn: React.ReactNode,
  createAttractionBtn: React.ReactNode
}) {
  const [activeTab, setActiveTab] = useState<'hotels' | 'attractions'>('hotels')

  return (
    <div>
      <div className="mb-6 border-b border-border">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('hotels')}
            className={`
              flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${activeTab === 'hotels'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            <Building2 className="mr-2 h-4 w-4" />
            合作飯店
          </button>
          <button
            onClick={() => setActiveTab('attractions')}
            className={`
              flex items-center whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${activeTab === 'attractions'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            <MapPin className="mr-2 h-4 w-4" />
            私房景點
          </button>
        </nav>
      </div>

      <div className="mb-4 flex justify-end">
        {activeTab === 'hotels' ? createHotelBtn : createAttractionBtn}
      </div>

      {activeTab === 'hotels' ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-card-foreground">{hotel.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{hotel.address || '無地址資訊'}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span className="font-medium">WiFi:</span>
                  <span className="ml-2">{hotel.wifi ? '免費提供' : '無'}</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium">電話:</span>
                  <span className="ml-2">{hotel.phone || '無'}</span>
                </div>
              </div>
            </div>
          ))}
          {hotels.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              目前沒有飯店資料
            </div>
          )}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {attractions.map((attraction) => (
            <div key={attraction.id} className="rounded-lg border border-border bg-card p-6 shadow-sm">
              <h3 className="font-semibold text-lg text-card-foreground">{attraction.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {attraction.description || '無描述'}
              </p>
            </div>
          ))}
          {attractions.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              目前沒有景點資料
            </div>
          )}
        </div>
      )}
    </div>
  )
}
