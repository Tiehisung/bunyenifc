import { useState } from "react";
import { Button } from "./Button";
import { TButtonSize, TButtonVariant } from "../ui/button";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  textToCopy: string;
  variant?: TButtonVariant;
  size?: TButtonSize;
}

export const CopyButton = ({
  buttonText = "Copy url",
  className = "",
  disabled = false,
  type = "button",
  textToCopy,
  variant = "ghost",
  size,
}: CopyButtonProps) => {
  const [copyButtonText, setCopyButtonText] = useState(buttonText);
  const handleClick = () => {
    setCopyButtonText("Copied!");
    navigator.clipboard.writeText(textToCopy);
    setTimeout(() => {
      setCopyButtonText(buttonText);
    }, 2000);
  };

  return (
    <Button
      onClick={handleClick}
      type={type}
      disabled={disabled}
      className={`${className} `}
      variant={variant}
      size={size}
    >
      <Copy className="w-4 h-4 mr-1" />
      {copyButtonText}
    </Button>
  );
};

interface CopyableTextProps {
  text: string;
  className?: string;
  visibleText?: string;
  iconClassName?: string;
  textClassName?: string;
}

export function CopyableText({
  text,
  className = "",
  iconClassName = "",
  textClassName = "",
  visibleText,
}: CopyableTextProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <span
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 cursor-pointer hover:text-primary transition-colors ${className}`}
    >
      {visibleText && <span className={textClassName}>{visibleText}</span>}
      {copied ? (
        <Check className={`size-3.5 text-emerald-500 ${iconClassName}`} />
      ) : (
        <Copy
          className={`size-3.5 opacity-60 hover:opacity-100 ${iconClassName}`}
        />
      )}
    </span>
  );
}
