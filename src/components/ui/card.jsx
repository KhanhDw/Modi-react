import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Card styles
const cardVariants = cva(
  "flex flex-col gap-6 rounded-xl border py-4 shadow-sm transition-all",
  {
    variants: {
      theme: {
        light: "bg-card text-card-foreground", // Mặc định sáng
        dark: "dark:bg-card dark:text-card-foreground",
        admin: "admin-dark:bg-card admin-dark:text-card-foreground",
      },
      bordered: {
        true: "border",
        false: "border-0",
      },
    },
    defaultVariants: {
      theme: "light",
      bordered: true,
    },
    compoundVariants: [
      {
        theme: "dark",
        bordered: true,
        className: "dark:border-border/60",
      },
      {
        theme: "admin",
        bordered: true,
        className: "admin-dark:border-border/60",
      },
    ],
  }
)

function Card({ className, theme, bordered, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(cardVariants({ theme, bordered, className }))}
      {...props}
    />
  )
}

const cardHeaderVariants = cva(
  "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
  {
    variants: {
      theme: {
        light: "",
        dark: "dark:[.border-b]:border-border/60 ",
        admin: "admin-dark:[.border-b]:border-border/60 ",
      },
    },
    defaultVariants: {
      theme: "light",
    },
  }
)

function CardHeader({ className, theme, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(cardHeaderVariants({ theme, className }))}
      {...props}
    />
  )
}

function CardTitle({ className, ...props }) {
  return (
    <div
      data-slot="card-title"
      className={cn("leading-none font-semibold text-gray-800", className)}
      {...props}
    />
  )
}

function CardDescription({ className, ...props }) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  )
}

function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

function CardContent({ className, ...props }) {
  return (
    <div data-slot="card-content" className={cn("px-6", className)} {...props} />
  )
}

function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
