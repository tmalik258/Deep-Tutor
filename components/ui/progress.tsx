"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import {cva,type Variantprops} from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVarants= cva(
  "h-full w-full flex-1 bg-primary transition-all",
  {
    variants: {
      variant:{
        default:"bg-sky-600",
        success:"bg-emeraled-700"
      },
    },
    defaultVariants:{
      variant:"default",
    }

  }
)

export interface ProgressProps
  extends React.HTMLAttributes<HTMLDivElement>,
     Variantprops<typeof  progressVariants> {}

type CombinedProgressProps= ProgressProps & React.ComponentPropsWithoutRef<typeof 
ProgressPrimitive.Root>
const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  CombinedProgressProps
>(({ className, value, variant,...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(progressVariants({variant}))}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
