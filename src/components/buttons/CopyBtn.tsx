 

import { useState } from "react";
import { BiCopy } from "react-icons/bi";
import { Button } from "./Button";
import { TButtonSize, TButtonVariant } from "../ui/button";

interface CopyButtonProps {
  buttonText?: string;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  textToCopy: string;
  variant?:TButtonVariant
  size?:TButtonSize
}

export const CopyButton = ({
  buttonText = "Copy url",
  className = "",
  disabled = false,
  type = "button",
  textToCopy,variant='ghost',size
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
      <BiCopy size={20}/>
      {copyButtonText}
    </Button>
  );
};
