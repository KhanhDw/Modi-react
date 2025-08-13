import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Badge styles với theme giống Button
const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
  {
    variants: {
      theme: {
        light: "",
        dark: "dark:aria-invalid:ring-destructive/40",
        admin: "admin-dark:aria-invalid:ring-destructive/40 admin-dark:text-foreground",
      },
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 admin-dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 admin-dark:bg-destructive/60",
        outline:
          "border-green-600 text-gray-800 [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      theme: "light",
      variant: "default",
    },
    compoundVariants: [
      {
        variant: "outline",
        theme: "dark",
        className: "dark:hover:bg-accent/50",
      },
      {
        variant: "outline",
        theme: "admin",
        className: "admin-dark:hover:bg-accent/50",
      },
    ],
  }
)

function Badge({ className, theme, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ theme, variant, className }))}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
