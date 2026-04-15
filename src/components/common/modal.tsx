import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { XIcon } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  trigger?: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
  open?: boolean;
  onOpenChange: (open: boolean) => void;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  showCloseButton?: boolean;
  footer?: ReactNode;
}

const sizeClasses = {
  sm: "sm:max-w-sm",
  md: "sm:max-w-md",
  lg: "sm:max-w-lg",
  xl: "sm:max-w-xl",
  "2xl": "sm:max-w-2xl",
  "3xl": "sm:max-w-3xl",
  full: "sm:max-w-[95vw]",
};

export function Modal({
  title,
  description,
  children,
  open,
  onOpenChange,
  size = "md",
  showCloseButton = true,
  footer,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={`p-4 ${sizeClasses[size]} w-full`}
      >
        <div className="flex justify-between items-center gap-4 border-b-2 pb-2">
          <div className="flex gap-2">
            <div>
              <DialogTitle className="text-md">{title}</DialogTitle>
              {description && (
                <DialogDescription className="text-xs">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
          {showCloseButton && (
            <div role="button" onClick={() => onOpenChange(false)}>
              <XIcon width={22} height={22} />
              <span className="sr-only">Close</span>
            </div>
          )}
        </div>
        {children}
        {footer && <DialogFooter className="mt-4">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
