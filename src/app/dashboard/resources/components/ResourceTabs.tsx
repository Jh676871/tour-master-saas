'use client'

import { useState } from 'react'
import { Building2, MapPin, Trash, AlertTriangle, X } from 'lucide-react'
import { EditHotelModal } from './CreateResourceModals'
import { deleteHotel } from '../actions'

function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  isDeleting 
}: { 
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  isDeleting: boolean
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg border border-border">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {title}
          </h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <p className="mb-6 text-muted-foreground">{description}</p>
        
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
            disabled={isDeleting}
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
          >
            {isDeleting ? '刪除中...' : '確認刪除'}
          </button>
        </div>
      </div>
    </div>
  )
}

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
  const [deletingHotelId, setDeletingHotelId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeleteConfirm = async () => {
    if (!deletingHotelId) return
    
    setIsDeleting(true)
    try {
      const result = await deleteHotel(deletingHotelId)
      if (result.error) {
        alert(result.error)
      } else {
        // Success, close modal
        setDeletingHotelId(null)
      }
    } catch (error) {
      alert('發生未預期的錯誤')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <DeleteConfirmationModal 
        isOpen={!!deletingHotelId}
        onClose={() => setDeletingHotelId(null)}
        onConfirm={handleDeleteConfirm}
        title="刪除確認"
        description="確定要刪除這間飯店嗎？此操作無法復原。"
        isDeleting={isDeleting}
      />

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
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-card-foreground">{hotel.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{hotel.address || '無地址資訊'}</p>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <EditHotelModal hotel={hotel} />
                  <button
                    onClick={() => setDeletingHotelId(hotel.id)}
                    className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    title="刪除"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <span className="font-medium">WiFi:</span>
                  <span className="ml-2">{hotel.wifi_ssid || hotel.wifi ? (hotel.wifi_ssid ? `${hotel.wifi_ssid}` : '免費提供') : '無'}</span>
                </div>
                {hotel.wifi_password && (
                   <div className="flex items-center">
                     <span className="font-medium">密碼:</span>
                     <span className="ml-2">{hotel.wifi_password}</span>
                   </div>
                )}
                <div className="flex items-center">
                  <span className="font-medium">電話:</span>
                  <span className="ml-2">{hotel.phone || '無'}</span>
                </div>
                {hotel.images && hotel.images.length > 0 && (
                   <div className="mt-2 flex gap-2 overflow-x-auto py-2">
                     {hotel.images.map((img: string, idx: number) => (
                       <img key={idx} src={img} alt={hotel.name} className="h-16 w-16 object-cover rounded-md" />
                     ))}
                   </div>
                )}
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
