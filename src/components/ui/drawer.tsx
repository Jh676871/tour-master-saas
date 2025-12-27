'use client'

import * as React from 'react'
import { Drawer as VaulDrawer } from 'vaul'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function Drawer({
  children,
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Root>) {
  return (
    <VaulDrawer.Root shouldScaleBackground={shouldScaleBackground} {...props}>
      {children}
    </VaulDrawer.Root>
  )
}

export function DrawerTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Trigger>) {
  return (
    <VaulDrawer.Trigger className={cn(className)} {...props}>
      {children}
    </VaulDrawer.Trigger>
  )
}

export function DrawerContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Content>) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay className="fixed inset-0 bg-black/40" />
      <VaulDrawer.Content
        className={cn(
          'fixed bottom-0 left-0 right-0 mt-24 flex h-[90%] flex-col rounded-t-[10px] bg-white outline-none',
          className
        )}
        {...props}
      >
        <div className="flex-1 rounded-t-[10px] bg-white p-4">
          <div className="mx-auto mb-8 h-1.5 w-12 flex-shrink-0 rounded-full bg-gray-300" />
          <div className="mx-auto max-w-md">{children}</div>
        </div>
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  )
}

export function DrawerTitle({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Title>) {
  return (
    <VaulDrawer.Title
      className={cn('text-lg font-medium font-semibold text-gray-900', className)}
      {...props}
    />
  )
}

export function DrawerDescription({
  className,
  ...props
}: React.ComponentProps<typeof VaulDrawer.Description>) {
  return (
    <VaulDrawer.Description
      className={cn('text-sm text-gray-500', className)}
      {...props}
    />
  )
}
