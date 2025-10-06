
import { cn } from "@/lib/utils";

function Input({
  className,
  type,
  ...props
}) {
  return (
    <input autoComplete="off"
      type={type}
      data-slot="input"
      className={cn(
        "file:text-gray-700 admin-dark:file:text-gray-200 selection:bg-primary selection:text-primary-foreground admin-dark:bg-input/30 flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:cursor-pointer disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:border-gray-300 admin-dark:border-gray-600 border-gray-300 placeholder:text-gray-400",

        "aria-invalid:ring-destructive/20 admin-dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props} />
  );
}

export { Input };
