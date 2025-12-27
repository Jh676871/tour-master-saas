'use client'

import { useState, useActionState, useEffect } from 'react'
import { PlusCircle, X } from 'lucide-react'
import { createHotel, createAttraction } from '../actions'

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
          <div className="w-full max-w-md rounded-lg bg-card p-6 shadow-lg">
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

              <div className="flex items-center space-x-2">
                <input
                  name="wifi"
                  type="checkbox"
                  id="wifi"
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="wifi" className="text-sm font-medium text-card-foreground">
                  提供免費 WiFi
                </label>
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
                  placeholder="例如：清水寺私房拍照點"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-card-foreground">描述與備註</label>
                <textarea
                  name="description"
                  rows={4}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="請輸入景點特色、注意事項或導覽重點..."
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
