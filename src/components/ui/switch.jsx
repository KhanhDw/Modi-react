

import * as React from "react"
import * as SwitchPrimitive from "@radix-ui/react-switch"
import { cn } from "@/lib/utils"

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // Base style
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none disabled:cursor-not-allowed disabled:opacity-50",

        // Unchecked state (light & admin-dark)
        "data-[state=unchecked]:bg-gray-300 admin-dark:data-[state=unchecked]:bg-gray-600",

        // Checked state default color (có thể override bằng className)
        "data-[state=checked]:bg-primary",

        // Focus ring
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // Thumb color
          "bg-white border border-gray-400 admin-dark:bg-gray-200 admin-dark:border-gray-500",
          // Position
          "data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
