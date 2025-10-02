import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot"; // Thêm Slot
import { XIcon } from "lucide-react";
import { createContext, forwardRef, useContext, useState } from "react";

const DialogContext = createContext(null);

function useDialogContext() {
  const ctx = useContext(DialogContext);
  if (!ctx) throw new Error("Dialog components must be used inside <Dialog>");
  return ctx;
}

function Dialog({ children, open: controlledOpen, onOpenChange }) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  );
}

// Cập nhật DialogTrigger
const DialogTrigger = forwardRef(
  ({ children, asChild = false, ...props }, ref) => {
    const { setOpen } = useDialogContext();
    const Comp = asChild ? Slot : "button"; // Sử dụng Slot khi asChild={true}

    return (
      <Comp ref={ref} onClick={() => setOpen(true)} {...props}>
        {children}
      </Comp>
    );
  }
);
DialogTrigger.displayName = "DialogTrigger";

function DialogClose({ children, ...props }) {
  const { setOpen } = useDialogContext();
  return (
    <button onClick={() => setOpen(false)} {...props}>
      {children}
    </button>
  );
}

function DialogOverlay({ className, ...props }) {
  const { open, setOpen } = useDialogContext();
  if (!open) return null;
  return (
    <div
      onClick={() => setOpen(false)}
      className={cn(
        "fixed inset-0 z-40 h-screen w-screen overflow-y-hidden bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in-0",
        className
      )}
      {...props}
    />
  );
}

function DialogContent({
  className,
  children,
  showCloseButton = true,
  ...props
}) {
  const { open, setOpen } = useDialogContext();
  if (!open) return null;

  return (
    <>
      <div
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border bg-background p-6 shadow-lg duration-200 animate-in fade-in-0 zoom-in-95",
          className
        )}
        {...props}
      >
        {children}
        {showCloseButton && (
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:outline-none cursor-pointer"
          >
            <XIcon className="size-5" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </div>
    </>
  );
}

function DialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function DialogFooter({ className, ...props }) {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      )}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-sm font-semibold leading-none", className)}
      {...props}
    />
  );
}

function DialogDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
  );
}

export {
  Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle, DialogTrigger
};
