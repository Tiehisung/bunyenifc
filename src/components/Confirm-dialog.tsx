import * as React from "react";

import { Button, TButtonSize, TButtonVariant } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ConfirmDialogProps {
  title?: string;
  description?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  disabled?: boolean;
  variant?: TButtonVariant;
  size?: TButtonSize;
  trigger?: React.ReactNode;
  triggerStyles?: string;
  className?: string;

  // New onConfirm callback
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean; // Optional loading state
  loadingText?: string; // Optional loading text
}

export function ConfirmDialog({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "default",
  trigger,
  className,
  size,
  disabled,
  triggerStyles,
  onConfirm,
  isLoading: externalLoading,
  loadingText = "Please wait...",
}: ConfirmDialogProps) {
  const [internalLoading, setInternalLoading] = React.useState(false);

  const isLoading = externalLoading ?? internalLoading;

  const handleConfirm = async () => {
    if (!onConfirm) return;

    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          title={typeof title === "string" ? title : ""}
          className={cn("h-fit", triggerStyles)}
          disabled={disabled}
        >
          {trigger}
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className={cn("sm:max-w-md", className)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {typeof description === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              description
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction asChild>
            <Button
              variant={variant}
              onClick={handleConfirm}
              disabled={isLoading}
            >
              {isLoading ? loadingText : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
