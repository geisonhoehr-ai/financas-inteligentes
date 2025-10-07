'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavigationMenuProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenu({ children, className }: NavigationMenuProps) {
  return (
    <nav className={cn('relative', className)}>
      {children}
    </nav>
  )
}

interface NavigationMenuListProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenuList({ children, className }: NavigationMenuListProps) {
  return (
    <ul className={cn('flex flex-1 list-none items-center justify-center space-x-1', className)}>
      {children}
    </ul>
  )
}

interface NavigationMenuItemProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenuItem({ children, className }: NavigationMenuItemProps) {
  return (
    <li className={cn('relative', className)}>
      {children}
    </li>
  )
}

interface NavigationMenuTriggerProps {
  children: React.ReactNode
  className?: string
  asChild?: boolean
}

export function NavigationMenuTrigger({ children, className, asChild }: NavigationMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, {
      ...children.props,
      className: cn(children.props.className, className),
    })
  }

  return (
    <button
      className={cn(
        'group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50',
        className
      )}
    >
      {children}
      <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
    </button>
  )
}

interface NavigationMenuContentProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenuContent({ children, className }: NavigationMenuContentProps) {
  return (
    <div className={cn('absolute top-full left-0 z-50 mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md', className)}>
      {children}
    </div>
  )
}

interface NavigationMenuLinkProps {
  children: React.ReactNode
  href: string
  className?: string
  active?: boolean
}

export function NavigationMenuLink({ 
  children, 
  href, 
  className, 
  active = false 
}: NavigationMenuLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
        active && 'bg-accent text-accent-foreground',
        className
      )}
    >
      {children}
    </a>
  )
}

interface NavigationMenuIndicatorProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenuIndicator({ children, className }: NavigationMenuIndicatorProps) {
  return (
    <div className={cn('absolute top-full z-50 flex h-1.5 items-end justify-center overflow-hidden', className)}>
      <div className="relative top-[60%] h-2 w-2 rotate-45 rounded-tl-sm bg-border shadow-md" />
    </div>
  )
}

interface NavigationMenuViewportProps {
  children: React.ReactNode
  className?: string
}

export function NavigationMenuViewport({ children, className }: NavigationMenuViewportProps) {
  return (
    <div className={cn('absolute left-0 top-full flex justify-center', className)}>
      <div className="origin-top-center relative mt-1.5 h-[var(--radix-navigation-menu-viewport-height)] w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-90 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 md:w-[var(--radix-navigation-menu-viewport-width)]">
        {children}
      </div>
    </div>
  )
}
