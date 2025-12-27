'use client'

import { useState } from 'react'
import { Plus, Trash2, MapPin } from 'lucide-react'
import { updateTripDay, addAttractionToDay, removeAttractionFromDay } from '../actions'

export function ItineraryView({ days, hotels, attractions }: { days: any[], hotels: any[], attractions: any[] }) {
  return (
    <div className="space-y-8">
      {days.map((day) => (
        <DayCard key={day.id} day={day} hotels={hotels} attractions={attractions} />
      ))}
    </div>
  )
}

function DayCard({ day, hotels, attractions }: { day: any, hotels: any[], attractions: any[] }) {
  const [isSaving, setIsSaving] = useState(false)

  const handleUpdate = async (formData: FormData) => {
    setIsSaving(true)
    try {
      const result = await updateTripDay(day.id, formData)
      if (result && result.error) {
        alert(`更新失敗: ${result.error}`)
      }
    } catch (e) {
      alert('發生未預期的錯誤')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-card-foreground">
          Day {day.day_number} - {day.day_date}
        </h3>
      </div>

      <form action={handleUpdate} className="grid gap-4 sm:grid-cols-2">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-muted-foreground">當日摘要</label>
          <input
            name="summary"
            defaultValue={day.summary || ''}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="例如：東京市區觀光"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">集合時間</label>
          <input
            name="meeting_time"
            defaultValue={day.meeting_time || ''}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="08:00"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted-foreground">晨喚時間</label>
          <input
            name="morning_call_time"
            defaultValue={day.morning_call_time || ''}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="07:00"
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-muted-foreground">今晚入住飯店</label>
          <select
            name="hotel_id"
            defaultValue={day.hotel_id || ''}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">選擇飯店...</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div className="col-span-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
          >
            {isSaving ? '儲存中...' : '儲存變更'}
          </button>
        </div>
      </form>

      {/* Attractions Section */}
      <div className="mt-6 border-t border-border pt-4">
        <h4 className="mb-2 text-sm font-semibold text-foreground">景點安排</h4>
        <div className="space-y-2">
          {day.trip_day_attractions?.map((link: any) => (
            <div key={link.id} className="flex items-center justify-between rounded-md bg-secondary/50 px-3 py-2">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{link.attractions?.name}</span>
              </div>
              <button
                onClick={() => removeAttractionFromDay(link.id)}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-4">
           <AttractionSelector dayId={day.id} attractions={attractions} />
        </div>
      </div>
    </div>
  )
}

function AttractionSelector({ dayId, attractions }: { dayId: string, attractions: any[] }) {
  const [selectedId, setSelectedId] = useState('')

  const handleAdd = async () => {
    if (!selectedId) return
    await addAttractionToDay(dayId, selectedId)
    setSelectedId('')
  }

  return (
    <div className="flex space-x-2">
      <select
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">新增景點...</option>
        {attractions.map((a) => (
          <option key={a.id} value={a.id}>{a.name}</option>
        ))}
      </select>
      <button
        onClick={handleAdd}
        disabled={!selectedId}
        className="flex items-center rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  )
}
