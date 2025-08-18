import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Button styles (unchanged)
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive",
  {
    variants: {
      theme: {
        light: "",
        dark: "dark:aria-invalid:ring-destructive/40",
        admin: "admin-dark:aria-invalid:ring-destructive/40",
      },
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20",
        outline: "border text-foreground bg-background shadow-xs hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      theme: "light",
      variant: "default",
      size: "default",
    },
    compoundVariants: [
      {
        variant: "outline",
        theme: "dark",
        className: "dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
      },
      {
        variant: "outline",
        theme: "admin",
        className: "admin-dark:bg-input/30 admin-dark:border-input admin-dark:hover:bg-input/50",
      },
      {
        variant: "destructive",
        theme: "dark",
        className: "dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
      },
      {
        variant: "destructive",
        theme: "admin",
        className: "admin-dark:focus-visible:ring-destructive/40 admin-dark:bg-destructive/60",
      },
      {
        variant: "ghost",
        theme: "dark",
        className: "dark:hover:bg-accent/50",
      },
      {
        variant: "ghost",
        theme: "admin",
        className: "admin-dark:hover:bg-accent/50",
      },
    ],
  }
);

// Use forwardRef to support refs for Radix UI components
const Button = React.forwardRef(
  ({ className, theme, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        data-slot="button"
        className={cn(buttonVariants({ theme, variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };