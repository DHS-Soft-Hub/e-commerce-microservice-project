"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import * as React from "react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rdp-root", className)}
      classNames={{
        ...classNames,
      }}
      components={{
        PreviousMonthButton: ({ className, ...props }) => (
          <button {...props} className={cn("size-4", className)}>
            <ChevronLeft />
          </button>
        ),
        NextMonthButton: ({ className, ...props }) => (
          <button {...props} className={cn("size-4", className)}>
            <ChevronRight />
          </button>
        ),
      }}
      {...props}
    />
  )
}

export { Calendar }

