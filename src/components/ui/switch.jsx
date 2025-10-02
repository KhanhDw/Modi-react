import { cn } from "@/lib/utils"
import * as SwitchPrimitive from "@radix-ui/react-switch"

function Switch({ className, ...props }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-[1.25rem] w-9 shrink-0 items-center rounded-full border border-transparent shadow transition-colors outline-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",

        // Unchecked background
        "data-[state=unchecked]:bg-gray-300 dark:data-[state=unchecked]:bg-gray-600",

        // Checked background color (customizable by className or use bg-primary here)
        "data-[state=checked]:bg-blue-500 dark:data-[state=checked]:bg-blue-400",

        // Focus ring
        "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400",

        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block size-4 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out",

          // Thumb border for visibility in both themes
          "border border-gray-400 dark:border-gray-300",

          // Move the thumb when checked
          "data-[state=checked]:translate-x-[1.1rem] data-[state=unchecked]:translate-x-[2px]"
        )}
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
