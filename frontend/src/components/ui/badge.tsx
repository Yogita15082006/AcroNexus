import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-full border px-4 h-[34px] text-[13px] font-semibold tracking-wide transition-all duration-300 ease-out hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow-sm shadow-primary/20 hover:shadow-primary/40",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground shadow-sm shadow-secondary/20 hover:shadow-secondary/40",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow-sm shadow-destructive/20 hover:shadow-destructive/40",
        outline: "text-foreground border-border/50 bg-background/50 backdrop-blur-sm hover:bg-muted/50",
        
        // Semantic custom variants
        active: "border-emerald-400/20 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-sm shadow-emerald-500/20 hover:shadow-emerald-500/40",
        inactive: "border-slate-400/20 bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-sm shadow-slate-500/20 hover:shadow-slate-500/40",
        pending: "border-amber-400/20 bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-sm shadow-amber-500/20 hover:shadow-amber-500/40",
        completed: "border-blue-400/20 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40",
        rejected: "border-rose-400/20 bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-sm shadow-rose-500/20 hover:shadow-rose-500/40",
        event: "border-indigo-400/20 bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20 hover:shadow-indigo-500/40",
        time: "border-violet-400/20 bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-500/20 hover:shadow-violet-500/40",
        date: "border-sky-400/20 bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-sm shadow-blue-500/20 hover:shadow-blue-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

