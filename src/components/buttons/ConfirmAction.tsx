import { Button } from "@/components/buttons/Button";
import { DIALOG } from "@/components/Dialog";

import { ReactNode } from "react";
import { TButtonVariant } from "../ui/button";

interface IProps {
  className?: string;
  variant?: TButtonVariant;
  confirmVariant?: TButtonVariant;
  primaryText?: string;
  loadingText?: string;
  children?: ReactNode;
  title?: string;
  confirmText?: string;

  escapeOnEnd?: boolean;
  gobackAfter?: boolean;

  trigger?: ReactNode;
  triggerStyles?: string;
  hidden?: boolean;
  disabled?: boolean;
  onConfirm?: () => Promise<void> | void;
  isLoading?: boolean;
  // uri?: string;
  // method: "PUT" | "POST" | "DELETE" | "GET";
  // body?: unknown;
}

export const ConfirmActionButton = ({
  variant,
  className,
  children,
  loadingText,
  primaryText='',
  confirmText,
  title,
  hidden,
  trigger,
  triggerStyles = "",
  confirmVariant,
  disabled,
  onConfirm,
  isLoading,
}: IProps) => {
  // const handleAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   try {
  //     setWaiting(true);
  //     const response = await fetch(
  //       uri?.startsWith(apiConfig.base)
  //         ? uri
  //         : uri?.startsWith("/")
  //           ? `${apiConfig.base}${uri}`
  //           : `${apiConfig.base}/${uri}`,
  //       {
  //         method,
  //         headers: { "Content-Type": "application/json" },
  //         cache: "no-cache",
  //         body: JSON.stringify(body),
  //       },
  //     );
  //     const results = await response.json();
  //     if (results.success) toast.success(results.message);
  //     if (!results.success) toast.error(results.message);

  //     if (gobackAfter) navigate(-1);
  //   } catch (error) {
  //     toast.error(getErrorMessage(error));
  //   } finally {
  //     setWaiting(false);

  //     if (escapeOnEnd) fireDoubleEscape(400);
  //   }
  // };

  if (hidden) {
    return null;
  }

  const handleConfirm = async () => {
    if (onConfirm) {
      await onConfirm();
    } else {
      // Existing fetch logic with uri and body
    }
  };
  return (
    <DIALOG
      trigger={trigger ?? primaryText}
      title={title}
      variant={variant}
      triggerStyles={triggerStyles}
      disabled={disabled}
    >
      <div className="flex flex-col items-center justify-center py-6 ">
        {confirmText && (
          <div
            className="font-light text-sm text-muted-foreground mb-6"
            dangerouslySetInnerHTML={{ __html: confirmText }}
          />
        )}

        <Button
          waiting={isLoading}
          disabled={isLoading}
          primaryText={`Confirm ${primaryText ?? ""}`}
          waitingText={loadingText}
          onClick={handleConfirm}
          className={className}
          variant={confirmVariant ?? variant}
        >
          {children}
        </Button>
      </div>
    </DIALOG>
  );
};
