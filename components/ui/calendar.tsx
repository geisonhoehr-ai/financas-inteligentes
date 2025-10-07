'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  value?: Date
  onValueChange?: (date: Date) => void
  className?: string
}

export function Calendar({ value = new Date(), onValueChange, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(value)

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }
    
    return days
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleDayClick = (day: Date) => {
    onValueChange?.(day)
  }

  const days = getDaysInMonth(currentDate)

  return (
    <div className={cn('w-full max-w-sm', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={handlePrevMonth}
          className="rounded-full p-2 hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <h3 className="text-lg font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        
        <button
          onClick={handleNextMonth}
          className="rounded-full p-2 hover:bg-muted transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Week days */}
      <div className="grid grid-cols-7 gap-1 p-4 pt-0">
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 p-4 pt-0">
        {days.map((day, index) => (
          <div key={index} className="text-center">
            {day ? (
              <button
                onClick={() => handleDayClick(day)}
                className={cn(
                  'w-8 h-8 rounded-full text-sm hover:bg-muted transition-colors',
                  day.toDateString() === value.toDateString() && 'bg-primary text-primary-foreground'
                )}
              >
                {day.getDate()}
              </button>
            ) : (
              <div className="w-8 h-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
