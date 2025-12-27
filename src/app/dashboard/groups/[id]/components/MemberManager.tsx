'use client'

import { useState, useEffect } from 'react'
import { Plus, Upload, QrCode, Trash2, Phone } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import * as XLSX from 'xlsx'
import { addMember, deleteMember } from '../actions'
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from '@/components/ui/drawer'
import { motion, PanInfo, useAnimation } from 'framer-motion'
import { createClient } from '@/lib/supabase'

interface MemberManagerProps {
  tripId: string
  members: any[]
}

const SwipeableMemberItem = ({ member, onDelete }: { member: any; onDelete: (id: string) => void }) => {
  const controls = useAnimation();

  const handleDragEnd = async (event: any, info: PanInfo) => {
    // Only delete if swiped significantly to the left
    if (info.offset.x < -150) {
      if (confirm('確定要刪除這位旅客嗎？')) {
        await controls.start({ x: -1000, transition: { duration: 0.2 } });
        onDelete(member.id);
      } else {
        controls.start({ x: 0 });
      }
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border mb-2 group">
      {/* Background Action (Delete) */}
      <div className="absolute inset-y-0 right-0 w-full bg-red-500 flex items-center justify-end px-6 rounded-lg">
        <Trash2 className="text-white h-6 w-6" />
      </div>

      {/* Foreground Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -1000, right: 0 }}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        animate={controls}
        className="relative bg-card p-4 flex items-center justify-between z-10"
        style={{ touchAction: 'pan-y' }} // Allow vertical scrolling
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
            {member.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium">{member.name}</div>
            {member.phone && (
              <div className="text-xs text-muted-foreground flex items-center mt-0.5">
                <Phone className="w-3 h-3 mr-1" />
                {member.phone}
              </div>
            )}
          </div>
        </div>
        
        {/* Desktop Delete Button (visible only on hover/desktop) */}
        <button 
           onClick={() => onDelete(member.id)}
           className="hidden sm:block p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
           <Trash2 className="h-4 w-4" />
        </button>
      </motion.div>
    </div>
  );
};

export function MemberManager({ tripId, members }: MemberManagerProps) {
  const [activeTab, setActiveTab] = useState<'list' | 'invite'>('list')
  const [memberList, setMemberList] = useState(members)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberPhone, setNewMemberPhone] = useState('')
  const [isImporting, setIsImporting] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const supabase = createClient()

  // Sync props to state
  useEffect(() => {
    setMemberList(members)
  }, [members])

  // Realtime Subscription
  useEffect(() => {
    const channel = supabase
      .channel(`members-${tripId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'members',
          filter: `trip_id=eq.${tripId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMemberList((prev) => [...prev, payload.new])
          } else if (payload.eventType === 'DELETE') {
            setMemberList((prev) => prev.filter((m) => m.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            setMemberList((prev) => prev.map((m) => m.id === payload.new.id ? payload.new : m))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [tripId, supabase])

  // Join Link
  const joinLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/trip/${tripId}/join`

  const handleAddMember = async () => {
    if (!newMemberName.trim()) return
    await addMember(tripId, newMemberName, newMemberPhone)
    setNewMemberName('')
    setNewMemberPhone('')
    setIsDrawerOpen(false)
  }
  
  const handleDeleteMember = async (memberId: string) => {
    if (confirm('確定要刪除這位旅客嗎？')) {
        await deleteMember(memberId, tripId)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    const reader = new FileReader()
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result
        const wb = XLSX.read(bstr, { type: 'binary' })
        const wsname = wb.SheetNames[0]
        const ws = wb.Sheets[wsname]
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][]
        
        // Assuming format: [Name, Phone] or just [Name]
        for (const row of data) {
            const name = row[0]
            const phone = row[1] || ''
            if (name && typeof name === 'string') {
                await addMember(tripId, name, String(phone))
            }
        }
      } catch (err) {
        console.error('Import failed', err)
        alert('匯入失敗，請檢查檔案格式')
      } finally {
        setIsImporting(false)
        e.target.value = ''
      }
    }
    reader.readAsBinaryString(file)
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('list')}
            className={`
              whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${activeTab === 'list'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            旅客名單
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`
              whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium
              ${activeTab === 'invite'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:border-gray-300 hover:text-foreground'
              }
            `}
          >
            邀請連結 / QR Code
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'list' ? (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">旅客管理</label>
                <div className="flex gap-2">
                    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                      <DrawerTrigger asChild>
                        <button className="flex-1 sm:flex-none flex items-center justify-center rounded-md bg-primary px-4 py-3 sm:py-2 text-sm font-medium text-white hover:bg-primary/90 min-h-[48px]">
                          <Plus className="mr-2 h-5 w-5" />
                          新增旅客
                        </button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="space-y-6">
                          <div>
                            <DrawerTitle>新增旅客</DrawerTitle>
                            <DrawerDescription>請輸入旅客姓名與電話。</DrawerDescription>
                          </div>
                          <div className="space-y-4 px-4 pb-4">
                            <div>
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
                              <input
                                id="name"
                                value={newMemberName}
                                onChange={(e) => setNewMemberName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                placeholder="王大明"
                              />
                            </div>
                            <div>
                              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">電話</label>
                              <input
                                id="phone"
                                value={newMemberPhone}
                                onChange={(e) => setNewMemberPhone(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm p-3 border"
                                placeholder="0912345678"
                              />
                            </div>
                            <button
                              onClick={handleAddMember}
                              disabled={!newMemberName}
                              className="w-full rounded-md bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50 min-h-[48px]"
                            >
                              確認新增
                            </button>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>

                    <label className="cursor-pointer flex items-center justify-center rounded-md bg-white border border-gray-300 px-4 py-3 sm:py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 min-h-[48px]">
                        <Upload className="mr-2 h-5 w-5" />
                        {isImporting ? '匯入中...' : 'Excel 匯入'}
                        <input
                            type="file"
                            accept=".xlsx, .xls"
                            className="hidden"
                            onChange={handleFileUpload}
                            disabled={isImporting}
                        />
                    </label>
                </div>
            </div>
          </div>

          {/* Member List */}
          <div className="space-y-2">
            {memberList.map((member) => (
              <SwipeableMemberItem 
                 key={member.id} 
                 member={member} 
                 onDelete={handleDeleteMember} 
              />
            ))}
            
            {memberList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                <p>尚無旅客資料</p>
                <p className="text-xs mt-1">點擊上方按鈕新增或匯入</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center space-y-8 py-8">
            <div className="rounded-xl border border-border bg-white p-8 shadow-sm">
                <QRCodeSVG value={joinLink} size={256} level="H" />
            </div>
            
            <div className="text-center">
                <h3 className="text-lg font-semibold">旅客自動報到連結</h3>
                <p className="mb-4 text-sm text-muted-foreground">請旅客掃描上方 QR Code，或分享下方連結</p>
                
                <div className="flex items-center gap-2 rounded-md bg-secondary p-2">
                    <code className="flex-1 text-sm text-muted-foreground">{joinLink}</code>
                    <button 
                        onClick={() => navigator.clipboard.writeText(joinLink)}
                        className="rounded bg-background px-2 py-1 text-xs font-medium border hover:bg-accent"
                    >
                        複製
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}
