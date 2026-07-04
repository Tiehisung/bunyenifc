// components/ui/Modal.tsx
import { useActionOnEsc } from "@/hooks/Esc";
import { X } from "lucide-react";
import { ReactNode, useState } from "react";
import { Button } from "../buttons/Button";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  title: ReactNode;
  children: ReactNode;
  modalSize?: "sm" | "md" | "lg" | "xl" | "full";

  showCloseButton?: boolean;
  closeOnOutsideClick?: boolean;
  closeOnEscape?: boolean;
  footer?: ReactNode;
  isLoading?: boolean;

  // Trigger
  triggerStyles?: string;
  trigger?: ReactNode;
  variant?: TButtonVariant;
  triggerSize?: TButtonSize;
}

export function MODAL({
  title,
  children,
  triggerSize,
  showCloseButton = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  footer,
  isLoading = false,
  variant,
  trigger='Modal Trigger',
  triggerStyles,
  modalSize = "md",
}: ModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget && !isLoading) {
      setIsOpen(false);
    }
  };
  useActionOnEsc({
    onEscape() {
      if (closeOnEscape) setIsOpen(false);
    },
  });

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-[90vw] max-h-[90vh]",
  };

  return (
    <>
      <Button
        variant={variant}
        size={triggerSize}
        className={cn(`cursor-pointer`, triggerStyles)}
        onClick={() => setIsOpen(!isOpen)}
        loadingText="Please wait..."
      >
        {trigger}
      </Button>

      {isOpen && (
        <div
          className="fixed inset-0 -bottom-5 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all"
          onClick={handleBackdropClick}
        >
          <div
            className={`${sizeClasses[modalSize]} w-full bg-surface-elevated rounded-3xl shadow-2xl animate-in fade-in-0 zoom-in-95 duration-200`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {title && (
              <header className="flex items-center justify-between p-6 pb-4 border-b border-border">
                <div className="text-lg font-semibold text-surface-foreground line-clamp-1">
                  {title}
                </div>
                {showCloseButton && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-surface-muted rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                )}
              </header>
            )}

            {/* Content */}
            <div className="p-6 max-h-[80vh] overflow-y-auto mr-0.5">{children}</div>

            {/* Footer */}
            {footer && (
              <div className="p-6 pt-0 border-t border-border mt-4">
                {footer}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
