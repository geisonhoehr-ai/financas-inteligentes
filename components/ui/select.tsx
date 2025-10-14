'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectProps {
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode
  placeholder?: string
  className?: string
}

export function Select({ value, onValueChange, children, placeholder, className }: SelectProps) {
  const [open, setOpen] = React.useState(false)
  const [selected, setSelected] = React.useState<{ label: string; value: string } | null>(null)

  React.useEffect(() => {
    const option = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && child.props.value === value
    ) as React.ReactElement | undefined

    if (option) {
      setSelected({ label: option.props.children, value: option.props.value })
    } else {
      setSelected(null)
    }
  }, [value, children])

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          'flex h-12 w-full items-center justify-between rounded-xl border-2 border-input bg-background px-4 py-3 text-base ring-offset-background transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50 hover:border-input/80',
          open && 'ring-2 ring-primary ring-offset-2 border-primary'
        )}
      >
        <span className={selected ? 'text-foreground' : 'text-muted-foreground'}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-muted-foreground transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute top-full z-50 mt-1 w-full rounded-xl border bg-popover p-1 shadow-lg">
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, {
                  ...child.props,
                  onSelect: () => {
                    onValueChange(child.props.value)
                    setOpen(false)
                  },
                })
              }
              return child
            })}
          </div>
        </>
      )}
    </div>
  )
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  onSelect?: () => void
  className?: string
}

export function SelectItem({ value, children, onSelect, className }: SelectItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center rounded-lg px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none',
        className
      )}
    >
      {children}
    </button>
  )
}

// Aliases para compatibilidade com shadcn/ui
export const SelectTrigger = Select
export const SelectValue = ({ children }: { children?: React.ReactNode }) => <>{children}</>
export const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>