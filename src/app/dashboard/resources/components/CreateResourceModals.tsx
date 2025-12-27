'use client'

import { useState, useActionState, useEffect } from 'react'
import { PlusCircle, X, Pencil } from 'lucide-react'
import { createHotel, createAttraction, updateHotel } from '../actions'

export function CreateHotelModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(createHotel, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
    }
  }, [state])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        新增飯店
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">新增合作飯店</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">飯店名稱</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="例如：東京希爾頓酒店"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">地址</label>
                <input
                  name="address"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="例如：東京都新宿區..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">電話</label>
                <input
                  name="phone"
                  type="text"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">WiFi 名稱 (SSID)</label>
                  <input
                    name="wifi_ssid"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="WiFi 名稱"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">WiFi 密碼</label>
                  <input
                    name="wifi_password"
                    type="text"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="WiFi 密碼"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">飯店圖片 (可多選)</label>
                <input
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
              </div>

              {state?.error && (
                <div className="text-sm text-destructive">{state.error}</div>
              )}

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? '新增中...' : '確認新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function EditHotelModal({ hotel }: { hotel: any }) {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(updateHotel, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
    }
  }, [state])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
        title="編輯"
      >
        <Pencil className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">編輯飯店</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action} className="space-y-4">
              <input type="hidden" name="id" value={hotel.id} />
              <input type="hidden" name="existing_images" value={JSON.stringify(hotel.images || [])} />
              
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">飯店名稱</label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={hotel.name}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">地址</label>
                <input
                  name="address"
                  type="text"
                  defaultValue={hotel.address}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">電話</label>
                <input
                  name="phone"
                  type="text"
                  defaultValue={hotel.phone}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">WiFi 名稱 (SSID)</label>
                  <input
                    name="wifi_ssid"
                    type="text"
                    defaultValue={hotel.wifi_ssid}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-card-foreground">WiFi 密碼</label>
                  <input
                    name="wifi_password"
                    type="text"
                    defaultValue={hotel.wifi_password}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">新增圖片 (選填)</label>
                <input
                  name="images"
                  type="file"
                  multiple
                  accept="image/*"
                  className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                />
                {hotel.images && hotel.images.length > 0 && (
                   <div className="mt-2 flex gap-2 overflow-x-auto py-2">
                     {hotel.images.map((img: string, idx: number) => (
                       <img key={idx} src={img} alt="Hotel" className="h-16 w-16 object-cover rounded-md" />
                     ))}
                   </div>
                )}
              </div>

              {state?.error && (
                <div className="text-sm text-destructive">{state.error}</div>
              )}

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? '更新中...' : '確認更新'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export function CreateAttractionModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, action, isPending] = useActionState(createAttraction, null)

  useEffect(() => {
    if (state?.success) {
      setIsOpen(false)
    }
  }, [state])

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        新增景點
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-card-foreground">新增私房景點</h2>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form action={action} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">景點名稱</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="例如：清水寺"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">描述</label>
                <textarea
                  name="description"
                  rows={3}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="請輸入景點描述..."
                />
              </div>

              {state?.error && (
                <div className="text-sm text-destructive">{state.error}</div>
              )}

              <div className="mt-6 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? '新增中...' : '確認新增'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
