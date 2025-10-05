'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-in fade-in"
        onClick={() => onOpenChange(false)}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 animate-in slide-in-from-bottom duration-300">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-t-[20px] border-t border-x bg-background shadow-2xl">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="h-1.5 w-12 rounded-full bg-muted-foreground/20" />
            </div>

            {/* Content */}
            <div className="max-h-[85vh] overflow-y-auto px-6 pb-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

interface SheetHeaderProps {
  children: React.ReactNode
  onClose?: () => void
}

export function SheetHeader({ children, onClose }: SheetHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-4 pt-2">
      <h2 className="text-2xl font-semibold tracking-tight">{children}</h2>
      {onClose && (
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-muted transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

interface SheetContentProps {
  children: React.ReactNode
  className?: string
}

export function SheetContent({ children, className }: SheetContentProps) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

interface SheetFooterProps {
  children: React.ReactNode
}

export function SheetFooter({ children }: SheetFooterProps) {
  return (
    <div className="flex gap-3 pt-6 border-t mt-6 sticky bottom-0 bg-background pb-2">
      {children}
    </div>
  )
}

interface SheetTitleProps {
  children: React.ReactNode
}

export function SheetTitle({ children }: SheetTitleProps) {
  return (
    <h3 className="text-lg font-semibold leading-none tracking-tight">
      {children}
    </h3>
  )
}

interface SheetDescriptionProps {
  children: React.ReactNode
}

export function SheetDescription({ children }: SheetDescriptionProps) {
  return (
    <p className="text-sm text-muted-foreground">
      {children}
    </p>
  )
}