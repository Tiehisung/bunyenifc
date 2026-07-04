import { CSSProperties, MouseEventHandler } from "react";
import { VscLoading } from "react-icons/vsc";
import { TButtonSize, TButtonVariant, Button as Btn } from "../ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps {
  text?: string;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  children?: React.ReactNode;
  type?: "submit" | "button" | "reset";
  styles?: CSSProperties;
  variant?: TButtonVariant;
  size?: TButtonSize;
  id?: string;
}

interface ClickButtonProps extends ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function Button({
  text,
  loading = false,
  className = "",
  disabled = false,
  type = "button",
  onClick,
  children,
  title = "",
  styles = {},
  variant,
  size,
  id,
  loadingText,
}: ClickButtonProps) {
  return (
    <Btn
      disabled={loading || disabled}
      className={cn(
        `flex items-center gap-2 font-semibold disabled:pointer-events-none disabled:hover:bg-transparent disabled:opacity-60 active:scale-[99%] overflow-hidden ${
          loading ? "cursor-wait " : "cursor-pointer"
        }  `,
        className,
      )}
      variant={variant}
      size={size}
      type={type}
      onClick={onClick}
      title={title}
      style={styles}
      id={id}
    >
      {loading ? <VscLoading className={` animate-spin `} /> : children}
      <span hidden={!text}>{loading && loadingText ? loadingText : text}</span>
    </Btn>
  );
}
