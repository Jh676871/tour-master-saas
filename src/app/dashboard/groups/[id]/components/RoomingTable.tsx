'use client'

import { useState } from 'react'
import { Plus, Bell, CheckCircle } from 'lucide-react'
import { addMember, updateRoomAssignment, sendRoomNotification } from '../actions'

export function RoomingTable({ tripId, days, members, assignments }: { tripId: string, days: any[], members: any[], assignments: any[] }) {
  const [newMemberName, setNewMemberName] = useState('')

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return
    await addMember(tripId, newMemberName)
    setNewMemberName('')
  }

  const getAssignment = (memberId: string, date: string) => {
    return assignments.find(a => a.member_id === memberId && a.day_date === date)?.room_number || ''
  }

  return (
    <div className="space-y-6">
      {/* Add Member Section */}
      <div className="flex items-center justify-between">
         <div className="flex items-center space-x-2">
            <input
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              placeholder="輸入旅客姓名..."
              className="w-64 rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <button
              onClick={handleAddMember}
              className="flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              新增旅客
            </button>
         </div>
         <div className="text-sm text-muted-foreground">
            <span className="inline-flex items-center"><CheckCircle className="w-3 h-3 mr-1 text-green-500"/> 輸入即自動儲存</span>
         </div>
      </div>

      {/* Rooming Grid */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50">
            <tr>
              <th className="border-b border-border px-4 py-3 text-left font-medium text-muted-foreground min-w-[150px] sticky left-0 bg-background sm:bg-secondary/50 z-10">旅客姓名</th>
              {days.map(day => (
                <th key={day.id} className="border-b border-border px-4 py-3 text-center font-medium text-muted-foreground min-w-[100px]">
                  <div>Day {day.day_number}</div>
                  <div className="text-xs text-muted-foreground/70">{day.day_date.slice(5)}</div>
                </th>
              ))}
              <th className="border-b border-border px-4 py-3 text-center font-medium text-muted-foreground min-w-[100px]">
                 操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {members.length === 0 ? (
              <tr>
                <td colSpan={days.length + 2} className="px-4 py-8 text-center text-muted-foreground">
                  尚未新增旅客
                </td>
              </tr>
            ) : (
              members.map(member => (
                <tr key={member.id} className="bg-card">
                  <td className="px-4 py-3 font-medium text-foreground sticky left-0 bg-card border-r border-border z-10">{member.name}</td>
                  {days.map(day => (
                    <td key={day.id} className="p-1">
                      <RoomInput 
                        tripId={tripId}
                        memberId={member.id}
                        date={day.day_date}
                        initialValue={getAssignment(member.id, day.day_date)}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-3 text-center">
                    <NotifyButton tripId={tripId} memberId={member.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RoomInput({ tripId, memberId, date, initialValue }: { tripId: string, memberId: string, date: string, initialValue: string }) {
  const [value, setValue] = useState(initialValue)
  const [isSaving, setIsSaving] = useState(false)

  const handleBlur = async () => {
    if (value !== initialValue) {
      setIsSaving(true)
      await updateRoomAssignment(tripId, memberId, date, value)
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          className={`w-full rounded border bg-transparent px-2 py-1 text-center focus:outline-none transition-colors
             ${isSaving ? 'border-yellow-400 bg-yellow-50' : 'border-transparent hover:border-input focus:border-primary focus:bg-background'}
          `}
          placeholder="-"
        />
        {isSaving && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-yellow-500"></div>
            </div>
        )}
    </div>
  )
}

function NotifyButton({ tripId, memberId }: { tripId: string, memberId: string }) {
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleNotify = async () => {
        setLoading(true)
        // Simulate sending or call server action
        await sendRoomNotification(tripId, memberId)
        setSent(true)
        setLoading(false)
        setTimeout(() => setSent(false), 3000) // Reset after 3s
    }

    return (
        <button 
            onClick={handleNotify}
            disabled={loading || sent}
            className={`
                inline-flex items-center justify-center rounded-full p-2 transition-colors
                ${sent ? 'bg-green-100 text-green-600' : 'hover:bg-accent text-muted-foreground hover:text-foreground'}
            `}
            title={sent ? "已發送" : "發送房號通知"}
        >
            {sent ? <CheckCircle className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
        </button>
    )
}
