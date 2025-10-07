'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

interface ToastProps {
  id: string
  title?: string
  description?: string
  action?: React.ReactNode
  variant?: 'default' | 'destructive'
  className?: string
}

export function Toast({ 
  id, 
  title, 
  description, 
  action, 
  variant = 'default',
  className 
}: ToastProps) {
  return (
    <div
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        variant === 'destructive' 
          ? 'border-destructive bg-destructive text-destructive-foreground' 
          : 'border bg-background text-foreground',
        className
      )}
    >
      <div className="grid gap-1">
        {title && (
          <div className="text-sm font-semibold">{title}</div>
        )}
        {description && (
          <div className="text-sm opacity-90">{description}</div>
        )}
      </div>
      {action && (
        <div className="flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

interface ToastActionProps {
  altText: string
  onClick: () => void
  children: React.ReactNode
  className?: string
}

export function ToastAction({ 
  altText, 
  onClick, 
  children, 
  className 
}: ToastActionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
        className
      )}
    >
      {children}
    </button>
  )
}

interface ToastCloseProps {
  onClick: () => void
  className?: string
}

export function ToastClose({ onClick, className }: ToastCloseProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600',
        className
      )}
    >
      <span className="sr-only">Close</span>
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  )
}

interface ToastTitleProps {
  children: React.ReactNode
  className?: string
}

export function ToastTitle({ children, className }: ToastTitleProps) {
  return (
    <div className={cn('text-sm font-semibold', className)}>
      {children}
    </div>
  )
}

interface ToastDescriptionProps {
  children: React.ReactNode
  className?: string
}

export function ToastDescription({ children, className }: ToastDescriptionProps) {
  return (
    <div className={cn('text-sm opacity-90', className)}>
      {children}
    </div>
  )
}

interface ToastProviderProps {
  children: React.ReactNode
  className?: string
}

export function ToastProvider({ children, className }: ToastProviderProps) {
  return (
    <div className={cn('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className)}>
      {children}
    </div>
  )
}

interface ToastViewportProps {
  className?: string
}

export function ToastViewport({ className }: ToastViewportProps) {
  return (
    <div className={cn('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className)} />
  )
}
